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

function addItem(category, item) {
  const data = loadData();
  
  if (!data.categories[category]) {
    data.categories[category] = [];
  }
  
  data.categories[category].unshift({
    title: item.title,
    source: item.source,
    date: new Date().toISOString().split('T')[0],
    url: item.url || '',
    summary: item.summary || ''
  });
  
  data.total++;
  data.today++;
  data.week++;
  
  saveData(data);
  console.log(`✅ 已添加到 ${category}: ${item.title}`);
}

const args = process.argv.slice(2);
if (args[0] === 'add') {
  const category = args[1];
  const title = args[2];
  const source = args[3] || '手动添加';
  const url = args[4] || '';
  const summary = args[5] || '';
  
  addItem(category, { title, source, url, summary });
} else {
  console.log('用法: node update.js add <分类> <标题> [来源] [URL] [摘要]');
}
