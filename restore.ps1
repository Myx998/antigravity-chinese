<#
.SYNOPSIS
    Google Antigravity 深度汉化补丁 - Windows 一键还原脚本
.DESCRIPTION
    从原版备份 app.asar.bak 还原官方原始客户端状态。
#>

[CmdletBinding()]
param(
    [string]$TargetAsar = ""
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   Google Antigravity 官方原版还原器 - Windows              " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

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
    Write-Host "[ERROR] 未能定位 Antigravity 客户端路径！" -ForegroundColor Red
    $TargetAsar = Read-Host "请输入 app.asar 的完整路径"
    if (-not (Test-Path $TargetAsar)) {
        Write-Host "[FATAL] 路径无效，还原终止。" -ForegroundColor Red
        exit 1
    }
}

$backupFile = "$TargetAsar.bak"
if (-not (Test-Path $backupFile)) {
    Write-Host "[ERROR] 未找到官方原版备份文件: $backupFile" -ForegroundColor Red
    Write-Host "如果未曾备份，请重新安装官方 Antigravity 客户端覆盖修复。"
    exit 1
}

$processes = Get-Process -Name "antigravity" -ErrorAction SilentlyContinue
if ($processes) {
    Write-Host "[INFO] 正在关闭 Antigravity 进程..." -ForegroundColor Yellow
    $processes | Stop-Process -Force
    Start-Sleep -Seconds 1
}

Write-Host "[RESTORE] 正在还原官方备份..." -ForegroundColor Cyan
Copy-Item -Path $backupFile -Destination $TargetAsar -Force

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "   🎉 还原成功！已恢复为官方纯净英版客户端。                 " -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host "重新启动 Antigravity 即可生效。"
