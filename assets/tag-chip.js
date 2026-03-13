(function() {
  if (customElements.get('tag-chip')) {
    return
  }

  var template = document.createElement('template')
  template.innerHTML = [
    '<style>',
    '  :host {',
    '    display: inline-flex;',
    '    vertical-align: middle;',
    '  }',
    '  .chip {',
    '    display: inline-flex;',
    '    align-items: center;',
    '    gap: 6px;',
    '    padding: var(--tag-chip-padding, 2px 8px);',
    '    border-radius: var(--tag-chip-radius, 4px);',
    '    font-size: var(--tag-chip-font-size, 12px);',
    '    line-height: 1.2;',
    '    cursor: var(--tag-chip-cursor, pointer);',
    '    border: 1px solid var(--tag-border-dim, rgba(255, 255, 255, 0.12));',
    '    background: var(--tag-bg-dim, rgba(255, 255, 255, 0.05));',
    '    color: var(--tag-text, #cfe4ff);',
    '    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease, opacity 0.2s ease;',
    '    user-select: none;',
    '    box-sizing: border-box;',
    '  }',
    '  .icon {',
    '    width: 1.05em;',
    '    height: 1.05em;',
    '    display: inline-flex;',
    '    align-items: center;',
    '    justify-content: center;',
    '    flex: none;',
    '  }',
    '  .icon:empty {',
    '    display: none;',
    '  }',
    '  .icon svg {',
    '    width: 100%;',
    '    height: 100%;',
    '    display: block;',
    '    fill: currentColor;',
    '  }',
    '  .label {',
    '    white-space: nowrap;',
    '  }',
    '  .count {',
    '    font-size: 0.85em;',
    '    opacity: 0.72;',
    '  }',
    '  :host(:hover) .chip {',
    '    background: var(--tag-bg-hover, rgba(255, 255, 255, 0.1));',
    '    border-color: var(--tag-border, #69a7ff);',
    '    box-shadow: 0 0 8px var(--tag-border, #69a7ff);',
    '  }',
    '  :host(.active) .chip {',
    '    background: var(--tag-bg, #3e5bd4);',
    '    border-color: var(--tag-border, #69a7ff);',
    '    color: #fff;',
    '    font-weight: 600;',
    '    box-shadow: 0 0 10px var(--tag-bg-dim, rgba(62, 91, 212, 0.35));',
    '  }',
    '  :host(.card-tag) .chip {',
    '    padding: var(--tag-chip-padding, 1px 6px);',
    '    font-size: var(--tag-chip-font-size, 10px);',
    '    cursor: var(--tag-chip-cursor, default);',
    '    background: var(--tag-card-bg, var(--tag-bg-dim, rgba(255, 255, 255, 0.05)));',
    '    border-color: var(--tag-card-border, var(--tag-border-dim, rgba(255, 255, 255, 0.12)));',
    '    opacity: var(--tag-card-opacity, 0.82);',
    '  }',
    '  :host(.card-tag:hover) .chip,',
    '  :host(.detail-tag:hover) .chip {',
    '    box-shadow: none;',
    '    opacity: 1;',
    '  }',
    '  :host(.detail-tag) .chip {',
    '    padding: var(--tag-chip-padding, 3px 8px);',
    '    font-size: var(--tag-chip-font-size, 11px);',
    '    cursor: var(--tag-chip-cursor, default);',
    '  }',
    '</style>',
    '<span class="chip" part="chip">',
    '  <span class="icon" part="icon"></span>',
    '  <span class="label" part="label"></span>',
    '  <span class="count" part="count"></span>',
    '</span>',
  ].join('')

  function sanitizeSvg(svg) {
    var text = String(svg || '').trim()
    if (!text) return ''
    if (/<script/i.test(text)) return ''
    return text
  }

  class TagChipElement extends HTMLElement {
    static get observedAttributes() {
      return ['label', 'count', 'icon-svg']
    }

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
      this.$icon = this.shadowRoot.querySelector('.icon')
      this.$label = this.shadowRoot.querySelector('.label')
      this.$count = this.shadowRoot.querySelector('.count')
    }

    connectedCallback() {
      this.render()
    }

    attributeChangedCallback() {
      this.render()
    }

    render() {
      this.$label.textContent = this.getAttribute('label') || this.dataset.name || ''

      var count = this.getAttribute('count')
      if (count == null || count === '') {
        this.$count.textContent = ''
        this.$count.hidden = true
      } else {
        this.$count.textContent = count
        this.$count.hidden = false
      }

      var svg = sanitizeSvg(this.getAttribute('icon-svg'))
      this.$icon.innerHTML = svg
    }
  }

  customElements.define('tag-chip', TagChipElement)
})()
