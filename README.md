<div align="center">

# 🚀 Google Antigravity 中文汉化包
### 全网覆盖最全・动态流式深度汉化・Windows 零依赖一键安装

[![CI Pipeline](https://github.com/Myx998/antigravity-chinese/actions/workflows/ci.yml/badge.svg)](https://github.com/Myx998/antigravity-chinese/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![词条覆盖](https://img.shields.io/badge/词条覆盖-2%2C312%2B-brightgreen.svg)](#-真实汉化效果对照)
[![平台支持](https://img.shields.io/badge/平台支持-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](#-一分钟极速安装)

**告别半中半英与生硬机翻！专为新一代 AI 智能体开发工具 Google Antigravity 量身打造的无感纯中文体验。**

[⚡ 一分钟极速安装](#-一分钟极速安装) • [✨ 为什么选这个汉化包](#-为什么选这个汉化包) • [📋 真实汉化效果对照](#-真实汉化效果对照) • [🔄 如何卸载还原](#-一键无损还原) • [❓ 常见疑问 FAQ](#-常见问题解答-faq)

</div>

---

## ⚡ 一分钟极速安装

无需安装 Node.js，无需安装 Python，不修改系统环境，开箱即用！

### 方式 A：一行命令在线安装（推荐・免下载仓库）

#### 🪟 Windows 用户（打开 PowerShell 复制运行）：
```powershell
# 国内极速通道 (推荐)
irm https://cdn.jsdelivr.net/gh/Myx998/antigravity-chinese@main/install.ps1 | iex

# GitHub 原生通道
irm https://raw.githubusercontent.com/Myx998/antigravity-chinese/main/install.ps1 | iex
```

#### 🍎 macOS / 🐧 Linux 用户（打开 Terminal 终端复制运行）：
```bash
# 国内极速通道 (推荐)
curl -fsSL https://cdn.jsdelivr.net/gh/Myx998/antigravity-chinese@main/install.sh | bash

# GitHub 原生通道
curl -fsSL https://raw.githubusercontent.com/Myx998/antigravity-chinese/main/install.sh | bash
```
> *macOS 内置自动重签名修复，绝不弹窗提示“应用已损坏”。*

---

### 方式 B：下载离线压缩包安装（小白推荐）

> ⚠️ **重要提示**：解压后请确保不要在压缩包内直接双击，需先解压到任意文件夹后再运行！

1. **[点击此处下载汉化包 ZIP 压缩包](https://github.com/Myx998/antigravity-chinese/archive/refs/heads/main.zip)** 并解压到任意文件夹。
2. 彻底退出正在运行的 Antigravity 软件。
3. **Windows**：双击运行解压文件夹中的 **`【双击安装汉化】-install.bat`** 即可！（亦兼容双击原版 `install.bat` 或在 PowerShell 中执行 `install.ps1`）
4. **macOS / Linux**：在解压目录终端执行 `./install.sh`。

---

## ✨ 为什么选这个汉化包？

普通汉化补丁往往只是简单的静态字面替换，在 Antigravity 这种高度依赖 AI 实时交互的工具中会出现各种“半生不熟”的毛病。本项目专为解决这些痛点而生：

### 1. 动态任务流不夹生（全网独家）
Antigravity 最核心的 AI 思考与动作状态（带箭头折叠、耗时跳动、多文件探索），我们全部做了动态语义还原：
- 原版英文：`Worked for 6s v` ➔ **中文还原**：`工作耗时: 6秒 v`
- 原版英文：`Exploring 1 file, 1 search` ➔ **中文还原**：`正在探索 1 个文件，1 次搜索`
- 原版英文：`Running 2 commands v` ➔ **中文还原**：`正在运行 2 个命令 v`

### 2. 126+ 个官方内置技能全中文说明
内置技能库（Skills）多达 700+ 条长篇使用指南全量人工校准翻译（包括 Android CLI、Chrome DevTools、BigQuery AI、Data Pipelines 等），技能用途一目了然，再也不用翻翻译软件。

### 3. 新版规划模式（Planning Mode）全覆盖
完整汉化 Antigravity 2.x 的核心规划功能：`拟定变更`、`验证计划`、`需用户审批`、`自动化测试`、`派生会话` 等，辅助 AI 做项目规划毫无阅读门槛。

### 4. 全栈深度覆盖，没有“漏网之鱼”
除了主窗口与侧边栏，全面渗透至：
- **首次启动向导**：新手引导窗口 100% 中文。
- **系统托盘与菜单**：任务栏托盘菜单、动态智能体运行计数、顶部原生菜单（文件/编辑/视图）全中文。
- **系统级弹窗**：退出确认对话框、更新检查弹窗全中文。

### 5. 绝对安全，100% 免疫代码误伤
采用严格的代码区旁路白名单机制。**绝不触碰** Monaco 代码编辑器、终端命令行输出、代码块以及您的聊天正文，仅精准翻译软件界面控制元素！

### 6. 彻底杜绝乱码白屏
所有翻译内容在打包期编译为标准纯 ASCII Unicode 序列，彻底解决 Windows 默认中文编码（GBK/CP936）导致的乱码或客户端白屏崩溃。

---

## 📋 真实汉化效果对照

| 界面模块 | 原版英文显示 | 汉化后效果 |
| :--- | :--- | :--- |
| **首屏新手向导** | `Welcome to the new Antigravity!` | `欢迎使用全新的 Antigravity！` |
| **AI 任务动态耗时** | `Worked for 12s v` | `工作耗时: 12秒 v` |
| **复合从句任务流** | `Exploring 3 files, running 2 commands` | `正在探索 3 个文件，正在运行 2 个命令` |
| **派生子智能体** | `AI Portrait Fidelity Auditor #1` | `AI人像保真度审计师 #1` |
| **规划模式审核** | `User Review Required` / `Verification Plan` | `需用户审批` / `验证计划` |
| **系统托盘右键** | `2 agents running` / `Quit` | `2 个智能体运行中` / `退出` |
| **退出二次确认** | `Confirm Quit` / `Cancel` / `Quit` | `确认退出` / `取消` / `退出` |

---

## 🔄 一键无损还原

安装时会自动备份官方原版文件（`app.asar.bak`）。任何时候想恢复英文原版，随时一键还原：
- **Windows**：双击运行文件夹内的 **`【双击还原原版】-restore.bat`**（亦兼容 `restore.bat` 或在 PowerShell 中执行 `restore.ps1`）。
- **macOS / Linux**：在终端运行 **`./restore.sh`**。

---

## ❓ 常见问题解答 (FAQ)

<details>
<summary><b>Q1: 软件后续更新了，汉化会失效吗？</b></summary>
官方推送大版本覆盖更新后，原版核心文件可能会被替换。遇到这种情况，只需<b>重新运行一次安装命令（或双击 <code>【双击安装汉化】-install.bat</code> / <code>install.bat</code>）</b>，几秒内即可重新注入汉化！
</details>

<details>
<summary><b>Q2: 会不会改坏我写的代码或影响终端命令？</b></summary>
<b>绝对不会！</b>汉化引擎内嵌严格的代码区隔离机制（包含 Monaco 代码编辑器、系统终端 xterm、Markdown 代码块 <code>pre/code</code> 以及输入区），代码文本原样放行，只汉化界面按钮与提示。
</details>

<details>
<summary><b>Q3: Windows 安装时报安全警告或权限错误怎么办？</b></summary>
请确保在安装前<b>彻底退出 Antigravity 软件</b>。若提示权限受限，右键点击 <code>【双击安装汉化】-install.bat</code>（或 <code>install.bat</code>）选择“以管理员身份运行”即可。
</details>

<details>
<summary><b>Q4: macOS 提示“应用已损坏，无法打开”？</b></summary>
我们的 <code>install.sh</code> 安装脚本已内置自动调用 <code>codesign</code> 对应用进行签名修复。如果依然提示，可以在 Mac 终端中运行：
<code>sudo xattr -rd com.apple.quarantine /Applications/Antigravity.app</code> 即可正常打开。
</details>

---

## 🛠️ 致开发者与极客（底层架构亮点）

对于关心底层实现的技术同学，本项目具备工业级工程设计：
- **纯流式内存注入**：Windows 下由 PowerShell 实时编译内嵌 C# 引擎，直接读取与追加 Asar 二进制偏移，无需耗时解包数十兆文件，安装耗时仅数百毫秒。
- **WeakMap 防重入调度**：DOM 监听引擎引入 WeakMap 极速防重入机制，页面元素翻译后 $O(1)$ 复杂度直接跳过，零 CPU 占用，打字与长对话流畅顺滑。
- **87 项全自动化测试**：集成 GitHub Actions CI 流水线，针对各种从句模式、符号嵌套及真机 Asar 模块进行 87 项用例自动化回归验证。

---

## 🤝 参与共建与反馈

- 发现有漏译、翻译不妥的词条？欢迎直接提交 [Issues](https://github.com/Myx998/antigravity-chinese/issues) 或发起 Pull Request。
- 词典文件均以模块化 JSON 形式存放于 `src/dictionary/` 目录下，结构清晰，修改极简。

## 📄 开源许可

本项目基于 [MIT License](LICENSE) 许可协议开源。
