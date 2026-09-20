/**
 * Antigravity Chinese Localization - Pattern Matcher
 * 动态模式、复合从句、实体状态矩阵与耗时匹配引擎
 */

const {
  UNIT_MAP_CN,
  ACTION_TIMER_PREFIX,
  ACTION_MAP,
  OBJECT_MAP,
  ENTITY_MAP,
  STATE_MAP,
  PANE_BADGE_MAP
} = require('./constants');

const { DYNAMIC_TEMPLATES } = require('./templates');

// 格式化复合时间字符串，例如 "2m 30s" -> "2分钟 30秒", "6s" -> "6秒"
function formatDur(str) {
  if (!str) return '';
  return str
    .replace(/(\d+(?:\.\d+)?)\s*(?:years?|yrs?|y)\b/gi, '$1年')
    .replace(/(\d+(?:\.\d+)?)\s*(?:months?|mo)\b/gi, '$1个月')
    .replace(/(\d+(?:\.\d+)?)\s*(?:days?|d)\b/gi, '$1天')
    .replace(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b/gi, '$1小时')
    .replace(/(\d+(?:\.\d+)?)\s*(?:minutes?|mins?|m)\b/gi, '$1分钟')
    .replace(/(\d+(?:\.\d+)?)\s*(?:seconds?|secs?|s)\b/gi, '$1秒')
    .replace(/(\d+(?:\.\d+)?)\s*(?:milliseconds?|millisecs?|ms)\b/gi, '$1毫秒')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchDynamicPatterns(trimmed) {
  let m;

  // 0. 剥离末尾折叠/指示箭头符号（例如 "Worked for 6s v", "Running 2 commands v", "Explored 3 files >"）
  let symbolSuffix = '';
  const arrowMatch = trimmed.match(/^(.*?)([\s›»>ˇv^▼▶◀▲]+)$/);
  let coreText = trimmed;
  if (arrowMatch && arrowMatch[1].trim()) {
    coreText = arrowMatch[1].trim();
    symbolSuffix = arrowMatch[2];
  }

  // 1. 耗时动作矩阵（例如 "Worked for 6s", "Thought for 1s", "Ran for 2s", "Running for 5m"）
  if ((m = coreText.match(/^(worked\s+for|working\s+for|thought\s+for|thinking\s+for|ran\s+for|running\s+for|waited\s+for|waiting\s+for|took)\s+(.+)$/i))) {
    const key = m[1].toLowerCase().replace(/\s+/g, ' ');
    const pfx = ACTION_TIMER_PREFIX[key] || '耗时: ';
    return `${pfx}${formatDur(m[2])}${symbolSuffix}`;
  }

  // 2. 单操作-对象匹配（例如 "Exploring 1 file", "Running 2 commands"）
  const singleActionMatch = coreText.match(/^([a-zA-Z]+)\s+(\d+)\s+([a-zA-Z]+)$/i);
  if (singleActionMatch) {
    const act = ACTION_MAP[singleActionMatch[1].toLowerCase()];
    const obj = OBJECT_MAP[singleActionMatch[3].toLowerCase()];
    if (act && obj) {
      return `${act} ${singleActionMatch[2]} ${obj}${symbolSuffix}`;
    }
  }

  // 3. 复合逗号分割从句引擎（例如 "Exploring 1 file, 1 search" 或 "Exploring 6 files, running 4 commands"）
  if (coreText.includes(',')) {
    const parts = coreText.split(',').map(s => s.trim());
    const transParts = [];
    let allOk = true;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      // 3.1 完整 [Action] [Count] [Obj] 结构
      const mFull = part.match(/^([a-zA-Z]+)\s+(\d+)\s+([a-zA-Z]+)$/i);
      if (mFull) {
        const act = ACTION_MAP[mFull[1].toLowerCase()];
        const obj = OBJECT_MAP[mFull[3].toLowerCase()];
        if (act && obj) {
          transParts.push(`${act} ${mFull[2]} ${obj}`);
          continue;
        }
      }

      // 3.2 顺接简写 [Count] [Obj] 结构（继承前文动作主语）
      const mCountObj = part.match(/^(\d+)\s+([a-zA-Z]+)$/i);
      if (mCountObj) {
        const obj = OBJECT_MAP[mCountObj[2].toLowerCase()];
        if (obj) {
          transParts.push(`${mCountObj[1]} ${obj}`);
          continue;
        }
      }

      allOk = false;
      break;
    }

    if (allOk && transParts.length > 0) {
      return transParts.join('，') + symbolSuffix;
    }
  }

  // 4. 相对时间匹配
  if (/^just\s+now$/i.test(trimmed)) return '刚刚';
  if (/^a\s+few\s+seconds\s+ago$/i.test(trimmed)) return '几秒前';
  if (/^a\s+minute\s+ago$/i.test(trimmed)) return '1分钟前';
  if (/^an\s+hour\s+ago$/i.test(trimmed)) return '1小时前';
  if (/^a\s+day\s+ago$/i.test(trimmed)) return '1天前';
  if (/^today$/i.test(trimmed)) return '今天';
  if (/^yesterday$/i.test(trimmed)) return '昨天';

  if (trimmed.startsWith('Today ')) return trimmed.replace('Today ', '今天 ');
  if (trimmed.startsWith('Yesterday ')) return trimmed.replace('Yesterday ', '昨天 ');

  // 简略相对时间戳（如 10d, 5m, 1mo, 2h, 30s, 1y）
  if ((m = trimmed.match(/^(\d+)\s*(mo|[dmhsy])(?:\s+ago)?$/i))) {
    const unit = m[2].toLowerCase();
    const cn = UNIT_MAP_CN[unit];
    if (cn) return `${m[1]}${cn}`;
  }

  // 完整相对时间戳（如 5 minutes ago, 2 days ago, 1 month ago）
  if ((m = trimmed.match(/^(\d+)\s*(months?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?|years?|yrs?)\s+ago$/i))) {
    const unit = m[2].toLowerCase();
    const cn = UNIT_MAP_CN[unit];
    if (cn) return `${m[1]}${cn}`;
  }

  // 5. 动态面板徽标与工作区计数器（例如 "Subagents 2", "Files Changed 3"）
  if ((m = trimmed.match(/^(Subagents|Files Changed|Artifacts|Uploads|Background Tasks|MCP Servers|Skills)\s+(\d+)$/i))) {
    const label = PANE_BADGE_MAP[m[1].toLowerCase()] || m[1];
    return `${label} ${m[2]}`;
  }

  // 6. 文件改动计数器
  if ((m = trimmed.match(/^(\d+)\s+files?\s+changed$/i))) return `${m[1]} 个文件已修改`;
  if ((m = trimmed.match(/^(\d+)\s+files?\s+modified$/i))) return `${m[1]} 个文件已修改`;
  if ((m = trimmed.match(/^(\d+)\s+files?\s+added$/i))) return `${m[1]} 个文件已添加`;
  if ((m = trimmed.match(/^(\d+)\s+files?\s+deleted$/i))) return `${m[1]} 个文件已删除`;
  if ((m = trimmed.match(/^(\d+)\s+files?$/i))) return `${m[1]} 个文件`;

  // 7. 通用实体-状态矩阵引擎 (Universal Entity-State Matrix Engine)
  // 规则 1: <Count> <Entity> <State>（例如 "1 task running", "2 commands failed"）
  if ((m = trimmed.match(/^(\d+)\s+([a-zA-Z]+)\s+([a-zA-Z]+)$/i))) {
    const entity = ENTITY_MAP[m[2].toLowerCase()];
    const state = STATE_MAP[m[3].toLowerCase()];
    if (entity && state) {
      if (m[3].toLowerCase() === 'selected') {
        return `已选 ${m[1]} ${entity}`;
      }
      return `${m[1]} ${entity}${state}`;
    }
  }

  // 规则 2: No <Entity> <State>（例如 "No tasks running"）
  if ((m = trimmed.match(/^(?:no|0)\s+([a-zA-Z]+)\s+([a-zA-Z]+)$/i))) {
    const entity = ENTITY_MAP[m[1].toLowerCase()];
    const state = STATE_MAP[m[2].toLowerCase()];
    if (entity && state) {
      const noun = entity.replace(/^[^\s]*?[个条处项]/, '');
      return `暂无${state}的${noun || entity}`;
    }
  }

  // 规则 3: All <Entity> <State>（例如 "All tasks completed"）
  if ((m = trimmed.match(/^all\s+([a-zA-Z]+)\s+([a-zA-Z]+)$/i))) {
    const entity = ENTITY_MAP[m[1].toLowerCase()];
    const state = STATE_MAP[m[2].toLowerCase()];
    if (entity && state) {
      const noun = entity.replace(/^[^\s]*?[个条处项]/, '');
      return `全部${noun || entity}${state}`;
    }
  }

  // 规则 4: <Count> <Entity>（例如 "5 tasks", "1 error", "3 items selected"）
  if ((m = trimmed.match(/^(\d+)\s+selected$/i))) return `已选 ${m[1]} 项`;
  if ((m = trimmed.match(/^(\d+)\s+([a-zA-Z]+)$/i))) {
    const entity = ENTITY_MAP[m[2].toLowerCase()];
    if (entity) {
      return `${m[1]} ${entity}`;
    }
  }

  // 8. 动态正则模板遍历匹配
  for (let i = 0; i < DYNAMIC_TEMPLATES.length; i++) {
    const tmpl = DYNAMIC_TEMPLATES[i];
    if ((m = trimmed.match(tmpl.regex))) {
      return tmpl.format(m);
    }
  }

  return null;
}

module.exports = {
  formatDur,
  matchDynamicPatterns
};
