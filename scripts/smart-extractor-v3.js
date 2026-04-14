#!/usr/bin/env node
// 智能提取器 - 使用本地Whisper

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
  console.log('📝 简介不足，启动转录...');
  
  try {
    const audioPath = `${QUEUE_DIR}/${bvid}.m4a`;
    
    // 下载音频
    console.log('⬇️  下载音频...');
    execSync(
      `cd ${QUEUE_DIR} && python3 -m yt_dlp -x --audio-format m4a ` +
      `-o "${bvid}.%(ext)s" "https://www.bilibili.com/video/${bvid}"`,
      { stdio: 'inherit' }
    );
    
    // 本地Whisper转录
    console.log('🎤 转录中（使用本地Whisper）...');
    const transcript = execSync(
      `python3 -c "import whisper; model = whisper.load_model('base'); result = model.transcribe('${audioPath}'); print(result['text'])"`,
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
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
  const bvid = process.argv[2];
  if (!bvid) {
    console.error('用法: node smart-extractor-v3.js <BV号>');
    return;
  }
  
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
    `${QUEUE_DIR}/${bvid}_final.json`,
    JSON.stringify(result, null, 2)
  );
  
  console.log(`\n✅ 完成！来源: ${source}, 长度: ${content.length}字`);
}

main().catch(console.error);
