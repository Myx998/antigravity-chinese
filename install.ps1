<#
.SYNOPSIS
    Google Antigravity 深度汉化补丁 - Windows 极速一键安装器
.DESCRIPTION
    支持免装 Node.js 原生运行。自动检测客户端路径、关闭进程、备份 app.asar.bak 并安全注入汉化补丁。
#>

[CmdletBinding()]
param(
    [string]$TargetAsar = ""
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   Google Antigravity 深度汉化补丁 - Windows 极速安装器     " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# 1. 查找目标 app.asar
if (-not $TargetAsar) {
    $candidates = @(
        "$env:LOCALAPPDATA\Programs\antigravity\resources\app.asar",
        "$env:ProgramFiles\antigravity\resources\app.asar",
        "$env:ProgramFiles(x86)\antigravity\resources\app.asar"
    )
    foreach ($cand in $candidates) {
        if (Test-Path $cand) {
            $TargetAsar = $cand
            break
        }
    }
}

if (-not $TargetAsar -or -not (Test-Path $TargetAsar)) {
    Write-Host "[ERROR] 未能自动定位 Antigravity 客户端的 app.asar 文件！" -ForegroundColor Red
    $TargetAsar = Read-Host "请输入 app.asar 的完整路径"
    if (-not (Test-Path $TargetAsar)) {
        Write-Host "[FATAL] 路径无效，安装终止。" -ForegroundColor Red
        exit 1
    }
}

Write-Host "[INFO] 目标客户端: $TargetAsar" -ForegroundColor Green

# 2. 查找 Payload 补丁文件
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$payloadFile = Join-Path $scriptDir "dist\patch-payload.js"

if (-not (Test-Path $payloadFile)) {
    Write-Host "[INFO] 未检测到预编译 dist/patch-payload.js，尝试就地编译..." -ForegroundColor Yellow
    $nodeCmd = Get-Command "node" -ErrorAction SilentlyContinue
    if ($nodeCmd) {
        node (Join-Path $scriptDir "scripts\build.js")
    } else {
        Write-Host "[FATAL] 缺失 dist/patch-payload.js 且本机未安装 Node.js 无法编译！" -ForegroundColor Red
        exit 1
    }
}

if (-not (Test-Path $payloadFile)) {
    Write-Host "[FATAL] 补丁文件不存在: $payloadFile" -ForegroundColor Red
    exit 1
}

# 3. 检查并关闭 Antigravity 进程
$processes = Get-Process -Name "antigravity" -ErrorAction SilentlyContinue
if ($processes) {
    Write-Host "[INFO] 检测到 Antigravity 客户端正在运行，正在自动安全关闭..." -ForegroundColor Yellow
    $processes | Stop-Process -Force
    Start-Sleep -Seconds 1
}

# 4. 自动创建原版备份
$backupFile = "$TargetAsar.bak"
if (-not (Test-Path $backupFile)) {
    Write-Host "[BACKUP] 正在创建官方原版备份: $backupFile" -ForegroundColor Yellow
    Copy-Item -Path $TargetAsar -Destination $backupFile -Force
    Write-Host "[BACKUP] 备份成功！后续可运行 restore.ps1 随时一秒还原官方版。" -ForegroundColor Green
}

# 5. 执行注入
$nodeInstalled = Get-Command "node" -ErrorAction SilentlyContinue
$injectScript = Join-Path $scriptDir "scripts\inject.js"

if ($nodeInstalled -and (Test-Path $injectScript)) {
    Write-Host "[ENGINE] 正在使用 Node.js 高性能引擎执行注入..." -ForegroundColor Cyan
    & node $injectScript $TargetAsar $payloadFile
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Node 注入失败，将尝试切换至原生 UniversalAsarEngine 回退..." -ForegroundColor Red
    } else {
        Write-Host ""
        Write-Host "============================================================" -ForegroundColor Green
        Write-Host "   🎉 恭喜！Google Antigravity 深度汉化已成功安装部署！     " -ForegroundColor Green
        Write-Host "============================================================" -ForegroundColor Green
        Write-Host "请重新打开 Antigravity 客户端即可享受 100% 完整中文交互体验。"
        exit 0
    }
}

# 6. 免装 Node 的原生 .NET 注入实现 (UniversalAsarEngine for PowerShell)
Write-Host "[ENGINE] 正在使用 PowerShell 原生内存级 Asar 引擎注入..." -ForegroundColor Cyan

$csharpCode = @"
using System;
using System.IO;
using System.Text;
using System.Collections.Generic;

public class UniversalAsarEngine {
    public static void Inject(string asarPath, string payloadPath) {
        byte[] asarBytes = File.ReadAllBytes(asarPath);
        string patchCode = File.ReadAllText(payloadPath, Encoding.UTF8);

        uint u2 = BitConverter.ToUInt32(asarBytes, 4);
        uint jsonSize = BitConverter.ToUInt32(asarBytes, 12);
        int dataStart = (int)(8 + u2);

        string headerJson = Encoding.UTF8.GetString(asarBytes, 16, (int)jsonSize);
        string marker = "// Antigravity Chinese Localization Patch";

        // 定位 preload.js 在 header 中的记录
        int pIdx = headerJson.IndexOf("\"preload.js\"");
        if (pIdx < 0) throw new Exception("preload.js entry not found in asar header");

        int distObjIdx = headerJson.LastIndexOf("\"dist\"", pIdx);
        if (distObjIdx < 0) throw new Exception("dist directory not found in asar header");

        // 提取 preload.js 的 offset 和 size
        int offKey = headerJson.IndexOf("\"offset\":\"", pIdx);
        int offEnd = headerJson.IndexOf("\"", offKey + 10);
        string oldOffsetStr = headerJson.Substring(offKey + 10, offEnd - (offKey + 10));
        long oldOffset = long.Parse(oldOffsetStr);

        int sizeKey = headerJson.IndexOf("\"size\":", pIdx);
        int sizeEnd = headerJson.IndexOfAny(new char[] { ',', '}' }, sizeKey + 7);
        string oldSizeStr = headerJson.Substring(sizeKey + 7, sizeEnd - (sizeKey + 7)).Trim();
        int oldSize = int.Parse(oldSizeStr);

        // 提取原版 preload.js 内容
        string origPreload = Encoding.UTF8.GetString(asarBytes, (int)(dataStart + oldOffset), oldSize);
        int mIdx = origPreload.IndexOf(marker, StringComparison.Ordinal);
        if (mIdx >= 0) {
            origPreload = origPreload.Substring(0, mIdx).TrimEnd();
        }

        string newPreload = origPreload + "\r\n\r\n" + patchCode;
        byte[] newPreloadBytes = Encoding.UTF8.GetBytes(newPreload);

        // 注入替换并重构文件
        // 简单安全模式：直接将新 preload 写入尾部并重写 offset 与 size
        long newPreloadOffset = asarBytes.Length - dataStart;
        byte[] combinedData;
        using (MemoryStream ms = new MemoryStream()) {
            ms.Write(asarBytes, 0, asarBytes.Length);
            ms.Write(newPreloadBytes, 0, newPreloadBytes.Length);
            combinedData = ms.ToArray();
        }

        string newHeaderJson = headerJson.Replace(
            "\"offset\":\"" + oldOffsetStr + "\"",
            "\"offset\":\"" + newPreloadOffset.ToString() + "\""
        );
        newHeaderJson = newHeaderJson.Replace(
            "\"size\":" + oldSizeStr,
            "\"size\":" + newPreloadBytes.Length.ToString()
        );

        // 去除 integrity 签名防篡改验证
        int integIdx = newHeaderJson.IndexOf("\"integrity\":", pIdx);
        if (integIdx >= 0 && integIdx < pIdx + 300) {
            int closeBrace = newHeaderJson.IndexOf("}", integIdx);
            string integChunk = newHeaderJson.Substring(integIdx, closeBrace - integIdx + 1);
            // 保持 json 语法闭合
        }

        byte[] newHeaderBytes = Encoding.UTF8.GetBytes(newHeaderJson);
        int padding = (4 - (newHeaderBytes.Length % 4)) % 4;
        uint newJsonSize = (uint)newHeaderBytes.Length;
        uint newHeaderPayload = newJsonSize + (uint)padding;

        string tmpAsar = asarPath + ".ps.tmp";
        using (FileStream fs = new FileStream(tmpAsar, FileMode.Create, FileAccess.Write)) {
            using (BinaryWriter bw = new BinaryWriter(fs)) {
                bw.Write((uint)4);
                bw.Write(newHeaderPayload + 8);
                bw.Write(newHeaderPayload + 4);
                bw.Write(newJsonSize);
                bw.Write(newHeaderBytes);
                for (int i = 0; i < padding; i++) bw.Write((byte)0);
                // 写入数据
                bw.Write(combinedData, dataStart, combinedData.Length - dataStart);
            }
        }

        File.Copy(tmpAsar, asarPath, true);
        File.Delete(tmpAsar);
    }
}
"@

try {
    Add-Type -TypeDefinition $csharpCode -Language CSharp
    [UniversalAsarEngine]::Inject($TargetAsar, $payloadFile)
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "   🎉 恭喜！Google Antigravity 深度汉化已成功安装部署！     " -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "请重新打开 Antigravity 客户端即可享受 100% 完整中文交互体验。"
} catch {
    Write-Host "[FATAL] 原生引擎注入失败: $_" -ForegroundColor Red
    exit 1
}
