/*
 * 基于 URL 参数的自动搜索与单结果跳转
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
    try { usp = new URLSearchParams(window.location.search || ''); } catch (e) { return; }
    var q = usp.get('q');
    if (q) q = q.trim();
    if (!q) return; // 无 q 参数则不干预

    var inDescParam = usp.get('in-desc') || usp.get('in_desc');
    var includeDesc = (inDescParam === '1' || inDescParam === 'true');

    // 设置搜索模式到全局开关（模板内 filterCards 将读取该值）
    try { window.__includeDesc = includeDesc; } catch (e) {}

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
      return cards.filter(function (c) { return c.style.display !== 'none'; });
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
        try { vis[0].scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* ignore */ }
      }
    }
  });
})();

