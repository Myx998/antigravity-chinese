/**
 * Antigravity Chinese Localization - Asar Injection Engine
 * 跨平台内存级 UniversalAsarEngine
 * 严格遵循 DMCA Clean-room 规范：仅在用户本机读取本地原始 preload 并注入 Payload
 */

const fs = require('fs');
const path = require('path');

const patchMarker = '// Antigravity Chinese Localization Patch';

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

  // 2. 查找并汉化 dist/loadingOverlay.js (若存在)
  const loadingEntry = allEntries.find(e => e.path === 'dist/loadingOverlay.js' || e.path === 'dist\\loadingOverlay.js');
  if (loadingEntry) {
    let oldLoading = asarBuf.toString('utf8', dataStart + loadingEntry.oldOffset, dataStart + loadingEntry.oldOffset + loadingEntry.size);
    let newLoading = oldLoading.replace('Loading Antigravity', '\u6b63\u5728\u52a0\u8f7d Antigravity...');
    const newLoadingBuf = Buffer.from(newLoading, 'utf8');
    loadingEntry.overriddenData = newLoadingBuf;
    loadingEntry.size = newLoadingBuf.length;
    loadingEntry.node.size = newLoadingBuf.length;
    if (loadingEntry.node.integrity) {
      delete loadingEntry.node.integrity;
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

module.exports = { injectAsar, restoreAsar, checkStatus, getDefaultAsarPath };
