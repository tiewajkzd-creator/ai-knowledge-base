#!/usr/bin/env node
// 带通知的批量处理

const { execSync } = require('child_process');
const fs = require('fs');

const WORKSPACE = `${process.env.HOME}/.openclaw/workspace-ai-brain`;

async function processVideo(bvid) {
  console.log(`\n📹 ${bvid}`);
  
  try {
    execSync(`cd ${WORKSPACE} && node scripts/bilibili-extractor.js ${bvid}`, { stdio: 'inherit' });
    const enhanced = JSON.parse(execSync(`cd ${WORKSPACE} && node scripts/enhanced-summarizer.js queue/${bvid}_result.json`, { encoding: 'utf8' }));
    execSync(`cd ${WORKSPACE} && node scripts/comment-extractor.js ${bvid}`, { stdio: 'inherit' });
    
    const data = JSON.parse(fs.readFileSync(`${WORKSPACE}/queue/${bvid}_result.json`, 'utf8'));
    const comments = JSON.parse(fs.readFileSync(`${WORKSPACE}/queue/${bvid}_comments.json`, 'utf8'));
    
    const summary = {
      title: data.title,
      source: `B站 - ${data.owner}`,
      link: data.url,
      date: data.pubdate,
      category: 'AI绘画',
      score: '⭐⭐⭐',
      keyPoints: ['待补充'],
      tools: enhanced.tools,
      resources: enhanced.links.slice(0, 5),
      comments: comments.slice(0, 3),
      tags: ['待生成']
    };
    
    execSync(`cd ${WORKSPACE} && node scripts/kb-writer.js '${JSON.stringify(summary)}'`, { stdio: 'inherit' });
    
    console.log(`✅ 完成`);
    return true;
    
  } catch (error) {
    console.error(`❌ 失败:`, error.message);
    return false;
  }
}

(async () => {
  const bvList = fs.readFileSync(`${WORKSPACE}/bv_list.txt`, 'utf8').trim().split('\n');
  console.log(`📋 共${bvList.length}个视频\n`);
  
  let success = 0;
  for (const bvid of bvList) {
    if (bvid.trim()) {
      if (await processVideo(bvid.trim())) success++;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  
  console.log(`\n🎉 完成！成功处理${success}/${bvList.length}个视频`);
  
  // 输出完成标记，方便外部脚本检测
  fs.writeFileSync(`${WORKSPACE}/.batch_done`, new Date().toISOString());
})();
