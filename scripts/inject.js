/**
 * Antigravity Chinese Localization - Asar Injection Engine
 * 跨平台内存级 UniversalAsarEngine
 * 严格遵循 DMCA Clean-room 规范：仅在用户本机读取本地原始 preload 并注入 Payload
 */

const fs = require('fs');
const path = require('path');

const patchMarker = '// Antigravity Chinese Localization Patch';

function toAsciiUnicode(str) {
  return str.replace(/[^\x00-\x7F]/g, char => {
    const hex = char.charCodeAt(0).toString(16).padStart(4, '0');
    return '\\u' + hex;
  });
}

function applyReplacements(content, rules) {
  let result = content;
  for (const rule of rules) {
    const target = rule.from;
    const replacement = typeof rule.to === 'string' ? toAsciiUnicode(rule.to) : rule.to;
    if (typeof target === 'string') {
      result = result.split(target).join(replacement);
    } else if (target instanceof RegExp) {
      result = result.replace(target, replacement);
    }
  }
  return result;
}

const MODULE_PATCHES = {
  loadingOverlay: {
    patterns: ['dist/loadingOverlay.js', 'dist\\loadingOverlay.js'],
    patch: (content) => applyReplacements(content, [
      { from: '<div class="text">Loading Antigravity</div>', to: `<div class="text">${toAsciiUnicode('正在加载 Antigravity...')}</div>` },
      { from: 'Loading Antigravity', to: '正在加载 Antigravity...' }
    ])
  },
  wizardHtml: {
    patterns: ['dist/ideInstall/wizardHtml.js', 'dist\\ideInstall\\wizardHtml.js'],
    patch: (content) => applyReplacements(content, [
      // 真实 Antigravity 首屏向导核心文案
      { from: 'Welcome to the new Antigravity!', to: '欢迎体验全新 Antigravity！' },
      { from: '<title>Welcome to Antigravity</title>', to: `<title>${toAsciiUnicode('欢迎使用 Antigravity')}</title>` },
      { from: 'Setting up…', to: '正在准备…' },
      { from: 'Setting up...', to: '正在准备...' },
      { from: "Antigravity has been redesigned to put agents first with new capabilities. If you'd still like a code editor, you can download it as a separate app named <b>Antigravity IDE</b>.", to: 'Antigravity 经过全面重塑，以智能体为核心并赋予更强大的全新能力。如果您仍需要代码编辑器，可单独下载名为 <b>Antigravity IDE</b> 的专属应用程序。' },
      { from: 'Download the Antigravity IDE', to: '下载 Antigravity IDE' },
      { from: 'Explore the new Antigravity', to: '探索全新 Antigravity' },
      // 兼容扩展与通用安装流文案
      { from: 'Welcome to Antigravity', to: '欢迎使用 Antigravity' },
      { from: 'Install IDE Extensions', to: '安装 IDE 扩展插件' },
      { from: 'Install extensions for your favorite IDEs to enable seamless AI coding workflows.', to: '为您常用的 IDE 安装扩展插件，开启无缝 AI 编程工作流。' },
      { from: 'Choose your primary IDE', to: '选择您的主要 IDE' },
      { from: 'Installing...', to: '正在安装...' },
      { from: 'Installed', to: '已安装' },
      { from: 'Install Extension', to: '安装扩展' },
      { from: 'Configure Later', to: '稍后配置' },
      { from: 'Get Started', to: '开始使用' },
      { from: 'Skip for now', to: '暂时跳过' },
      { from: 'Installation Successful', to: '安装成功' },
      { from: 'Installation Failed', to: '安装失败' },
      { from: 'Continue', to: '继续' },
      { from: 'Next', to: '下一步' },
      { from: 'Back', to: '返回' },
      { from: 'Skip', to: '跳过' },
      { from: 'Finish', to: '完成' }
    ])
  },
  main: {
    patterns: ['dist/main.js', 'dist\\main.js'],
    patch: (content) => applyReplacements(content, [
      // 退出确认对话框核心文案与按钮
      { from: "title: 'Confirm Quit'", to: `title: '${toAsciiUnicode('确认退出')}'` },
      { from: 'title: "Confirm Quit"', to: `title: "${toAsciiUnicode('确认退出')}"` },
      { from: "message: 'Are you sure you want to quit?'", to: `message: '${toAsciiUnicode('确定要退出 Antigravity 吗？')}'` },
      { from: 'message: "Are you sure you want to quit?"', to: `message: "${toAsciiUnicode('确定要退出 Antigravity 吗？')}"` },
      { from: "detail: 'There may be agents or background tasks running.'", to: `detail: '${toAsciiUnicode('可能仍有正在运行中的智能体或后台任务。')}'` },
      { from: 'detail: "There may be agents or background tasks running."', to: `detail: "${toAsciiUnicode('可能仍有正在运行中的智能体或后台任务。')}"` },
      { from: "buttons: ['Cancel', 'Quit']", to: `buttons: ['${toAsciiUnicode('取消')}', '${toAsciiUnicode('退出')}']` },
      { from: 'buttons: ["Cancel", "Quit"]', to: `buttons: ["${toAsciiUnicode('取消')}", "${toAsciiUnicode('退出')}"]` },
      // 初始系统托盘与 Dock 菜单文案
      { from: "label: 'No agents running'", to: `label: '${toAsciiUnicode('暂无运行中的智能体')}'` },
      { from: 'label: "No agents running"', to: `label: "${toAsciiUnicode('暂无运行中的智能体')}"` },
      { from: 'label: `Open ${electron_1.app.getName()}`', to: `label: \`${toAsciiUnicode('打开')} \${electron_1.app.getName()}\`` },
      { from: "label: 'New Window'", to: `label: '${toAsciiUnicode('新建窗口')}'` },
      { from: 'label: "New Window"', to: `label: "${toAsciiUnicode('新建窗口')}"` },
      { from: "label: 'Quit',", to: `label: '${toAsciiUnicode('退出')}',` },
      { from: 'label: "Quit",', to: `label: "${toAsciiUnicode('退出')}",` },
      // 错误弹窗
      { from: "'Binary not found'", to: `'${toAsciiUnicode('未找到可执行文件')}'` },
      { from: '"Binary not found"', to: `"${toAsciiUnicode('未找到可执行文件')}"` },
      { from: "'Startup failed'", to: `'${toAsciiUnicode('启动失败')}'` },
      { from: '"Startup failed"', to: `"${toAsciiUnicode('启动失败')}"` },
      // 历史/通用退出与托盘文案回退
      { from: 'Are you sure you want to quit Antigravity?', to: '确定要退出 Antigravity 吗？' },
      { from: 'Are you sure you want to exit?', to: '确定要退出吗？' },
      { from: 'Do you want to exit?', to: '确定要退出吗？' },
      { from: 'Quit Antigravity', to: '退出 Antigravity' },
      { from: 'Exit Antigravity', to: '退出 Antigravity' },
      { from: 'Keep Running in Background', to: '在后台保持运行' },
      { from: 'Minimize to Tray', to: '最小化到系统托盘' },
      { from: 'Show Antigravity', to: '显示 Antigravity' },
      { from: 'Hide Antigravity', to: '隐藏 Antigravity' },
      { from: 'Open Antigravity', to: '打开 Antigravity' },
      { from: 'Toggle Window', to: '切换窗口显示' }
    ])
  },
  tray: {
    patterns: ['dist/tray.js', 'dist\\tray.js'],
    patch: (content) => applyReplacements(content, [
      // 真实 dist/tray.js 动态智能体计数拼接逻辑
      {
        from: /\(count\s*>\s*0\s*\?\s*`\$\{count\}`\s*:\s*['"]No['"]\)\s*\+\s*['"]\s*agent['"]\s*\+\s*\(count\s*===\s*1\s*\?\s*['"]['"]\s*:\s*['"]s['"]\)\s*\+\s*['"]\s*running['"]/g,
        to: `(count > 0 ? \`\${count} ${toAsciiUnicode('个智能体运行中')}\` : '${toAsciiUnicode('暂无运行中的智能体')}')`
      },
      // 模板字符串与正则动态匹配
      { from: /([`'"])(\${[^}]+}|\d+)\s+agents?\s+running\1/g, to: (m, q, p) => `${q}${p} ${toAsciiUnicode('个智能体运行中')}${q}` },
      { from: /([`'"])(\${[^}]+}|\d+)\s+tasks?\s+running\1/g, to: (m, q, p) => `${q}${p} ${toAsciiUnicode('个任务运行中')}${q}` },
      { from: /([`'"])(\${[^}]+}|\d+)\s+active\s+tasks?\1/g, to: (m, q, p) => `${q}${p} ${toAsciiUnicode('个进行中任务')}${q}` },
      { from: 'No agents running', to: '暂无运行中的智能体' },
      { from: 'No background tasks', to: '暂无后台任务' },
      { from: 'agents running', to: '个智能体运行中' },
      { from: 'agent running', to: '个智能体运行中' },
      { from: 'tasks running', to: '个任务运行中' },
      { from: 'task running', to: '个任务运行中' },
      { from: 'active tasks', to: '个进行中任务' },
      { from: 'active task', to: '个进行中任务' },
      { from: 'Tasks Running:', to: '运行中的任务:' },
      { from: 'Background Tasks:', to: '后台任务:' },
      { from: 'Antigravity is running in the background', to: 'Antigravity 正在后台运行' },
      { from: 'Click to open', to: '点击打开' },
      { from: 'Show Antigravity', to: '显示 Antigravity' },
      { from: 'Hide Antigravity', to: '隐藏 Antigravity' },
      { from: 'Open Antigravity', to: '打开 Antigravity' },
      { from: 'Quit Antigravity', to: '退出 Antigravity' }
    ])
  },
  updater: {
    patterns: ['dist/updater.js', 'dist\\updater.js'],
    patch: (content) => applyReplacements(content, [
      // MenuUpdateStep 枚举项精确汉化 (与 updateActions 完美联动)
      { from: 'MenuUpdateStep["CheckForUpdates"] = "Check for Updates"', to: `MenuUpdateStep["CheckForUpdates"] = "${toAsciiUnicode('检查更新...')}"` },
      { from: 'MenuUpdateStep["CheckingForUpdates"] = "Checking for Updates..."', to: `MenuUpdateStep["CheckingForUpdates"] = "${toAsciiUnicode('正在检查更新...')}"` },
      { from: 'MenuUpdateStep["DownloadingUpdate"] = "Downloading Update..."', to: `MenuUpdateStep["DownloadingUpdate"] = "${toAsciiUnicode('正在下载更新...')}"` },
      { from: 'MenuUpdateStep["RestartToUpdate"] = "Restart to Update"', to: `MenuUpdateStep["RestartToUpdate"] = "${toAsciiUnicode('重启以应用更新')}"` },
      // 更新检查弹窗
      { from: "title: 'Check for Updates'", to: `title: '${toAsciiUnicode('检查更新')}'` },
      { from: 'title: "Check for Updates"', to: `title: "${toAsciiUnicode('检查更新')}"` },
      { from: "message: 'No updates available'", to: `message: '${toAsciiUnicode('当前已是最新版本。')}'` },
      { from: 'message: "No updates available"', to: `message: "${toAsciiUnicode('当前已是最新版本。')}"` },
      { from: "buttons: ['OK']", to: `buttons: ['${toAsciiUnicode('确定')}']` },
      { from: 'buttons: ["OK"]', to: `buttons: ["${toAsciiUnicode('确定')}"]` },
      // 通用与历史提示文案
      { from: 'Check for Updates...', to: '检查更新...' },
      { from: 'Check for updates...', to: '检查更新...' },
      { from: 'Checking for Updates...', to: '正在检查更新...' },
      { from: 'Checking for updates...', to: '正在检查更新...' },
      { from: 'Downloading Update...', to: '正在下载更新...' },
      { from: 'Downloading update...', to: '正在下载更新...' },
      { from: 'Restart to Update', to: '重启以应用更新' },
      { from: 'Restart and Update', to: '重启并更新' },
      { from: 'Restart Now', to: '立即重启' },
      { from: 'Remind Me Later', to: '稍后提醒我' },
      { from: 'Install and Restart', to: '安装并重启' },
      { from: 'Update Available', to: '发现新版本' },
      { from: 'Update available', to: '发现新版本' },
      { from: 'A new version of Antigravity is available.', to: 'Antigravity 有可用新版本。' },
      { from: 'A new version is available.', to: '有可用新版本。' },
      { from: 'Update Downloaded', to: '更新已下载完成' },
      { from: 'Update ready to install', to: '更新已就绪，准备安装' },
      { from: 'Update ready', to: '更新就绪' },
      { from: 'No updates available.', to: '当前已是最新版本。' },
      { from: 'No updates available', to: '当前已是最新版本。' },
      { from: "You're up to date!", to: '当前已是最新版本！' },
      { from: 'Update Error', to: '更新检查出错' },
      { from: 'Failed to check for updates', to: '检查更新失败' },
      { from: 'Failed to download update', to: '下载更新失败' }
    ])
  },
  menu: {
    patterns: ['dist/menu.js', 'dist\\menu.js'],
    patch: (content) => applyReplacements(content, [
      // 注入全局原生应用菜单递归汉化函数
      {
        from: 'electron_1.Menu.setApplicationMenu(menu);',
        to: `const _tDict = { 'File': '${toAsciiUnicode('文件')}', 'Edit': '${toAsciiUnicode('编辑')}', 'View': '${toAsciiUnicode('视图')}', 'Window': '${toAsciiUnicode('窗口')}', 'Help': '${toAsciiUnicode('帮助')}', 'About Antigravity': '${toAsciiUnicode('关于 Antigravity')}', 'Preferences': '${toAsciiUnicode('偏好设置')}', 'Hide Antigravity': '${toAsciiUnicode('隐藏 Antigravity')}', 'Hide Others': '${toAsciiUnicode('隐藏其他')}', 'Show All': '${toAsciiUnicode('显示全部')}', 'Quit Antigravity': '${toAsciiUnicode('退出 Antigravity')}', 'Quit': '${toAsciiUnicode('退出')}', 'Undo': '${toAsciiUnicode('撤消')}', 'Redo': '${toAsciiUnicode('重做')}', 'Cut': '${toAsciiUnicode('剪切')}', 'Copy': '${toAsciiUnicode('复制')}', 'Paste': '${toAsciiUnicode('粘贴')}', 'Paste and Match Style': '${toAsciiUnicode('粘贴并匹配样式')}', 'Select All': '${toAsciiUnicode('全选')}', 'Delete': '${toAsciiUnicode('删除')}', 'Minimize': '${toAsciiUnicode('最小化')}', 'Zoom': '${toAsciiUnicode('缩放')}', 'Close Window': '${toAsciiUnicode('关闭窗口')}', 'Close': '${toAsciiUnicode('关闭')}', 'Bring All to Front': '${toAsciiUnicode('前置全部窗口')}', 'Reload': '${toAsciiUnicode('重新加载')}', 'Force Reload': '${toAsciiUnicode('强制重新加载')}', 'Toggle Developer Tools': '${toAsciiUnicode('切换开发者工具')}', 'Toggle Full Screen': '${toAsciiUnicode('切换全屏')}', 'Actual Size': '${toAsciiUnicode('实际大小')}', 'Reset Zoom': '${toAsciiUnicode('重置缩放')}', 'Zoom In': '${toAsciiUnicode('放大')}', 'Zoom Out': '${toAsciiUnicode('缩小')}', 'New Window': '${toAsciiUnicode('新建窗口')}', 'Docs': '${toAsciiUnicode('官方文档')}' }; const _locMenu = (m) => { m.items?.forEach((item) => { if (item.label && _tDict[item.label]) item.label = _tDict[item.label]; if (item.submenu) _locMenu(item.submenu); }); }; _locMenu(menu); electron_1.Menu.setApplicationMenu(menu);`
      },
      // 菜单项特定文案
      { from: "label: 'New Window'", to: `label: '${toAsciiUnicode('新建窗口')}'` },
      { from: 'label: "New Window"', to: `label: "${toAsciiUnicode('新建窗口')}"` },
      { from: "label: 'Docs'", to: `label: '${toAsciiUnicode('官方文档')}'` },
      { from: 'label: "Docs"', to: `label: "${toAsciiUnicode('官方文档')}"` },
      // 快捷键与标准菜单回退
      { from: '&File', to: '文件(&F)' },
      { from: '&Edit', to: '编辑(&E)' },
      { from: '&View', to: '视图(&V)' },
      { from: '&Window', to: '窗口(&W)' },
      { from: '&Help', to: '帮助(&H)' },
      { from: 'About Antigravity', to: '关于 Antigravity' },
      { from: 'Preferences', to: '偏好设置' },
      { from: 'Hide Antigravity', to: '隐藏 Antigravity' },
      { from: 'Hide Others', to: '隐藏其他' },
      { from: 'Show All', to: '显示全部' },
      { from: 'Quit Antigravity', to: '退出 Antigravity' },
      { from: 'Undo', to: '撤消' },
      { from: 'Redo', to: '重做' },
      { from: 'Cut', to: '剪切' },
      { from: 'Copy', to: '复制' },
      { from: 'Paste', to: '粘贴' },
      { from: 'Select All', to: '全选' },
      { from: 'Minimize', to: '最小化' },
      { from: 'Zoom', to: '缩放' },
      { from: 'Close Window', to: '关闭窗口' },
      { from: 'Bring All to Front', to: '前置全部窗口' },
      { from: 'Reload', to: '重新加载' },
      { from: 'Force Reload', to: '强制重新加载' },
      { from: 'Toggle Developer Tools', to: '切换开发者工具' },
      { from: 'Toggle Full Screen', to: '切换全屏' },
      { from: 'Reset Zoom', to: '重置缩放' },
      { from: 'Zoom In', to: '放大' },
      { from: 'Zoom Out', to: '缩小' },
      { from: 'Documentation', to: '官方文档' },
      { from: 'Report Issue', to: '提交反馈与问题' }
    ])
  }
};

function injectAsar(targetAsarPath, payloadFilePath) {
  if (!fs.existsSync(targetAsarPath)) {
    throw new Error(`Target app.asar not found at: ${targetAsarPath}`);
  }
  if (!fs.existsSync(payloadFilePath)) {
    throw new Error(`Payload file not found at: ${payloadFilePath}`);
  }

  const patchCode = fs.readFileSync(payloadFilePath, 'utf8');
  if (!patchCode.includes(patchMarker)) {
    throw new Error('Invalid patch payload: Patch marker not found');
  }

  console.log(`[ASAR] Reading: ${targetAsarPath}`);
  const asarBuf = fs.readFileSync(targetAsarPath);

  // 解析 Asar 头部元数据
  const u2 = asarBuf.readUInt32LE(4);
  const jsonSize = asarBuf.readUInt32LE(12);
  const dataStart = 8 + u2;

  const headerJsonStr = asarBuf.toString('utf8', 16, 16 + jsonSize);
  const root = JSON.parse(headerJsonStr);

  const allEntries = [];
  function collect(node, currentPath) {
    for (const [name, val] of Object.entries(node)) {
      const subPath = currentPath ? currentPath + '/' + name : name;
      if (val.files) {
        collect(val.files, subPath);
      } else {
        allEntries.push({
          path: subPath,
          node: val,
          oldOffset: val.offset ? parseInt(val.offset, 10) : 0,
          size: val.size || 0,
          unpacked: !!val.unpacked,
        });
      }
    }
  }
  collect(root.files, '');

  // 1. 查找 dist/preload.js
  const preloadEntry = allEntries.find(e => e.path === 'dist/preload.js' || e.path === 'dist\\preload.js');
  if (!preloadEntry) {
    throw new Error('dist/preload.js not found in target asar');
  }

  // 提取原始官方 preload（自动截断历史补丁）
  let origPreload = asarBuf.toString('utf8', dataStart + preloadEntry.oldOffset, dataStart + preloadEntry.oldOffset + preloadEntry.size);
  const existingMarkerIdx = origPreload.indexOf(patchMarker);
  if (existingMarkerIdx >= 0) {
    origPreload = origPreload.substring(0, existingMarkerIdx).trimEnd();
  }

  const newPreload = origPreload + '\r\n\r\n' + patchCode;
  const newPreloadBuf = Buffer.from(newPreload, 'utf8');
  preloadEntry.overriddenData = newPreloadBuf;
  preloadEntry.size = newPreloadBuf.length;
  preloadEntry.node.size = newPreloadBuf.length;
  if (preloadEntry.node.integrity) {
    delete preloadEntry.node.integrity;
  }

  // 2. 联动查找并汉化其他目标模块（首屏向导、主进程、托盘、更新弹窗、原生菜单等）
  for (const [modKey, modConfig] of Object.entries(MODULE_PATCHES)) {
    const entry = allEntries.find(e => {
      const norm = e.path.replace(/\\/g, '/');
      return modConfig.patterns.some(p => p.replace(/\\/g, '/') === norm);
    });

    if (entry) {
      let oldCode = asarBuf.toString('utf8', dataStart + entry.oldOffset, dataStart + entry.oldOffset + entry.size);
      let patchedCode = modConfig.patch(oldCode);
      if (patchedCode !== oldCode) {
        const newBuf = Buffer.from(patchedCode, 'utf8');
        entry.overriddenData = newBuf;
        entry.size = newBuf.length;
        entry.node.size = newBuf.length;
        if (entry.node.integrity) {
          delete entry.node.integrity;
        }
        console.log(`[PATCH] Successfully localized: ${entry.path} (${modKey})`);
      }
    }
  }

  // 3. 重新计算所有条目的数据偏移量
  allEntries.sort((a, b) => a.oldOffset - b.oldOffset);
  let currentOffset = 0;
  for (const entry of allEntries) {
    if (entry.unpacked) continue;
    entry.node.offset = currentOffset.toString();
    currentOffset += entry.size;
  }

  // 4. 重构并对齐 Asar JSON Header
  const newJsonStr = JSON.stringify(root);
  const newJsonBuf = Buffer.from(newJsonStr, 'utf8');
  const newJsonSize = newJsonBuf.length;
  const padding = (4 - (newJsonSize % 4)) % 4;
  const headerPayload = newJsonSize + padding;

  const tmpAsarPath = targetAsarPath + '.new.tmp';
  const outStream = fs.createWriteStream(tmpAsarPath);

  const headerPrefix = Buffer.alloc(16);
  headerPrefix.writeUInt32LE(4, 0);
  headerPrefix.writeUInt32LE(headerPayload + 8, 4);
  headerPrefix.writeUInt32LE(headerPayload + 4, 8);
  headerPrefix.writeUInt32LE(newJsonSize, 12);
  outStream.write(headerPrefix);
  outStream.write(newJsonBuf);
  if (padding > 0) {
    outStream.write(Buffer.alloc(padding));
  }

  // 写入各文件二进制实体
  for (const entry of allEntries) {
    if (entry.unpacked) continue;
    if (entry.overriddenData) {
      outStream.write(entry.overriddenData);
    } else {
      const chunk = asarBuf.subarray(dataStart + entry.oldOffset, dataStart + entry.oldOffset + entry.size);
      outStream.write(chunk);
    }
  }

  return new Promise((resolve, reject) => {
    outStream.end();
    outStream.on('finish', () => {
      // 5. 校验新生成 Asar 合法性
      try {
        const testBuf = fs.readFileSync(tmpAsarPath);
        const testU2 = testBuf.readUInt32LE(4);
        const testJsonSize = testBuf.readUInt32LE(12);
        const testHeader = JSON.parse(testBuf.toString('utf8', 16, 16 + testJsonSize));
        const testPreload = testHeader.files.dist.files['preload.js'];
        const testDataStart = 8 + testU2;
        const testCode = testBuf.toString('utf8', testDataStart + parseInt(testPreload.offset), testDataStart + parseInt(testPreload.offset) + testPreload.size);
        if (!testCode.includes(patchMarker)) {
          throw new Error('Verification failed: patch marker missing in output asar');
        }

        // 6. 创建备份并替换
        const backupAsarPath = targetAsarPath + '.bak';
        if (!fs.existsSync(backupAsarPath)) {
          fs.copyFileSync(targetAsarPath, backupAsarPath);
          console.log(`[BACKUP] Original backup created: ${backupAsarPath}`);
        }

        fs.copyFileSync(tmpAsarPath, targetAsarPath);
        fs.unlinkSync(tmpAsarPath);
        console.log(`[SUCCESS] Patched asar deployed to: ${targetAsarPath}`);
        resolve();
      } catch (err) {
        if (fs.existsSync(tmpAsarPath)) {
          fs.unlinkSync(tmpAsarPath);
        }
        reject(err);
      }
    });
    outStream.on('error', reject);
  });
}

// CLI 执行入口
if (require.main === module) {
  const args = process.argv.slice(2);
  const targetAsar = args[0] || getDefaultAsarPath();
  const payloadPath = args[1] || path.resolve(__dirname, '../dist/patch-payload.js');

  console.log(`Target: ${targetAsar}`);
  console.log(`Payload: ${payloadPath}`);

  injectAsar(targetAsar, payloadPath)
    .then(() => {
      console.log('Injection completed successfully.');
      process.exit(0);
    })
    .catch(err => {
      console.error('Injection failed:', err);
      process.exit(1);
    });
}

function getDefaultAsarPath() {
  const candidates = process.platform === 'win32'
    ? [
        path.join(process.env.LOCALAPPDATA || '', 'Programs/antigravity/resources/app.asar'),
        path.join(process.env.ProgramFiles || '', 'antigravity/resources/app.asar'),
      ]
    : process.platform === 'darwin'
    ? [
        '/Applications/Antigravity.app/Contents/Resources/app.asar',
        path.join(process.env.HOME || '', 'Applications/Antigravity.app/Contents/Resources/app.asar'),
      ]
    : [
        '/opt/antigravity/resources/app.asar',
        '/usr/lib/antigravity/resources/app.asar',
        path.join(process.env.HOME || '', '.local/share/antigravity/resources/app.asar'),
      ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

async function restoreAsar(asarPath) {
  const backupPath = asarPath + '.bak';
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file not found: ${backupPath}`);
  }
  fs.copyFileSync(backupPath, asarPath);
  console.log(`[RESTORE] Restored from backup: ${backupPath}`);
}

function checkStatus(asarPath) {
  const stat = fs.statSync(asarPath);
  const backupPath = asarPath + '.bak';
  const hasBackup = fs.existsSync(backupPath);
  const backupSize = hasBackup ? fs.statSync(backupPath).size : 0;

  const buf = fs.readFileSync(asarPath);
  const u2 = buf.readUInt32LE(4);
  const jsonSize = buf.readUInt32LE(12);
  const dataStart = 8 + u2;
  const headerJson = buf.toString('utf8', 16, 16 + jsonSize);
  const root = JSON.parse(headerJson);

  let isPatched = false;
  let patchTimestamp = null;
  try {
    const preloadNode = root.files.dist.files['preload.js'];
    if (preloadNode) {
      const offset = parseInt(preloadNode.offset, 10);
      const size = preloadNode.size;
      const content = buf.toString('utf8', dataStart + offset, dataStart + offset + size);
      isPatched = content.includes(patchMarker);
      if (isPatched) {
        const tsMatch = content.match(/Build Timestamp:\s*(.+)/);
        patchTimestamp = tsMatch ? tsMatch[1].trim() : null;
      }
    }
  } catch (e) {
    // ignore parse errors
  }

  return {
    fileSize: stat.size,
    isPatched,
    hasBackup,
    backupSize,
    patchTimestamp,
  };
}

module.exports = {
  injectAsar,
  restoreAsar,
  checkStatus,
  getDefaultAsarPath,
  MODULE_PATCHES,
  applyReplacements,
  toAsciiUnicode
};
