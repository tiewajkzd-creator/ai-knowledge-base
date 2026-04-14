#!/usr/bin/env node
// B站API采集器

const fs = require('fs');
const { execSync } = require('child_process');

const QUEUE_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/queue`;

function getVideoInfo(bvid) {
  const cmd = `curl -s "https://api.bilibili.com/x/web-interface/view?bvid=${bvid}"`;
  const result = execSync(cmd, { encoding: 'utf8' });
  const data = JSON.parse(result);
  return data.code === 0 ? data.data : null;
}

function getVideoList(uid, count = 5) {
  console.log(`📥 获取 UID:${uid} 的视频`);
  const cmd = `curl -s "https://api.bilibili.com/x/space/wbi/arc/search?mid=${uid}&ps=${count}"`;
  const result = execSync(cmd, { encoding: 'utf8' });
  const data = JSON.parse(result);
  return data.code === 0 && data.data.list.vlist ? data.data.list.vlist.map(v => v.bvid) : [];
}

async function main() {
  const uid = '389291683';
  const bvids = getVideoList(uid, 3);
  console.log(`找到 ${bvids.length} 个视频\n`);
  
  const results = [];
  
  for (const bvid of bvids) {
    console.log(`📹 ${bvid}`);
    const info = getVideoInfo(bvid);
    
    if (info) {
      results.push({
        bvid: info.bvid,
        title: info.title,
        desc: info.desc,
        duration: info.duration,
        pubdate: new Date(info.pubdate * 1000).toISOString().split('T')[0],
        owner: info.owner.name,
        url: `https://www.bilibili.com/video/${info.bvid}`
      });
      console.log(`✅ ${info.title}\n`);
    }
  }
  
  fs.writeFileSync(
    `${QUEUE_DIR}/${uid}_api_data.json`,
    JSON.stringify(results, null, 2)
  );
  
  console.log(`✅ 完成！已保存 ${results.length} 个视频`);
}

main().catch(console.error);
