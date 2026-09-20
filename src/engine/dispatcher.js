/**
 * Antigravity Chinese Localization - Master Translation Dispatcher
 * 主翻译分发器
 */

const { synthesizeRole } = require('./synthesizer');
const { matchDynamicPatterns } = require('./matcher');

function normalize(str) {
  return str ? str.replace(/\s+/g, ' ') : '';
}

function createDispatcher(dictionary, lowerDictionary) {
  if (!lowerDictionary && dictionary) {
    lowerDictionary = {};
    for (const [k, v] of Object.entries(dictionary)) {
      lowerDictionary[k.toLowerCase()] = v;
    }
  }

  return function translateText(text) {
    if (!text || typeof text !== 'string') return null;
    const normalized = normalize(text);
    const trimmed = normalized.trim();
    if (!trimmed) return null;

    // 1. 直接词典匹配 (Exact match)
    if (dictionary[trimmed]) {
      return normalized.replace(trimmed, dictionary[trimmed]);
    }
    if (dictionary[normalized]) {
      return dictionary[normalized];
    }

    // 2. 大小写不敏感词典回退 (Case-insensitive fallback)
    const lower = trimmed.toLowerCase();
    if (lowerDictionary[lower]) {
      return normalized.replace(trimmed, lowerDictionary[lower]);
    }

    // 3. 快捷键后缀检测 (Shortcut suffix fallback, e.g. "Toggle Auxiliary Pane Ctrl+Shift+B")
    const scMatch = trimmed.match(/^(.+?)\s+(?:\()?((?:Ctrl|Cmd|Alt|Shift|⌘|⌥|⇧|⌃)[\+\-\w]+)(?:\))?$/i);
    if (scMatch) {
      const actionPart = scMatch[1].trim();
      const scPart = scMatch[2];
      const transAction = dictionary[actionPart] || lowerDictionary[actionPart.toLowerCase()] || matchDynamicPatterns(actionPart);
      if (transAction) {
        return normalized.replace(trimmed, `${transAction} (${scPart})`);
      }
    }

    // 4. 省略号回退 (Trailing ellipsis fallback, e.g. "Running...", "Searching...")
    if (trimmed.endsWith('...') || trimmed.endsWith('…')) {
      const base = trimmed.replace(/\.{3}$|…$/, '').trim();
      const transBase = dictionary[base] || lowerDictionary[base.toLowerCase()] || matchDynamicPatterns(base);
      if (transBase) {
        return normalized.replace(trimmed, transBase + '...');
      }
    }

    // 5. 通用子智能体角色构词合成器 (Universal Role Morphological Synthesizer Fallback)
    const roleSynth = synthesizeRole(trimmed);
    if (roleSynth !== null) {
      return normalized.replace(trimmed, roleSynth);
    }

    // 6. 动态正则、实体状态矩阵与耗时匹配器
    const dynamicMatch = matchDynamicPatterns(trimmed);
    if (dynamicMatch !== null) {
      return normalized.replace(trimmed, dynamicMatch);
    }

    return null;
  };
}

module.exports = {
  normalize,
  createDispatcher
};
