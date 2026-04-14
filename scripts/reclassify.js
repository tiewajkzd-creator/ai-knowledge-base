#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const KB_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/ai-knowledge-base`;

function getSubCategory(category, title, keyPoints) {
  const text = `${title} ${keyPoints}`.toLowerCase();
  
  if (category === 'AI绘画') {
    if (text.match(/ltx|flux|sd|sdxl|stable.*diffusion|模型.*更新|新版本|v\d+\.\d+/)) 
      return '模型更新';
    if (text.match(/报错|错误|解决|问题|bug|修复|踩坑/)) 
      return '问题解决';
    if (text.match(/提示词|prompt|公式|模板|咒语/)) 
      return '提示词技巧';
    if (text.match(/测评|对比|实测|评测|vs|性能/)) 
      return '工具测评';
    if (text.match(/工作流|节点|comfyui|workflow|教程|使用|配置/)) 
      return '工作流教程';
    return '工作流教程';
  }
  
  if (category === 'Agent系统') {
    // 优先级：先匹配最具体的特征
    if (text.match(/a2a.*插件|skill.*开发|mcp.*开发|插件.*开发|api.*开发/)) 
      return '插件开发';
    if (text.match(/架构|跨.*gateway|跨.*机器|通信|协作|分布式/)) 
      return '架构设计';
    if (text.match(/实战|实测|部署|自动.*部署|案例|应用|项目/)) 
      return '实战案例';
    if (text.match(/教程|配置|安装|使用|入门|进阶|工作区/)) 
      return 'OpenClaw教程';
    return 'OpenClaw教程';
  }
  
  return '';
}

function reclassify() {
  const categories = ['Agent系统', 'AI绘画'];
  
  categories.forEach(cat => {
    const catDir = path.join(KB_DIR, cat);
    if (!fs.existsSync(catDir)) return;
    
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.md') && f !== 'README.md');
    
    files.forEach(file => {
      const oldPath = path.join(catDir, file);
      const content = fs.readFileSync(oldPath, 'utf8');
      
      const titleMatch = content.match(/^# (.+)/m);
      const keyPointsMatch = content.match(/## 核心观点\n\n([\s\S]+?)\n\n---/);
      
      const title = titleMatch ? titleMatch[1] : file;
      const keyPoints = keyPointsMatch ? keyPointsMatch[1] : '';
      
      const subCat = getSubCategory(cat, title, keyPoints);
      if (!subCat) return;
      
      const newDir = path.join(catDir, subCat);
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
      }
      
      const newPath = path.join(newDir, file);
      
      if (oldPath !== newPath) {
        fs.renameSync(oldPath, newPath);
        console.log(`✅ ${file} → ${cat}/${subCat}/`);
      }
    });
  });
}

reclassify();
console.log('✅ 重新分类完成');
