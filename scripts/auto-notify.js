#!/usr/bin/env node
// 带自动通知的批量处理

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
    
    const classification = JSON.parse(
      execSync(`cd ${WORKSPACE} && node scripts/llm-classifier.js queue/${bvid}_result.json`, { encoding: 'utf8' })
    );
    
    const knowledgeSummary = JSON.parse(
      execSync(`cd ${WORKSPACE} && node scripts/knowledge-summarizer.js queue/${bvid}_result.json`, { encoding: 'utf8' })
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
    
    execSync(`cd ${WORKSPACE} && node scripts/kb-writer.js '${JSON.stringify(summary)}'`, { stdio: 'inherit' });
    
    console.log(`✅ 完成`);
    return { success: true, title: data.title };
    
  } catch (error) {
    console.error(`❌ 失败:`, error.message);
    return { success: false, error: error.message };
  }
}

(async () => {
  const startTime = Date.now();
  const bvList = process.argv.slice(2);
  
  if (bvList.length === 0) {
    console.log('用法: node auto-notify.js BV1... BV2...');
    process.exit(1);
  }
  
  console.log(`📋 共${bvList.length}个视频\n`);
  
  const results = [];
  for (const bvid of bvList) {
    const result = await processVideo(bvid.trim());
    results.push({ bvid, ...result });
    await new Promise(r => setTimeout(r, 3000));
  }
  
  const duration = Math.round((Date.now() - startTime) / 1000 / 60);
  const success = results.filter(r => r.success).length;
  
  // 生成通知消息
  let message = `✅ 批量处理完成！\n\n`;
  message += `成功: ${success}/${bvList.length}\n`;
  message += `耗时: ${duration}分钟\n\n`;
  
  if (success > 0) {
    message += `已处理:\n`;
    results.filter(r => r.success).forEach((r, i) => {
      message += `${i+1}. ${r.title}\n`;
    });
  }
  
  if (success < bvList.length) {
    message += `\n失败:\n`;
    results.filter(r => !r.success).forEach(r => {
      message += `- ${r.bvid}: ${r.error}\n`;
    });
  }
  
  message += `\n访问: https://tiewajkzd-creator.github.io/ai-knowledge-base/`;
  
  console.log('\n' + message);
  
  // 发送Telegram通知
  try {
    execSync(`openclaw message send --target "AI大脑+知识库" --message "${message.replace(/"/g, '\\"')}"`, 
      { stdio: 'inherit' });
  } catch (e) {
    console.log('⚠️ Telegram通知发送失败');
  }
})();
