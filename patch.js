const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// 1. Update common.json
const commonPath = path.join(srcDir, 'dictionary', 'common.json');
let common = JSON.parse(fs.readFileSync(commonPath, 'utf8'));
const additions = {
  "Security Notice & Data Use": "安全须知与数据使用",
  "AI coding agents are known to have certain security limitations. Users should be aware of potential risks, including data exfiltration and possible code execution. Avoid processing highly sensitive data and verify all the actions taken by the agent.": "AI 编程智能体存在某些安全限制。用户应注意潜在风险，包括数据外泄和可能的代码执行。避免处理高度敏感的数据，并验证智能体执行的所有操作。",
  "Yes, I agree to help improve Antigravity by allowing Google to collect and use my Interactions data, subject to the ... and Google Privacy Policy. I understand I can choose to opt out later whenever I want via my settings.": "是的，我同意允许 Google 收集并使用我的交互数据以帮助改进 Antigravity，受制于 ... 和 Google 隐私权政策。我了解我可以随时通过设置选择退出。",
  "Previous": "上一步",
  "show": "显示",
  "Show": "显示",
  "No Project": "无项目",
  "New Project": "新建项目",
  "Quick Start": "快速开始",
  "Select Project Ctrl+;": "选择项目 Ctrl+;",
  "Select Project": "选择项目",
  "Send message Enter": "发送消息 Enter",
  "Send message": "发送消息",
  "(Main Agent)": "(主智能体)",
  "Thinking...": "思考中...",
  "Generating...": "生成中...",
  "Analyzing...": "分析中...",
  "Advanced Settings": "高级设置"
};
Object.assign(common, additions);
fs.writeFileSync(commonPath, JSON.stringify(common, null, 2), 'utf8');

// 2. Update templates.js
const templatesPath = path.join(srcDir, 'engine', 'templates.js');
let templates = fs.readFileSync(templatesPath, 'utf8');
const newTemplate = "  { regex: /^You have used some of your weekly limit, it will fully refresh in (.+)$/i, format: (m) => `您已使用部分周度额度，它将在 ${m[1].replace(/days?/i, '天').replace(/hours?/i, '小时').replace(/minutes?/i, '分钟').replace(/,/g, '')} 后完全刷新` },\n";

if (!templates.includes('You have used some of your weekly limit')) {
  templates = templates.replace('const DYNAMIC_TEMPLATES = [', 'const DYNAMIC_TEMPLATES = [\n' + newTemplate);
  fs.writeFileSync(templatesPath, templates, 'utf8');
}

console.log('Update complete.');
