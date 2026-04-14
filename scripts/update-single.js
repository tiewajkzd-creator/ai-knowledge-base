#!/usr/bin/env node
// 批量更新核心观点（手动提供JSON）

const fs = require('fs');
const path = require('path');

const KB_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/ai-knowledge-base`;

// 从命令行读取：标题关键词 "JSON数组"
const keyword = process.argv[2];
const keyPointsJson = process.argv[3];

if (!keyword || !keyPointsJson) {
  console.log('用法: node update-single.js 标题关键词 \'["观点1", "观点2"]\'');
  console.log('示例: node update-single.js "工作区优化" \'["观点1"]\'');
  process.exit(1);
}

const keyPoints = JSON.parse(keyPointsJson);

// 查找对应的文件
const categories = ['Agent系统', 'AI绘画', 'AI编程', 'AI前沿', '个人成长'];
let found = false;

for (const cat of categories) {
  const dir = path.join(KB_DIR, cat);
  if (!fs.existsSync(dir)) continue;
  
  const files = fs.readdirSync(dir);
  const file = files.find(f => f.includes(keyword));
  
  if (file) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const keyPointsText = keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n');
    content = content.replace(
      /## 核心观点\n\n[\s\S]*?\n\n---/,
      `## 核心观点\n\n${keyPointsText}\n\n---`
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 已更新: ${file}`);
    found = true;
    break;
  }
}

if (!found) {
  console.log(`❌ 未找到包含"${keyword}"的文章`);
}
