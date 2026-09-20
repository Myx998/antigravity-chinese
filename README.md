<div align="center">

# 🚀 Google Antigravity 深度汉化与本土化增强引擎
### *The Industrial-Grade Clean-Room Localization Engine for Google Antigravity*

[![CI Pipeline](https://github.com/myxge/antigravity-chinese/actions/workflows/ci.yml/badge.svg)](https://github.com/myxge/antigravity-chinese/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Clean-Room Compliant](https://img.shields.io/badge/DMCA-Clean--Room%20100%25-brightgreen.svg)](TERMS.md)
[![Encoding](https://img.shields.io/badge/Encoding-Pure%207--bit%20ASCII-orange.svg)](#3-编码管线杜绝-gbkcp936-乱码)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](#-一键极速安装)

**告别生硬机翻与界面夹生！专为新一代 AI 智能体开发平台 Google Antigravity 量身打造的工业级深度本土化方案。**

[✨ 核心亮点](#-核心亮点) • [⚡ 极速安装](#-一键极速安装) • [📊 降维对比](#-深度方案对比) • [🛠️ 架构设计](#-工业级工程架构) • [❓ 常见问题](#-常见问题-faq)

</div>

---

## 🌟 为什么需要深度汉化？

Google Antigravity 作为新一代端到端 AI Agent 编程环境，融合了大量的动态交互状态——包括**多任务复合从句**（`Exploring 1 file, 1 search`）、**子智能体动态派生**（`AI Portrait Fidelity Auditor`）、**细粒度毫秒级耗时监控**（`Worked for 6s v`、`Thought for 1s`）以及**动态实体状态矩阵**。

普通的静态词典替换或简单的浏览器翻译插件会导致：
- ❌ **动态组合从句失效**：一旦包含逗号或时态变化（如 `Exploring 6 files, running 4 commands`），传统插件直接抓瞎打回英文；
- ❌ **衍生角色名夹生**：社区扩展的子智能体名称（如 `Frontend Layout Optimizer L1`）无法识别；
- ❌ **Windows 编码灾难**：中文字符直接注入易导致 GBK / CP936 乱码乃至页面白屏崩溃；
- ❌ **版权合规雷区**：直接分发修改后的闭源官方 `preload.js` 面临严重的 DMCA 侵权下架风险。

**本项目采用 100% Clean-Room 洁净室架构，彻底解决上述所有工业级痛点！**

---

## 📊 深度方案对比

| 核心维度 | 传统静态替换 / 简单脚本 | 🚀 Antigravity 深度汉化引擎 |
| :--- | :--- | :--- |
| **合规性 (DMCA)** | ❌ 包含官方闭源 Preload，存在侵权下架风险 | ✅ **100% Clean-Room 洁净室隔离**，仅分发纯净 Payload |
| **动态复合从句** | ❌ 无法识别（如 `Exploring 1 file, 1 search` 原文裸露） | ✅ **多重从句语法树分析器**，自动解析顺接宾语与动作 |
| **智能体角色衍生** | ❌ 仅支持死记硬背的几个固定名称 | ✅ **子智能体构词法合成引擎**，支持任意领域修饰词与层级 |
| **时态与耗时追踪** | ❌ 动词时态与毫秒/秒/分混合显示异常 | ✅ **Action-Timer 耗时矩阵**（思考/工作/执行精细化支持） |
| **Windows 编码** | ❌ 极易在非 UTF-8 控制台发生 CP936 乱码白屏 | ✅ **自动化编译管线**，编译为纯 7-bit ASCII `\uXXXX` |
| **macOS 兼容性** | ❌ 修改 asar 后被 Gatekeeper 判定“应用损坏”闪退 | ✅ **自动化 Codesign 重签名管线**，开箱即用不弹警告 |
| **代码保护防串改** | ❌ 暴力替换可能误伤 Monaco 编辑器或终端代码 | ✅ **严格安全旁路过滤**，代码编辑区、终端、输入框 0 污染 |

---

## ⚡ 一键极速安装

无需繁琐的手动解包配置，提供全自动原生安装器（**支持免装 Node.js**）：

### 🪟 Windows 用户（推荐免装 Node）
1. [下载本仓库 Zip 压缩包](https://github.com/myxge/antigravity-chinese/archive/refs/heads/main.zip) 并解压。
2. 双击运行 **`install.bat`** 即可！（或在 PowerShell 中执行 `.\install.ps1`）
> *内置 UniversalAsarEngine，全自动查找路径、安全关闭进程、备份原版并注入。*

### 🍎 macOS 用户
打开终端，进入解压目录后运行：
```bash
chmod +x install.sh restore.sh
./install.sh
```
> *脚本内置 macOS 自动重签名（`codesign`），彻底杜绝系统提示“应用已损坏，应移至废纸篓”的闪退问题。*

### 🐧 Linux 用户
```bash
chmod +x install.sh restore.sh
./install.sh
```

---

## 🔄 一键恢复官方原版

安装器在首次运行时会自动创建官方原版备份（`app.asar.bak`）。若需无缝还原：
- **Windows**：双击运行 **`restore.bat`**（或执行 `.\restore.ps1`）
- **macOS / Linux**：终端运行 **`./restore.sh`**

---

## 🛠️ 工业级工程架构

```
antigravity-chinese/
├── .github/workflows/ci.yml       # 多平台（Ubuntu/Win/macOS）自动化 CI 回归测试
├── dist/
│   └── patch-payload.js          # 编译产物：纯 7-bit ASCII Unicode 独立自包含补丁
├── scripts/
│   ├── build.js                  # 编译管线：词典去重合并与非 ASCII 编码转译器
│   ├── test.js                   # 自动化测试套件（实战短语全覆盖）
│   └── inject.js                 # 跨平台通用 Asar 动态安全注入器
├── src/
│   ├── dictionary/               # 领域模块化词典（方便社区提 PR）
│   │   ├── actions.json          # 动作、动词、时态（153 项）
│   │   ├── sidebar.json          # 侧边栏、对话管理、历史记录（100 项）
│   │   ├── settings.json         # 偏好设置、模型配置、快捷键（165 项）
│   │   ├── subagents.json        # 智能体专有名词与词缀（86 项）
│   │   ├── tools.json            # 开发者工具、MCP 服务与终端（99 项）
│   │   └── common.json           # 常用按钮、弹窗与通用文案（753 项）
│   └── engine/
│       ├── constants.js          # 动词时态表、度量单位映射、实体状态定义
│       ├── synthesizer.js        # 通用子智能体角色构词法合成引擎
│       ├── matcher.js            # 复合从句、耗时追踪与正则模式匹配器
│       ├── dispatcher.js         # 主翻译分发器（快捷键与省略号兜底）
│       └── observer.js           # 严格安全旁路审查与 Shadow DOM 穿透监听
├── install.bat / install.ps1     # Windows 免装 Node 双击安装器
├── install.sh                    # macOS / Linux 安装器（含自动 Codesign）
├── restore.bat / restore.ps1     # Windows 一键还原
├── restore.sh                    # macOS / Linux 一键还原
├── TERMS.md                      # DMCA 洁净室架构与合规说明
└── LICENSE                       # MIT 开源协议
```

### 1. DMCA 100% 洁净室源码隔离
仓库源码（`src/`）只包含纯粹的中文翻译字典与开源引擎逻辑，**不包含 Google 任何专有二进制或官方闭源 preload 片段**。补丁仅在用户本地机器上由安装脚本动态读取本地文件并在尾部追加，完全符合开源分发与合规要求。

### 2. 子智能体通用构词法合成引擎
针对 Antigravity 动态派生的丰富子智能体角色，内置词根解构与形态合成算法：
- 输入 `AI Portrait Fidelity Auditor` ➔ 自动拆解为 `[AI] [人像] [保真度] [审计师]` ➔ 输出 `AI人像保真度审计师`
- 输入 `Database Schema Validator L2` ➔ 自动提取层级后缀 ➔ 输出 `数据库架构验证器 L2`
- 输入 `Frontend Layout Optimizer` ➔ 输出 `前端布局优化师`

### 3. 编码管线杜绝 GBK/CP936 乱码
通过 `scripts/build.js` 将所有中文字符在编译阶段自动转换为标准 ASCII `\uXXXX` 转义序列，彻底免疫 Windows 控制台编码差异。

---

## 🧪 本地开发与测试

本项目内置完善的自动化防回归测试套件，在提交代码或修改词典后可本地运行：

```bash
# 安装依赖（纯原生零外部依赖）
npm install

# 编译生成单文件补丁 dist/patch-payload.js
npm run build

# 运行全量 32 项自动化回归测试
npm test
```

测试覆盖实战高频短语（`Running 2 commands v`、`Exploring 1 file, 1 search`、`AI Portrait Fidelity Auditor`、耗时追踪、实体状态矩阵、安全旁路过滤等）。

---

## ❓ 常见问题 (FAQ)

<details>
<summary><b>Q1: 客户端后续收到官方更新后，汉化会失效吗？</b></summary>
官方推送全量更新后可能会覆盖 <code>app.asar</code>。此时只需重新双击 <code>install.bat</code>（或执行 <code>./install.sh</code>）即可一秒重新应用最新汉化！
</details>

<details>
<summary><b>Q2: 为什么选择修改 asar 而不是外部脚本注入？</b></summary>
Antigravity 基于 Electron 深度封装，窗口启用了严格的上下文隔离（Context Isolation）。直接在 preload 环节追加安全 Payload 是目前性能最高（0 内存损耗）、响应最快且最稳定的工业级方案。
</details>

<details>
<summary><b>Q3: 会不会影响我的代码或终端输出？</b></summary>
<b>绝对不会！</b>引擎内嵌严格的安全旁路白名单机制（<code>isBypassedElement</code>），任何处于 <code>Monaco Editor</code>、<code>xterm / terminal</code>、<code>code</code>、<code>pre</code>、输入框内部的字符一律原样放行，杜绝任何误伤代码的情况。
</details>

---

## 🤝 参与贡献

欢迎社区参与完善词典与优化翻译！
1. Fork 本工程并克隆到本地。
2. 词典按功能领域拆分存放在 `src/dictionary/` 中，请在对应的 JSON 文件中添加或修正键值对。
3. 运行 `npm run build && npm test` 确保编译通过且无测试断言失败。
4. 提交 Pull Request，CI 机器人将自动完成交叉验证。

---

## 📄 开源协议与声明

- 本项目基于 [MIT License](LICENSE) 许可协议开源。
- 更多版权与免责声明请参阅 [TERMS.md](TERMS.md)。
