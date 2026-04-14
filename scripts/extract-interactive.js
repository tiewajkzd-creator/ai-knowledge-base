#!/usr/bin/env node
// 方案2：交互式提取核心观点

const fs = require('fs');
const path = require('path');

const file = process.argv[2];
if (!file) {
  console.log('用法: node extract-interactive.js <result.json>');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const content = data.content || data.transcript || '';

console.log('='.repeat(80));
console.log('📹 视频标题:', data.title);
console.log('📝 内容长度:', content.length, '字');
console.log('='.repeat(80));
console.log('\n内容预览（前2000字）:\n');
console.log(content.slice(0, 2000));
console.log('\n' + '='.repeat(80));
console.log('\n👉 请AI提取3-10个核心观点（每个30-50字），返回JSON数组格式');
console.log('👉 格式: ["观点1", "观点2", ...]\n');
