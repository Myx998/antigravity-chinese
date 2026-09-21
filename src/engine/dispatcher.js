/**
 * Antigravity Chinese Localization - Master Translation Dispatcher
 * 主翻译分发器
 */

const { synthesizeRole } = require('./synthesizer');
const { matchDynamicPatterns } = require('./matcher');

const SHORTCUT_MODIFIERS = '(?:Ctrl|Cmd|Command|Alt|Option|Shift|[⌘⌥⇧⌃])';
const SHORTCUT_KEY_NAME = '(?:[a-zA-Z0-9,./`~=_+;:\'\"<>?\\[\\]\\\\-]|Up|Down|Left|Right|Home|End|PageUp|PageDown|Enter|Tab|Space|Delete|Backspace|Esc|Escape|F(?:[1-9]|1[0-2]))';
const SHORTCUT_COMBO = `(?:${SHORTCUT_MODIFIERS}[+\\-])+${SHORTCUT_KEY_NAME}`;
const SHORTCUT_FUNC = 'F(?:[1-9]|1[0-2])\\b';
const SHORTCUT_STROKE = `(?:${SHORTCUT_COMBO}|${SHORTCUT_FUNC})`;
const SHORTCUT_CHORD = `(?:${SHORTCUT_STROKE}(?:(?:\\s+|\\s*,\\s*)${SHORTCUT_STROKE})?)`;
const SHORTCUT_REGEX = new RegExp(`^(.+?)\\s+(?:\\()?(${SHORTCUT_CHORD})(?:\\))?$`, 'i');

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

    // 1. 直接词典匹配 (Exact match: normalized 优先于 trimmed，保证显式空白配置不被截断)
    if (dictionary[normalized]) {
      return dictionary[normalized];
    }
    if (dictionary[trimmed]) {
      return normalized.replace(trimmed, dictionary[trimmed]);
    }

    // 2. 大小写不敏感词典回退 (Case-insensitive fallback)
    const lowerNormalized = normalized.toLowerCase();
    if (lowerDictionary[lowerNormalized]) {
      return lowerDictionary[lowerNormalized];
    }
    const lower = trimmed.toLowerCase();
    if (lowerDictionary[lower]) {
      return normalized.replace(trimmed, lowerDictionary[lower]);
    }

    // 3. 快捷键后缀检测 (Shortcut suffix fallback, 支持单功能键 F1~F12、标点符号键及双组合 Chord 键)
    const scMatch = trimmed.match(SHORTCUT_REGEX);
    if (scMatch) {
      const actionPart = scMatch[1].trim();
      const scPart = scMatch[2].trim();
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

    // 7. 项目符号/列表符前缀剥离回退 (Bullet prefix fallback, e.g. "• ...", "- ...", "* ...")
    const bulletMatch = trimmed.match(/^([-*•]\s+)(.+)$/);
    if (bulletMatch) {
      const pfx = bulletMatch[1];
      const body = bulletMatch[2].trim();
      const transBody = dictionary[body] || lowerDictionary[body.toLowerCase()] || matchDynamicPatterns(body);
      if (transBody) {
        return normalized.replace(trimmed, `${pfx}${transBody}`);
      }
    }

    return null;
  };
}

module.exports = {
  normalize,
  createDispatcher
};
