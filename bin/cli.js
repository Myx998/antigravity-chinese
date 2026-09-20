#!/usr/bin/env node
/**
 * Antigravity Chinese Localization - Unified Command Line Interface (CLI)
 * Zero-dependency, cross-platform CLI tool for installing, restoring, building, and testing
 */

const fs = require('fs');
const path = require('path');
const { injectAsar, restoreAsar, checkStatus, getDefaultAsarPath } = require('../scripts/inject');
const { build } = require('../scripts/build');

const pkg = require('../package.json');

const HELP_TEXT = `
Google Antigravity 深度汉化补丁 - 命令行工具 v${pkg.version}

使用方法:
  antigravity-chinese <command> [options]

核心命令:
  install [path]    自动定位或向指定的 app.asar 注入汉化补丁
  restore [path]    将客户端还原为官方纯净英版 (优先使用 .bak 备份，支持无备份逆向剥离)
  check [path]      检测目标客户端的汉化补丁状态与备份有效性
  build             重新编译词典与核心引擎，生成 dist/patch-payload.js
  test              执行完整的语法、词典与自动化回归测试套件

选项:
  -h, --help        显示此帮助说明
  -v, --version     显示当前版本号

示例:
  antigravity-chinese install
  antigravity-chinese install "C:\\Path\\To\\resources\\app.asar"
  antigravity-chinese restore
  antigravity-chinese check
`;

function printBanner() {
  console.log('============================================================');
  console.log(`   Google Antigravity 深度汉化命令行工具 v${pkg.version}     `);
  console.log('============================================================\n');
}

async function run() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '-h' || command === '--help' || command === 'help') {
    printBanner();
    console.log(HELP_TEXT.trim());
    process.exit(0);
  }

  if (command === '-v' || command === '--version' || command === 'version') {
    console.log(`v${pkg.version}`);
    process.exit(0);
  }

  const targetArg = args[1];

  switch (command) {
    case 'install': {
      printBanner();
      const asarPath = targetArg || getDefaultAsarPath();
      if (!asarPath || !fs.existsSync(asarPath)) {
        console.error(`[FATAL] 未能定位 Antigravity 客户端 app.asar。路径: ${asarPath || '(未指定)'}`);
        console.error('请手动指定路径: antigravity-chinese install "<path-to-app.asar>"');
        process.exit(1);
      }
      const payloadPath = path.resolve(__dirname, '../dist/patch-payload.js');
      if (!fs.existsSync(payloadPath)) {
        console.log('[BUILD] 未检测到 dist/patch-payload.js，正在就地编译...');
        build();
      }
      console.log(`[TARGET] 目标客户端: ${asarPath}`);
      try {
        await injectAsar(asarPath, payloadPath);
        console.log('\n[SUCCESS] 恭喜！Google Antigravity 深度汉化已成功安装部署！');
        process.exit(0);
      } catch (err) {
        console.error('\n[FATAL] 汉化安装失败:', err.message);
        process.exit(1);
      }
      break;
    }

    case 'restore': {
      printBanner();
      const asarPath = targetArg || getDefaultAsarPath();
      if (!asarPath || !fs.existsSync(asarPath)) {
        console.error(`[FATAL] 未能定位 Antigravity 客户端 app.asar。路径: ${asarPath || '(未指定)'}`);
        process.exit(1);
      }
      console.log(`[TARGET] 目标客户端: ${asarPath}`);
      try {
        await restoreAsar(asarPath);
        console.log('\n[SUCCESS] 还原成功！已恢复为官方纯净英版客户端。');
        process.exit(0);
      } catch (err) {
        console.error('\n[FATAL] 还原失败:', err.message);
        process.exit(1);
      }
      break;
    }

    case 'check':
    case 'status': {
      printBanner();
      const asarPath = targetArg || getDefaultAsarPath();
      if (!asarPath || !fs.existsSync(asarPath)) {
        console.error(`[FATAL] 未能定位 Antigravity 客户端 app.asar。路径: ${asarPath || '(未指定)'}`);
        process.exit(1);
      }
      console.log(`[TARGET] 目标文件: ${asarPath}`);
      try {
        const status = checkStatus(asarPath);
        console.log(`- 文件存在: 是 (${(status.fileSize / (1024 * 1024)).toFixed(2)} MB)`);
        console.log(`- 汉化补丁状态: ${status.isPatched ? '【已安装汉化补丁】' : '【未安装 / 官方原始状态】'}`);
        console.log(`- 备份状态: ${status.hasBackup ? `已备份 (${(status.backupSize / (1024 * 1024)).toFixed(2)} MB)` : '未检测到备份'}`);
        if (status.isPatched) {
          console.log(`- 补丁时间戳: ${status.patchTimestamp || '未知'}`);
        }
        process.exit(0);
      } catch (err) {
        console.error('[ERROR] 状态检查失败:', err.message);
        process.exit(1);
      }
      break;
    }

    case 'build': {
      build();
      process.exit(0);
      break;
    }

    case 'test': {
      require('../scripts/test');
      break;
    }

    default: {
      console.error(`[ERROR] 未知命令: ${command}`);
      console.log(HELP_TEXT.trim());
      process.exit(1);
    }
  }
}

if (require.main === module) {
  run();
}

module.exports = { run, HELP_TEXT };
