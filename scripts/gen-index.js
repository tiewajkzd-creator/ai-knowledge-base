#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const KB_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/ai-knowledge-base`;
const categories = ['AI绘画', 'AI编程', 'Agent系统', 'AI前沿', '个人成长'];

function scanArticles() {
  const articles = [];
  categories.forEach(category => {
    const dir = path.join(KB_DIR, category);
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'README.md');
    files.forEach(file => {
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      const titleMatch = content.match(/^# (.+)/m);
      const dateMatch = content.match(/\*\*发布时间：\*\* (.+)/);
      articles.push({
        category, 
        title: titleMatch ? titleMatch[1] : file.replace('.md', ''),
        file, 
        date: dateMatch ? dateMatch[1] : '未知'
      });
    });
  });
  return articles.sort((a, b) => b.date.localeCompare(a.date));
}

const articles = scanArticles();
console.log(`扫描到 ${articles.length} 篇文章`);

// 读取原版HTML的样式部分
const template = fs.readFileSync(path.join(KB_DIR, 'index.html.backup'), 'utf8');
const styleMatch = template.match(/<style>[\s\S]*?<\/style>/);
const style = styleMatch ? styleMatch[0] : '';

// 生成文章卡片
const cards = articles.map(a => `
        <div class="article-card" onclick="window.open('${encodeURIComponent(a.category)}/${encodeURIComponent(a.file)}')">
            <div class="article-meta">
                <span class="category-tag">${a.category}</span>
                <span class="article-date">${a.date}</span>
            </div>
            <h3 class="article-title">${a.title}</h3>
        </div>`).join('');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI大脑知识库</title>
    ${style}
</head>
<body>
    <div class="header">
        <h1>🧠 AI大脑知识库</h1>
    </div>
    <div class="main">
        <div class="sidebar">
            <div class="nav-section">
                <div class="nav-title">板块</div>
                <div class="nav-item">🤖 Agent系统</div>
                <div class="nav-item">🎨 AI绘画</div>
                <div class="nav-item">💻 AI编程</div>
                <div class="nav-item">🔭 AI前沿</div>
                <div class="nav-item">📖 个人成长</div>
            </div>
        </div>
        <div class="content">
            <div class="stats-bar">
                <div class="stat">
                    <div class="stat-num">${articles.length}</div>
                    <div class="stat-label">总文章</div>
                </div>
            </div>
${cards}
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(KB_DIR, 'index.html'), html, 'utf8');
console.log('✅ 已生成index.html');

