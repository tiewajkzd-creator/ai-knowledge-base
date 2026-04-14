#!/usr/bin/env node
// 视频详情处理器 v3 - 从列表页直接点击

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const QUEUE_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/queue`;

// 抓取博主的视频详情
async function fetchVideosFromSpace(uid, count = 3) {
  console.log(`\n📦 处理 UID: ${uid}`);
  
  try {
    // 打开UP主视频页
    execSync(`agent-browser open "https://space.bilibili.com/${uid}/video"`);
    execSync('sleep 3');
    
    // 滚动加载
    for (let i = 0; i < 3; i++) {
      execSync('agent-browser scroll down 1000');
      execSync('sleep 1');
    }
    
    // 获取视频链接
    execSync('agent-browser snapshot -i > /tmp/space_snapshot.txt');
    const snapshot = fs.readFileSync('/tmp/space_snapshot.txt', 'utf8');
    
    // 找所有视频链接
    const linkPattern = /link "([^"]+)" \[ref=(e\d+)\]/g;
    const links = [];
    let match;
    
    while ((match = linkPattern.exec(snapshot)) !== null) {
      const text = match[1];
      const ref = match[2];
      // 过滤出视频标题（包含时长的）
      if (/\d{2}:\d{2}/.test(text)) {
        links.push({ title: text.split(/\d+\.\d+[万千]?/)[0].trim(), ref });
      }
    }
    
    console.log(`找到 ${links.length} 个视频链接`);
    
    const results = [];
    
    // 处理前N个视频
    for (const link of links.slice(0, count)) {
      console.log(`\n📹 ${link.title}`);
      
      // 点击视频
      execSync(`agent-browser click @${link.ref}`);
      execSync('sleep 5');
      
      // 获取当前URL
      const url = execSync('agent-browser get url').toString().trim();
      
      // 获取页面内容
      const pageText = execSync('agent-browser get text body').toString();
      
      // 滚动到评论
      execSync('agent-browser scroll down 2000');
      execSync('sleep 2');
      
      const commentsText = execSync('agent-browser get text body').toString();
      
      results.push({
        title: link.title,
        url,
        content: pageText.slice(0, 2000),
        comments: commentsText.slice(0, 2000)
      });
      
      console.log(`✅ 完成`);
      
      // 返回列表页
      execSync('agent-browser back');
      execSync('sleep 2');
    }
    
    execSync('agent-browser close');
    return results;
    
  } catch (error) {
    console.error(`❌ 失败: ${error.message}`);
    try { execSync('agent-browser close'); } catch {}
    return [];
  }
}

// 主流程
async function main() {
  // 读取白名单
  const memoryPath = `${process.env.HOME}/.openclaw/workspace-ai-brain/MEMORY.md`;
  const memory = fs.readFileSync(memoryPath, 'utf8');
  
  const uidPattern = /\| B站 \| [^|]+ \| (\d+) \|/g;
  const uids = [];
  let match;
  
  while ((match = uidPattern.exec(memory)) !== null) {
    uids.push(match[1]);
  }
  
  for (const uid of uids) {
    const results = await fetchVideosFromSpace(uid, 3);
    
    if (results.length > 0) {
      fs.writeFileSync(
        path.join(QUEUE_DIR, `${uid}_details.json`),
        JSON.stringify(results, null, 2)
      );
    }
  }
  
  console.log('\n✅ 全部完成！');
}

main().catch(console.error);
