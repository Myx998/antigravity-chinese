@echo off
@chcp 65001 >nul
title Antigravity Chinese Restore
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0restore.ps1"
pause
