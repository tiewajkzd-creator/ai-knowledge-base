#!/usr/bin/env node
// B站评论区抓取器

const fs = require('fs');
const { execSync } = require('child_process');

// 读取cookie
function getCookie() {
  const cookieFile = `${process.env.HOME}/.openclaw/workspace-ai-brain/.bilibili_cookie`;
  if (!fs.existsSync(cookieFile)) return '';
  
  const content = fs.readFileSync(cookieFile, 'utf8');
  const match = content.match(/COOKIE="(.*)"/);
  return match ? match[1] : '';
}

function getComments(bvid, limit = 20) {
  try {
    const cookie = getCookie();
    const cookieHeader = cookie ? `-H "Cookie: ${cookie}"` : '';
    
    // 获取视频aid
    const infoCmd = `curl -s ${cookieHeader} "https://api.bilibili.com/x/web-interface/view?bvid=${bvid}"`;
    const infoResult = JSON.parse(execSync(infoCmd, { encoding: 'utf8' }));
    
    if (infoResult.code !== 0) {
      console.error('获取视频信息失败');
      return [];
    }
    
    const aid = infoResult.data.aid;
    
    // 获取评论（按热度排序）
    const commentCmd = `curl -s ${cookieHeader} "https://api.bilibili.com/x/v2/reply/main?oid=${aid}&type=1&mode=3&ps=${limit}"`;
    const commentResult = JSON.parse(execSync(commentCmd, { encoding: 'utf8' }));
    
    if (commentResult.code !== 0 || !commentResult.data) {
      console.error('获取评论失败');
      return [];
    }
    
    const comments = commentResult.data.replies || [];
    
    return comments.map(c => ({
      author: c.member.uname,
      content: c.content.message,
      likes: c.like,
      time: new Date(c.ctime * 1000).toISOString().split('T')[0]
    }));
    
  } catch (error) {
    console.error('抓取评论出错:', error.message);
    return [];
  }
}

// 筛选有价值的评论
function filterValuableComments(comments) {
  return comments.filter(c => {
    // 宽松筛选：内容长度≥15字即可
    return c.content.length >= 15;
  }).slice(0, 5); // 最多保留5条
}

// 主函数
const bvid = process.argv[2];
if (!bvid) {
  console.error('用法: node comment-extractor.js <BV号>');
  process.exit(1);
}

console.log(`📝 抓取评论: ${bvid}\n`);
const comments = getComments(bvid);
console.log(`✅ 获取${comments.length}条评论`);

const valuable = filterValuableComments(comments);
console.log(`🔍 筛选出${valuable.length}条有价值评论\n`);

valuable.forEach((c, i) => {
  console.log(`${i + 1}. ${c.author} (👍${c.likes})`);
  console.log(`   ${c.content}\n`);
});

// 输出JSON
const outputPath = `${process.env.HOME}/.openclaw/workspace-ai-brain/queue/${bvid}_comments.json`;
fs.writeFileSync(outputPath, JSON.stringify(valuable, null, 2));
console.log(`💾 已保存: ${outputPath}`);
