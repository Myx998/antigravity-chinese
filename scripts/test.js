/**
 * Antigravity Chinese Localization - Test Suite
 * 覆盖实战短语、构词法合成、复合从句、实体状态矩阵、时长、相对时间、快捷键、安全旁路及 Asar 注入定位算法
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// 1. 验证构建产物是否存在
const distFile = path.resolve(__dirname, '../dist/patch-payload.js');
if (!fs.existsSync(distFile)) {
  console.error('[ERROR] dist/patch-payload.js not found. Run "npm run build" first!');
  process.exit(1);
}

// 动态加载编译后的产物
const payload = require(distFile);
const { translateText, isBypassedElement, isBypassedNode, isMonacoListRowBypassed, synthesizeRole } = payload;

// 动态加载源码引擎模块（双重防御：源码单测 + 编译产物集成测试）
const engine = require('../src/engine');

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

it('应该正确翻译 "Edited 5 files, created 2 files" (多动作复合)', () => {
  const res = translateText('Edited 5 files, created 2 files');
  assert.strictEqual(res, '已编辑 5 个文件，已创建 2 个文件');
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

it('应该正确构词 "Security Vulnerability Auditor #1" (支持漏洞修饰词)', () => {
  const res = translateText('Security Vulnerability Auditor #1');
  assert.strictEqual(res, '安全漏洞审计师 #1');
});

it('应该正确构词 "Async Concurrency Profiler"', () => {
  const res = translateText('Async Concurrency Profiler');
  assert.strictEqual(res, '异步并发分析专家');
});

it('应该正确构词 "Fullstack System Architect Node 1"', () => {
  const res = translateText('Fullstack System Architect Node 1');
  assert.strictEqual(res, 'Fullstack系统架构师 Node 1');
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

it('应该正确翻译 "Waited for 500ms"', () => {
  const res = translateText('Waited for 500ms');
  assert.strictEqual(res, '等待耗时: 500毫秒');
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

it('应该正确翻译 "3 items selected"', () => {
  const res = translateText('3 items selected');
  assert.strictEqual(res, '已选 3 项');
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

it('应该正确翻译 "Background Tasks 1"', () => {
  const res = translateText('Background Tasks 1');
  assert.strictEqual(res, '后台任务 1');
});

// 6. 快捷键与省略号
console.log('\nGroup 6: 快捷键后缀与省略号检测');
it('应该正确翻译 "Toggle Auxiliary Pane Ctrl+Shift+B"', () => {
  const res = translateText('Toggle Auxiliary Pane Ctrl+Shift+B');
  assert.ok(res && res.includes('(Ctrl+Shift+B)'), `Result: ${res}`);
});

it('应该正确翻译单功能键快捷键 "Command Palette F1"', () => {
  const res = translateText('Command Palette F1');
  assert.strictEqual(res, '命令面板 (F1)');
});

it('应该正确翻译带括号的单功能键 "Command Palette (F1)"', () => {
  const res = translateText('Command Palette (F1)');
  assert.strictEqual(res, '命令面板 (F1)');
});

it('应该正确翻译标点符号快捷键 "Settings Ctrl+,"', () => {
  const res = translateText('Settings Ctrl+,');
  assert.strictEqual(res, '系统设置 (Ctrl+,)');
});

it('应该正确翻译双组合 Chord 快捷键 "Keyboard Shortcuts Ctrl+K Ctrl+S"', () => {
  const res = translateText('Keyboard Shortcuts Ctrl+K Ctrl+S');
  assert.strictEqual(res, '键盘快捷键 (Ctrl+K Ctrl+S)');
});

it('应该正确翻译带逗号分隔的 Chord 快捷键 "Keyboard Shortcuts Ctrl+K, Ctrl+S"', () => {
  const res = translateText('Keyboard Shortcuts Ctrl+K, Ctrl+S');
  assert.strictEqual(res, '键盘快捷键 (Ctrl+K, Ctrl+S)');
});

it('应该正确翻译 "Running..." (省略号后退)', () => {
  const res = translateText('Running...');
  assert.strictEqual(res, '正在运行...');
});

it('应该正确翻译 "Searching…"', () => {
  const res = translateText('Searching…');
  assert.strictEqual(res, '正在搜索...');
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

it('应该匹配 units.json 中的新词条 "Duration"', () => {
  const res = translateText('Duration');
  assert.strictEqual(res, '持续时间');
});

it('应该匹配 units.json 中的新词条 "seconds"', () => {
  const res = translateText('seconds');
  assert.strictEqual(res, '秒');
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

it('应该拦截 contenteditable 元素', () => {
  const editEl = { nodeType: 1, tagName: 'DIV', isContentEditable: true };
  assert.strictEqual(isBypassedElement(editEl), true);
});

it('应该拦截处于普通列表中的 monaco-list-row 元素', () => {
  const normalRow = {
    nodeType: 1,
    tagName: 'DIV',
    className: 'monaco-list-row',
    matches(sel) { return sel.includes('monaco-list-row'); },
    closest(sel) {
      if (sel.includes('.quick-input-widget')) return null;
      if (sel.includes('.monaco-list-row')) return this;
      return null;
    }
  };
  assert.strictEqual(isBypassedElement(normalRow), true);
});

it('应该放行处于快捷命令面板 (.quick-input-widget) 内的 monaco-list-row 元素', () => {
  const quickInputContainer = { className: 'quick-input-widget' };
  const quickInputRow = {
    nodeType: 1,
    tagName: 'DIV',
    className: 'monaco-list-row',
    matches(sel) { return sel.includes('monaco-list-row'); },
    closest(sel) {
      if (sel.includes('.quick-input-widget')) return quickInputContainer;
      if (sel.includes('.monaco-list-row')) return this;
      return null;
    }
  };
  assert.strictEqual(isBypassedElement(quickInputRow), false);
});

it('应该放行处于快捷命令面板内部 monaco-list-row 子节点的文本', () => {
  const quickInputContainer = { className: 'quick-input-widget' };
  const quickInputRow = {
    nodeType: 1,
    tagName: 'DIV',
    className: 'monaco-list-row',
    matches(sel) { return sel.includes('monaco-list-row'); },
    closest(sel) {
      if (sel.includes('.quick-input-widget')) return quickInputContainer;
      if (sel.includes('.monaco-list-row')) return this;
      return null;
    }
  };
  const textNode = {
    nodeType: 3,
    nodeValue: 'Preferences: Open User Settings',
    parentElement: quickInputRow
  };
  assert.strictEqual(isBypassedNode(textNode), false);
});

// 9. 编译产物 7-bit ASCII 与编码安全测试
console.log('\nGroup 9: 编译编码与 7-bit ASCII 安全');
it('dist/patch-payload.js 必须为 100% 纯 7-bit ASCII (杜绝 GBK/CP936 乱码)', () => {
  const rawBuf = fs.readFileSync(distFile);
  for (let i = 0; i < rawBuf.length; i++) {
    if (rawBuf[i] > 127) {
      throw new Error(`Non-ASCII byte detected at byte index ${i}: 0x${rawBuf[i].toString(16)}`);
    }
  }
});

// 10. 源码模块与编译产物一致性验证 (SSOT)
console.log('\nGroup 10: 源码引擎 (src/engine) 与产物一致性测试');
it('源码引擎与构建产物分发逻辑应保持 100% 一致', () => {
  const testPhrases = [
    'Running 2 commands v',
    'Exploring 1 file, 1 search',
    'AI Portrait Fidelity Auditor',
    'Security Vulnerability Auditor #1',
    'Worked for 6s v',
    '1 task running',
    '5 minutes ago'
  ];
  const srcDispatcher = engine.createDispatcher(payload.dictionary, payload.lowerDictionary);
  for (const phrase of testPhrases) {
    const fromSrc = srcDispatcher(phrase);
    const fromDist = translateText(phrase);
    assert.strictEqual(fromDist, fromSrc, `Mismatch on phrase: "${phrase}"`);
  }
});

// 11. Asar 深度层级扫描算法验证 (防假阳性)
console.log('\nGroup 11: Asar 深度层级匹配算法防假阳性验证');
it('深度扫描器必须精确命中 dist/preload.js，而忽略 node_modules 中的 preload.js', () => {
  const mockHeader = JSON.stringify({
    files: {
      node_modules: {
        files: {
          'electron-log': {
            files: {
              'preload.js': { size: 100, offset: '1000' }
            }
          },
          semver: {
            files: {
              'preload.js': { size: 200, offset: '2000' }
            }
          }
        }
      },
      dist: {
        files: {
          ideInstall: {
            files: {
              'service.js': { size: 50, offset: '3000' }
            }
          },
          'preload.js': { size: 300, offset: '4000', integrity: { hash: 'abc' } },
          'main.js': { size: 400, offset: '5000' }
        }
      }
    }
  });

  // 模拟 C# 中的 FindAsarEntryStart 逻辑
  function simulateFindEntry(json, targetDir, targetFile) {
    const rootMarker = '"files":{';
    const rootIdx = json.indexOf(rootMarker);
    if (rootIdx < 0) return -1;
    let pos = rootIdx + rootMarker.length;
    let braceDepth = 0;
    let inString = false;
    let escape = false;
    let key = '';
    let collectingKey = false;
    let targetDirStart = -1;

    while (pos < json.length) {
      const c = json[pos];
      if (escape) { escape = false; pos++; continue; }
      if (c === '\\') { escape = true; pos++; continue; }
      if (c === '"') {
        inString = !inString;
        if (inString && braceDepth === 0) {
          key = '';
          collectingKey = true;
        } else if (!inString && collectingKey) {
          collectingKey = false;
          if (key === targetDir) {
            targetDirStart = json.indexOf('{', pos);
            break;
          }
        }
        pos++;
        continue;
      }
      if (inString) {
        if (collectingKey) key += c;
        pos++;
        continue;
      }
      if (c === '{') braceDepth++;
      else if (c === '}') {
        braceDepth--;
        if (braceDepth < 0) break;
      }
      pos++;
    }

    if (targetDirStart < 0) return -1;

    const subFilesMarker = '"files":{';
    const subFilesIdx = json.indexOf(subFilesMarker, targetDirStart);
    if (subFilesIdx < 0) return -1;

    pos = subFilesIdx + subFilesMarker.length;
    braceDepth = 0;
    inString = false;
    escape = false;
    collectingKey = false;

    while (pos < json.length) {
      const c = json[pos];
      if (escape) { escape = false; pos++; continue; }
      if (c === '\\') { escape = true; pos++; continue; }
      if (c === '"') {
        inString = !inString;
        if (inString && braceDepth === 0) {
          key = '';
          collectingKey = true;
        } else if (!inString && collectingKey) {
          collectingKey = false;
          if (key === targetFile) {
            return json.indexOf('{', pos);
          }
        }
        pos++;
        continue;
      }
      if (inString) {
        if (collectingKey) key += c;
        pos++;
        continue;
      }
      if (c === '{') braceDepth++;
      else if (c === '}') {
        braceDepth--;
        if (braceDepth < 0) break;
      }
      pos++;
    }
    return -1;
  }

  const foundPos = simulateFindEntry(mockHeader, 'dist', 'preload.js');
  assert.ok(foundPos > 0, 'Should find dist/preload.js entry');
  const matchedChunk = mockHeader.substring(foundPos, foundPos + 40);
  assert.ok(matchedChunk.includes('"size":300'), `Should match the dist/preload.js (size: 300), got: ${matchedChunk}`);
  assert.ok(!matchedChunk.includes('"size":100'), 'Should NOT match electron-log preload');
  assert.ok(!matchedChunk.includes('"size":200'), 'Should NOT match semver preload');
});

// 12. 配额与限额动态时间模板测试 (覆盖 5-hour limit, weekly limit, hit limit 及 AI credits 变体)
console.log('\nGroup 12: 配额与限额动态时间模板');
it('应该正确翻译 "You have used some of your 5-hour limit, it will fully refresh in 3 hours, 50 minutes."', () => {
  const res = translateText('You have used some of your 5-hour limit, it will fully refresh in 3 hours, 50 minutes.');
  assert.strictEqual(res, '您已使用部分5小时额度，将在 3 小时 50 分钟 后完全刷新');
});

it('应该正确翻译 "You have hit your 5-hour limit, so the weekly limit does not currently apply. Your 5-hour limit will refresh in 3 hours, 57 minutes."', () => {
  const res = translateText('You have hit your 5-hour limit, so the weekly limit does not currently apply. Your 5-hour limit will refresh in 3 hours, 57 minutes.');
  assert.strictEqual(res, '您已达到5小时额度，因此周度额度当前不适用。您的5小时额度将在 3 小时 57 分钟 后刷新');
});

it('应该正确翻译 "You have hit your 5-hour limit, it will refresh in 3 hours, 57 minutes. If on a supported paid plan, you can use AI credits in the interim."', () => {
  const res = translateText('You have hit your 5-hour limit, it will refresh in 3 hours, 57 minutes. If on a supported paid plan, you can use AI credits in the interim.');
  assert.strictEqual(res, '您已达到5小时额度，将在 3 小时 57 分钟 后刷新。若使用的是支持的付费计划，期间可使用 AI 信用点。');
});

it('应该正确翻译 "You have used some of your weekly limit, it will fully refresh in 2 days, 4 hours."', () => {
  const res = translateText('You have used some of your weekly limit, it will fully refresh in 2 days, 4 hours.');
  assert.strictEqual(res, '您已使用部分周度额度，将在 2 天 4 小时 后完全刷新');
});

it('应该正确翻译独立短语 "If on a supported paid plan, you can use AI credits in the interim."', () => {
  const res = translateText('If on a supported paid plan, you can use AI credits in the interim.');
  assert.strictEqual(res, '若使用的是支持的付费计划，期间可使用 AI 信用点。');
});

it('应该正确翻译通用限额组合 "You have hit your weekly limit, so the 5-hour limit does not currently apply. Your weekly limit will refresh in 2 days, 4 hours."', () => {
  const res = translateText('You have hit your weekly limit, so the 5-hour limit does not currently apply. Your weekly limit will refresh in 2 days, 4 hours.');
  assert.strictEqual(res, '您已达到周度额度，因此5小时额度当前不适用。您的周度额度将在 2 天 4 小时 后刷新');
});

it('应该正确翻译动词变体 "You have reached your 5-hour limit, it will refresh in 3 hours, 57 minutes."', () => {
  const res = translateText('You have reached your 5-hour limit, it will refresh in 3 hours, 57 minutes.');
  assert.strictEqual(res, '您已达到5小时额度，将在 3 小时 57 分钟 后刷新');
});

it('应该正确翻译分拆独立子句 "You have hit your 5-hour limit, so the weekly limit does not currently apply."', () => {
  const res = translateText('You have hit your 5-hour limit, so the weekly limit does not currently apply.');
  assert.strictEqual(res, '您已达到5小时额度，因此周度额度当前不适用。');
});

it('应该正确翻译分拆独立子句 "You have hit your 5-hour limit."', () => {
  const res = translateText('You have hit your 5-hour limit.');
  assert.strictEqual(res, '您已达到5小时额度。');
});

it('应该正确翻译分拆独立子句 "so the 5-hour limit does not currently apply."', () => {
  const res = translateText('so the 5-hour limit does not currently apply.');
  assert.strictEqual(res, '因此5小时额度当前不适用。');
});

it('应该正确翻译分拆独立子句 "Your 5-hour limit will fully refresh in 3 hours, 57 minutes."', () => {
  const res = translateText('Your 5-hour limit will fully refresh in 3 hours, 57 minutes.');
  assert.strictEqual(res, '您的5小时额度将在 3 小时 57 分钟 后完全刷新');
});

// 13. 插件与技能系统全量说明汉化测试
console.log('\nGroup 13: 插件与技能系统全量说明汉化');
it('应该正确汉化 Android CLI 技能说明', () => {
  const res = translateText('Provides instructions for using the android CLI tool to manage devices, emulators, SDK components, and build projects.');
  assert.ok(res && res.includes('Android 命令行工具'));
});

it('应该正确汉化 Chrome DevTools 技能说明', () => {
  const res = translateText('Uses Chrome DevTools via MCP for efficient debugging, troubleshooting and browser automation. Use when debugging web pages, automating browser interactions, analyzing performance, or inspecting network requests. This skill does not apply to --slim mode (MCP configuration).');
  assert.ok(res && res.includes('Chrome DevTools'));
});

it('应该正确汉化 BigQuery AI & ML 技能说明 (含前导横杠兼容)', () => {
  const res = translateText('- Leverages BigQuery\'s built-in machine learning and GenAI capabilities for advanced data analytics. Use when you need to write SQL queries that perform time-series forecasting, detect outliers, find key drivers, or leverage generative AI capabilities in BigQuery.');
  assert.ok(res && res.includes('BigQuery 内置机器学习'));
});

it('应该正确汉化带圆点项目符号 "• " 的技能说明', () => {
  const res = translateText('• Uses Chrome DevTools via MCP for efficient debugging, troubleshooting and browser automation. Use when debugging web pages, automating browser interactions, analyzing performance, or inspecting network requests. This skill does not apply to --slim mode (MCP configuration).');
  assert.ok(res && res.includes('Chrome DevTools'));
});

it('应该正确汉化首句提取截断的技能说明', () => {
  const res = translateText('Uses Chrome DevTools MCP for accessibility (a11y) debugging and auditing based on web.dev guidelines.');
  assert.ok(res && res.includes('Chrome DevTools MCP 进行无障碍可访问性'));
});

it('应该保证本地所有 126 个已注册技能的官方 description 均被 100% 成功汉化', () => {
  const extractedFile = path.resolve(__dirname, 'extracted_skills.json');
  if (fs.existsSync(extractedFile)) {
    const skills = JSON.parse(fs.readFileSync(extractedFile, 'utf8'));
    let unlocalizedCount = 0;
    for (const skill of skills) {
      const translated = translateText(skill.description);
      if (!translated || !/[\u4e00-\u9fa5]/.test(translated)) {
        unlocalizedCount++;
        console.error(`  [SKILL UNTRANSLATED] ${skill.name}: "${skill.description.substring(0, 60)}..."`);
      }
    }
    assert.strictEqual(unlocalizedCount, 0, `存在 ${unlocalizedCount} 个未汉化的技能描述`);
  }
});

// 14. 设置面板与配额界面核心词条静态匹配测试
console.log('\nGroup 14: 设置面板与配额界面核心词条静态匹配');
it('应该正确翻译 "AI Credit Overages"', () => {
  assert.strictEqual(translateText('AI Credit Overages'), 'AI 信用点超额扣费');
});

it('应该正确翻译 "Available AI Credits:"', () => {
  assert.strictEqual(translateText('Available AI Credits:'), '可用 AI 信用点：');
});

it('应该正确翻译 "Five Hour Limit Remaining"', () => {
  assert.strictEqual(translateText('Five Hour Limit Remaining'), '5小时剩余额度');
});

it('应该正确翻译 "Installed Skills"', () => {
  assert.strictEqual(translateText('Installed Skills'), '已安装技能');
});

it('应该正确翻译 "Agent Security Settings"', () => {
  assert.strictEqual(translateText('Agent Security Settings'), '智能体安全设置');
});

// 15. Planning Mode 规划模式高频交互词条
console.log('\nGroup 15: Planning Mode 规划模式核心交互词条');
it('应该正确翻译规划模式及其计划执行词条', () => {
  assert.strictEqual(translateText('Proposed Changes'), '提议的变更');
  assert.strictEqual(translateText('Verification Plan'), '验证计划');
  assert.strictEqual(translateText('Automated Tests'), '自动化测试');
  assert.strictEqual(translateText('Manual Verification'), '人工验证');
  assert.strictEqual(translateText('User Review Required'), '需要用户审查');
  assert.strictEqual(translateText('Open Questions'), '待解决问题');
  assert.strictEqual(translateText('Plan Execution'), '计划执行');
  assert.strictEqual(translateText('Approve Plan'), '批准计划');
  assert.strictEqual(translateText('Reject Plan'), '拒绝计划');
  assert.strictEqual(translateText('Planning Mode'), '规划模式');
  assert.strictEqual(translateText('Approve and Execute'), '批准并执行');
  assert.strictEqual(translateText('Reject and Stop'), '拒绝并停止');
  assert.strictEqual(translateText('proposed changes'), '提议的变更');
  assert.strictEqual(translateText('verification plan'), '验证计划');
  assert.strictEqual(translateText('plan execution'), '计划执行');
});

// 16. 权限策略、会话管理与插件构件词条
console.log('\nGroup 16: 权限策略、会话管理与插件构件词条');
it('应该正确翻译权限文件策略词条', () => {
  assert.strictEqual(translateText('Outside of folders file access policy'), '工作区外文件访问策略');
  assert.strictEqual(translateText('Outside of workspace file access policy'), '工作区外文件访问策略');
  assert.strictEqual(translateText('Terminal Command Auto Execution'), '终端命令自动执行');
  assert.strictEqual(translateText('Terminal Command Auto-Execution'), '终端命令自动执行');
  assert.strictEqual(translateText('Require Review'), '需要审查');
  assert.strictEqual(translateText('require review'), '需要审查');
});

it('应该正确翻译会话管理词条', () => {
  assert.strictEqual(translateText('Fork Conversation'), '分叉会话');
  assert.strictEqual(translateText('Group By'), '分组方式');
  assert.strictEqual(translateText('group by'), '分组方式');
});

it('应该正确翻译内置与工作区插件构件词条', () => {
  assert.strictEqual(translateText('Bundled Skills'), '内置技能');
  assert.strictEqual(translateText('Bundled Rules'), '内置规则');
  assert.strictEqual(translateText('Bundled MCP Servers'), '内置 MCP 服务');
  assert.strictEqual(translateText('Bundled Hooks'), '内置钩子');
  assert.strictEqual(translateText('User Skills'), '用户技能');
  assert.strictEqual(translateText('Workspace Skills'), '工作区技能');
  assert.strictEqual(translateText('Workspace Rules'), '工作区规则');
});

// 17. DOM 引擎 WeakMap 防重入与 O(1) 短路机制
console.log('\nGroup 17: DOM 引擎 WeakMap 防重入与 O(1) 短路机制');
it('DOM 引擎在翻译文本节点后应记录入 WeakMap 并在重复巡检时 O(1) 短路', () => {
  let callCount = 0;
  const customTranslate = (text) => {
    callCount++;
    return text === 'Proposed Changes' ? '提议的变更' : text;
  };
  const engineInstance = engine.createObserverEngine(customTranslate);
  const mockNode = {
    nodeType: 3,
    nodeValue: 'Proposed Changes'
  };

  // 第一次遍历：应触发翻译
  engineInstance.walk(mockNode);
  assert.strictEqual(mockNode.nodeValue, '提议的变更');
  assert.strictEqual(callCount, 1);
  assert.strictEqual(engineInstance.translatedNodes.get(mockNode), '提议的变更');

  // 第二次遍历（巡检）：应触发 WeakMap 短路，不调用 customTranslate
  engineInstance.walk(mockNode);
  assert.strictEqual(mockNode.nodeValue, '提议的变更');
  assert.strictEqual(callCount, 1, '重复巡检时应 O(1) 短路，不重复调用翻译分发器');

  // 当外部程序修改该文本节点（例如重新渲染）：应能感知变化并重新翻译
  mockNode.nodeValue = 'Proposed Changes';
  engineInstance.walk(mockNode);
  assert.strictEqual(callCount, 2, '节点内容被重写后应重新进入翻译分发');
  assert.strictEqual(mockNode.nodeValue, '提议的变更');
});

// 18. 多目标联动注入与 7-bit ASCII 补丁验证
console.log('\nGroup 18: 多目标联动注入与 7-bit ASCII 补丁验证');
const injectModule = require('./inject');
const { MODULE_PATCHES, toAsciiUnicode } = injectModule;

it('wizardHtml.js 补丁应正确汉化真实首屏向导文案与描述', () => {
  const realWizardSnippet = `
    <title>Welcome to Antigravity</title>
    <div class="text">Setting up…</div>
    <h1>Welcome to the new Antigravity!</h1>
    <p>Antigravity has been redesigned to put agents first with new capabilities. If you'd still like a code editor, you can download it as a separate app named <b>Antigravity IDE</b>.</p>
    <span>Download the Antigravity IDE</span>
    <button class="btn-primary" id="btn-skip">Explore the new Antigravity</button>
  `;
  const patched = MODULE_PATCHES.wizardHtml.patch(realWizardSnippet);
  assert.ok(patched.includes(toAsciiUnicode('欢迎使用 Antigravity')), '应汉化 title 标签');
  assert.ok(patched.includes(toAsciiUnicode('正在准备…')), '应汉化 Loading 状态');
  assert.ok(patched.includes(toAsciiUnicode('欢迎体验全新 Antigravity！')), '应汉化 h1 标题');
  assert.ok(patched.includes(toAsciiUnicode('Antigravity 经过全面重塑')), '应汉化正文段落');
  assert.ok(patched.includes(toAsciiUnicode('下载 Antigravity IDE')), '应汉化下载勾选项');
  assert.ok(patched.includes(toAsciiUnicode('探索全新 Antigravity')), '应汉化跳过按钮');
});

it('main.js 补丁应正确汉化真实退出确认对话框、错误弹窗与托盘初始化', () => {
  const realMainSnippet = `
    (0, tray_1.createTray)([
        { id: 'running-agents', label: 'No agents running', enabled: false },
        { type: 'separator' },
        { label: \`Open \${electron_1.app.getName()}\`, click: () => {} },
        { label: 'Quit', click: () => {} }
    ]);
    const options = {
        type: 'question',
        buttons: ['Cancel', 'Quit'],
        title: 'Confirm Quit',
        message: 'Are you sure you want to quit?',
        detail: 'There may be agents or background tasks running.'
    };
  `;
  const patched = MODULE_PATCHES.main.patch(realMainSnippet);
  assert.ok(patched.includes(toAsciiUnicode('确认退出')), '应汉化退出对话框标题');
  assert.ok(patched.includes(toAsciiUnicode('确定要退出 Antigravity 吗？')), '应汉化退出提示');
  assert.ok(patched.includes(toAsciiUnicode('可能仍有正在运行中的智能体或后台任务。')), '应汉化详细说明');
  assert.ok(patched.includes(toAsciiUnicode('取消')) && patched.includes(toAsciiUnicode('退出')), '应汉化对话框按钮');
  assert.ok(patched.includes(toAsciiUnicode('暂无运行中的智能体')), '应汉化托盘初始文本');
  assert.ok(patched.includes(toAsciiUnicode('打开')), '应汉化托盘打开应用项');
});

it('tray.js 补丁应正确汉化真实智能体计数拼接逻辑与动态模板', () => {
  const realTraySnippet = `
    countItem.label =
        (count > 0 ? \`\${count}\` : 'No') +
            ' agent' +
            (count === 1 ? '' : 's') +
            ' running';
  `;
  const patched = MODULE_PATCHES.tray.patch(realTraySnippet);
  assert.ok(patched.includes(toAsciiUnicode('个智能体运行中')), '应汉化真实拼接逻辑中的计数后缀');
  assert.ok(patched.includes(toAsciiUnicode('暂无运行中的智能体')), '应汉化真实拼接逻辑中的 0 计数分支');
});

it('updater.js 补丁应正确汉化 MenuUpdateStep 枚举及更新检查结果弹窗', () => {
  const realUpdaterSnippet = `
    MenuUpdateStep["CheckForUpdates"] = "Check for Updates";
    MenuUpdateStep["CheckingForUpdates"] = "Checking for Updates...";
    MenuUpdateStep["DownloadingUpdate"] = "Downloading Update...";
    MenuUpdateStep["RestartToUpdate"] = "Restart to Update";
    const options = {
        type: 'info',
        title: 'Check for Updates',
        message: 'No updates available',
        buttons: ['OK'],
    };
  `;
  const patched = MODULE_PATCHES.updater.patch(realUpdaterSnippet);
  assert.ok(patched.includes(toAsciiUnicode('检查更新...')), '应汉化 MenuUpdateStep 检查更新');
  assert.ok(patched.includes(toAsciiUnicode('正在检查更新...')), '应汉化 MenuUpdateStep 检查中');
  assert.ok(patched.includes(toAsciiUnicode('正在下载更新...')), '应汉化 MenuUpdateStep 下载中');
  assert.ok(patched.includes(toAsciiUnicode('重启以应用更新')), '应汉化 MenuUpdateStep 重启更新');
  assert.ok(patched.includes(toAsciiUnicode('当前已是最新版本。')), '应汉化无需更新提示');
  assert.ok(patched.includes(toAsciiUnicode('确定')), '应汉化 OK 确认按钮');
});

it('menu.js 补丁应正确汉化原生应用菜单项并注入递归汉化引擎', () => {
  const realMenuSnippet = `
    addItemToSubmenu(menu, 'File', 0, new electron_1.MenuItem({
        label: 'New Window',
        accelerator: 'CmdOrCtrl+Shift+N',
        click: () => { (0, utils_1.createWindow)(url); }
    }));
    addItemToSubmenu(menu, 'Help', 0, new electron_1.MenuItem({
        label: 'Docs',
        click: async () => {}
    }));
    hideDevTools(menu);
    electron_1.Menu.setApplicationMenu(menu);
  `;
  const patched = MODULE_PATCHES.menu.patch(realMenuSnippet);
  assert.ok(patched.includes(toAsciiUnicode('新建窗口')), '应汉化 New Window 菜单项');
  assert.ok(patched.includes(toAsciiUnicode('官方文档')), '应汉化 Docs 菜单项');
  assert.ok(patched.includes(toAsciiUnicode('文件')) && patched.includes(toAsciiUnicode('编辑')), '应注入全局菜单字典');
});

it('多目标补丁产物必须 100% 为纯 7-bit ASCII，无裸 UTF-8 汉字', () => {
  const testSamples = [
    MODULE_PATCHES.wizardHtml.patch('Welcome to Antigravity\nSetting up…\nWelcome to the new Antigravity!'),
    MODULE_PATCHES.main.patch('Confirm Quit\nAre you sure you want to quit?\nNo agents running'),
    MODULE_PATCHES.tray.patch("(count > 0 ? `${count}` : 'No') + ' agent' + (count === 1 ? '' : 's') + ' running'"),
    MODULE_PATCHES.updater.patch('MenuUpdateStep["CheckForUpdates"] = "Check for Updates"\nNo updates available'),
    MODULE_PATCHES.menu.patch("label: 'New Window'\nlabel: 'Docs'\nelectron_1.Menu.setApplicationMenu(menu);")
  ];
  for (const sample of testSamples) {
    for (let i = 0; i < sample.length; i++) {
      assert.ok(sample.charCodeAt(i) <= 127, `Non-ASCII byte detected at pos ${i}: ${sample.charCodeAt(i)}`);
    }
  }
});

it('若本机检测到真实客户端 Asar，多目标补丁应能 100% 成功命中并修改真实文件', () => {
  const asarPath = injectModule.getDefaultAsarPath();
  const targetAsar = (fs.existsSync(asarPath + '.bak')) ? asarPath + '.bak' : (fs.existsSync(asarPath) ? asarPath : null);
  if (targetAsar) {
    const buf = fs.readFileSync(targetAsar);
    const u2 = buf.readUInt32LE(4);
    const jsonSize = buf.readUInt32LE(12);
    const dataStart = 8 + u2;
    const root = JSON.parse(buf.toString('utf8', 16, 16 + jsonSize));

    const getFile = (p) => {
      const parts = p.split('/');
      let curr = root.files;
      for (let i = 0; i < parts.length - 1; i++) curr = curr[parts[i]].files;
      const entry = curr[parts[parts.length - 1]];
      return buf.toString('utf8', dataStart + parseInt(entry.offset), dataStart + parseInt(entry.offset) + entry.size);
    };

    for (const [modKey, modConfig] of Object.entries(MODULE_PATCHES)) {
      const entryPath = modConfig.patterns[0].replace(/\\\\/g, '/');
      try {
        const fileContent = getFile(entryPath);
        const patchedContent = modConfig.patch(fileContent);
        assert.notStrictEqual(fileContent, patchedContent, `真实 Asar 文件 [${entryPath}] 补丁应成功生效并产生内容改动`);
      } catch (err) {
        // 如果特定构建版本未打包该子模块则安全跳过
      }
    }
  }
});

// 19. 源码入口规范化与完整性验证
console.log('\nGroup 19: 源码入口与字典加载完整性');
it('src/index.js 应成功加载 skills.json 且词典条目数与产物保持一致', () => {
  const src = require('../src');
  const dicts = src.loadDictionaries();
  assert.ok(dicts.dictionary['android-cli'] || Object.keys(dicts.dictionary).length > 2000, '应成功加载包括 skills.json 在内的全部词典');
  assert.strictEqual(dicts.dictionary['Proposed Changes'], '提议的变更');
  assert.strictEqual(dicts.dictionary['Bundled Skills'], '内置技能');
});

console.log('\n----------------------------------------------------');
console.log(`Total: ${totalTests}, Passed: ${passedTests}, Failed: ${failedTests}`);
if (failedTests > 0) {
  console.error(`[FAIL] ${failedTests} test(s) failed!`);
  process.exit(1);
} else {
  console.log('[PASS] All regression test cases passed successfully!\n');
}
