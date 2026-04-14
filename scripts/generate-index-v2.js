#!/usr/bin/env node
// 生成保留原样式的index.html

const fs = require('fs');
const path = require('path');

const KB_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/ai-knowledge-base`;
const categories = ['AI绘画', 'AI编程', 'Agent系统', 'AI前沿', '个人成长'];

// 扫描文章
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
      const scoreMatch = content.match(/\*\*质量评分：\*\* (.+)/);
      articles.push({
        category, 
        title: titleMatch ? titleMatch[1] : file.replace('.md', ''),
        file, 
        date: dateMatch ? dateMatch[1] : '未知',
        score: scoreMatch ? scoreMatch[1] : '⭐⭐⭐'
      });
    });
  });
  return articles.sort((a, b) => b.date.localeCompare(a.date));
}

const articles = scanArticles();
const grouped = {};
categories.forEach(cat => grouped[cat] = articles.filter(a => a.category === cat));

// 生成文章卡片HTML
const articleCards = articles.map(a => `
        <div class="article-card" data-category="${a.category}" onclick="window.open('${encodeURIComponent(a.category)}/${encodeURIComponent(a.file)}')">
            <div class="article-meta">
                <span class="category-tag">${a.category}</span>
                <span class="article-date">${a.date}</span>
            </div>
            <h3 class="article-title">${a.title}</h3>
            <div class="article-footer">
                <span>${a.score}</span>
            </div>
        </div>`).join('');

// 生成侧边栏分类
const sidebarSections = categories.map(cat => `
        <div class="nav-section">
            <div class="nav-title">${cat}</div>
            ${grouped[cat].map(a => `<div class="nav-item" onclick="window.open('${encodeURIComponent(cat)}/${encodeURIComponent(a.file)}')">${a.title}</div>`).join('')}
        </div>`).join('');

