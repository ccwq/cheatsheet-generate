(function() {
  // 依赖全局变量: window.TAG_DATA, window.__navFilterCards
  if (!window.TAG_DATA || !Array.isArray(window.TAG_DATA)) {
    console.warn('TAG_DATA not found or invalid');
    return;
  }

  // 状态
  var state = {
    selectedTags: new Set(),
    rowCount: parseInt(localStorage.getItem('tagRowCount') || '3', 10),
    isExpanded: false,
    isMultiSelect: localStorage.getItem('tagMultiSelect') === 'true'
  };

  // DOM 元素
  var container, tagList, rowSelect, expandBtn, clearBtn;

  // 初始化
  function init() {
    renderUI();
    bindEvents();
    updateLayout();
  }

  // 渲染 UI 结构
  function renderUI() {
    var panel = document.querySelector('.panel');
    if (!panel) return;

    // 创建容器
    container = document.createElement('div');
    container.className = 'tag-bar-container';

    // 控制栏
    var controls = document.createElement('div');
    controls.className = 'tag-controls';
    
    controls.innerHTML = `
      <label>🏷️ 标签筛选：</label>
      <label class="toggle" style="margin-right: 8px; font-size: 12px; cursor: pointer;" title="勾选后可选择多个标签，默认单选">
        <input id="tagMultiSelect" type="checkbox" ${state.isMultiSelect ? 'checked' : ''} /> 多选
      </label>
      <select id="tagRowSelect" class="btn" style="padding: 2px 6px; font-size: 12px;">
        <option value="1">1 行</option>
        <option value="2">2 行</option>
        <option value="3">3 行</option>
        <option value="0">全部显示</option>
      </select>
      <span id="tagExpandBtn" class="tag-expand-btn" style="display:none">展开</span>
      <button id="tagClearBtn" class="tag-clear-btn">清除筛选</button>
    `;

    // 标签列表
    tagList = document.createElement('div');
    tagList.appendChild(controls);
    tagList.className = 'tag-list';

    // 渲染标签
    window.TAG_DATA.forEach(function(tag) {
      var el = document.createElement('tag-chip');
      el.className = 'tag tag-group-' + (tag.group || 0);
      el.dataset.name = tag.name;
      el.dataset.group = tag.group;
      el.setAttribute('label', tag.name);
      el.setAttribute('group', tag.group || 0);
      el.setAttribute('variant', 'filter');
      el.setAttribute('count', tag.count || 0);
      if (tag.icon) {
        el.setAttribute('icon', tag.icon);
      }
      if (tag.iconSvg) {
        el.setAttribute('icon-svg', tag.iconSvg);
      }
      el.title = tag.name;
      el.onclick = function() { toggleTag(tag.name, el); };
      tagList.appendChild(el);
    });

    // container.appendChild(controls);
    container.appendChild(tagList);
    panel.appendChild(container);

    // 获取引用
    rowSelect = container.querySelector('#tagRowSelect');
    expandBtn = container.querySelector('#tagExpandBtn');
    clearBtn = container.querySelector('#tagClearBtn');

    // 恢复行数设置
    rowSelect.value = state.rowCount;
  }

  // 绑定事件
  function bindEvents() {
    var multiSelectCb = container.querySelector('#tagMultiSelect');
    if (multiSelectCb) {
      multiSelectCb.addEventListener('change', function(e) {
        state.isMultiSelect = e.target.checked;
        localStorage.setItem('tagMultiSelect', state.isMultiSelect);
      });
    }

    rowSelect.addEventListener('change', function(e) {
      state.rowCount = parseInt(e.target.value, 10);
      localStorage.setItem('tagRowCount', state.rowCount);
      updateLayout();
    });

    expandBtn.addEventListener('click', function() {
      state.isExpanded = !state.isExpanded;
      updateLayout();
    });

    clearBtn.addEventListener('click', function() {
      state.selectedTags.clear();
      updateTagSelection();
      triggerFilter();
    });
  }

  // 切换标签选中状态
  function toggleTag(name, el) {
    var isSelected = state.selectedTags.has(name);

    if (!state.isMultiSelect) {
      // 单选模式
      if (isSelected) {
        // 已选中 -> 取消选中
        state.selectedTags.delete(name);
        el.classList.remove('active');
      } else {
        // 未选中 -> 清除其他所有，选中当前
        state.selectedTags.clear();
        // UI 清除
        var activeTags = tagList.querySelectorAll('.tag.active');
        activeTags.forEach(function(t) { t.classList.remove('active'); });
        
        state.selectedTags.add(name);
        el.classList.add('active');
      }
    } else {
      // 多选模式
      if (isSelected) {
        state.selectedTags.delete(name);
        el.classList.remove('active');
      } else {
        state.selectedTags.add(name);
        el.classList.add('active');
      }
    }
    updateClearBtn();
    triggerFilter();
  }

  // 更新选中状态 UI
  function updateTagSelection() {
    var tags = tagList.querySelectorAll('.tag');
    tags.forEach(function(el) {
      if (state.selectedTags.has(el.dataset.name)) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    updateClearBtn();
  }

  function updateClearBtn() {
    if (state.selectedTags.size > 0) {
      clearBtn.style.display = 'inline-flex';
      clearBtn.textContent = `清除筛选 (${state.selectedTags.size})`;
    } else {
      clearBtn.style.display = 'none';
    }
  }

  // 触发全局过滤
  function triggerFilter() {
    // 将 Set 转为 Array 传递给全局过滤器
    // 这里我们需要 hook 现有的 filterCards 或者暴露一个新的接口
    // 假设 nav.template.html 中的 filterCards 已经被修改为支持 tags 参数
    // 或者我们直接修改 window.__selectedTags 供其使用
    window.__selectedTags = Array.from(state.selectedTags);
    
    // 触发搜索（传递当前搜索框的值）
    var searchBox = document.getElementById('searchBox');
    if (window.__navFilterCards) {
      window.__navFilterCards(searchBox ? searchBox.value : '');
    }
  }

  // 更新布局（行数限制）
  function updateLayout() {
    var lineHeight = 28; // 估算每行高度 (tag height + gap)
    var limit = state.rowCount;
    
    if (limit === 0) {
      tagList.style.maxHeight = 'none';
      expandBtn.style.display = 'none';
    } else {
      // 检查是否溢出 (简单判断：如果有 limit 行，maxHeight 设为 limit * lineHeight)
      // 但由于 flex wrap，我们很难精确知道具体占了多少行，除非 offsetHeight
      // 这里采用 CSS maxHeight 限制
      if (state.isExpanded) {
        tagList.style.maxHeight = 'none';
        expandBtn.textContent = '收起';
      } else {
        tagList.style.maxHeight = (limit * 34) + 'px'; // 34px 约等于一行的高度
        expandBtn.textContent = '展开';
      }
      expandBtn.style.display = 'inline-block';
    }
  }

  // 暴露全局
  window.__tagsManager = {
    init: init
  };

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
