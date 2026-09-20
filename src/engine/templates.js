/**
 * Antigravity Chinese Localization - Dynamic Templates
 * 动态正则匹配模板表
 */

const DYNAMIC_TEMPLATES = [
  { regex: /^You have used some of your weekly limit, it will fully refresh in (.+)$/i, format: (m) => `您已使用部分周度额度，它将在 ${m[1].replace(/days?/i, '天').replace(/hours?/i, '小时').replace(/minutes?/i, '分钟').replace(/,/g, '')} 后完全刷新` },

  // 智能体角色与层级
  {
    regex: /^(Deep Investigator|Technical Feasibility Investigator|Codebase Researcher|Database Debugger|Code Reviewer|Bug Fixer)\s+(L\d+|Worker\s+\d+|#\d+)$/i,
    format: (m) => {
      const roleMap = {
        'deep investigator': '深度调研员',
        'technical feasibility investigator': '技术可行性分析师',
        'codebase researcher': '代码库调研员',
        'database debugger': '数据库调试专家',
        'code reviewer': '代码审查专家',
        'bug fixer': '缺陷修复专家'
      };
      const r = roleMap[m[1].toLowerCase()] || m[1];
      return `${r} ${m[2]}`;
    }
  },
  { regex: /^Send\s+feedback\s+as\s+(.+)$/i, format: (m) => `以 ${m[1]} 的身份发送反馈` },
  { regex: /^Learn\s+more\s+about\s+(.+)$/i, format: (m) => `了解关于 ${m[1]} 的更多信息` },
  { regex: /^Open\s+(.+)\s+Preferences$/i, format: (m) => `打开 ${m[1]} 偏好设置` },
  { regex: /^Open\s+(.+)\s+Settings$/i, format: (m) => `打开 ${m[1]} 设置` },
  { regex: /^Configure\s+(.+)$/i, format: (m) => `配置 ${m[1]}` },
  { regex: /^Manage\s+(.+)$/i, format: (m) => `管理 ${m[1]}` },
  { regex: /^Enable\s+(.+)$/i, format: (m) => `启用 ${m[1]}` },
  { regex: /^Disable\s+(.+)$/i, format: (m) => `禁用 ${m[1]}` },
  { regex: /^Choose\s+a\s+predefined\s+(.+)\s+for\s+the\s+agent\.(.*)$/i, format: (m) => `为智能体选择预设的 ${m[1]}。${m[2]}` },
  { regex: /^Scan\s+the\s+code\s+to\s+(.+)$/i, format: (m) => `扫描二维码以 ${m[1]}` },
  { regex: /^Created\s+(\d+)\s+files?$/i, format: (m) => `已创建 ${m[1]} 个文件` },
  { regex: /^Edited\s+(\d+)\s+files?$/i, format: (m) => `已编辑 ${m[1]} 个文件` },
  { regex: /^Read\s+(\d+)\s+files?$/i, format: (m) => `已读取 ${m[1]} 个文件` },
  { regex: /^Searched\s+(\d+)\s+files?$/i, format: (m) => `已搜索 ${m[1]} 个文件` },
  { regex: /^Found\s+(\d+)\s+results?$/i, format: (m) => `找到 ${m[1]} 个结果` },
  { regex: /^Found\s+(\d+)\s+files?$/i, format: (m) => `找到 ${m[1]} 个文件` },
  { regex: /^Found\s+(\d+)\s+matches?$/i, format: (m) => `找到 ${m[1]} 个匹配项` },
  { regex: /^Sent\s+message\s+to\s+(.+)$/i, format: (m) => `已发送消息给 ${m[1]}` },
  { regex: /^Received\s+message\s+from\s+(.+)$/i, format: (m) => `收到来自 ${m[1]} 的消息` },
  { regex: /^Waiting\s+for\s+(.+)$/i, format: (m) => `等待 ${m[1]}` },
  { regex: /^Blocked\s+by\s+(.+)$/i, format: (m) => `被 ${m[1]} 阻塞` },
  { regex: /^(\d+)\s+of\s+(\d+)\s+completed$/i, format: (m) => `${m[1]}/${m[2]} 已完成` },
  { regex: /^Step\s+(\d+)\s+of\s+(\d+)$/i, format: (m) => `步骤 ${m[1]}/${m[2]}` },
  { regex: /^Spawned\s+(\d+)\s+subagents?$/i, format: (m) => `已生成 ${m[1]} 个子智能体` },
  { regex: /^Invoked\s+(\d+)\s+subagents?$/i, format: (m) => `已调用 ${m[1]} 个子智能体` },
  { regex: /^Viewing\s+(.+)$/i, format: (m) => `正在查看 ${m[1]}` },
  { regex: /^Editing\s+(.+)$/i, format: (m) => `正在编辑 ${m[1]}` },
  { regex: /^Creating\s+(.+)$/i, format: (m) => `正在创建 ${m[1]}` },
  { regex: /^Reading\s+(.+)$/i, format: (m) => `正在读取 ${m[1]}` },
  { regex: /^Writing\s+(.+)$/i, format: (m) => `正在写入 ${m[1]}` },
  { regex: /^Searching\s+(.+)$/i, format: (m) => `正在搜索 ${m[1]}` },
  { regex: /^Analyzing\s+(.+)$/i, format: (m) => `正在分析 ${m[1]}` },
  { regex: /^Fetching\s+(.+)$/i, format: (m) => `正在获取 ${m[1]}` },
  { regex: /^Generating\s+(.+)$/i, format: (m) => `正在生成 ${m[1]}` },
  { regex: /^Scheduling\s+(.+)$/i, format: (m) => `正在调度 ${m[1]}` },
  { regex: /^Invoking\s+(.+)$/i, format: (m) => `正在调用 ${m[1]}` },
  { regex: /^Launching\s+(.+)$/i, format: (m) => `正在启动 ${m[1]}` },
  { regex: /^Listing\s+(.+)$/i, format: (m) => `正在列出 ${m[1]}` },
  { regex: /^Navigating\s+(.+)$/i, format: (m) => `正在导航 ${m[1]}` },
  { regex: /^Defining\s+(.+)$/i, format: (m) => `正在定义 ${m[1]}` },
  { regex: /^Spawning\s+(.+)$/i, format: (m) => `正在生成 ${m[1]}` },
  { regex: /^Sending\s+(.+)$/i, format: (m) => `正在发送 ${m[1]}` },
  { regex: /^Calling\s+(.+)$/i, format: (m) => `正在调用 ${m[1]}` },
  { regex: /^Replacing\s+(.+)$/i, format: (m) => `正在替换 ${m[1]}` },
  { regex: /^Killing\s+(.+)$/i, format: (m) => `正在终止 ${m[1]}` },
  { regex: /^Setting\s+(.+)$/i, format: (m) => `正在设置 ${m[1]}` },
  { regex: /^Signed\s+in\s+as\s+(.+)$/i, format: (m) => `已登录为 ${m[1]}` }
];

module.exports = {
  DYNAMIC_TEMPLATES
};
