#!/usr/bin/env node
// B站白名单批量采集器

const fs = require('fs');
const { execSync } = require('child_process');

const WORKSPACE = `${process.env.HOME}/.openclaw/workspace-ai-brain`;
const QUEUE_DIR = `${WORKSPACE}/queue`;
const MEMORY_PATH = `${WORKSPACE}/MEMORY.md`;

// 读取白名单
function getWhitelist() {
  const memory = fs.readFileSync(MEMORY_PATH, 'utf8');
  const match = memory.match(/## 白名单博主清单\n([\s\S]*?)\n\n/);
  if (!match) return [];
  
  const lines = match[1].split('\n').filter(l => l.includes('|'));
  return lines.slice(2).map(line => {
    const parts = line.split('|').map(s => s.trim());
    return {
      platform: parts[1],
      name: parts[2],
      uid: parts[3],
      category: parts[4],
      priority: parts[5]
    };
  }).filter(b => b.platform === 'B站');
}

// 获取UP主最近30天视频列表
function getRecentVideos(uid, days = 30) {
  const cutoff = Date.now() / 1000 - days * 86400;
  
  try {
    const cmd = `curl -s "https://api.bilibili.com/x/space/wbi/arc/search?mid=${uid}&ps=50&pn=1"`;
    const result = execSync(cmd, { encoding: 'utf8' });
    const data = JSON.parse(result);
    
    if (data.code !== 0 || !data.data?.list?.vlist) return [];
    
    return data.data.list.vlist
      .filter(v => v.created >= cutoff)
      .map(v => ({
        bvid: v.bvid,
        title: v.title,
        pubdate: new Date(v.created * 1000).toISOString().split('T')[0]
      }));
  } catch (error) {
    console.error(`获取${uid}视频失败:`, error.message);
    return [];
  }
}

// 关键词过滤
function matchKeywords(title) {
  const keywords = [
    'Flux', 'ComfyUI', 'Stable Diffusion', 'SDXL', 'AI绘画', 'AI视频',
    'LTX', 'Sora', 'Pika', 'Runway', 'Midjourney', 'DALL-E',
    'LoRA', 'ControlNet', 'Fooocus', 'Automatic1111', 'GGUF',
    'Agent', 'LangChain', 'AutoGPT', 'OpenAWS', 'Claude', 'GPT',
    '提示词', 'prompt', '工作流', 'workflow'
  ];
  
  return keywords.some(kw => title.includes(kw));
}

async function main() {
  console.log('📦 开始批量采集\n');
  
  const whitelist = getWhitelist();
  console.log(`白名单博主: ${whitelist.length}个\n`);
  
  let totalCollected = 0;
  
  for (const blogger of whitelist) {
    console.log(`\n📹 ${blogger.name} (${blogger.uid})`);
    
    const videos = getRecentVideos(blogger.uid);
    console.log(`  最近30天: ${videos.length}条`);
    
    const filtered = videos.filter(v => matchKeywords(v.title));
    console.log(`  关键词匹配: ${filtered.length}条`);
    
    for (const video of filtered.slice(0, 10)) {
      console.log(`  → ${video.title}`);
      
      try {
        execSync(
          `node ${WORKSPACE}/scripts/bilibili-extractor.js ${video.bvid}`,
          { stdio: 'inherit' }
        );
        totalCollected++;
      } catch (error) {
        console.error(`    ❌ 失败: ${error.message}`);
      }
    }
  }
  
  console.log(`\n✅ 完成！共采集 ${totalCollected} 条`);
}

main().catch(console.error);
