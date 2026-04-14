#!/usr/bin/env node
// 知识库写入器

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = `${process.env.HOME}/.openclaw/workspace-ai-brain`;
const KB_DIR = `${WORKSPACE}/ai-knowledge-base`;

function getSubCategory(category, title, keyPoints) {
  const text = `${title} ${keyPoints.join(' ')}`.toLowerCase();
  
  if (category === 'AI绘画') {
    // 优先级从高到低匹配
    if (text.match(/ltx|flux|sd|sdxl|stable.*diffusion|模型.*更新|新版本|v\d+\.\d+/)) 
      return '模型更新';
    if (text.match(/报错|错误|解决|问题|bug|修复|踩坑/)) 
      return '问题解决';
    if (text.match(/提示词|prompt|公式|模板|咒语/)) 
      return '提示词技巧';
    if (text.match(/测评|对比|实测|评测|vs|性能/)) 
      return '工具测评';
    if (text.match(/工作流|节点|comfyui|workflow|教程|使用|配置/)) 
      return '工作流教程';
    // 默认归类
    return '工作流教程';
  }
  
  if (category === 'Agent系统') {
    if (text.match(/a2a.*插件|skill.*开发|mcp.*开发|插件.*开发|api.*开发/)) 
      return '插件开发';
    if (text.match(/架构|跨.*gateway|跨.*机器|通信|协作|分布式/)) 
      return '架构设计';
    if (text.match(/实战|实测|部署|自动.*部署|案例|应用|项目/)) 
      return '实战案例';
    if (text.match(/教程|配置|安装|使用|入门|进阶|工作区/)) 
      return 'OpenClaw教程';
    return 'OpenClaw教程';
  }
  
  if (category === 'AI编程') {
    if (text.match(/cursor|windsurf|copilot|工具|ide/)) 
      return '工具对比';
    if (text.match(/代码生成|自动.*代码|ai.*编程/)) 
      return '代码生成';
    if (text.match(/项目|实战|案例|开发/)) 
      return '项目实战';
    if (text.match(/技巧|快捷键|效率|插件/)) 
      return '效率技巧';
    return '代码生成';
  }
  
  if (category === 'AI前沿') {
    if (text.match(/论文|paper|研究|arxiv/)) 
      return '学术研究';
    if (text.match(/新.*工具|产品|发布|上线/)) 
      return '新品速递';
    if (text.match(/趋势|预测|未来|展望/)) 
      return '行业趋势';
    return '新品速递';
  }
  
  if (category === '个人成长') {
    if (text.match(/学习|方法论|认知/)) 
      return '学习方法';
    if (text.match(/效率|时间|gtd|管理/)) 
      return '效率工具';
    if (text.match(/知识|笔记|pkm|obsidian/)) 
      return '知识管理';
    return '学习方法';
  }
  
  return '';
}

function writeToKnowledgeBase(summary) {
  const subCategory = getSubCategory(summary.category, summary.title, summary.keyPoints);
  const categoryDir = subCategory 
    ? path.join(KB_DIR, summary.category, subCategory)
    : path.join(KB_DIR, summary.category);
  
  // 确保分类目录存在
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }
  
  // 生成文件名（标题.md）
  const filename = `${summary.title.replace(/[\/\\:*?"<>|]/g, '-')}.md`;
  const filepath = path.join(categoryDir, filename);
  
  // 计算时效性
  const publishDate = new Date(summary.date);
  const now = new Date();
  const daysDiff = Math.floor((now - publishDate) / (1000 * 60 * 60 * 24));
  let freshness = '📚 经典教程';
  if (daysDiff <= 7) freshness = '🔥 本周热点';
  else if (daysDiff <= 30) freshness = '📅 本月精选';
  else if (daysDiff > 180) freshness = '⏰ 已过时';
  
  // 提取作者
  const author = summary.source.replace('B站 - ', '');
  
  // 生成Markdown内容
  const content = `# ${summary.title}

**来源：** ${summary.source}  
**作者：** ${author}  
**原文链接：** [点击查看](${summary.link})  
**发布时间：** ${summary.date}  
**时效性：** ${freshness}  
**质量评分：** ${summary.score || '⭐⭐⭐'}  
**成熟度：** 🌱 新鲜观点

---

## 核心观点

${summary.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

---

## 实用工具

${summary.tools.length > 0 ? summary.tools.map(t => `- ${t}`).join('\n') : '无'}

---

${summary.resources && summary.resources.length > 0 ? `## 资源链接

${summary.resources.map(r => `- **${r.type}：** ${r.url}`).join('\n')}

---

` : ''}${summary.comments && summary.comments.length > 0 ? `## 用户反馈

${summary.comments.map((c, i) => `**${i + 1}. ${c.author}** (👍${c.likes})  \n> ${c.content}`).join('\n\n')}

---

` : ''}## 标签

${summary.tags.map(t => `\`${t}\``).join(' ')}
`;
  
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`✅ 已写入: ${filepath}`);
  return filepath;
}

// 主函数
const summaryJson = process.argv[2];
if (!summaryJson) {
  console.log('用法: node kb-writer.js \'{"title":"...","source":"..."}\'');
  process.exit(1);
}

const summary = JSON.parse(summaryJson);
const filepath = writeToKnowledgeBase(summary);

// 更新index.html
console.log('🔄 更新index.html...');
execSync(`cd ${WORKSPACE} && node scripts/gen-index-final.js`, { stdio: 'inherit' });

// Git提交并推送
try {
  execSync(`cd ${KB_DIR} && git add . && git commit -m "新增: ${summary.title}" && git push`, 
    { stdio: 'inherit' });
  console.log('✅ 已推送到GitHub Pages');
} catch (error) {
  console.log('⚠️ Git推送失败，请手动推送');
}
