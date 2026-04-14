#!/usr/bin/env node
// index.html生成器

const fs = require('fs');
const path = require('path');

const KB_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/ai-knowledge-base`;
const categories = ['AI绘画', 'AI编程', 'Agent系统', 'AI前沿', '个人成长'];

// 扫描所有Markdown文件
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
        file: file,
        date: dateMatch ? dateMatch[1] : '未知'
      });
    });
  });
  
  return articles.sort((a, b) => b.date.localeCompare(a.date));
}

const articles = scanArticles();
console.log(`找到 ${articles.length} 篇文章`);

// 按分类分组
const grouped = {};
categories.forEach(cat => grouped[cat] = []);
articles.forEach(a => grouped[a.category].push(a));

// 生成HTML
const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI大脑知识库</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, sans-serif; padding: 20px; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                  color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .category { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; }
        .category h2 { margin-bottom: 15px; color: #333; }
        .article { padding: 10px; border-bottom: 1px solid #eee; }
        .article:last-child { border: none; }
        .article a { color: #667eea; text-decoration: none; }
        .article a:hover { text-decoration: underline; }
        .date { color: #999; font-size: 0.9em; margin-left: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧠 AI大脑知识库</h1>
        <p>共 ${articles.length} 篇文章</p>
    </div>
${categories.map(cat => `
    <div class="category">
        <h2>${cat}</h2>
        ${grouped[cat].map(a => `
        <div class="article">
            <a href="${encodeURIComponent(cat)}/${encodeURIComponent(a.file)}">${a.title}</a>
            <span class="date">${a.date}</span>
        </div>`).join('')}
    </div>`).join('')}
</body>
</html>`;

fs.writeFileSync(path.join(KB_DIR, 'index.html'), html, 'utf8');
console.log('✅ index.html已生成');
