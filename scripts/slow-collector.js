#!/usr/bin/env node
// 延迟重试批量采集

const fs = require('fs');
const { execSync } = require('child_process');

const WORKSPACE = `${process.env.HOME}/.openclaw/workspace-ai-brain`;
const MEMORY_PATH = `${WORKSPACE}/MEMORY.md`;

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
    return { platform: parts[1], name: parts[2], uid: parts[3] };
  }).filter(b => b.platform === 'B站');
}

async function getVideosWithRetry(uid, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await sleep(2000 * (i + 1)); // 递增延迟
      const cmd = `curl -s "https://api.bilibili.com/x/space/arc/search?mid=${uid}&ps=30"`;
      const result = execSync(cmd, { encoding: 'utf8' });
      const data = JSON.parse(result);
      
      if (data.code === 0 && data.data?.list?.vlist) {
        return data.data.list.vlist.slice(0, 10);
      }
    } catch (error) {
      console.log(`  重试 ${i + 1}/${retries}...`);
    }
  }
  return [];
}

async function main() {
  console.log('📦 慢速批量采集（带延迟）\n');
  const whitelist = getWhitelist();
  
  for (const blogger of whitelist) {
    console.log(`\n📹 ${blogger.name}`);
    const videos = await getVideosWithRetry(blogger.uid);
    console.log(`  获取到 ${videos.length} 条`);
    
    for (const v of videos) {
      console.log(`  → ${v.title}`);
      await sleep(3000); // 每个视频间隔3秒
    }
  }
}

main().catch(console.error);
