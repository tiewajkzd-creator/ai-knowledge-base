#!/usr/bin/env node
// 增强版小结生成器：提取链接、关键信息

const fs = require('fs');

function extractLinks(text) {
  const links = [];
  
  // 提取URL
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex) || [];
  
  urls.forEach(url => {
    if (url.includes('github.com')) {
      links.push({ type: '代码仓库', url });
    } else if (url.includes('huggingface.co')) {
      links.push({ type: '模型地址', url });
    } else if (url.includes('civitai.com')) {
      links.push({ type: '模型下载', url });
    } else if (url.includes('docs') || url.includes('wiki')) {
      links.push({ type: '文档', url });
    } else {
      links.push({ type: '相关链接', url });
    }
  });
  
  return links;
}

function extractKeyInfo(description, transcript) {
  // 从简介和转录中提取关键信息
  const combined = description + '\n' + transcript;
  
  const keyPoints = [];
  const tools = new Set();
  const tags = new Set();
  
  // 提取工具名称
  const toolPatterns = [
    /ComfyUI/gi, /Stable Diffusion/gi, /SDXL/gi, /Flux/gi,
    /LTX/gi, /GGUF/gi, /LoRA/gi, /Qwen/gi, /GPT/gi
  ];
  
  toolPatterns.forEach(pattern => {
    const matches = combined.match(pattern);
    if (matches) {
      matches.forEach(m => tools.add(m));
    }
  });
  
  return {
    tools: Array.from(tools),
    links: extractLinks(description)
  };
}

// 主函数
const resultFile = process.argv[2];
if (!resultFile) {
  console.error('用法: node enhanced-summarizer.js <result.json>');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(resultFile, 'utf8'));
const enhanced = extractKeyInfo(data.description || '', data.content || '');

console.log(JSON.stringify(enhanced, null, 2));
