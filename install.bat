@echo off
chcp 65001 >nul
title Google Antigravity 深度汉化安装器

echo ============================================================
echo    Google Antigravity 深度汉化补丁 - Windows 极速安装器
echo ============================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [错误] 安装过程中遇到异常，请检查控制台输出。
) else (
    echo.
    echo [完成] 汉化安装流程已顺利结束！
)

echo.
echo 按任意键退出窗口...
pause >nul
