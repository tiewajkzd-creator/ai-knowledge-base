#!/usr/bin/env node
// 简化版：直接处理已知BV号

const fs = require('fs');
const { execSync } = require('child_process');

const QUEUE_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/queue`;

function getVideoInfo(bvid) {
  const cmd = `curl -s "https://api.bilibili.com/x/web-interface/view?bvid=${bvid}"`;
  const result = execSync(cmd, { encoding: 'utf8' });
  const data = JSON.parse(result);
  return data.code === 0 ? data.data : null;
}

// 测试：处理单个视频
const bvid = 'BV1EMNMzmEhd';
console.log(`📹 处理: ${bvid}\n`);

const info = getVideoInfo(bvid);

if (info) {
  const result = {
    bvid: info.bvid,
    title: info.title,
    desc: info.desc,
    duration: info.duration,
    pubdate: new Date(info.pubdate * 1000).toISOString().split('T')[0],
    owner: info.owner.name,
    url: `https://www.bilibili.com/video/${info.bvid}`,
    // 提取关键信息
    tools: [],
    links: []
  };
  
  // 从简介中提取工具名
  const toolPatterns = ['LTX', 'ComfyUI', 'GGUF', 'Llama', 'KJNodes'];
  toolPatterns.forEach(tool => {
    if (info.desc.includes(tool)) result.tools.push(tool);
  });
  
  // 提取链接
  const urlMatches = info.desc.match(/https?:\/\/[^\s]+/g);
  if (urlMatches) result.links = urlMatches.slice(0, 5);
  
  console.log(`✅ 标题: ${result.title}`);
  console.log(`📝 简介长度: ${result.desc.length}字`);
  console.log(`🔧 工具: ${result.tools.join(', ')}`);
  console.log(`🔗 链接数: ${result.links.length}\n`);
  
  fs.writeFileSync(
    `${QUEUE_DIR}/test_video.json`,
    JSON.stringify(result, null, 2)
  );
  
  console.log('✅ 已保存到 test_video.json');
}
