@echo off
chcp 65001 >nul
title Google Antigravity 官方还原器

echo ============================================================
echo    Google Antigravity 官方原版还原器 - Windows
echo ============================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0restore.ps1"

echo.
echo 按任意键退出窗口...
pause >nul
