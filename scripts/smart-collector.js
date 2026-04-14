#!/usr/bin/env node
// 智能批量采集 - 集成LLM分类

const fs = require('fs');
const { execSync } = require('child_process');
const { analyzeVideo } = require('./llm-classifier.js');

const WORKSPACE = `${process.env.HOME}/.openclaw/workspace-ai-brain`;
const MEMORY_PATH = `${WORKSPACE}/MEMORY.md`;
const QUEUE_DIR = `${WORKSPACE}/queue`;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getWhitelist() {
  const memory = fs.readFileSync(MEMORY_PATH, 'utf8');
  const match = memory.match(/## 白名单博主清单\n([\s\S]*?)\n\n/);
  if (!match) return [];
  
  const lines = match[1].split('\n').filter(l => l.includes('|'));
  return lines.slice(2).map(line => {
    const parts = line.split('|').map(s => s.trim());
    return { name: parts[2], uid: parts[3] };
  }).filter(b => b.uid);
}

async function main() {
  console.log('🤖 智能批量采集（LLM分类）\n');
  
  // 测试：手动提供一个视频
  const testVideo = {
    bvid: 'BV1EMNMzmEhd',
    title: 'LTX2.3又更新了、去除字幕、新增GGUF工作流、报错信息解答',
    desc: 'LTX视频生成模型更新，ComfyUI工作流优化...'
  };
  
  console.log(`📹 测试: ${testVideo.title}\n`);
  
  const analysis = await analyzeVideo(testVideo.title, testVideo.desc);
  console.log('LLM分析结果:', JSON.stringify(analysis, null, 2));
  
  if (analysis.relevant && analysis.score >= 6) {
    console.log(`\n✅ 相关！分类: ${analysis.category}, 评分: ${analysis.score}`);
    console.log(`开始提取完整内容...`);
    
    execSync(
      `node ${WORKSPACE}/scripts/bilibili-extractor.js ${testVideo.bvid}`,
      { stdio: 'inherit' }
    );
  } else {
    console.log(`\n❌ 不相关或评分过低`);
  }
}

main().catch(console.error);
