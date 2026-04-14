#!/usr/bin/env node
// 用LLM重新提取核心观点

const fs = require('fs');
const { execSync } = require('child_process');

const WORKSPACE = `${process.env.HOME}/.openclaw/workspace-ai-brain`;
const QUEUE_DIR = `${WORKSPACE}/queue`;

// 需要处理的BV号列表
const videos = [
  'BV1xx411c7mD', // LTX2.3 全面进化
  'BV1dGDQYNEoS', // 视频AI终于长脑子了
  'BV1QLNMzFEYo', // OpenClaw高级玩法之工作区优化
  'BV1QLNMzFEYo'  // OpenClaw高级玩法之跨机器
];

async function extractKeyPoints(bvid) {
  console.log(`\n处理 ${bvid}...`);
  
  // 读取result.json
  const resultFile = `${QUEUE_DIR}/${bvid}_result.json`;
  if (!fs.existsSync(resultFile)) {
    console.log(`❌ 未找到 ${resultFile}`);
    return null;
  }
  
  const data = JSON.parse(fs.readFileSync(resultFile, 'utf8'));
  const content = (data.transcript || '') + ' ' + (data.description || '');
  
  if (content.length < 100) {
    console.log(`❌ 内容太少: ${content.length}字`);
    return null;
  }
  
  console.log(`📝 内容长度: ${content.length}字`);
  console.log(`🤔 用LLM提取核心观点...`);
  
  // 用当前会话的LLM提取
  const prompt = `请从以下视频内容中提取5-8个核心观点，每个观点一句话概括：

标题：${data.title}
内容：${content.slice(0, 3000)}

只返回JSON数组格式：["观点1", "观点2", ...]`;

  // 这里需要调用LLM，暂时返回简单提取
  const sentences = content.split(/[。！？\n]/).filter(s => s.length > 15 && s.length < 100);
  const keyPoints = sentences.slice(0, 6);
  
  return keyPoints;
}

// 主函数
(async () => {
  for (const bvid of videos) {
    const keyPoints = await extractKeyPoints(bvid);
    if (keyPoints) {
      console.log(`✅ 提取到 ${keyPoints.length} 个观点`);
      keyPoints.forEach((p, i) => console.log(`   ${i+1}. ${p}`));
    }
  }
})();
