// 自然语言指令解析
const { markReviewed } = require('./reviewEngine');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data.json');

function loadData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 解析自然语言指令
function parseCommand(text) {
  text = text.trim();
  
  // 已看/已复习
  if (/^已看\s*(\d+)/.test(text) || /^已复习\s*(\d+)/.test(text)) {
    const match = text.match(/\d+/);
    return { action: 'reviewed', index: parseInt(match[0]) - 1 };
  }
  
  // 推迟N天
  if (/推迟\s*(\d+)\s*天/.test(text)) {
    const match = text.match(/\d+/);
    return { action: 'postpone', days: parseInt(match[0]) };
  }
  
  // 归档
  if (/归档|已掌握/.test(text)) {
    return { action: 'archive' };
  }
  
  // 添加标签
  if (/添加标签\s+(.+)/.test(text)) {
    const match = text.match(/添加标签\s+(.+)/);
    return { action: 'addTag', tag: match[1].trim() };
  }
  
  return null;
}

module.exports = { parseCommand };
