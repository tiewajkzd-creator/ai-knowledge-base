#!/usr/bin/env node
// 从BV列表批量处理

const { execSync } = require('child_process');
const fs = require('fs');

const WORKSPACE = `${process.env.HOME}/.openclaw/workspace-ai-brain`;

function sendNotification(message) {
  try {
    execSync(`openclaw message send --channel telegram --target "-5211118890" --message "${message.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
  } catch (e) {
    console.error('通知发送失败:', e.message);
  }
}

async function processVideo(bvid, index, total) {
  console.log(`\n📹 ${bvid}`);
  
  // 发送开始通知
  sendNotification(`🎬 开始处理 ${index}/${total}: ${bvid}`);
  
  try {
    // 1. 提取
    execSync(`cd ${WORKSPACE} && node scripts/bilibili-extractor.js ${bvid}`, { stdio: 'inherit' });
    
    // 2. 链接
    const enhanced = JSON.parse(execSync(`cd ${WORKSPACE} && node scripts/enhanced-summarizer.js queue/${bvid}_result.json`, { encoding: 'utf8' }));
    
    // 3. 评论
    execSync(`cd ${WORKSPACE} && node scripts/comment-extractor.js ${bvid}`, { stdio: 'inherit' });
    
    // 4. 小结
    const data = JSON.parse(fs.readFileSync(`${WORKSPACE}/queue/${bvid}_result.json`, 'utf8'));
    
    // 检查转录是否成功
    if (!data.content || data.content.length < 100) {
      throw new Error('转录内容过短或为空');
    }
    
    const comments = JSON.parse(fs.readFileSync(`${WORKSPACE}/queue/${bvid}_comments.json`, 'utf8'));
    
    // 4.1 LLM分类
    const classification = JSON.parse(
      execSync(`cd ${WORKSPACE} && node scripts/llm-classifier.js queue/${bvid}_result.json`, 
        { encoding: 'utf8' })
    );
    
    // 4.2 提取核心观点
    const knowledgeSummary = JSON.parse(
      execSync(`cd ${WORKSPACE} && node scripts/knowledge-summarizer.js queue/${bvid}_result.json`,
        { encoding: 'utf8' })
    );
    
    const summary = {
      title: data.title,
      source: `B站 - ${data.owner}`,
      link: data.url,
      date: data.pubdate,
      category: classification.category,
      score: classification.score >= 80 ? '⭐⭐⭐' : '⭐⭐',
      keyPoints: knowledgeSummary.keyPoints,
      tools: knowledgeSummary.tools,
      resources: enhanced.links.slice(0, 5),
      comments: comments.slice(0, 3),
      tags: knowledgeSummary.tags
    };
    
    // 5. 写入
    execSync(`cd ${WORKSPACE} && node scripts/kb-writer.js '${JSON.stringify(summary)}'`, { stdio: 'inherit' });
    
    console.log(`✅ 完成`);
    sendNotification(`✅ 完成 ${index}/${total}: ${data.title.slice(0, 30)}...`);
    
  } catch (error) {
    console.error(`❌ 失败:`, error.message);
    sendNotification(`❌ 失败 ${index}/${total}: ${bvid}\n原因: ${error.message}`);
    throw error;
  }
}

const listFile = process.argv[2] || 'bv_list.txt';
const bvList = fs.readFileSync(`${WORKSPACE}/${listFile}`, 'utf8').trim().split('\n');
console.log(`📋 共${bvList.length}个视频\n`);

(async () => {
  const results = { success: 0, failed: [] };
  
  for (let i = 0; i < bvList.length; i++) {
    const bvid = bvList[i].trim();
    if (bvid) {
      try {
        await processVideo(bvid, i + 1, bvList.length);
        results.success++;
      } catch (e) {
        results.failed.push(bvid);
      }
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  
  console.log('\n🎉 完成');
  
  // 发送汇总通知
  const message = `🎉 批量处理完成\n\n✅ 成功: ${results.success}/${bvList.length}\n${results.failed.length > 0 ? '❌ 失败: ' + results.failed.join(', ') : ''}\n\n🔗 https://tiewajkzd-creator.github.io/ai-knowledge-base/`;
  
  sendNotification(message);
})();
