#!/usr/bin/env node
// 视频列表解析器 - 简化版

const fs = require('fs');
const path = require('path');

const QUEUE_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/queue`;

// 解析视频信息
function parseVideos(rawText) {
  const videos = [];
  
  // 按行分割，找包含时长的行
  const lines = rawText.split(/\n/);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 匹配时长格式 XX:XX
    if (/\d{2}:\d{2}/.test(line)) {
      // 提取标题（在"稍后再看"之后）
      const titleMatch = line.match(/稍后再看(.+?)(\d{2}-\d{2})/);
      if (titleMatch) {
        const title = titleMatch[1].trim();
        const date = titleMatch[2];
        const duration = line.match(/(\d{2}:\d{2})/)[1];
        
        videos.push({ title, duration, date });
      }
    }
  }
  
  return videos;
}

// 主流程
const files = fs.readdirSync(QUEUE_DIR).filter(f => f.endsWith('_raw.txt'));

for (const file of files) {
  const uid = file.replace('_raw.txt', '');
  const rawText = fs.readFileSync(path.join(QUEUE_DIR, file), 'utf8');
  
  const videos = parseVideos(rawText);
  
  console.log(`\n📹 UID: ${uid} - 找到 ${videos.length} 个视频`);
  
  videos.slice(0, 5).forEach((v, i) => {
    console.log(`${i+1}. ${v.title} (${v.duration}) - ${v.date}`);
  });
  
  // 保存
  fs.writeFileSync(
    path.join(QUEUE_DIR, `${uid}_parsed.json`),
    JSON.stringify(videos, null, 2)
  );
}

console.log('\n✅ 解析完成！');
