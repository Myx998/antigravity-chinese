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

# 1.1 管理员权限 (UAC) 检测与提权
function Test-IsAdmin {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Test-PathNeedsAdmin([string]$path) {
    if (-not $path) { return $false }
    $pFiles = [Environment]::GetFolderPath("ProgramFiles")
    $pFilesX86 = [Environment]::GetFolderPath("ProgramFilesX86")
    if (($pFiles -and $path.StartsWith($pFiles, [System.StringComparison]::OrdinalIgnoreCase)) -or
        ($pFilesX86 -and $path.StartsWith($pFilesX86, [System.StringComparison]::OrdinalIgnoreCase))) {
        return $true
    }
    return $false
}

if ((Test-PathNeedsAdmin $TargetAsar) -and (-not (Test-IsAdmin))) {
    Write-Host "[UAC] 检测到目标文件位于受系统保护目录 (Program Files)，需要管理员权限！" -ForegroundColor Yellow
    if ($MyInvocation.MyCommand.Path) {
        Write-Host "[UAC] 正在自动请求管理员提权重新启动安装器..." -ForegroundColor Cyan
        Start-Process powershell.exe -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$($MyInvocation.MyCommand.Path)`" -TargetAsar `"$TargetAsar`""
        exit 0
    } else {
        Write-Host "[UAC ERROR] 当前为免克隆管道模式运行，无法静默提权。" -ForegroundColor Red
        Write-Host "请右键点击开始菜单 -> 选择【终端管理员】或【PowerShell (管理员)】，然后重新粘贴运行命令：" -ForegroundColor Yellow
        Write-Host "  irm https://cdn.jsdelivr.net/gh/Myx998/antigravity-chinese@main/install.ps1 | iex" -ForegroundColor White
        exit 1
    }
}

# 2. 查找或远程拉取 Payload 补丁文件 (支持管道一行命令远程极速安装)
$scriptDir = if ($MyInvocation.MyCommand.Path) { Split-Path -Parent $MyInvocation.MyCommand.Path } else { "" }
$payloadFile = ""

# 2.1 检查脚本同级或当前工作区目录
if ($scriptDir) {
    $cand = Join-Path $scriptDir "dist\patch-payload.js"
    if (Test-Path $cand) {
        $payloadFile = $cand
    }
}

if (-not $payloadFile -and (Test-Path "dist\patch-payload.js")) {
    $payloadFile = (Resolve-Path "dist\patch-payload.js").Path
}

# 2.2 本地未找到且有 Node 时尝试就地编译
if (-not $payloadFile -and $MyInvocation.MyCommand.Path) {
    $buildScript = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "scripts\build.js"
    $nodeCmd = Get-Command "node" -ErrorAction SilentlyContinue
    if ((Test-Path $buildScript) -and $nodeCmd) {
        Write-Host "[INFO] 未检测到预编译 dist/patch-payload.js，正在就地编译..." -ForegroundColor Yellow
        & node $buildScript
        $cand = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "dist\patch-payload.js"
        if (Test-Path $cand) {
            $payloadFile = $cand
        }
    }
}

# 2.3 管道远程运行（免克隆仓库）或本地缺失时，自动通过 CDN/镜像拉取最新补丁
if (-not $payloadFile) {
    Write-Host "[NETWORK] 本地未检测到补丁文件，正在从极速 CDN / 镜像源拉取最新补丁..." -ForegroundColor Cyan
    $tempPayload = Join-Path $env:TEMP "antigravity-patch-payload.js"

    $cdnSources = @(
        "https://cdn.jsdelivr.net/gh/Myx998/antigravity-chinese@main/dist/patch-payload.js",
        "https://ghproxy.net/https://raw.githubusercontent.com/Myx998/antigravity-chinese/main/dist/patch-payload.js",
        "https://raw.githubusercontent.com/Myx998/antigravity-chinese/main/dist/patch-payload.js"
    )

    $downloadSuccess = $false
    foreach ($sourceUrl in $cdnSources) {
        try {
            Write-Host "[DOWNLOAD] 尝试连接节点: $sourceUrl" -ForegroundColor DarkGray
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
            $client = New-Object System.Net.WebClient
            $client.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Antigravity-Installer")
            $client.DownloadFile($sourceUrl, $tempPayload)
            if ((Test-Path $tempPayload) -and ((Get-Item $tempPayload).Length -gt 1000)) {
                $headContent = Get-Content -Path $tempPayload -TotalCount 5 -Raw
                if ($headContent -match "Antigravity Chinese Localization Patch") {
                    $payloadFile = $tempPayload
                    $downloadSuccess = $true
                    Write-Host "[SUCCESS] 成功从远程镜像拉取汉化补丁！" -ForegroundColor Green
                    break
                }
            }
        } catch {
            Write-Host "[WARN] 节点访问异常，自动切换下一镜像..." -ForegroundColor Yellow
        }
    }

    if (-not $downloadSuccess) {
        Write-Host "[FATAL] 所有远程节点拉取补丁均失败，请检查网络连接或手动下载仓库后运行！" -ForegroundColor Red
        exit 1
    }
}

Write-Host "[INFO] 补丁文件就绪: $payloadFile" -ForegroundColor Green

# 3. 检查并关闭 Antigravity 进程 (释放 Windows 文件占用锁定)
$processes = Get-Process -Name "antigravity" -ErrorAction SilentlyContinue
if ($processes) {
    Write-Host "[NOTICE] 检测到 Antigravity 客户端正在运行。" -ForegroundColor Yellow
    Write-Host "[NOTICE] Windows 系统保护机制要求更新 app.asar 前必须先关闭客户端。" -ForegroundColor Yellow
    Write-Host "[NOTICE] 正在准备安全退出 Antigravity 客户端以完成操作..." -ForegroundColor Cyan
    Start-Sleep -Seconds 2
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
$injectScript = ""
if ($scriptDir -and (Test-Path (Join-Path $scriptDir "scripts\inject.js"))) {
    $injectScript = Join-Path $scriptDir "scripts\inject.js"
} elseif (Test-Path "scripts\inject.js") {
    $injectScript = (Resolve-Path "scripts\inject.js").Path
}

if ($nodeInstalled -and $injectScript) {
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
using System.Text.RegularExpressions;
using System.Collections.Generic;

public class UniversalAsarEngine {
    private static int FindAsarEntryStart(string json, string targetDir, string targetFile) {
        string rootMarker = "\"files\":{";
        int rootIdx = json.IndexOf(rootMarker);
        if (rootIdx < 0) return -1;

        int pos = rootIdx + rootMarker.Length;
        int braceDepth = 0;
        bool inString = false;
        bool escape = false;
        string key = "";
        bool collectingKey = false;
        int targetDirStart = -1;

        while (pos < json.Length) {
            char c = json[pos];
            if (escape) { escape = false; pos++; continue; }
            if (c == '\\') { escape = true; pos++; continue; }
            if (c == '"') {
                inString = !inString;
                if (inString && braceDepth == 0) {
                    key = "";
                    collectingKey = true;
                } else if (!inString && collectingKey) {
                    collectingKey = false;
                    if (key == targetDir) {
                        targetDirStart = json.IndexOf('{', pos);
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
            if (c == '{') braceDepth++;
            else if (c == '}') {
                braceDepth--;
                if (braceDepth < 0) break;
            }
            pos++;
        }

        if (targetDirStart < 0) return -1;

        string subFilesMarker = "\"files\":{";
        int subFilesIdx = json.IndexOf(subFilesMarker, targetDirStart);
        if (subFilesIdx < 0) return -1;

        pos = subFilesIdx + subFilesMarker.Length;
        braceDepth = 0;
        inString = false;
        escape = false;
        collectingKey = false;

        while (pos < json.Length) {
            char c = json[pos];
            if (escape) { escape = false; pos++; continue; }
            if (c == '\\') { escape = true; pos++; continue; }
            if (c == '"') {
                inString = !inString;
                if (inString && braceDepth == 0) {
                    key = "";
                    collectingKey = true;
                } else if (!inString && collectingKey) {
                    collectingKey = false;
                    if (key == targetFile) {
                        return json.IndexOf('{', pos);
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
            if (c == '{') braceDepth++;
            else if (c == '}') {
                braceDepth--;
                if (braceDepth < 0) break;
            }
            pos++;
        }

        return -1;
    }

    public static void Inject(string asarPath, string payloadPath) {
        byte[] asarBytes = File.ReadAllBytes(asarPath);
        string patchCode = File.ReadAllText(payloadPath, Encoding.UTF8);

        uint u2 = BitConverter.ToUInt32(asarBytes, 4);
        uint jsonSize = BitConverter.ToUInt32(asarBytes, 12);
        int dataStart = (int)(8 + u2);

        string headerJson = Encoding.UTF8.GetString(asarBytes, 16, (int)jsonSize);
        string marker = "// Antigravity Chinese Localization Patch";

        // 精确查找 dist/preload.js
        int entryStart = FindAsarEntryStart(headerJson, "dist", "preload.js");
        if (entryStart < 0) {
            int pIdx = headerJson.LastIndexOf("\"preload.js\"");
            if (pIdx >= 0) entryStart = headerJson.IndexOf('{', pIdx);
        }
        if (entryStart < 0) {
            throw new Exception("dist/preload.js entry not found in asar header");
        }

        // 查找 entry 的闭合 '}'
        int depth = 0;
        int entryEnd = -1;
        bool inStr = false;
        bool esc = false;
        for (int i = entryStart; i < headerJson.Length; i++) {
            char c = headerJson[i];
            if (esc) { esc = false; continue; }
            if (c == '\\') { esc = true; continue; }
            if (c == '"') { inStr = !inStr; continue; }
            if (inStr) continue;

            if (c == '{') depth++;
            else if (c == '}') {
                depth--;
                if (depth == 0) {
                    entryEnd = i;
                    break;
                }
            }
        }
        if (entryEnd < 0) throw new Exception("Invalid JSON structure for preload.js entry");

        string oldEntry = headerJson.Substring(entryStart, entryEnd - entryStart + 1);

        Match mOff = Regex.Match(oldEntry, "\"offset\"\\s*:\\s*\"(\\d+)\"");
        Match mSize = Regex.Match(oldEntry, "\"size\"\\s*:\\s*(\\d+)");
        if (!mOff.Success || !mSize.Success) {
            throw new Exception("Could not parse offset/size from preload.js entry: " + oldEntry);
        }

        long oldOffset = long.Parse(mOff.Groups[1].Value);
        int oldSize = int.Parse(mSize.Groups[1].Value);

        // 提取原版 preload.js 内容
        string origPreload = Encoding.UTF8.GetString(asarBytes, (int)(dataStart + oldOffset), oldSize);
        int mIdx = origPreload.IndexOf(marker, StringComparison.Ordinal);
        if (mIdx >= 0) {
            origPreload = origPreload.Substring(0, mIdx).TrimEnd();
        }

        string newPreload = origPreload + "\r\n\r\n" + patchCode;
        byte[] newPreloadBytes = Encoding.UTF8.GetBytes(newPreload);

        long newPreloadOffset = asarBytes.Length - dataStart;
        byte[] combinedData;
        using (MemoryStream ms = new MemoryStream()) {
            ms.Write(asarBytes, 0, asarBytes.Length);
            ms.Write(newPreloadBytes, 0, newPreloadBytes.Length);
            combinedData = ms.ToArray();
        }

        // 局部精准替换 entry，不触碰任何其它文件，并自动剥离 integrity 校验
        string newEntry = "{\"size\":" + newPreloadBytes.Length + ",\"offset\":\"" + newPreloadOffset.ToString() + "\"}";
        string newHeaderJson = headerJson.Substring(0, entryStart) + newEntry + headerJson.Substring(entryEnd + 1);

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
