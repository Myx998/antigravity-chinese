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
  '.monaco-list-row',
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

function isBypassedElement(el) {
  if (!el || el.nodeType !== 1) return false;
  if (IGNORE_TAGS.has(el.tagName)) return true;
  if (el.isContentEditable) return true;
  if (el.getAttribute && el.getAttribute('contenteditable') === 'true') return true;

  if (el.matches && el.matches(BYPASS_ANCESTOR_SELECTOR)) return true;
  if (el.closest && el.closest(BYPASS_ANCESTOR_SELECTOR)) return true;

  const className = (typeof el.className === 'string') ? el.className : (el.getAttribute ? (el.getAttribute('class') || '') : '');
  if (className) {
    const bypassClasses = ['monaco-editor', 'view-lines', 'monaco-list-row', 'terminal', 'xterm', 'code-block', 'hljs', 'cm-editor', 'cm-content'];
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
      if (isBypassedNode(node)) return;
      const text = node.nodeValue;
      if (text && typeof text === 'string') {
        const trans = translateText(text);
        if (trans !== null && trans !== text) {
          node.nodeValue = trans;
        }
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
          if (!isBypassedNode(node)) {
            const trans = translateText(node.nodeValue);
            if (trans !== null && trans !== node.nodeValue) {
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

  function startPeriodicSweep() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    const sweep = () => {
      try {
        if (document.documentElement) {
          walk(document.documentElement);
        }
      } catch (e) {}
    };

    window.addEventListener('focus', sweep, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') sweep();
    }, { passive: true });
    window.addEventListener('popstate', sweep, { passive: true });
    window.addEventListener('hashchange', sweep, { passive: true });

    setInterval(sweep, 1500);
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
    isBypassedElement,
    isBypassedNode,
    startObserver,
    hookShadowRoot,
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
  isBypassedElement,
  isBypassedNode,
  createObserverEngine
};
