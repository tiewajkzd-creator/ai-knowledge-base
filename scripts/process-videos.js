#!/usr/bin/env node
// 完整视频处理流程

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { analyzeWithLLM } = require('./llm-analyzer.js');

const QUEUE_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/queue`;

async function processVideo(uid, videoRef, index) {
  try {
    console.log(`\n📹 视频 ${index + 1}`);
    
    execSync(`agent-browser click @${videoRef}`);
    execSync('sleep 5');
    
    const url = execSync('agent-browser get url').toString().trim();
    const bvid = url.match(/BV[a-zA-Z0-9]+/)?.[0];
    
    execSync('agent-browser scroll down 1000');
    execSync('sleep 2');
    
    const pageText = execSync('agent-browser get text body').toString();
    const title = pageText.match(/LTX[^\n]{0,50}/)?.[0] || '未知';
    
    const analysis = await analyzeWithLLM(pageText, title, url);
    
    execSync('agent-browser back');
    execSync('sleep 2');
    
    return { 
      bvid, 
      url, 
      title, 
      ...analysis, 
      date: new Date().toISOString().split('T')[0] 
    };
    
  } catch (error) {
    console.error(`❌ ${error.message}`);
    return null;
  }
}

async function main() {
  const uid = '389291683';
  
  execSync(`agent-browser open "https://space.bilibili.com/${uid}/video"`);
  execSync('sleep 3');
  
  execSync('agent-browser snapshot -i > /tmp/space.txt');
  const snapshot = fs.readFileSync('/tmp/space.txt', 'utf8');
  
  const refs = [];
  const pattern = /link "[^"]*LTX[^"]*" \[ref=(e\d+)\]/g;
  let match;
  
  while ((match = pattern.exec(snapshot)) !== null) {
    refs.push(match[1]);
  }
  
  console.log(`找到 ${refs.length} 个视频`);
  
  const results = [];
  
  for (let i = 0; i < Math.min(2, refs.length); i++) {
    const video = await processVideo(uid, refs[i], i);
    if (video) {
      results.push(video);
      console.log(`✅ ${video.title}`);
    }
  }
  
  execSync('agent-browser close');
  
  fs.writeFileSync(
    path.join(QUEUE_DIR, `${uid}_processed.json`),
    JSON.stringify(results, null, 2)
  );
  
  console.log(`\n✅ 完成！已保存 ${results.length} 个视频`);
}

main().catch(console.error);
