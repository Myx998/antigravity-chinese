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

console.log('\n----------------------------------------------------');
console.log(`Total: ${totalTests}, Passed: ${passedTests}, Failed: ${failedTests}`);
if (failedTests > 0) {
  console.error(`[FAIL] ${failedTests} test(s) failed!`);
  process.exit(1);
} else {
  console.log('[PASS] All regression test cases passed successfully!\n');
}
