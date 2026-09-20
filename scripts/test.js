/**
 * Antigravity Chinese Localization - Test Suite
 * 覆盖实战短语、构词法合成、复合从句、实体状态矩阵、时长、相对时间、快捷键及安全旁路
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const distFile = path.resolve(__dirname, '../dist/patch-payload.js');
if (!fs.existsSync(distFile)) {
  console.error('[ERROR] dist/patch-payload.js not found. Run "npm run build" first!');
  process.exit(1);
}

// 动态加载编译后的产物
const payload = require(distFile);
const { translateText, isBypassedElement, isBypassedNode, synthesizeRole } = payload;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failedTests++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

console.log('====================================================');
console.log('   Antigravity Chinese Localization Test Suite      ');
console.log('====================================================\n');

// 1. 实战关键短语回归测试
console.log('Group 1: 实战高频交互与复合短语');
it('应该正确翻译 "Running 2 commands v" (带折叠箭头)', () => {
  const res = translateText('Running 2 commands v');
  assert.strictEqual(res, '正在运行 2 条命令 v');
});

it('应该正确翻译 "Exploring 1 file, 1 search" (复合从句顺接)', () => {
  const res = translateText('Exploring 1 file, 1 search');
  assert.strictEqual(res, '正在探索 1 个文件，1 次搜索');
});

it('应该正确翻译 "Exploring 6 files, running 4 commands" (多复合从句)', () => {
  const res = translateText('Exploring 6 files, running 4 commands');
  assert.strictEqual(res, '正在探索 6 个文件，正在运行 4 条命令');
});

it('应该正确翻译 "Explored 3 files >" (带向右箭头)', () => {
  const res = translateText('Explored 3 files >');
  assert.strictEqual(res, '已探索 3 个文件 >');
});

// 2. 角色构词法合成器测试
console.log('\nGroup 2: 子智能体通用角色构词法引擎');
it('应该正确构词 "AI Portrait Fidelity Auditor"', () => {
  const res = translateText('AI Portrait Fidelity Auditor');
  assert.strictEqual(res, 'AI人像保真度审计师');
});

it('应该正确构词 "Database Schema Validator L2" (带层级后缀)', () => {
  const res = translateText('Database Schema Validator L2');
  assert.strictEqual(res, '数据库架构验证器 L2');
});

it('应该正确构词 "Frontend Layout Optimizer"', () => {
  const res = translateText('Frontend Layout Optimizer');
  assert.strictEqual(res, '前端布局优化师');
});

it('应该正确构词 "Security Vulnerability Auditor #1"', () => {
  const res = translateText('Security Vulnerability Auditor #1');
  assert.strictEqual(res, '安全Vulnerability审计师 #1');
});

it('应该正确构词 "Async Concurrency Profiler"', () => {
  const res = translateText('Async Concurrency Profiler');
  assert.strictEqual(res, '异步并发分析专家');
});

// 3. 耗时与执行计时器测试
console.log('\nGroup 3: 执行耗时与计时器');
it('应该正确翻译 "Worked for 6s v"', () => {
  const res = translateText('Worked for 6s v');
  assert.strictEqual(res, '工作耗时: 6秒 v');
});

it('应该正确翻译 "Thought for 1s"', () => {
  const res = translateText('Thought for 1s');
  assert.strictEqual(res, '思考耗时: 1秒');
});

it('应该正确翻译 "Ran for 2m 30s"', () => {
  const res = translateText('Ran for 2m 30s');
  assert.strictEqual(res, '执行耗时: 2分钟 30秒');
});

it('应该正确翻译 "Running for 5m"', () => {
  const res = translateText('Running for 5m');
  assert.strictEqual(res, '已运行: 5分钟');
});

// 4. 实体-状态矩阵测试
console.log('\nGroup 4: 通用实体-状态矩阵');
it('应该正确翻译 "1 task running"', () => {
  const res = translateText('1 task running');
  assert.strictEqual(res, '1 个任务运行中');
});

it('应该正确翻译 "2 commands failed"', () => {
  const res = translateText('2 commands failed');
  assert.strictEqual(res, '2 条命令失败');
});

it('应该正确翻译 "No tasks running"', () => {
  const res = translateText('No tasks running');
  assert.strictEqual(res, '暂无运行中的任务');
});

it('应该正确翻译 "All tasks completed"', () => {
  const res = translateText('All tasks completed');
  assert.strictEqual(res, '全部任务已完成');
});

it('应该正确翻译 "5 tasks"', () => {
  const res = translateText('5 tasks');
  assert.strictEqual(res, '5 个任务');
});

// 5. 相对时间与徽标测试
console.log('\nGroup 5: 相对时间与工作区徽标');
it('应该正确翻译 "just now"', () => {
  const res = translateText('just now');
  assert.strictEqual(res, '刚刚');
});

it('应该正确翻译 "5 minutes ago"', () => {
  const res = translateText('5 minutes ago');
  assert.strictEqual(res, '5分钟前');
});

it('应该正确翻译 "10d ago"', () => {
  const res = translateText('10d ago');
  assert.strictEqual(res, '10天前');
});

it('应该正确翻译 "Subagents 2"', () => {
  const res = translateText('Subagents 2');
  assert.strictEqual(res, '子智能体 2');
});

it('应该正确翻译 "Files Changed 3"', () => {
  const res = translateText('Files Changed 3');
  assert.strictEqual(res, '已修改文件 3');
});

// 6. 快捷键与省略号
console.log('\nGroup 6: 快捷键后缀与省略号检测');
it('应该正确翻译 "Toggle Auxiliary Pane Ctrl+Shift+B"', () => {
  const res = translateText('Toggle Auxiliary Pane Ctrl+Shift+B');
  assert.ok(res && res.includes('(Ctrl+Shift+B)'), `Result: ${res}`);
});

it('应该正确翻译 "Running..." (省略号后退)', () => {
  const res = translateText('Running...');
  assert.strictEqual(res, '正在运行...');
});

// 7. 静态词典精确与大小写测试
console.log('\nGroup 7: 静态词典精确与大小写不敏感查找');
it('应该匹配静态词条 "New Conversation"', () => {
  const res = translateText('New Conversation');
  assert.strictEqual(res, '新建对话');
});

it('应该支持大小写不敏感 "new conversation"', () => {
  const res = translateText('new conversation');
  assert.strictEqual(res, '新建对话');
});

it('应该匹配静态词条 "Settings"', () => {
  const res = translateText('Settings');
  assert.strictEqual(res, '系统设置');
});

// 8. 安全旁路测试
console.log('\nGroup 8: 安全旁路过滤审查');
it('应该放行普通 span 元素', () => {
  const fakeEl = { nodeType: 1, tagName: 'SPAN', className: 'tab-title' };
  assert.strictEqual(isBypassedElement(fakeEl), false);
});

it('应该拦截 SCRIPT 和 STYLE 标签', () => {
  assert.strictEqual(isBypassedElement({ nodeType: 1, tagName: 'SCRIPT' }), true);
  assert.strictEqual(isBypassedElement({ nodeType: 1, tagName: 'STYLE' }), true);
});

it('应该拦截 Monaco 编辑器类名', () => {
  const editorEl = { nodeType: 1, tagName: 'DIV', className: 'monaco-editor vs-dark' };
  assert.strictEqual(isBypassedElement(editorEl), true);
});

it('应该拦截 Terminal/xterm 类名', () => {
  const termEl = { nodeType: 1, tagName: 'DIV', className: 'xterm-screen' };
  assert.strictEqual(isBypassedElement(termEl), true);
});

console.log('\n----------------------------------------------------');
console.log(`Total: ${totalTests}, Passed: ${passedTests}, Failed: ${failedTests}`);
if (failedTests > 0) {
  console.error(`[FAIL] ${failedTests} test(s) failed!`);
  process.exit(1);
} else {
  console.log('[PASS] All regression test cases passed successfully!\n');
}
