function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderDesc(node) {
  return `<div class="desc">${escapeHtml(node.text)}</div>`
}

function renderEntryLi(entry) {
  if (entry.variant === 'code-desc') {
    const codes = (entry.codes || []).map((c) => `<code>${escapeHtml(c)}</code>`).join(' ')
    const desc = escapeHtml(entry.description)
    return `<li>${codes}：${desc}</li>`
  }

  return `<li>${escapeHtml(entry.text)}</li>`
}

function renderListItem(item) {
  let content = ''
  if (item.variant === 'code-desc') {
    const codes = (item.codes || []).map((c) => `<code>${escapeHtml(c)}</code>`).join(' ')
    const desc = escapeHtml(item.description || '')
    content = desc ? `${codes}：${desc}` : codes
  } else {
    content = escapeHtml(item.text || '')
  }

  const child = item.children ? renderList(item.children) : ''
  return `<li>${content}${child}</li>`
}

function renderList(node) {
  const items = (node.items || []).map((item) => renderListItem(item)).join('')
  return `<ul>${items}</ul>`
}

function renderInlineCode(node) {
  const code = escapeHtml(node.code)
  const lang = escapeHtml(node.lang || 'bash')
  return `<pre><code class="language-${lang}">${code}</code></pre>`
}

function renderCodeBlock(node) {
  const code = escapeHtml(node.code)
  const lang = escapeHtml(node.lang || 'bash')
  return `<pre><code class="language-${lang}">${code}</code></pre>`
}

function renderSet(set) {
  return `<h3>${escapeHtml(set.title)}</h3>${renderItems(set.items)}`
}

function renderItems(items) {
  const parts = []
  let pendingEntries = []

  function flushEntries() {
    if (pendingEntries.length === 0) {
      return
    }
    parts.push(`<ul>${pendingEntries.join('')}</ul>`)
    pendingEntries = []
  }

  items.forEach((item) => {
      if (item.type === 'entry') {
        pendingEntries.push(renderEntryLi(item))
        return
      }

      if (item.type === 'inlineCode') {
        flushEntries()
        parts.push(renderInlineCode(item))
        return
      }

      if (item.type === 'codeBlock') {
        flushEntries()
        parts.push(renderCodeBlock(item))
        return
      }

      if (item.type === 'set') {
        flushEntries()
        parts.push(renderSet(item))
        return
      }

      if (item.type === 'list') {
        flushEntries()
        parts.push(renderList(item))
        return
      }

      if (item.type === 'desc') {
        flushEntries()
        parts.push(renderDesc(item))
      }
    })

  flushEntries()
  return parts.join('')
}

function renderCard(card) {
  const body = renderItems(card.items)
  const titleText = `${card.emoji ? `${card.emoji} ` : ''}${card.title}`
  const title = escapeHtml(titleText.trim())
  const link = String(card.link || '').trim()
  const linkHtml = /^https?:\/\//.test(link)
    ? ` <a href="${escapeHtml(link)}" title="官方文档" target="_blank" style="color:#93cdfc;">&gt;&gt;&gt;</a>`
    : ''

  return `<div class="card"><h2>${title}${linkHtml}</h2>${body}</div>`
}

function githubHref(github) {
  const value = String(github || '').trim()
  if (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value)) {
    return `https://github.com/${value}`
  }
  return ''
}

export function renderCards(model) {
  return model.cards.map((card) => renderCard(card)).join('')
}

export function renderDocument(model, templateHtml) {
  const title = escapeHtml(model.title || 'Cheatsheet')
  const metaVersion = escapeHtml(model.meta?.version || 'unknown')
  const metaDate = escapeHtml(model.meta?.date || 'unknown')
  const metaGithub = escapeHtml(model.meta?.github || 'unknown')
  const githubUrl = githubHref(model.meta?.github || '')
  const githubHtml = githubUrl
    ? `<a class="meta-link" href="${escapeHtml(githubUrl)}" target="_blank" rel="noopener">${metaGithub}</a>`
    : metaGithub
  const cardsHtml = renderCards(model)

  const colWidth = escapeHtml(model.meta?.colWidth || '340px')

  return templateHtml
    .replace('<!-- APP_TITLE -->', title)
    .replace('<!-- PAGE_TITLE -->', title)
    .replace('<!-- META_VERSION -->', metaVersion)
    .replace('<!-- META_DATE -->', metaDate)
    .replace('<!-- META_GITHUB -->', githubHtml)
    .replace('<!-- CHEATSHEET_CONTENT -->', cardsHtml)
    .replace('<!-- CHEATSHEET_CONTENT -->', cardsHtml)
    .replace('<!-- COL_WIDTH -->', colWidth)
}
