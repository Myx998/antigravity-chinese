/**
 * Antigravity Chinese Localization - Engine Entrypoint
 * 聚合导出所有子模块，供构建管线和测试套件使用
 */

const constants = require('./constants');
const { DYNAMIC_TEMPLATES } = require('./templates');
const { synthesizeRole } = require('./synthesizer');
const { formatDur, matchDynamicPatterns } = require('./matcher');
const { normalize, createDispatcher } = require('./dispatcher');
const {
  IGNORE_TAGS,
  CODE_OR_INPUT_TAGS,
  BUTTON_INPUT_TYPES,
  SAFE_ATTRS,
  BYPASS_ANCESTOR_SELECTOR,
  isBypassedElement,
  isBypassedNode,
  createObserverEngine
} = require('./observer');

module.exports = {
  constants,
  DYNAMIC_TEMPLATES,
  synthesizeRole,
  formatDur,
  matchDynamicPatterns,
  normalize,
  createDispatcher,
  IGNORE_TAGS,
  CODE_OR_INPUT_TAGS,
  BUTTON_INPUT_TYPES,
  SAFE_ATTRS,
  BYPASS_ANCESTOR_SELECTOR,
  isBypassedElement,
  isBypassedNode,
  createObserverEngine
};
