#!/usr/bin/env node
// 完整采集流程：提取 → 分类 → 总结 → 写入

const { analyzeVideo } = require('./llm-classifier.js');
const { writeToKnowledgeBase } = require('./kb-writer.js');
const { execSync } = require('child_process');
const fs = require('fs');

const WORKSPACE = `${process.env.HOME}/.openclaw/workspace-ai-brain`;
const QUEUE_DIR = `${WORKSPACE}/queue`;

async function processVideo(bvid) {
  console.log(`\n🎬 处理视频: ${bvid}`);
  
  // 1. 提取内容
  console.log('1️⃣ 提取内容...');
  execSync(`node ${WORKSPACE}/scripts/bilibili-extractor.js ${bvid}`, { stdio: 'inherit' });
  
  // 2. 读取提取结果
  const files = fs.readdirSync(QUEUE_DIR);
  const file = files.find(f => f.includes(bvid));
  if (!file) throw new Error('提取失败');
  
  const data = JSON.parse(fs.readFileSync(`${QUEUE_DIR}/${file}`, 'utf8'));
  
  // 3. LLM分类
  console.log('2️⃣ LLM分类...');
  const analysis = await analyzeVideo(data.title, data.content);
  console.log(`   分类: ${analysis.category}, 评分: ${analysis.score}`);
  
  if (!analysis.relevant || analysis.score < 6) {
    console.log('❌ 不相关或评分过低，跳过');
    return;
  }
  
  // 4. 生成小结
  console.log('3️⃣ 生成小结...');
  const summary = JSON.parse(
    execSync(`node ${WORKSPACE}/scripts/knowledge-summarizer.js ${bvid}`, { encoding: 'utf8' })
  );
  summary.category = analysis.category;
  summary.score = analysis.score;
  
  // 5. 写入知识库
  console.log('4️⃣ 写入知识库...');
  const filepath = writeToKnowledgeBase(summary);
  
  console.log(`\n✅ 完成！已写入: ${filepath}`);
}

const bvid = process.argv[2];
if (!bvid) {
  console.log('用法: node full-pipeline.js BV号');
  process.exit(1);
}

processVideo(bvid).catch(console.error);
