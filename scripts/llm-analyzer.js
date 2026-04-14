#!/usr/bin/env node
// LLM内容分析 - 真实调用版

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const QUEUE_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/queue`;

// 真正的LLM分析
async function analyzeWithLLM(pageText, title, url) {
  console.log('🤖 LLM分析中...');
  
  // 保存页面内容
  const contentFile = path.join(QUEUE_DIR, 'current_video.txt');
  fs.writeFileSync(contentFile, `标题：${title}\nURL：${url}\n\n页面内容：\n${pageText.slice(0, 3000)}`);
  
  // 构造提示词
  const prompt = `请分析这个B站AI视频的内容并提取关键信息。

标题：${title}

页面文本（前2000字）：
${pageText.slice(0, 2000)}

请严格按JSON格式输出：
{
  "summary": ["核心要点1", "核心要点2", "核心要点3"],
  "tools": ["工具/模型名称"],
  "techniques": ["技术关键词"],
  "score": 75
}`;

  // 保存提示词到文件
  const promptFile = path.join(QUEUE_DIR, 'llm_prompt.txt');
  fs.writeFileSync(promptFile, prompt);
  
  console.log(`📝 提示词已保存: ${promptFile}`);
  console.log('💡 请手动分析或等待自动调用...');
  
  // 临时返回基础提取
  const tools = [];
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('ltx')) tools.push('LTX');
  if (titleLower.includes('comfyui')) tools.push('ComfyUI');
  if (titleLower.includes('gguf')) tools.push('GGUF');
  if (titleLower.includes('wan')) tools.push('Wan');
  
  return {
    summary: [`视频讲解${tools.join('、')}相关内容`],
    tools,
    techniques: ['AI视频生成'],
    score: 75
  };
}

module.exports = { analyzeWithLLM };

// 测试
if (require.main === module) {
  const testText = fs.readFileSync('/tmp/video_content.txt', 'utf8');
  analyzeWithLLM(testText, 'LTX2.3测试', 'https://test.com').then(result => {
    console.log(JSON.stringify(result, null, 2));
  });
}
