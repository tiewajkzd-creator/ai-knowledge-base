#!/usr/bin/env node
// 智能视频内容提取 - 完整版

const fs = require('fs');
const { execSync } = require('child_process');

const QUEUE_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/queue`;
const MIN_DESC_LENGTH = 200;

function getVideoInfo(bvid) {
  const cmd = `curl -s "https://api.bilibili.com/x/web-interface/view?bvid=${bvid}"`;
  const result = execSync(cmd, { encoding: 'utf8' });
  const data = JSON.parse(result);
  return data.code === 0 ? data.data : null;
}

async function transcribeVideo(bvid) {
  console.log('📝 简介不足，下载音频转录...');
  
  try {
    const audioPath = `${QUEUE_DIR}/${bvid}.mp3`;
    
    // 下载音频（仅前2分钟，节省时间）
    console.log('⬇️  下载音频（前2分钟）...');
    execSync(
      `cd ${QUEUE_DIR} && python3 -m yt_dlp -x --audio-format mp3 ` +
      `--postprocessor-args "-t 120" ` +
      `-o "${bvid}.%(ext)s" "https://www.bilibili.com/video/${bvid}"`,
      { stdio: 'inherit' }
    );
    
    // 转录（使用Whisper API）
    console.log('🎤 转录中...');
    const transcript = execSync(
      `curl -s -X POST https://api.openai.com/v1/audio/transcriptions ` +
      `-H "Authorization: Bearer $OPENAI_API_KEY" ` +
      `-F file="@${audioPath}" ` +
      `-F model="whisper-1" | python3 -c "import sys,json; print(json.load(sys.stdin)['text'])"`,
      { encoding: 'utf8' }
    );
    
    // 清理
    execSync(`rm -f ${audioPath}`);
    return transcript.trim();
    
  } catch (error) {
    console.error(`转录失败: ${error.message}`);
    return null;
  }
}

async function main() {
  const bvid = process.argv[2] || 'BV1EMNMzmEhd';
  console.log(`📹 处理: ${bvid}\n`);
  
  const info = getVideoInfo(bvid);
  if (!info) {
    console.error('❌ 获取失败');
    return;
  }
  
  let content = info.desc;
  let source = 'description';
  
  if (content.length < MIN_DESC_LENGTH) {
    console.log(`⚠️  简介${content.length}字 < ${MIN_DESC_LENGTH}字`);
    const transcript = await transcribeVideo(bvid);
    if (transcript) {
      content = transcript;
      source = 'transcript';
    }
  }
  
  const result = {
    bvid: info.bvid,
    title: info.title,
    content,
    contentSource: source,
    contentLength: content.length,
    pubdate: new Date(info.pubdate * 1000).toISOString().split('T')[0],
    owner: info.owner.name,
    url: `https://www.bilibili.com/video/${info.bvid}`
  };
  
  fs.writeFileSync(
    `${QUEUE_DIR}/${bvid}_smart.json`,
    JSON.stringify(result, null, 2)
  );
  
  console.log(`\n✅ 完成！来源: ${source}, 长度: ${content.length}字`);
}

main().catch(console.error);
