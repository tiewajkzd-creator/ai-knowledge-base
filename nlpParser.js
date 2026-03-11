#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function parseCommand(text, category, index) {
  const data = loadData();
  const item = data.categories[category][index];
  
  // 推迟N天
  if (/推迟(\d+)天/.test(text)) {
    const days = parseInt(text.match(/推迟(\d+)天/)[1]);
    const nextDate = new Date(item.nextReviewAt);
    nextDate.setDate(nextDate.getDate() + days);
    item.nextReviewAt = nextDate.toISOString().split('T')[0];
    saveData(data);
    return `✅ 已推迟 ${days} 天，下次复习：${item.nextReviewAt}`;
  }
  
  // 归档
  if (/归档|已掌握|已看完/.test(text)) {
    item.status = 'archived';
    saveData(data);
    return `✅ 已归档：${item.title}`;
  }
  
  // 添加标签
  if (/添加标签\s+(.+)/.test(text)) {
    const tag = text.match(/添加标签\s+(.+)/)[1].trim();
    if (!item.tags) item.tags = [];
    if (!item.tags.includes(tag)) {
      item.tags.push(tag);
      saveData(data);
      return `✅ 已添加标签：${tag}`;
    }
    return `⚠️ 标签已存在：${tag}`;
  }
  
  // 标记为已回顾
  if (/已回顾|已看|看完了/.test(text)) {
    const reviewEngine = require('./reviewEngine');
    const updated = reviewEngine.markReviewed(category, index);
    return `✅ 已标记回顾\n复习次数：${updated.reviewCount}\n下次复习：${updated.nextReviewAt}\n成熟度：${updated.maturity}`;
  }
  
  return '❌ 无法识别指令';
}

module.exports = { parseCommand };

if (require.main === module) {
  const [,, text, category, index] = process.argv;
  if (!text || !category || index === undefined) {
    console.log('用法: node nlpParser.js "指令" "分类" 索引');
    console.log('示例: node nlpParser.js "已回顾" "AI绘画" 0');
    process.exit(1);
  }
  console.log(parseCommand(text, category, parseInt(index)));
}
