#!/usr/bin/env node
// 批量处理白名单博主

const { execSync } = require('child_process');
const fs = require('fs');

const WORKSPACE = `${process.env.HOME}/.openclaw/workspace-ai-brain`;
const WHITELIST = [
  { uid: '1648704464', name: 'AI超元域' },
  { uid: '389291683', name: '三层楼的小肥猴' }
];

// 获取UP主最近30天视频
function getRecentVideos(uid, days = 30) {
  const cutoffTime = Math.floor(Date.now() / 1000) - (days * 24 * 3600);
  
  try {
    // 读取cookie
    const cookieFile = `${WORKSPACE}/.bilibili_cookie`;
    let cookieHeader = '';
    if (fs.existsSync(cookieFile)) {
      const content = fs.readFileSync(cookieFile, 'utf8');
      const match = content.match(/COOKIE="(.*)"/);
      if (match) cookieHeader = `-H "Cookie: ${match[1]}"`;
    }
    
    const cmd = `curl -s ${cookieHeader} "https://api.bilibili.com/x/space/wbi/arc/search?mid=${uid}&ps=30&pn=1"`;
    const result = JSON.parse(execSync(cmd, { encoding: 'utf8' }));
    
    if (result.code !== 0 || !result.data) return [];
    
    const videos = result.data.list.vlist || [];
    return videos
      .filter(v => v.created >= cutoffTime)
      .map(v => ({ bvid: v.bvid, title: v.title, date: v.created }));
      
  } catch (error) {
    console.error(`获取${uid}视频失败:`, error.message);
    return [];
  }
}

// 完整处理流程
async function processVideo(bvid) {
  console.log(`\n📹 处理: ${bvid}`);
  
  try {
    // 1. 提取视频
    console.log('  1/5 提取内容...');
    execSync(`cd ${WORKSPACE} && node scripts/bilibili-extractor.js ${bvid}`, 
      { stdio: 'inherit' });
    
    // 2. 提取链接
    console.log('  2/5 提取链接...');
    const enhanced = JSON.parse(
      execSync(`cd ${WORKSPACE} && node scripts/enhanced-summarizer.js queue/${bvid}_result.json`,
        { encoding: 'utf8' })
    );
    
    // 3. 抓取评论
    console.log('  3/5 抓取评论...');
    execSync(`cd ${WORKSPACE} && node scripts/comment-extractor.js ${bvid}`,
      { stdio: 'inherit' });
    
    // 4. 生成小结
    console.log('  4/5 生成小结...');
    const data = JSON.parse(fs.readFileSync(`${WORKSPACE}/queue/${bvid}_result.json`, 'utf8'));
    const comments = JSON.parse(fs.readFileSync(`${WORKSPACE}/queue/${bvid}_comments.json`, 'utf8'));
    
    // 这里需要LLM生成小结，暂时用简化版
    const summary = {
      title: data.title,
      source: `B站 - ${data.owner}`,
      link: data.url,
      date: data.pubdate,
      category: 'AI绘画', // 需要LLM分类
      score: '⭐⭐⭐',
      keyPoints: ['待LLM提取'],
      tools: enhanced.tools,
      resources: enhanced.links.slice(0, 5),
      comments: comments.slice(0, 3),
      tags: ['待生成']
    };
    
    fs.writeFileSync(`${WORKSPACE}/queue/${bvid}_summary.json`, 
      JSON.stringify(summary, null, 2));
    
    // 5. 写入知识库
    console.log('  5/5 写入知识库...');
    execSync(`cd ${WORKSPACE} && node scripts/kb-writer.js '${JSON.stringify(summary)}'`,
      { stdio: 'inherit' });
    
    console.log(`✅ ${bvid} 完成`);
    return true;
    
  } catch (error) {
    console.error(`❌ ${bvid} 失败:`, error.message);
    return false;
  }
}

// 主函数
async function main() {
  console.log('🚀 开始批量处理白名单\n');
  
  for (const creator of WHITELIST) {
    console.log(`\n📺 ${creator.name} (${creator.uid})`);
    const videos = getRecentVideos(creator.uid, 30);
    console.log(`找到 ${videos.length} 个视频（最近30天）\n`);
    
    for (const video of videos.slice(0, 5)) { // 先处理前5个
      await processVideo(video.bvid);
      await new Promise(r => setTimeout(r, 2000)); // 间隔2秒
    }
  }
  
  console.log('\n🎉 批量处理完成');
}

main();
