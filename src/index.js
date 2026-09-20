/**
 * Antigravity Chinese Localization - Source Entry
 */

const fs = require('fs');
const path = require('path');

const constants = require('./engine/constants');
const { synthesizeRole } = require('./engine/synthesizer');
const { DYNAMIC_TEMPLATES } = require('./engine/templates');
const { formatDur, matchDynamicPatterns } = require('./engine/matcher');
const { normalize, createDispatcher } = require('./engine/dispatcher');
const {
  isBypassedElement,
  isBypassedNode,
  createObserverEngine
} = require('./engine/observer');

// 加载全部模块化词典
function loadDictionaries(dictDir) {
  const dir = dictDir || path.join(__dirname, 'dictionary');
  const files = ['actions.json', 'sidebar.json', 'settings.json', 'subagents.json', 'units.json', 'tools.json', 'common.json'];
  const merged = {};
  const lowerDict = {};

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.existsSync(fullPath)) {
      const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      for (const [k, v] of Object.entries(data)) {
        merged[k] = v;
        lowerDict[k.toLowerCase()] = v;
      }
    }
  }

  return { dictionary: merged, lowerDictionary: lowerDict };
}

module.exports = {
  ...constants,
  synthesizeRole,
  DYNAMIC_TEMPLATES,
  formatDur,
  matchDynamicPatterns,
  normalize,
  createDispatcher,
  isBypassedElement,
  isBypassedNode,
  createObserverEngine,
  loadDictionaries
};
