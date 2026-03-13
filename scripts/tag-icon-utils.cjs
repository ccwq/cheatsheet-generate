const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const TAGS_DEFINE_PATH = path.join(process.cwd(), 'tags', 'tags-define.yml')
const TAGS_ICON_PATH = path.join(process.cwd(), 'tags', 'tags-icon.yml')

let cachedMdiIcons = null

function exists(filePath) {
  try {
    fs.accessSync(filePath)
    return true
  } catch {
    return false
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function loadYamlFile(filePath, fallback) {
  if (!exists(filePath)) {
    return fallback
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const parsed = yaml.load(content)
    return parsed == null ? fallback : parsed
  } catch (error) {
    console.warn(`[tag-icon-utils] 读取失败: ${path.relative(process.cwd(), filePath)}`, error.message)
    return fallback
  }
}

function loadTagGroupMap() {
  const defs = loadYamlFile(TAGS_DEFINE_PATH, [])
  const map = {}

  defs.forEach((group, idx) => {
    if (!group || !Array.isArray(group.tags)) {
      return
    }

    group.tags.forEach((tagName) => {
      map[String(tagName)] = idx + 1
    })
  })

  return map
}

function loadTagIconConfig() {
  const config = loadYamlFile(TAGS_ICON_PATH, {})
  return {
    default: normalizeIconRule(config.default),
    tags: normalizeTagIconMap(config.tags),
  }
}

function normalizeTagIconMap(tagsSection) {
  const map = {}
  if (!tagsSection || typeof tagsSection !== 'object') {
    return map
  }

  Object.entries(tagsSection).forEach(([tagName, rule]) => {
    map[tagName] = normalizeIconRule(rule)
  })

  return map
}

function normalizeIconRule(rule) {
  if (typeof rule === 'string') {
    return { icon: rule }
  }

  if (!rule || typeof rule !== 'object') {
    return {}
  }

  return {
    icon: typeof rule.icon === 'string' ? rule.icon.trim() : '',
  }
}

function loadMdiIcons() {
  if (cachedMdiIcons) {
    return cachedMdiIcons
  }

  try {
    cachedMdiIcons = require('@iconify-json/mdi/icons.json').icons || {}
  } catch {
    cachedMdiIcons = {}
  }

  return cachedMdiIcons
}

function normalizeIconName(iconName) {
  const value = String(iconName || '').trim()
  if (!value) {
    return ''
  }

  if (value.startsWith('mdi:')) {
    return value
  }

  return `mdi:${value}`
}

function getIconSvg(iconName) {
  const normalizedName = normalizeIconName(iconName)
  if (!normalizedName) {
    return ''
  }

  const [prefix, rawName] = normalizedName.split(':')
  if (prefix !== 'mdi' || !rawName) {
    return ''
  }

  const iconSet = loadMdiIcons()
  const icon = iconSet[rawName]
  if (!icon || !icon.body) {
    return ''
  }

  const width = Number(icon.width) || 24
  const height = Number(icon.height) || 24
  return `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false">${icon.body}</svg>`
}

function createTagIconResolver() {
  const tagGroupMap = loadTagGroupMap()
  const iconConfig = loadTagIconConfig()
  const fallbackIcon = normalizeIconName(iconConfig.default.icon || 'mdi:tag-outline')
  const fallbackSvg = getIconSvg(fallbackIcon)

  function resolveTagMeta(tagName) {
    const name = String(tagName || '').trim()
    const group = tagGroupMap[name] || 0
    const configured = iconConfig.tags[name] || {}
    const icon = normalizeIconName(configured.icon || fallbackIcon)
    const iconSvg = getIconSvg(icon) || fallbackSvg

    return {
      name,
      group,
      icon,
      iconSvg,
    }
  }

  function renderTagChip(tagName, options = {}) {
    const meta = resolveTagMeta(tagName)
    const classNames = ['tag', `tag-group-${meta.group}`]
    if (options.className) {
      classNames.push(options.className)
    }

    const attrs = [
      `class="${classNames.join(' ')}"`,
      `data-name="${escapeHtml(meta.name)}"`,
      `data-group="${meta.group}"`,
      `label="${escapeHtml(meta.name)}"`,
      `group="${meta.group}"`,
    ]

    if (options.variant) {
      attrs.push(`variant="${escapeHtml(options.variant)}"`)
    }

    if (Number.isFinite(options.count)) {
      attrs.push(`count="${options.count}"`)
    }

    if (meta.icon) {
      attrs.push(`icon="${escapeHtml(meta.icon)}"`)
    }

    if (meta.iconSvg) {
      attrs.push(`icon-svg="${escapeHtml(meta.iconSvg)}"`)
    }

    return `<tag-chip ${attrs.join(' ')}></tag-chip>`
  }

  return {
    tagGroupMap,
    resolveTagMeta,
    renderTagChip,
  }
}

module.exports = {
  createTagIconResolver,
  escapeHtml,
}
