import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import yaml from 'js-yaml'

/**
 * @typedef {object} DocumentModel
 * @property {string} type
 * @property {string} title
 * @property {string} lang
 * @property {{version: string, date: string, github: string, colWidth: string, tags: string[]}} meta
 * @property {CardModel[]} cards
 */

/**
 * @typedef {object} CardModel
 * @property {string} type
 * @property {string} title
 * @property {string} emoji
 * @property {string} link
 * @property {string} desc
 * @property {string} lang
 * @property {Array<EntryModel|InlineCodeModel|CodeBlockModel|SetModel|ListModel|DescModel|TableModel>} items
 */

/**
 * @typedef {object} SetModel
 * @property {'set'} type
 * @property {string} title
 * @property {Array<EntryModel|InlineCodeModel|CodeBlockModel|ListModel|DescModel|TableModel>} items
 */

/**
 * @typedef {object} ListModel
 * @property {'list'} type
 * @property {ListItemModel[]} items
 */

/**
 * @typedef {object} ListItemModel
 * @property {'text'|'code-desc'} variant
 * @property {string[]} [codes]
 * @property {string} [description]
 * @property {string} [text]
 * @property {string} [lang]
 * @property {ListModel | null} [children]
 */

/**
 * @typedef {object} DescModel
 * @property {'desc'} type
 * @property {string} text
 */

/**
 * @typedef {object} EntryModel
 * @property {'entry'} type
 * @property {'code-desc'|'text'} variant
 * @property {string} [code]
 * @property {string} [description]
 * @property {string} [text]
 * @property {string} [lang]
 */

/**
 * @typedef {object} InlineCodeModel
 * @property {'inlineCode'} type
 * @property {string} code
 * @property {string} lang
 */

/**
 * @typedef {object} CodeBlockModel
 * @property {'codeBlock'} type
 * @property {string} code
 * @property {string} lang
 */

/**
 * @typedef {object} TableModel
 * @property {'table'} type
 * @property {(string|null)[]} align
 * @property {TableRowModel[]} rows
 */

/**
 * @typedef {object} TableRowModel
 * @property {boolean} header
 * @property {string[]} cells
 */

const DEFAULT_LANG = 'bash'
const DEFAULT_COL_WIDTH = '340px'

export function normalizeLang(lang, fallback = DEFAULT_LANG) {
  const value = String(lang || '').trim().toLowerCase()
  if (!value) {
    return fallback
  }

  if (!/^[a-z0-9_+-]+$/.test(value)) {
    return fallback
  }

  return value
}

export function normalizeColWidth(colWidth, fallback = DEFAULT_COL_WIDTH) {
  const value = String(colWidth || '').trim()
  if (!value) {
    return fallback
  }

  // 允许明确的 CSS 长度，避免把历史遗留的 `6` 解析成 6px 破坏布局。
  if (/^\d+(\.\d+)?(px|rem|em|vw|vh|%)$/i.test(value)) {
    return value
  }

  // 兼容纯数字像素值，但限制在合理范围内。
  if (/^\d+(\.\d+)?$/.test(value)) {
    const numeric = Number(value)
    if (numeric >= 240 && numeric <= 960) {
      return `${numeric}px`
    }
  }

  return fallback
}

export function extractFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) {
    return { data: {}, body: markdown }
  }

  try {
    const data = yaml.load(match[1]) || {}
    return { data: typeof data === 'object' ? data : {}, body: markdown.slice(match[0].length) }
  } catch {
    return { data: {}, body: markdown.slice(match[0].length) }
  }
}

function nodeText(node) {
  if (!node) {
    return ''
  }

  if (node.type === 'text' || node.type === 'inlineCode') {
    return node.value || ''
  }

  if (!Array.isArray(node.children)) {
    return ''
  }

  return node.children.map((child) => nodeText(child)).join('')
}

function extractCardMetaBlocks(markdownBody) {
  const lines = markdownBody.split(/\r?\n/)
  const metaByCardIndex = new Map()
  const output = []
  let cardIndex = -1

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    output.push(line)

    if (!/^##\s+/.test(line)) {
      continue
    }

    cardIndex += 1
    const nextLine = lines[i + 1]
    if (typeof nextLine !== 'string' || nextLine.trim() !== '---') {
      continue
    }

    let end = -1
    for (let j = i + 2; j < lines.length; j += 1) {
      if (lines[j].trim() === '---') {
        end = j
        break
      }
    }

    if (end === -1) {
      continue
    }

    const yamlSource = lines.slice(i + 2, end).join('\n')

    try {
      const data = yaml.load(yamlSource)
      if (data && typeof data === 'object') {
        const prev = metaByCardIndex.get(cardIndex) || {}
        metaByCardIndex.set(cardIndex, {
          ...prev,
          lang: typeof data.lang === 'string' ? normalizeLang(data.lang, DEFAULT_LANG) : prev.lang,
          emoji: typeof data.emoji === 'string' ? data.emoji.trim() : '',
          link: typeof data.link === 'string' ? data.link.trim() : '',
          desc: typeof data.desc === 'string' ? data.desc.trim() : '',
        })
      }
    } catch {
      // ignore invalid card meta yaml
    }

    i += end - i
  }

  return {
    body: output.join('\n'),
    metaByCardIndex,
  }
}

export function splitEmoji(titleText) {
  const text = String(titleText || '').trim()
  const emojiMatch = text.match(/^([\p{Extended_Pictographic}\uFE0F\u200D]+)\s*/u)

  if (!emojiMatch) {
    return { emoji: '', title: text }
  }

  return {
    emoji: emojiMatch[1],
    title: text.slice(emojiMatch[0].length).trim(),
  }
}

function targetArray(card, set) {
  if (!card) {
    return null
  }
  return set ? set.items : card.items
}

function paragraphText(node) {
  const text = nodeText(node)
  return String(text || '').trim()
}

function looksLikeCodeBlock(text) {
  if (!text) {
    return false
  }

  const lines = text.split(/\r?\n/)
  if (lines.length < 2) {
    return false
  }

  let indented = 0
  let treeChars = 0
  for (const line of lines) {
    if (/^\s{2,}\S/.test(line)) {
      indented += 1
    }
    if (/[└├│]/.test(line)) {
      treeChars += 1
    }
  }

  return indented >= 1 || treeChars >= 1
}

function normalizeListItemText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim()
}

function stripCodePlaceholders(text) {
  return String(text || '').replace(/\x00CODE\x00/g, '').replace(/\s+/g, ' ').trim()
}

function parseListItem(itemNode, currentLang) {
  const result = {
    variant: 'text',
    text: '',
    children: null,
  }

  const firstParagraph = (itemNode.children || []).find((child) => child.type === 'paragraph')
  if (firstParagraph && Array.isArray(firstParagraph.children)) {
    // 收集所有 inlineCode 节点
    const inlineCodes = []
    for (const child of firstParagraph.children) {
      if (child.type === 'inlineCode') {
        inlineCodes.push(child.value || '')
      }
    }

    if (inlineCodes.length > 0) {
      // 提取描述文本（去掉 inlineCode 后剩余部分）
      const parts = []
      for (const child of firstParagraph.children) {
        if (child.type === 'inlineCode') {
          parts.push('\x00CODE\x00')
        } else {
          parts.push(nodeText(child))
        }
      }
      const fullText = parts.join('')
      // 提取冒号后的描述
      const colonMatch = fullText.match(/[:：]\s*(.+)$/)
      const description = colonMatch ? stripCodePlaceholders(colonMatch[1]) : ''

      result.variant = 'code-desc'
      result.codes = inlineCodes.map((c) => c.trim())
      result.description = description
      result.lang = currentLang
    } else {
      result.text = normalizeListItemText(paragraphText(firstParagraph))
    }
  }

  const childList = (itemNode.children || []).find((child) => child.type === 'list' && !child.ordered)
  if (childList) {
    result.children = parseList(childList, currentLang)
  }

  if (result.variant === 'text' && !result.text) {
    const fallback = normalizeListItemText(nodeText(itemNode))
    result.text = fallback
  }

  return result
}

function parseList(listNode, currentLang) {
  const items = []
  for (const itemNode of listNode.children || []) {
    items.push(parseListItem(itemNode, currentLang))
  }
  return {
    type: 'list',
    items,
  }
}

function pushEntryFromListItem(itemNode, currentLang, output) {
  const paragraph = itemNode.children?.[0]
  if (paragraph?.type === 'paragraph' && Array.isArray(paragraph.children)) {
    // 收集所有 inlineCode 节点
    const inlineCodes = []
    for (const child of paragraph.children) {
      if (child.type === 'inlineCode') {
        inlineCodes.push(child.value || '')
      }
    }

    if (inlineCodes.length > 0) {
      // 提取描述文本
      const parts = []
      for (const child of paragraph.children) {
        if (child.type === 'inlineCode') {
          parts.push('\x00CODE\x00')
        } else {
          parts.push(nodeText(child))
        }
      }
      const fullText = parts.join('')
      const colonMatch = fullText.match(/[:：]\s*(.+)$/)
      const description = colonMatch ? stripCodePlaceholders(colonMatch[1]) : ''

      output.push({
        type: 'entry',
        variant: 'code-desc',
        codes: inlineCodes.map((c) => c.trim()),
        description,
        lang: currentLang,
      })
      return
    }
  }

  const text = itemNode.children.map((child) => nodeText(child)).join(' ').trim()
  if (!text) {
    return
  }

  output.push({
    type: 'entry',
    variant: 'text',
    text,
  })
}

/**
 * @param {string} markdown
 * @returns {DocumentModel}
 */
export function parseCheatsheetMarkdown(markdown) {
  const { data: frontmatter, body } = extractFrontmatter(markdown)
  const documentLang = normalizeLang(frontmatter.lang, DEFAULT_LANG)
  const { body: normalizedBody, metaByCardIndex } = extractCardMetaBlocks(body)

  const processor = unified().use(remarkParse).use(remarkFrontmatter, ['yaml']).use(remarkGfm)
  const tree = processor.parse(normalizedBody)
  const nodes = Array.isArray(tree.children) ? tree.children : []

  /** @type {DocumentModel} */
  const model = {
    type: 'document',
    title: typeof frontmatter.title === 'string' && frontmatter.title.trim() ? frontmatter.title.trim() : 'Cheatsheet',
    lang: documentLang,
    meta: {
      version: typeof frontmatter.version === 'string' && frontmatter.version.trim() ? frontmatter.version.trim() : 'unknown',
      date: typeof frontmatter.date === 'string' && frontmatter.date.trim() ? frontmatter.date.trim() : 'unknown',
      github: typeof frontmatter.github === 'string' && frontmatter.github.trim() ? frontmatter.github.trim() : 'unknown',
      colWidth: normalizeColWidth(frontmatter.colWidth, DEFAULT_COL_WIDTH),
      tags: Array.isArray(frontmatter.tags)
        ? frontmatter.tags.map((tag) => String(tag || '').trim()).filter(Boolean)
        : [],
    },
    cards: [],
  }

  /** @type {CardModel | null} */
  let currentCard = null
  /** @type {SetModel | null} */
  let currentSet = null
  let currentCardIndex = -1

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i]

    if (node.type === 'heading' && node.depth === 1) {
      const headingText = nodeText(node).trim()
      if (headingText) {
        model.title = headingText
      }
      continue
    }

    if (node.type === 'heading' && node.depth === 2) {
      currentCardIndex += 1
      const headingText = nodeText(node)
      const { emoji, title } = splitEmoji(headingText)
      const cardMeta = metaByCardIndex.get(currentCardIndex) || {}
      const cardLang = normalizeLang(cardMeta.lang, documentLang)
      currentCard = {
        type: 'card',
        title: title || 'Untitled',
        emoji: cardMeta.emoji || emoji,
        link: cardMeta.link || '',
        desc: cardMeta.desc || '',
        lang: cardLang,
        items: [],
      }

      if (currentCard.desc) {
        currentCard.items.push({
          type: 'desc',
          text: currentCard.desc,
        })
      }

      model.cards.push(currentCard)
      currentSet = null
      continue
    }

    if (!currentCard) {
      continue
    }

    if (node.type === 'heading' && node.depth === 3) {
      currentSet = {
        type: 'set',
        title: nodeText(node).trim() || 'Untitled Set',
        items: [],
      }
      currentCard.items.push(currentSet)
      continue
    }

    const output = targetArray(currentCard, currentSet)
    if (!output) {
      continue
    }

    if (node.type === 'list' && !node.ordered) {
      output.push(parseList(node, currentCard.lang || documentLang))
      continue
    }

    if (node.type === 'paragraph' && node.children && node.children.length === 1 && node.children[0].type === 'inlineCode') {
      output.push({
        type: 'inlineCode',
        code: node.children[0].value || '',
        lang: currentCard.lang || documentLang,
      })
      continue
    }

    if (node.type === 'code') {
      output.push({
        type: 'codeBlock',
        code: node.value || '',
        lang: normalizeLang(node.lang, currentCard.lang || documentLang),
      })
      continue
    }

    if (node.type === 'table') {
      output.push({
        type: 'table',
        align: Array.isArray(node.align) ? node.align.map((value) => (typeof value === 'string' ? value : null)) : [],
        rows: (node.children || []).map((rowNode, rowIndex) => ({
          header: rowIndex === 0,
          cells: (rowNode.children || []).map((cellNode) => normalizeListItemText(nodeText(cellNode))),
        })),
      })
      continue
    }

    if (node.type === 'paragraph') {
      const text = paragraphText(node)
      if (!text) {
        continue
      }

      if (looksLikeCodeBlock(text)) {
        output.push({
          type: 'codeBlock',
          code: text,
          lang: currentCard.lang || documentLang,
        })
      } else {
        output.push({
          type: 'desc',
          text,
        })
      }
      continue
    }
  }

  return model
}
