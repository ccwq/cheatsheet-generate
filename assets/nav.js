      // 第1次：列宽调节 + 搜索过滤 + 自动徽章 + 复制链接
      (function() {
        var search = $('#searchBox');
        var stats = $('#stats');
        var sortSel = document.getElementById('sortSelect');

        // 为每张卡自动添加 copy 按钮
        function enhanceCards() {
          var cards = $$('.card');
          cards.forEach(function(card){
            var h2 = $('h2', card);
            var link = $('.link', card);
            if (!h2 || !link) return;
            // 规范化标题文本（去除图标与现有链接显示内容）
            var h2clone = h2.cloneNode(true);
            var toRemove = h2clone.querySelector('.link'); if (toRemove) toRemove.remove();
            var iconClone = h2clone.querySelector('.icon'); if (iconClone) iconClone.remove();
            var titleText = (h2clone.textContent || '').trim();

            // 数据缓存（搜索/排序用）
            card.dataset.title = titleText;
            var descRaw = ($('.desc', card)?.textContent || '').trim();
            card.dataset.desc = descRaw;

            // 若无图标，添加默认文档图标
            var iconEl = h2.querySelector('.icon');
            if (!iconEl) {
              h2.insertAdjacentHTML('afterbegin', '<svg class="icon" width="16" height="16" viewBox="0 0 24 24"><use href="#icon-doc"/></svg>');
            }

            // 将标题文本变为可点击链接（使用原有 .link 元素）
            // 清理 h2 中除图标与 link 外的其它节点
            var iconKeep = h2.querySelector('.icon');
            Array.from(h2.childNodes).forEach(function(n){ if (n !== iconKeep && n !== link) h2.removeChild(n); });
            link.classList.add('title-link');
            link.innerHTML = '';
            link.appendChild(document.createTextNode(titleText));

            // 复制链接按钮（保持但改为更扁平）
            var href = link.getAttribute('href') || '';
            var wrap = document.createElement('div');
            wrap.className = 'copy';
            wrap.innerHTML = '<button title="复制链接"><svg width="14" height="14"><use href="#icon-copy"/></svg>复制</button>';
            wrap.addEventListener('click', function(){
              try {
                var abs = new URL(href, window.location.href).href; // 兼容 GitHub Pages 基础路径
                navigator.clipboard.writeText(abs);
              } catch(e) { /* ignore */ }
              var btn = wrap.querySelector('button');
              var before = btn.textContent;
              btn.textContent = '已复制';
              setTimeout(function(){ btn.textContent = before; }, 900);
            });
            card.appendChild(wrap);
          });
        }

        // 搜索过滤（标题+简介可选）
        // 说明：是否包含简介由全局开关 window.__includeDesc 控制（默认 true）
        function filterCards(q){
          var cards = $$('.card');
          var visible = 0; q = (q||'').trim().toLowerCase();
          var includeDesc = (typeof window !== 'undefined' && typeof window.__includeDesc === 'boolean') ? window.__includeDesc : true; // 新增：是否在搜索中包含简介
          var selectedTags = window.__selectedTags || [];

          function highlight(el, originText, query){
            if (!el) return;
            // 仅对文本进行高亮，避免污染属性（如 href）
            if (!el.dataset.origin) {
              el.dataset.origin = (originText || el.textContent || '').trim();
            }
            var text = el.dataset.origin || '';
            if (!query) { el.textContent = text; return; }
            try {
              var safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              var re = new RegExp('(' + safe + ')', 'ig');
              var html = text.replace(re, '<mark style="background:#3e5bd4;color:#fff;border-radius:3px;padding:0 2px">$1</mark>');
              el.innerHTML = html;
            } catch(e){ el.textContent = text; }
          }

          cards.forEach(function(card){
            var title = (card.dataset.title || '').toLowerCase();
            var desc = (card.dataset.desc || '').toLowerCase();
            var cardTagsStr = (card.dataset.tags || '');

            // 命中规则：标题命中 或（启用时）简介命中
            var textHit = (!q || title.indexOf(q) >= 0 || (includeDesc && desc.indexOf(q) >= 0));
            
            // 标签匹配：只要包含任一选中的标签即可 (OR逻辑)
            // 如果希望是 AND (必须包含所有选中标签)，则改为 every
            var tagHit = true;
            if (selectedTags.length > 0) {
              var cardTagList = cardTagsStr.split(',');
              tagHit = selectedTags.every(function(t) { return cardTagList.includes(t); });
            }

            var hit = textHit && tagHit;

            // 仅高亮标题可见文本，避免破坏 <a href>
            highlight($('.title-link', card), card.dataset.title || '', q);
            // 简介高亮跟随 includeDesc，未启用时清除简介高亮，避免误导
            if (includeDesc) {
              highlight($('.desc', card), card.dataset.desc || '', q);
            } else {
              highlight($('.desc', card), card.dataset.desc || '', '');
            }
            card.style.display = hit ? '' : 'none';
            if (hit) visible++;
          });
          stats.textContent = (q ? ('匹配 ' + visible + ' 项') : ('共 ' + cards.length + ' 项')) + ' · 可见：' + visible;
        }

        function sortCards(order){
          var cards = $$('.card');
          var nodes = cards.map(function(c){ return { node: c, key: (c.dataset.title||'').toLowerCase() }; });
          nodes.sort(function(a,b){ return a.key.localeCompare(b.key, 'zh-Hans-CN'); });
          if (order === 'name-desc') nodes.reverse();
          var frag = document.createDocumentFragment();
          nodes.forEach(function(it){ frag.appendChild(it.node); });
          var columns = document.getElementById('columns');
          if (columns) columns.appendChild(frag);
        }

        // 快捷键：按 / 聚焦搜索，Esc 清空
        // 全局键盘输入即搜索（无需先点到输入框）
        (function(){
          var lastTypeTime = 0; // 连续输入间隔阈值控制
          var typeGapMs = 800;
          var composing = false;

          function isEditable(el){
            if (!el) return false;
            var tag = (el.tagName || '').toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
            if (el.isContentEditable) return true;
            return false;
          }

          document.addEventListener('compositionstart', function(){ composing = true; }, true);
          document.addEventListener('compositionend', function(e){
            var target = document.activeElement;
            // 若当前不在搜索框编辑，合成输入结束时将文本写入搜索框
            if (composing && target !== search && !isEditable(target)) {
              var now = Date.now();
              if (now - lastTypeTime > typeGapMs) { search.value = ''; }
              var data = (e && e.data) ? e.data : '';
              if (data) {
                search.value += data;
                filterCards(search.value);
              }
              search.focus();
              lastTypeTime = now;
            }
            composing = false;
          }, true);

          document.addEventListener('keydown', function(ev) {
            // 快捷键：/ 聚焦搜索
            if (ev.key === '/' && document.activeElement !== search) { ev.preventDefault(); search.focus(); return; }

            // Esc：聚焦/取消
            if (ev.key === 'Escape') { 
              if (document.activeElement === search) {
                // 如果当前是聚焦状态：取消聚焦 (Blur)，不清空
                search.blur(); 
              } else {
                // 如果当前不是聚焦状态：聚焦并全选，方便输入
                ev.preventDefault();
                search.focus();
                search.select();
              }
              return; 
            }

            // 仅在非输入态、非组合键、非IME合成时处理
            if (isEditable(document.activeElement) || ev.ctrlKey || ev.metaKey || ev.altKey || composing) return;

            // Backspace：全局删除一个字符
            if (ev.key === 'Backspace') {
              if (search.value) {
                ev.preventDefault();
                search.value = search.value.slice(0, -1);
                filterCards(search.value);
              }
              return;
            }

            // 仅处理可打印字符（长度为1）
            if (typeof ev.key === 'string' && ev.key.length === 1) {
              var now = Date.now();
              if (now - lastTypeTime > typeGapMs) { search.value = ''; }
              search.value += ev.key;
              search.focus();
              filterCards(search.value);
              lastTypeTime = now;
              // 避免浏览器默认行为（例如页面滚动等）
              ev.preventDefault();
              return;
            }
          }, true);
        })();
        // 输入防抖
        var tId; search.addEventListener('input', function(){ clearTimeout(tId); tId=setTimeout(function(){ filterCards(search.value); }, 100); });
        if (sortSel) sortSel.addEventListener('change', function(){ sortCards(sortSel.value); filterCards(search.value); });

        // 首次增强 + 初始化统计
        enhanceCards();
        if (sortSel) sortCards(sortSel.value);
        filterCards('');
        // 注意：openLinkMode, columnWidth, backTop 由 common.js 初始化

        // --- 键盘导航功能 (2025-01-20) ---
        (function() {
          function getVisibleCards() {
            return Array.from(document.querySelectorAll('.card')).filter(function(c){
              return c.style.display !== 'none';
            });
          }

          function updateHighlight(card) {
            var all = document.querySelectorAll('.card');
            all.forEach(function(c){ c.classList.remove('card-highlight'); });
            if (card) {
              card.classList.add('card-highlight');
              // 平滑滚动可能导致连续按键时体验不佳，使用 auto
              if (card.scrollIntoView) {
                card.scrollIntoView({ block: 'nearest', inline: 'nearest' });
              }
            }
          }

          function findNextCard(current, dir) {
            var visible = getVisibleCards();
            if (visible.length === 0) return null;
            if (!current) return visible[0];

            var rect = current.getBoundingClientRect();
            var cx = rect.left + rect.width / 2;
            var cy = rect.top + rect.height / 2;

            var best = null;
            var minDist = Infinity;

            visible.forEach(function(card) {
              if (card === current) return;
              var r = card.getBoundingClientRect();
              var tcx = r.left + r.width / 2;
              var tcy = r.top + r.height / 2;
              
              var dx = tcx - cx;
              var dy = tcy - cy;
              
              var valid = false;
              // 宽松的方向判定 (阈值 5px)
              if (dir === 'up')    { if (dy < -5) valid = true; }
              else if (dir === 'down')  { if (dy > 5) valid = true; }
              else if (dir === 'left')  { if (dx < -5) valid = true; }
              else if (dir === 'right') { if (dx > 5) valid = true; }

              if (valid) {
                // 距离权重：主方向差异小优先，次方向差异大惩罚
                var dist = 0;
                if (dir === 'up' || dir === 'down') {
                  // 垂直移动：水平偏差惩罚大 (权重 10)
                  dist = (dy * dy) + (dx * dx * 10);
                } else {
                  // 水平移动：垂直偏差惩罚大 (权重 10)
                  dist = (dx * dx) + (dy * dy * 10);
                }

                if (dist < minDist) {
                  minDist = dist;
                  best = card;
                }
              }
            });

            return best || current;
          }

          // 搜索框回车：高亮第一个并 Blur
          search.addEventListener('keydown', function(ev) {
            if (ev.key === 'Enter') {
              ev.preventDefault();
              ev.stopPropagation(); // 阻止冒泡，防止触发全局的 Enter 跳转逻辑
              var visible = getVisibleCards();
              if (visible.length > 0) {
                updateHighlight(visible[0]);
                search.blur();
              }
            }
          });

          // 全局导航
          document.addEventListener('keydown', function(ev) {
            // 搜索框聚焦时，不处理方向键，避免冲突
            if (
              document.activeElement === search && 
              !["ArrowUp","ArrowDown"].includes(ev.key) && 
              !["Enter","Escape"].includes(ev.key)
            ){
              search.blur(); 
              return;
            };
            
            // 忽略修饰键
            if (ev.ctrlKey || ev.metaKey || ev.altKey) return;

            var dir = null;
            if (ev.key === 'ArrowUp') dir = 'up';
            else if (ev.key === 'ArrowDown') dir = 'down';
            else if (ev.key === 'ArrowLeft') dir = 'left';
            else if (ev.key === 'ArrowRight') dir = 'right';

            if (dir) {
              ev.preventDefault();
              var current = document.querySelector('.card.card-highlight');
              // 如果当前没有高亮，或者高亮的被隐藏了，选中第一个可见的
              if (!current || current.style.display === 'none') {
                var visible = getVisibleCards();
                if (visible.length > 0) updateHighlight(visible[0]);
              } else {
                var next = findNextCard(current, dir);
                updateHighlight(next);
              }
              return;
            }

            if (ev.key === 'Enter') {
              var current = document.querySelector('.card.card-highlight');
              if (current && current.style.display !== 'none') {
                var link = current.querySelector('.title-link');
                if (link) {
                   link.click(); 
                }
              }
            }
          });
        })();

        // 暴露全局 API，便于独立脚本基于 URL 参数触发搜索/跳转
        // - __navFilterCards(q: string): 触发筛选并刷新高亮/统计
        // - __includeDesc: 是否在搜索中包含简介（默认 true，可由外部脚本切换）
        try {
          window.__navFilterCards = filterCards;
          if (typeof window.__includeDesc !== 'boolean') {
            window.__includeDesc = true; // 默认包含简介参与搜索
          }
        } catch (e) { /* ignore */ }

      })();

/*
 * 基于 URL 参数的自动搜索与单结果跳转 + 键盘导航
 * - 参数：?q=关键词[&in-desc=1]
 * - 行为：
 *   1) 若存在 q：回填搜索框并触发筛选（大小写不敏感）
 *   2) 若匹配结果仅 1 项：直接跳转到该卡片链接（location.assign 保留历史）
 *   3) 若匹配结果 ≥ 2：聚焦搜索框并平滑滚动到第一个匹配项
 *   4) in-desc=1 时包含简介参与搜索；否则仅按标题匹配
 */
(function () {
  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function () {
    // 解析 URL 参数
    var usp;
    try {
      usp = new URLSearchParams(window.location.search || '');
    } catch (e) {
      return;
    }
    var q = usp.get('q');
    if (q) q = q.trim();
    if (!q) return; // 无 q 参数则不干预

    var inDescParam = usp.get('in-desc') || usp.get('in_desc');
    var includeDesc = (inDescParam === '1' || inDescParam === 'true');

    // 设置搜索模式到全局开关（模板内 filterCards 将读取该值）
    try {
      window.__includeDesc = includeDesc;
    } catch (e) {}

    var search = document.getElementById('searchBox');
    if (search) search.value = q;

    // 触发筛选：优先使用模板暴露的 API；若不可用，退化为最小 DOM 级实现
    function applyFilter() {
      if (typeof window.__navFilterCards === 'function') {
        window.__navFilterCards(q);
      } else {
        // 退化方案，仅作兜底（不做高亮/统计）
        var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
        var qq = (q || '').toLowerCase();
        cards.forEach(function (card) {
          var title = (card.dataset && card.dataset.title || card.querySelector('h2')?.textContent || '').toLowerCase();
          var desc = (card.dataset && card.dataset.desc || card.querySelector('.desc')?.textContent || '').toLowerCase();
          var hit = (!qq || title.indexOf(qq) >= 0 || (includeDesc && desc.indexOf(qq) >= 0));
          card.style.display = hit ? '' : 'none';
        });
      }
    }

    // 等待模板脚本完成卡片增强（dataset/title/desc 准备就绪）
    var attempts = 0;
    (function waitReady() {
      var hasCards = !!document.querySelector('.card');
      var readyApi = (typeof window.__navFilterCards === 'function');
      var readyData = hasCards && document.querySelector('.card').dataset && 'title' in document.querySelector('.card').dataset;
      if (readyApi || readyData || attempts > 50) {
        applyFilter();
        proceed();
        return;
      }
      attempts++;
      setTimeout(waitReady, 40);
    })();

    function visibleCards() {
      var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
      return cards.filter(function (c) {
        return c.style.display !== 'none';
      });
    }

    function proceed() {
      var vis = visibleCards();
      if (search) search.focus();
      if (vis.length === 1) {
        // 单结果：使用本页跳转，保留历史（便于后退回搜索页）
        var link = vis[0].querySelector('.link');
        var href = link && link.getAttribute('href');
        if (href) {
          try {
            var abs = new URL(href, window.location.href).href; // 兼容 GitHub Pages 子路径
            window.location.assign(abs);
          } catch (e) {
            window.location.href = href; // 兜底
          }
        }
      } else if (vis.length > 1) {
        // 多结果：滚动到第一个匹配项
        try {
          vis[0].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } catch (e) {
          /* ignore */ }
      }
    }
  });
})();
