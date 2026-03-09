const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * 标签重构映射表
 * 将旧的、重复的标签映射到新的、统一的标签
 */
const TAG_MAPPING = {
  // CLI/命令行相关 → 统一为 "CLI"
  '命令行': 'CLI',
  'CLI 工具': 'CLI',
  'CLI / Terminal': 'CLI',
  '命令行工具': 'CLI',
  '终端工具': 'CLI',
  '工具': 'CLI',
  
  // 终端相关 → 统一为 "Terminal"
  '终端模拟器': 'Terminal',
  '终端复用': 'Terminal',
  '终端': 'Terminal',
  
  // 开发相关 → 保留 "开发"
  '开发工具': '开发',
  
  // AI 相关 → 统一为 "AI"
  'AI / LLM': 'AI',
  'AI 辅助工具': 'AI',
  'AI 工具': 'AI',
  '代码助手': 'AI',
  
  // Web 相关
  'Web 前端': 'Web',
  'Web': 'Web',
  'Browser': 'Web',
  'Web API': 'Web',
  'HTTP 客户端': 'Web',
  'WebAutomation': 'Web',
  
  // 库/框架相关
  '库 / SDK': 'Library',
  '框架': 'Framework',
  
  // 运维相关
  '运维': 'DevOps',
  
  // 自动化相关
  '自动化工具': 'Automation',
  '脚本工具': 'Automation',
  '脚本管理': 'Automation',
  
  // 编辑器/IDE
  'IDE / 编辑器': 'Editor',
  'IDE': 'Editor',
  '编辑器': 'Editor',
  
  // 图形相关
  '图形 / 可视化': 'Visualization',
  '3D / 图形': 'Visualization',
  '3D': 'Visualization',
  '动画引擎': 'Visualization',
  '游戏开发': 'Game',
  
  // 调试相关
  '调试': 'Debug',
  '调试工具': 'Debug',
  
  // 版本控制
  '版本控制': 'VersionControl',
  '版本管理': 'VersionControl',
  
  // 包管理
  '包管理器': 'PackageManager',
  
  // 学习相关
  '学习 / 入门': 'Learning',
  
  // 规范相关
  '规范 / 流程': 'Documentation',
  '文档/规范': 'Documentation',
  
  // 网络相关
  '网络工具': 'Network',
  '代理 / 服务': 'Network',
  
  // 构建相关
  '构建工具': 'Build',
  
  // 测试相关
  '测试': 'Test',
  
  // 重构相关
  '重构': 'Refactor',
  
  // 查询/搜索
  '查询/搜索': 'Search',
  '查询语法': 'Search',
  
  // 符号链接
  '符号链接': 'FileSystem',
  '硬链接': 'FileSystem',
  
  // 进程相关
  '进程管理': 'Process',
  
  // 多仓库管理
  '多仓库管理': 'Monorepo',
  
  // 知识管理
  '知识管理': 'Knowledge',
  'Obsidian': 'Knowledge',
  'Dataview': 'Knowledge',
  'DQL': 'Knowledge',
  '元数据': 'Knowledge',
  '插件': 'Plugin',
  
  // 浏览器扩展
  'Userscript': 'Extension',
  'Violentmonkey': 'Extension',
  'Tampermonkey': 'Extension',
  'Greasemonkey': 'Extension',
  'BrowserExtension': 'Extension',
  'DOM': 'Extension',
  
  // 结构化日志
  '结构化日志': 'Logging',
  
  // GIS/地图
  'GIS / 地图': 'GIS',
  '地理引擎': 'GIS',
  
  // 操作系统
  '操作系统': 'OS',
  'Linux': 'OS',
  'Windows': 'OS',
  'Android': 'OS',
  '跨平台': 'OS',
  
  // 技术栈标签（保留）
  'Node.js': 'Node.js',
  'JavaScript': 'JavaScript',
  'Python': 'Python',
  'Rust': 'Rust',
  'Kotlin': 'Kotlin',
  'Shell': 'Shell',
  'Lua 配置': 'Lua',
  
  // GUI 相关
  'GUI': 'GUI',
  
  // 多路复用/GPU 加速等特性 → 移除（过于具体）
  '多路复用': null, // null 表示移除
  'GPU 加速': null,
  
  // API 相关
  'API': 'API',
  
  // 正则表达式
  '正则表达式': 'Regex',
};

/**
 * 每个项目的额外标签补充（用于补充上下文）
 */
const PROJECT_EXTRA_TAGS = {
  'wezterm': ['Terminal', 'Rust', 'Lua', 'OS'],
  'tmux': ['Terminal', 'CLI'],
  'vim': ['Editor', 'CLI'],
  'git': ['VersionControl', 'CLI'],
  'docker': ['DevOps', 'CLI'],
  'curl': ['Network', 'CLI'],
  'pnpm': ['PackageManager', 'Node.js'],
  'npm': ['PackageManager', 'Node.js'],
  'vite': ['Build', 'JavaScript'],
  'vue-styled-components': ['Framework', 'JavaScript', 'CSS'],
  'threejs': ['Visualization', 'JavaScript', '3D'],
  'leaflet.js': ['GIS', 'JavaScript'],
  'cesium': ['GIS', 'JavaScript', '3D'],
  'pygame': ['Game', 'Python'],
  'kotlin': ['Kotlin', 'OS'],
  'jetpack-compose': ['Framework', 'Kotlin', 'Android'],
  'adb': ['Debug', 'Android'],
  'android-studio': ['Editor', 'Android'],
  'gradle': ['Build', 'Android'],
  'lerna': ['Monorepo', 'Node.js'],
  'pm2': ['Process', 'Node.js'],
  'pino': ['Logging', 'Node.js'],
  'obsidian-dataview': ['Knowledge', 'Plugin'],
  'violentmonkey': ['Extension', 'JavaScript'],
  'git': ['VersionControl', 'CLI', 'DevOps'],
};

/**
 * 标签映射函数
 */
function mapTags(oldTags) {
  const newTagsSet = new Set();
  
  oldTags.forEach(tag => {
    const mappedTag = TAG_MAPPING[tag];
    if (mappedTag) {
      newTagsSet.add(mappedTag);
    }
    // 如果 mappedTag 为 null，则移除该标签
    // 如果没有映射关系，保留原标签
    if (mappedTag === undefined) {
      newTagsSet.add(tag);
    }
  });
  
  return Array.from(newTagsSet);
}

/**
 * 处理单个 meta.yml 文件
 */
function processMetaYaml(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(content);
    
    if (!data.tags || !Array.isArray(data.tags)) {
      console.log(`⚠️  跳过 ${filePath}：无 tags 字段`);
      return false;
    }
    
    const oldTags = data.tags;
    let newTags = mapTags(oldTags);
    
    // 添加项目特定的额外标签
    const dirName = path.basename(path.dirname(filePath));
    if (PROJECT_EXTRA_TAGS[dirName]) {
      PROJECT_EXTRA_TAGS[dirName].forEach(tag => newTags.push(tag));
    }
    
    // 去重
    newTags = [...new Set(newTags)];
    
    // 排序：常用标签在前
    const priorityTags = ['CLI', 'Terminal', 'Web', 'AI', 'DevOps', 'Library', 'Framework'];
    newTags.sort((a, b) => {
      const aPriority = priorityTags.indexOf(a);
      const bPriority = priorityTags.indexOf(b);
      if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
      if (aPriority !== -1) return -1;
      if (bPriority !== -1) return 1;
      return a.localeCompare(b, 'zh-CN');
    });
    
    // 如果标签有变化，则更新文件
    if (JSON.stringify(oldTags.sort()) !== JSON.stringify(newTags.sort())) {
      data.tags = newTags;
      const newYaml = yaml.dump(data, {
        allowUnicode: true,
        lineWidth: -1,
        quotingType: '"',
        forceQuotes: false,
      });
      fs.writeFileSync(filePath, newYaml, 'utf8');
      console.log(`✅ 更新 ${dirName}: [${oldTags.join(', ')}] → [${newTags.join(', ')}]`);
      return true;
    } else {
      console.log(`⏭️  跳过 ${dirName}：标签无变化`);
      return false;
    }
  } catch (error) {
    console.error(`❌ 处理 ${filePath} 失败：`, error.message);
    return false;
  }
}

/**
 * 主函数
 */
function main() {
  const cheatsheetsDir = path.join(__dirname, '..', 'cheatsheets');
  let updatedCount = 0;
  let skippedCount = 0;
  
  console.log('🚀 开始标签重构...\n');
  
  const dirs = fs.readdirSync(cheatsheetsDir);
  
  dirs.forEach(dir => {
    // 跳过以 _ 开头的目录
    if (dir.startsWith('_')) {
      console.log(`⏭️  跳过目录 ${dir}`);
      return;
    }
    
    const metaPath = path.join(cheatsheetsDir, dir, 'meta.yml');
    if (fs.existsSync(metaPath)) {
      if (processMetaYaml(metaPath)) {
        updatedCount++;
      } else {
        skippedCount++;
      }
    } else {
      console.log(`⚠️  跳过 ${dir}：无 meta.yml`);
    }
  });
  
  console.log(`\n✅ 完成！更新：${updatedCount} 个，跳过：${skippedCount} 个`);
}

main();
