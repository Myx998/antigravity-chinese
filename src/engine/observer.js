/**
 * Antigravity Chinese Localization - DOM Observer & Safe Walker
 * 安全旁路审查、Shadow DOM 穿透、MutationObserver 响应式监听与微轮询
 */

const IGNORE_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'CANVAS',
  'SVG', 'MATH', 'OBJECT', 'EMBED'
]);

const CODE_OR_INPUT_TAGS = new Set([
  'PRE', 'CODE', 'KBD', 'SAMP', 'VAR', 'TEXTAREA'
]);

const BUTTON_INPUT_TYPES = new Set([
  'button', 'submit', 'reset'
]);

const SAFE_ATTRS = ['placeholder', 'title', 'aria-label', 'data-tooltip', 'data-title', 'data-description', 'tooltip', 'alt'];

const BYPASS_ANCESTOR_SELECTOR = [
  '.monaco-editor',
  '.view-lines',
  '.cm-editor',
  '.cm-content',
  '.editor-instance',
  '.monaco-tokenized-source',
  'pre',
  'code',
  'kbd',
  'samp',
  'var',
  '.code-block',
  '.hljs',
  '.syntax-highlighted',
  '.highlight',
  '.terminal',
  '.xterm',
  '.xterm-screen',
  '.xterm-viewport',
  '.terminal-wrapper',
  'textarea',
  '[contenteditable="true"]',
  '[contenteditable=""]',
  '[contenteditable]:not([contenteditable="false"])',
  '[data-no-translate]',
  '[translate="no"]',
  'svg',
  'canvas'
].join(', ');

function isMonacoListRowBypassed(el) {
  if (!el) return false;
  // 精准放行快捷命令面板（.quick-input-widget），避免快捷面板菜单项被误拦截
  const inQuickInput = !!(el.closest && el.closest('.quick-input-widget'));
  if (inQuickInput) return false;

  if (el.matches && el.matches('.monaco-list-row')) return true;
  if (el.closest && el.closest('.monaco-list-row')) return true;

  const className = (typeof el.className === 'string') ? el.className : (el.getAttribute ? (el.getAttribute('class') || '') : '');
  if (className && className.includes('monaco-list-row')) return true;

  return false;
}

function isBypassedElement(el) {
  if (!el || el.nodeType !== 1) return false;
  if (IGNORE_TAGS.has(el.tagName)) return true;
  if (el.isContentEditable) return true;
  if (el.getAttribute && el.getAttribute('contenteditable') === 'true') return true;

  if (el.matches && el.matches(BYPASS_ANCESTOR_SELECTOR)) return true;
  if (el.closest && el.closest(BYPASS_ANCESTOR_SELECTOR)) return true;

  if (isMonacoListRowBypassed(el)) return true;

  const className = (typeof el.className === 'string') ? el.className : (el.getAttribute ? (el.getAttribute('class') || '') : '');
  if (className) {
    const bypassClasses = ['monaco-editor', 'view-lines', 'terminal', 'xterm', 'code-block', 'hljs', 'cm-editor', 'cm-content'];
    for (let i = 0; i < bypassClasses.length; i++) {
      if (className.includes(bypassClasses[i])) return true;
    }
  }
  return false;
}

function isBypassedNode(node) {
  if (!node) return true;
  if (node.nodeType === 3) {
    const parent = node.parentElement || node.parentNode;
    if (!parent || parent.nodeType !== 1) return false;
    const parentTag = parent.tagName ? parent.tagName.toUpperCase() : '';
    if (IGNORE_TAGS.has(parentTag) || CODE_OR_INPUT_TAGS.has(parentTag)) return true;
    if (parent.isContentEditable) return true;
    if (parent.closest && parent.closest(BYPASS_ANCESTOR_SELECTOR)) return true;
    return isBypassedElement(parent);
  }
  if (node.nodeType === 1) {
    return isBypassedElement(node);
  }
  return false;
}

function createObserverEngine(translateText) {
  // 文本节点翻译记录缓存表（WeakMap 防重入与 O(1) 短路短接）
  const translatedNodes = new WeakMap();

  function translateAttributes(el, attrs) {
    if (!el || !el.getAttribute) return;
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      if (el.hasAttribute && el.hasAttribute(attr)) {
        const val = el.getAttribute(attr);
        if (val && typeof val === 'string') {
          const trans = translateText(val);
          if (trans !== null && trans !== val) {
            el.setAttribute(attr, trans);
          }
        }
      }
    }
  }

  function walk(node) {
    if (!node) return;

    // 文本节点 (Type 3)
    if (node.nodeType === 3) {
      const text = node.nodeValue;
      if (!text || typeof text !== 'string') return;

      // WeakMap 防重入与短路：若节点内容已是记录的翻译产物，直接 O(1) 短路跳过
      if (translatedNodes.has(node) && translatedNodes.get(node) === text) {
        return;
      }

      if (isBypassedNode(node)) return;

      const trans = translateText(text);
      if (trans !== null && trans !== text) {
        translatedNodes.set(node, trans);
        node.nodeValue = trans;
      }
      return;
    }

    // DocumentFragment / ShadowRoot (Type 11)
    if (node.nodeType === 11) {
      for (let child = node.firstChild; child; child = child.nextSibling) {
        walk(child);
      }
      return;
    }

    // 元素节点 (Type 1)
    if (node.nodeType === 1) {
      const tag = node.tagName ? node.tagName.toUpperCase() : '';
      if (IGNORE_TAGS.has(tag)) return;

      if (tag === 'TEXTAREA') {
        translateAttributes(node, SAFE_ATTRS);
        return;
      }

      if (tag === 'INPUT') {
        const itype = (node.getAttribute('type') || 'text').toLowerCase();
        if (BUTTON_INPUT_TYPES.has(itype)) {
          translateAttributes(node, [...SAFE_ATTRS, 'value']);
        } else {
          translateAttributes(node, SAFE_ATTRS);
        }
        return;
      }

      const isSelfBypassed = (
        CODE_OR_INPUT_TAGS.has(tag) ||
        (node.matches && node.matches(BYPASS_ANCESTOR_SELECTOR)) ||
        isBypassedElement(node)
      );

      if (isSelfBypassed) {
        translateAttributes(node, SAFE_ATTRS);
        return;
      }

      translateAttributes(node, SAFE_ATTRS);

      if (node.shadowRoot) {
        observeRoot(node.shadowRoot);
        walk(node.shadowRoot);
      }

      for (let child = node.firstChild; child; child = child.nextSibling) {
        walk(child);
      }
    }
  }

  let observer = null;
  const observedRoots = new WeakSet();
  const observerConfig = {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true
  };

  function observeRoot(root) {
    if (!root || !observer || observedRoots.has(root)) return;
    try {
      observedRoots.add(root);
      observer.observe(root, observerConfig);
    } catch (e) {
      // 容错处理
    }
  }

  function startObserver() {
    if (observer) return;
    if (typeof MutationObserver === 'undefined') return;

    observer = new MutationObserver(mutations => {
      for (let i = 0; i < mutations.length; i++) {
        const m = mutations[i];
        if (m.type === 'childList') {
          for (let j = 0; j < m.addedNodes.length; j++) {
            const added = m.addedNodes[j];
            if (added.nodeType === 1 && added.shadowRoot) {
              observeRoot(added.shadowRoot);
            }
            walk(added);
          }
        } else if (m.type === 'characterData') {
          const node = m.target;
          if (!node || node.nodeType !== 3) continue;
          const text = node.nodeValue;
          if (!text || typeof text !== 'string') continue;

          // 防重入：自身修改触发的 characterData 或已有翻译，直接跳过
          if (translatedNodes.has(node) && translatedNodes.get(node) === text) {
            continue;
          }

          if (!isBypassedNode(node)) {
            const trans = translateText(text);
            if (trans !== null && trans !== text) {
              translatedNodes.set(node, trans);
              node.nodeValue = trans;
            }
          }
        } else if (m.type === 'attributes') {
          const el = m.target;
          if (el.nodeType === 1 && !isBypassedElement(el)) {
            walk(el);
          }
        }
      }
    });

    if (typeof document !== 'undefined') {
      if (document.documentElement) observeRoot(document.documentElement);
      if (document.body) observeRoot(document.body);
    }
  }

  function hookShadowRoot() {
    if (typeof Element !== 'undefined' && Element.prototype && Element.prototype.attachShadow) {
      const origAttachShadow = Element.prototype.attachShadow;
      Element.prototype.attachShadow = function(init) {
        const shadowRoot = origAttachShadow.apply(this, arguments);
        try {
          if (shadowRoot) {
            observeRoot(shadowRoot);
            walk(shadowRoot);
          }
        } catch (e) {
          // 容错
        }
        return shadowRoot;
      };
    }
  }

  let isSweepScheduled = false;

  function scheduleIdleSweep() {
    if (isSweepScheduled) return;
    isSweepScheduled = true;

    const executeSweep = () => {
      isSweepScheduled = false;
      if (typeof document === 'undefined') return;
      if (document.visibilityState === 'hidden') return;
      try {
        if (document.documentElement) {
          walk(document.documentElement);
        }
      } catch (e) {}
    };

    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => executeSweep(), { timeout: 2000 });
    } else if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => setTimeout(executeSweep, 0));
    } else {
      setTimeout(executeSweep, 0);
    }
  }

  function startPeriodicSweep() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    window.addEventListener('focus', scheduleIdleSweep, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') scheduleIdleSweep();
    }, { passive: true });
    window.addEventListener('popstate', scheduleIdleSweep, { passive: true });
    window.addEventListener('hashchange', scheduleIdleSweep, { passive: true });

    // 智能低频兜底巡检（防抖 + requestIdleCallback 空闲调度，彻底消除空载 CPU 占用）
    setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      scheduleIdleSweep();
    }, 3000);
  }

  function init() {
    if (typeof document === 'undefined') return;
    const run = () => {
      walk(document.documentElement || document.body);
      startObserver();
      hookShadowRoot();
      startPeriodicSweep();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }

  return {
    walk,
    translatedNodes,
    isBypassedElement,
    isBypassedNode,
    startObserver,
    hookShadowRoot,
    scheduleIdleSweep,
    startPeriodicSweep,
    init
  };
}

module.exports = {
  IGNORE_TAGS,
  CODE_OR_INPUT_TAGS,
  BUTTON_INPUT_TYPES,
  SAFE_ATTRS,
  BYPASS_ANCESTOR_SELECTOR,
  isMonacoListRowBypassed,
  isBypassedElement,
  isBypassedNode,
  createObserverEngine
};
