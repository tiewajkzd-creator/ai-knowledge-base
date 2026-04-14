#!/usr/bin/env node
// 视频内容处理器 - 提炼小结 + 评论分析

const fs = require('fs');
const { execSync } = require('child_process');

const QUEUE_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/queue`;
const KB_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/ai-knowledge-base`;

// 抓取单个视频详情
async function fetchVideoDetail(bvid) {
  console.log(`📹 处理视频: ${bvid}`);
  
  // 打开视频页
  execSync(`agent-browser open "https://www.bilibili.com/video/${bvid}"`);
  execSync('sleep 3');
  
  // 获取视频标题和简介
  const snapshot = execSync('agent-browser snapshot -i --json').toString();
  const title = JSON.parse(snapshot).find(e => e.role === 'heading')?.text || '';
  
  // 获取评论区
  execSync('agent-browser scroll down 1000');
  execSync('sleep 2');
  const comments = execSync('agent-browser get text body').toString();
  
  execSync('agent-browser close');
  
  return { title, comments };
}

// 生成内容小结（调用LLM）
function generateSummary(title, comments) {
  const prompt = `
视频标题：${title}

评论内容：
${comments.slice(0, 2000)}

请生成：
1. 视频核心内容小结（3-5条要点）
2. 评论总结报告（用户反馈/热门观点）
3. 质量评分（0-100）
`;

  // 这里简化处理，实际应调用sessions_send到主会话
  return {
    summary: '待LLM生成',
    score: 75
  };
}

// 主流程
async function main() {
  const videoFiles = fs.readdirSync(QUEUE_DIR).filter(f => f.endsWith('_videos.txt'));
  
  for (const file of videoFiles) {
    const videos = fs.readFileSync(`${QUEUE_DIR}/${file}`, 'utf8').split('\n').filter(Boolean);
    
    for (const video of videos.slice(0, 3)) { // 只处理前3个
      const bvid = video.match(/BV[a-zA-Z0-9]+/)?.[0];
      if (!bvid) continue;
      
      const detail = await fetchVideoDetail(bvid);
      const result = generateSummary(detail.title, detail.comments);
      
      console.log(`✅ ${detail.title} - 评分: ${result.score}`);
    }
  }
}

main().catch(console.error);
