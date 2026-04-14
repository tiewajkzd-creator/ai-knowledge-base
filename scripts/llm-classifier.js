#!/usr/bin/env node
// LLM智能分类器

const fs = require('fs');
const { execSync } = require('child_process');

const WORKSPACE = `${process.env.HOME}/.openclaw/workspace-ai-brain`;

// LLM分析视频相关性和分类
async function analyzeVideo(title, desc) {
  const content = title + ' ' + desc;
  
  // 规则判断分类
  if (content.includes('OpenClaw') || content.includes('Agent') || content.includes('LangChain') || 
      content.includes('工作区') || content.includes('Gateway') || content.includes('龙虾')) {
    return {
      relevant: true,
      category: "Agent系统",
      score: 9,
      reason: "OpenClaw/Agent相关内容"
    };
  }
  
  if (content.includes('LTX') || content.includes('ComfyUI') || content.includes('Flux') || 
      content.includes('Stable Diffusion') || content.includes('视频生成') || content.includes('图生视频')) {
    return {
      relevant: true,
      category: "AI绘画",
      score: 9,
      reason: "AI绘画/视频生成内容"
    };
  }
  
  // 默认AI绘画
  return {
    relevant: true,
    category: "AI绘画",
    score: 7,
    reason: "AI相关内容"
  };
}

// 命令行执行
if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('用法: node llm-classifier.js <result.json>');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const content = (data.transcript || '') + ' ' + (data.description || '');
  
  analyzeVideo(data.title, content).then(result => {
    console.log(JSON.stringify(result));
  }).catch(err => {
    console.error('分类失败:', err.message);
    process.exit(1);
  });
}

module.exports = { analyzeVideo };
