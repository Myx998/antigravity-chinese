#!/usr/bin/env bash
# ============================================================
#  Google Antigravity 官方原版还原器 - macOS / Linux
# ============================================================

set -e

echo "============================================================"
echo "   Google Antigravity 官方原版还原器 - macOS / Linux        "
echo "============================================================"
echo ""

OS_TYPE="$(uname -s)"
TARGET_ASAR=""

if [ "$OS_TYPE" = "Darwin" ]; then
    APP_PATH="/Applications/Antigravity.app"
    if [ ! -d "$APP_PATH" ]; then
        APP_PATH="$HOME/Applications/Antigravity.app"
    fi
    if [ -d "$APP_PATH" ]; then
        TARGET_ASAR="$APP_PATH/Contents/Resources/app.asar"
    fi
elif [ "$OS_TYPE" = "Linux" ]; then
    CANDIDATES=(
        "/opt/antigravity/resources/app.asar"
        "/usr/lib/antigravity/resources/app.asar"
        "$HOME/.local/share/antigravity/resources/app.asar"
    )
    for c in "${CANDIDATES[@]}"; do
        if [ -f "$c" ]; then
            TARGET_ASAR="$c"
            break
        fi
    done
fi

if [ -z "$TARGET_ASAR" ] || [ ! -f "$TARGET_ASAR" ]; then
    read -rp "请输入 app.asar 的绝对路径: " TARGET_ASAR
    if [ ! -f "$TARGET_ASAR" ]; then
        echo "[FATAL] 路径无效，还原终止。"
        exit 1
    fi
fi

BACKUP_ASAR="${TARGET_ASAR}.bak"
if [ ! -f "$BACKUP_ASAR" ]; then
    echo "[ERROR] 未找到官方原版备份文件: $BACKUP_ASAR"
    echo "若未曾备份，请重新下载官方安装包覆盖修复。"
    exit 1
fi

echo "[INFO] 正在关闭 Antigravity 进程..."
if [ "$OS_TYPE" = "Darwin" ]; then
    killall "Antigravity" 2>/dev/null || true
else
    pkill -f "antigravity" 2>/dev/null || true
fi
sleep 1

echo "[RESTORE] 正在恢复备份..."
cp -f "$BACKUP_ASAR" "$TARGET_ASAR"

if [ "$OS_TYPE" = "Darwin" ]; then
    if [ -z "$APP_PATH" ] || [ ! -d "$APP_PATH" ]; then
        if [[ "$TARGET_ASAR" == *".app"* ]]; then
            APP_PATH="${TARGET_ASAR%%.app*}.app"
        fi
    fi
    if [ -n "$APP_PATH" ] && [ -d "$APP_PATH" ]; then
        echo "[SECURITY] 正在重新签署官方应用状态..."
        codesign --force --deep --sign - "$APP_PATH" 2>/dev/null || true
    fi
fi

echo ""
echo "============================================================"
echo "   🎉 还原成功！已恢复为官方纯净英版客户端。                 "
echo "============================================================"
echo "重新启动 Antigravity 即可生效。"
