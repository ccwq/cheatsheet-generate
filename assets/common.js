/**
 * Common JS Utilities for Cheatsheet
 */

var $ = function(s, root){ return (root||document).querySelector(s); };
var $$ = function(s, root){ return Array.prototype.slice.call((root||document).querySelectorAll(s)); };

/**
 * 初始化列宽调节 (Slider + Presets + LocalStorage)
 */
function initColumnWidth() {
  var columns = $('#columns');
  var slider = $('#columnWidth');
  var widthVal = $('#widthVal');
  var presets = $$('.preset');
  var keyWidth = 'nav_column_width_px';

  if (!columns || !slider) return;

  function setWidth(val) {
    slider.value = val;
    columns.style.columnWidth = val + 'px';
    if (widthVal) widthVal.textContent = val + 'px';
  }

  // Load saved
  try {
    var saved = localStorage.getItem(keyWidth);
    if (saved) setWidth(saved);
  } catch (e) {}

  // Slider input
  slider.addEventListener('input', function() {
    columns.style.columnWidth = slider.value + 'px';
    if (widthVal) widthVal.textContent = slider.value + 'px';
  });
  slider.addEventListener('change', function() {
    try { localStorage.setItem(keyWidth, slider.value); } catch (e) {}
  });

  // Presets
  presets.forEach(function(btn){
    btn.addEventListener('click', function(){
      var v = btn.getAttribute('data-w');
      setWidth(v);
      try { localStorage.setItem(keyWidth, v); } catch (e) {}
    });
  });
}

/**
 * 初始化链接打开方式 (新窗口/当前窗口)
 */
function initOpenLinkMode() {
  var openNew = document.getElementById('openNew');
  var keyOpen = 'nav_open_new_tab';

  function applyOpenMode(){
    var anchors = $$('.link');
    var newTab = !!(openNew && openNew.checked);
    anchors.forEach(function(a){
      if (!a) return;
      if (newTab) { a.setAttribute('target','_blank'); a.setAttribute('rel','noopener'); }
      else { a.removeAttribute('target'); a.removeAttribute('rel'); }
    });
  }

  try {
    var savedOpen = localStorage.getItem(keyOpen);
    if (openNew) openNew.checked = (savedOpen == null ? true : savedOpen === '1'); // 默认开启新窗口
  } catch(e) { if (openNew) openNew.checked = true; }

  if (openNew) {
    openNew.addEventListener('change', function(){
      try { localStorage.setItem(keyOpen, openNew.checked ? '1' : '0'); } catch(e){}
      applyOpenMode();
    });
    // Initial apply
    applyOpenMode();
  }
}

/**
 * 初始化返回顶部按钮
 */
function initBackToTop() {
  var wrap = document.createElement('div'); wrap.id = 'backTop';
  wrap.innerHTML = '<button title="回到顶部"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5l7 7-1.4 1.4L13 8.8V20h-2V8.8L6.4 13.4 5 12z"/></svg></button>';
  document.body.appendChild(wrap);
  
  function onScroll(){ wrap.className = (window.scrollY > 200 ? 'show' : ''); }
  window.addEventListener('scroll', onScroll, { passive: true }); 
  onScroll();
  
  wrap.querySelector('button').addEventListener('click', function(){ 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  });
}

// Auto init if DOM is ready, or wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initColumnWidth();
    initOpenLinkMode();
    initBackToTop();
  });
} else {
  initColumnWidth();
  initOpenLinkMode();
  initBackToTop();
}
