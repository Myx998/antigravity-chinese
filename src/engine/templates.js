/**
 * Antigravity Chinese Localization - Dynamic Templates
 * 动态正则匹配模板表
 */

function formatLimitDuration(str) {
  if (!str) return '';
  return str
    .replace(/[.,;!?]+$/g, '')
    .replace(/\bmonths?\b/gi, '个月')
    .replace(/\bweeks?\b/gi, '周')
    .replace(/\bdays?\b/gi, '天')
    .replace(/\bhours?\b/gi, '小时')
    .replace(/\bminutes?\b/gi, '分钟')
    .replace(/\bseconds?\b/gi, '秒')
    .replace(/,/g, ' ')
    .replace(/\band\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatLimitName(name) {
  if (!name) return '额度';
  const clean = name.replace(/^(?:your|the|a)\s+/i, '').trim();
  const n = clean.toLowerCase();
  if (n === '5-hour limit' || n === '5-hour' || n === 'five-hour limit' || n === 'five hour limit') return '5小时额度';
  if (n === 'weekly limit' || n === 'weekly') return '周度额度';
  if (n === 'daily limit' || n === 'daily') return '每日额度';
  if (n === 'hourly limit' || n === 'hourly') return '每小时额度';
  if (n === 'monthly limit' || n === 'monthly') return '月度额度';
  const m = n.match(/^(\d+)-hour(?:\s+limit)?$/);
  if (m) return `${m[1]}小时额度`;
  const md = n.match(/^(\d+)-day(?:\s+limit)?$/);
  if (md) return `${md[1]}天额度`;
  const mw = n.match(/^(\d+)-week(?:\s+limit)?$/);
  if (mw) return `${mw[1]}周额度`;
  return clean.replace(/\blimit\b/i, '额度').trim();
}

const DYNAMIC_TEMPLATES = [
  // 1. 配额与限额动态时间刷新模板
  // 1.1 复合完整句（hit + so the ... does not apply + refresh + [credits]）
  {
    regex: /^You have (?:hit|reached|exceeded|used up) your (.+? limit), so (?:the )?(.+? limit) does not currently apply[.,;]\s+(?:Your (?:.+? limit)|It) will (fully )?refresh in (.+?)\.?(?:\s+(If on a supported paid plan, you can use AI credits in the interim\.?))?$/i,
    format: (m) => `您已达到${formatLimitName(m[1])}，因此${formatLimitName(m[2])}当前不适用。您的${formatLimitName(m[1])}将在 ${formatLimitDuration(m[4])} 后${m[3] ? '完全' : ''}刷新${m[5] ? '。若使用的是支持的付费计划，期间可使用 AI 信用点。' : ''}`
  },
  // 1.2 复合中句（hit + refresh + [credits]）
  {
    regex: /^You have (?:hit|reached|exceeded|used up) your (.+? limit)[.,;]\s+(?:it|your (?:.+? limit)) will (fully )?refresh in (.+?)\.?(?:\s+(If on a supported paid plan, you can use AI credits in the interim\.?))?$/i,
    format: (m) => `您已达到${formatLimitName(m[1])}，将在 ${formatLimitDuration(m[3])} 后${m[2] ? '完全' : ''}刷新${m[4] ? '。若使用的是支持的付费计划，期间可使用 AI 信用点。' : ''}`
  },
  // 1.3 used some of 复合句
  {
    regex: /^You have used some of your (.+? limit)[.,;]\s+it will (fully )?refresh in (.+?)\.?$/i,
    format: (m) => `您已使用部分${formatLimitName(m[1])}，将在 ${formatLimitDuration(m[3])} 后${m[2] ? '完全' : ''}刷新`
  },
  // 1.4 独立 refresh 句（带或不带 credits）
  {
    regex: /^Your (.+? limit) will (fully )?refresh in (.+?)\.?(?:\s+(If on a supported paid plan, you can use AI credits in the interim\.?))?$/i,
    format: (m) => `您的${formatLimitName(m[1])}将在 ${formatLimitDuration(m[3])} 后${m[2] ? '完全' : ''}刷新${m[4] ? '。若使用的是支持的付费计划，期间可使用 AI 信用点。' : ''}`
  },
  // 1.5 独立 hit 句带 not apply（分拆节点场景）
  {
    regex: /^You have (?:hit|reached|exceeded|used up) your (.+? limit), so (?:the )?(.+? limit) does not currently apply\.?$/i,
    format: (m) => `您已达到${formatLimitName(m[1])}，因此${formatLimitName(m[2])}当前不适用。`
  },
  // 1.6 独立 hit 句
  {
    regex: /^You have (?:hit|reached|exceeded|used up) your (.+? limit)\.?$/i,
    format: (m) => `您已达到${formatLimitName(m[1])}。`
  },
  // 1.7 独立 used some of 句
  {
    regex: /^You have used some of your (.+? limit)\.?$/i,
    format: (m) => `您已使用部分${formatLimitName(m[1])}。`
  },
  // 1.8 独立 not apply 句
  {
    regex: /^(?:so )?(?:the )?(.+? limit) does not currently apply\.?$/i,
    format: (m) => `因此${formatLimitName(m[1])}当前不适用。`
  },
  // 1.9 独立 credits 提示句
  {
    regex: /^If on a supported paid plan, you can use AI credits in the interim\.?$/i,
    format: () => `若使用的是支持的付费计划，期间可使用 AI 信用点。`
  },

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
  DYNAMIC_TEMPLATES,
  formatLimitDuration,
  formatLimitName
};
