#!/usr/bin/env bash
# ============================================================
#  Google Antigravity 深度汉化补丁 - macOS / Linux 极速安装器
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PAYLOAD_FILE="$SCRIPT_DIR/dist/patch-payload.js"

echo "============================================================"
echo "   Google Antigravity 深度汉化补丁 - macOS / Linux 安装器   "
echo "============================================================"
echo ""

# 1. 检测操作系统平台与默认路径
OS_TYPE="$(uname -s)"
TARGET_ASAR=""

if [ "$OS_TYPE" = "Darwin" ]; then
    echo "[INFO] 检测到操作系统: macOS"
    APP_PATH="/Applications/Antigravity.app"
    if [ ! -d "$APP_PATH" ]; then
        APP_PATH="$HOME/Applications/Antigravity.app"
    fi
    if [ -d "$APP_PATH" ]; then
        TARGET_ASAR="$APP_PATH/Contents/Resources/app.asar"
    fi
elif [ "$OS_TYPE" = "Linux" ]; then
    echo "[INFO] 检测到操作系统: Linux"
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
    echo "[ERROR] 未能自动定位 Antigravity 客户端的 app.asar！"
    read -rp "请输入 app.asar 的绝对路径: " TARGET_ASAR
    if [ ! -f "$TARGET_ASAR" ]; then
        echo "[FATAL] 路径无效，安装终止。"
        exit 1
    fi
fi

echo "[INFO] 目标客户端: $TARGET_ASAR"

# 2. 检查或远程拉取 Payload 补丁文件 (支持管道 curl 一键远程安装)
if [ ! -f "$PAYLOAD_FILE" ]; then
    if [ -f "dist/patch-payload.js" ]; then
        PAYLOAD_FILE="$(pwd)/dist/patch-payload.js"
    elif [ -f "$SCRIPT_DIR/scripts/build.js" ] && command -v node >/dev/null 2>&1; then
        echo "[INFO] 未检测到预编译补丁，正在就地编译 dist/patch-payload.js..."
        node "$SCRIPT_DIR/scripts/build.js"
    fi
fi

if [ ! -f "$PAYLOAD_FILE" ]; then
    echo "[NETWORK] 本地未检测到补丁文件，正在从极速 CDN / 镜像源拉取最新补丁..."
    TEMP_PAYLOAD="/tmp/antigravity-patch-payload.js"
    CDN_SOURCES=(
        "https://cdn.jsdelivr.net/gh/Myx998/antigravity-chinese@main/dist/patch-payload.js"
        "https://ghproxy.net/https://raw.githubusercontent.com/Myx998/antigravity-chinese/main/dist/patch-payload.js"
        "https://raw.githubusercontent.com/Myx998/antigravity-chinese/main/dist/patch-payload.js"
    )

    DOWNLOAD_OK=0
    for src in "${CDN_SOURCES[@]}"; do
        echo "[DOWNLOAD] 尝试连接节点: $src"
        if curl -fsSL --connect-timeout 5 -A "Antigravity-Installer" "$src" -o "$TEMP_PAYLOAD" 2>/dev/null; then
            if [ -f "$TEMP_PAYLOAD" ] && grep -q "Antigravity Chinese Localization Patch" "$TEMP_PAYLOAD"; then
                PAYLOAD_FILE="$TEMP_PAYLOAD"
                DOWNLOAD_OK=1
                echo "[SUCCESS] 成功从远程镜像拉取汉化补丁！"
                break
            fi
        fi
        echo "[WARN] 节点访问异常，自动切换下一镜像..."
    done

    if [ "$DOWNLOAD_OK" -ne 1 ]; then
        echo "[FATAL] 所有远程节点拉取补丁均失败，请检查网络连接！"
        exit 1
    fi
fi

echo "[INFO] 补丁文件就绪: $PAYLOAD_FILE"

# 2.1 目标路径写入权限检测
if [ ! -w "$TARGET_ASAR" ] && [ "$EUID" -ne 0 ]; then
    echo "[WARN] 目标客户端目录需要管理员权限写入！"
    echo "[WARN] 如果后续写入遇到 Permission denied，请使用 sudo 执行本命令。"
fi

# 3. 安全关闭 Antigravity 进程
echo "[INFO] 正在检测并关闭正在运行的 Antigravity 实例..."
if [ "$OS_TYPE" = "Darwin" ]; then
    killall "Antigravity" 2>/dev/null || true
else
    pkill -f "antigravity" 2>/dev/null || true
fi
sleep 1

# 4. 创建官方原版备份
BACKUP_ASAR="${TARGET_ASAR}.bak"
if [ ! -f "$BACKUP_ASAR" ]; then
    echo "[BACKUP] 正在创建官方原版备份: $BACKUP_ASAR"
    cp "$TARGET_ASAR" "$BACKUP_ASAR"
    echo "[BACKUP] 备份成功！后续运行 ./restore.sh 即可一秒还原官方版。"
fi

# 5. 执行 Asar 动态注入
INJECT_JS=""
if [ -f "$SCRIPT_DIR/scripts/inject.js" ]; then
    INJECT_JS="$SCRIPT_DIR/scripts/inject.js"
elif [ -f "scripts/inject.js" ]; then
    INJECT_JS="$(pwd)/scripts/inject.js"
fi

if command -v node >/dev/null 2>&1 && [ -n "$INJECT_JS" ]; then
    echo "[ENGINE] 正在使用 Node.js 执行内存级注入..."
    node "$INJECT_JS" "$TARGET_ASAR" "$PAYLOAD_FILE"
elif command -v python3 >/dev/null 2>&1; then
    echo "[ENGINE] 正在使用 Python3 执行 Asar 内存注入..."
    python3 - <<EOF
import sys, json, os, struct

asar_path = "$TARGET_ASAR"
payload_path = "$PAYLOAD_FILE"
marker = "// Antigravity Chinese Localization Patch"

with open(payload_path, "r", encoding="utf-8") as f:
    patch_code = f.read()

with open(asar_path, "rb") as f:
    data = f.read()

u2 = struct.unpack("<I", data[4:8])[0]
json_size = struct.unpack("<I", data[12:16])[0]
data_start = 8 + u2

header_json = data[16:16+json_size].decode("utf-8")
root = json.loads(header_json)

all_entries = []
def collect(node, curr_path):
    for name, val in node.items():
        sub_path = (curr_path + "/" + name) if curr_path else name
        if "files" in val:
            collect(val["files"], sub_path)
        else:
            all_entries.append({
                "path": sub_path,
                "node": val,
                "old_offset": int(val.get("offset", 0)),
                "size": val.get("size", 0),
                "unpacked": val.get("unpacked", False)
            })

collect(root["files"], "")

preload_entry = next((e for e in all_entries if e["path"] == "dist/preload.js"), None)
if not preload_entry:
    raise Exception("dist/preload.js not found in asar")

old_preload = data[data_start + preload_entry["old_offset"] : data_start + preload_entry["old_offset"] + preload_entry["size"]].decode("utf-8")
if marker in old_preload:
    old_preload = old_preload[:old_preload.index(marker)].rstrip()

new_preload = (old_preload + "\n\n" + patch_code).encode("utf-8")
preload_entry["overridden"] = new_preload
preload_entry["size"] = len(new_preload)
preload_entry["node"]["size"] = len(new_preload)
preload_entry["node"].pop("integrity", None)

all_entries.sort(key=lambda x: x["old_offset"])
current_offset = 0
for entry in all_entries:
    if entry["unpacked"]: continue
    entry["node"]["offset"] = str(current_offset)
    current_offset += entry["size"]

new_json_bytes = json.dumps(root, separators=(',', ':')).encode("utf-8")
new_json_size = len(new_json_bytes)
padding = (4 - (new_json_size % 4)) % 4
header_payload = new_json_size + padding

tmp_path = asar_path + ".tmp"
with open(tmp_path, "wb") as f:
    f.write(struct.pack("<IIII", 4, header_payload + 8, header_payload + 4, new_json_size))
    f.write(new_json_bytes)
    if padding > 0:
        f.write(b"\x00" * padding)
    for entry in all_entries:
        if entry["unpacked"]: continue
        if "overridden" in entry:
            f.write(entry["overridden"])
        else:
            f.write(data[data_start + entry["old_offset"] : data_start + entry["old_offset"] + entry["size"]])

os.replace(tmp_path, asar_path)
print("[SUCCESS] Python3 Asar 注入成功！")
EOF
else
    echo "[FATAL] 需安装 Node.js 或 Python3 才能执行安装！"
    exit 1
fi

# 6. macOS 自动签名重写 (规避 Gatekeeper “应用已损坏”闪退)
if [ "$OS_TYPE" = "Darwin" ]; then
    if [ -z "$APP_PATH" ] || [ ! -d "$APP_PATH" ]; then
        if [[ "$TARGET_ASAR" == *".app"* ]]; then
            APP_PATH="${TARGET_ASAR%%.app*}.app"
        fi
    fi
    if [ -n "$APP_PATH" ] && [ -d "$APP_PATH" ]; then
        echo "[SECURITY] 正在为 macOS 重新签名应用以规避系统安全拦截..."
        codesign --force --deep --sign - "$APP_PATH" 2>/dev/null || true
        echo "[SECURITY] 应用重签名已完成！"
    fi
fi

echo ""
echo "============================================================"
echo "   🎉 恭喜！Google Antigravity 深度汉化已成功安装部署！     "
echo "============================================================"
echo "重新启动 Antigravity 客户端即可享受完整中文界面。"
