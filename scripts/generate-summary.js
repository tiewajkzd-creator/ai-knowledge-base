#!/usr/bin/env node
// 内容小结生成器 - 调用LLM生成摘要

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const QUEUE_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/queue`;
const KB_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/ai-knowledge-base`;

// 生成小结（调用主会话）
function generateSummary(detail) {
  const prompt = `
请为这个B站视频生成知识库条目：

标题：${detail.title}
日期：${detail.date}

视频简介：
${detail.description}

评论摘录：
${detail.comments}

请输出JSON格式：
{
  "summary": ["核心要点1", "核心要点2", "核心要点3"],
  "tools": ["提到的工具/技术"],
  "comments_insight": "评论区主要反馈",
  "score": 75,
  "tags": ["标签1", "标签2"]
}
`;

  // 写入临时文件
  const tmpFile = '/tmp/video_prompt.txt';
  fs.writeFileSync(tmpFile, prompt);
  
  console.log('🤖 调用LLM生成小结...');
  
  // 这里简化返回，实际应通过sessions_send调用
  return {
    summary: ['待LLM生成'],
    tools: [],
    comments_insight: '待分析',
    score: 70,
    tags: ['AI绘画']
  };
}

// 主流程
const detailFiles = fs.readdirSync(QUEUE_DIR).filter(f => f.endsWith('_details.json'));

for (const file of detailFiles) {
  const details = JSON.parse(fs.readFileSync(path.join(QUEUE_DIR, file), 'utf8'));
  
  console.log(`\n📝 生成 ${details.length} 个视频的小结`);
  
  const summaries = details.map(detail => ({
    ...detail,
    analysis: generateSummary(detail)
  }));
  
  // 保存最终结果
  const uid = file.replace('_details.json', '');
  fs.writeFileSync(
    path.join(QUEUE_DIR, `${uid}_final.json`),
    JSON.stringify(summaries, null, 2)
  );
}

console.log('\n✅ 小结生成完成！');
