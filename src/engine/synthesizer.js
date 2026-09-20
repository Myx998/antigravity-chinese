/**
 * Antigravity Chinese Localization - Subagent Role Synthesizer
 * 通用子智能体角色构词法合成引擎
 */

const { ROLE_SUFFIX_MAP, MODIFIER_MAP } = require('./constants');

function synthesizeRole(text) {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();

  // 1. 剥离层级后缀如 "L0", "L1", "Worker 1", "#2", "Node 3"
  let levelSuffix = '';
  const levelMatch = trimmed.match(/^(.*?)\s+((?:L|V|#|Worker|Node)\s*\d+)$/i);
  let core = trimmed;
  if (levelMatch) {
    core = levelMatch[1].trim();
    levelSuffix = ' ' + levelMatch[2];
  }

  // 必须至少由 2 个词组成（如 "Code Reviewer"）
  const words = core.split(/\s+/);
  if (words.length < 2) return null;

  // 2. 检查最后一个词是否属于已知职业后缀
  const lastWord = words[words.length - 1].toLowerCase();
  const roleCn = ROLE_SUFFIX_MAP[lastWord];
  if (!roleCn) return null;

  // 3. 逐个匹配并翻译前面的修饰词
  const translatedWords = [];
  for (let i = 0; i < words.length - 1; i++) {
    const rawWord = words[i];
    const w = rawWord.toLowerCase();
    const modCn = MODIFIER_MAP[w];
    if (modCn) {
      translatedWords.push(modCn);
    } else {
      // 未知词保留原始英文词（如领域专有名词）
      translatedWords.push(rawWord);
    }
  }

  translatedWords.push(roleCn);
  return translatedWords.join('') + levelSuffix;
}

module.exports = {
  synthesizeRole
};
