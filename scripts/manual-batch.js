#!/usr/bin/env node
// 手动批量采集 - 提供BV号列表

const fs = require('fs');
const { execSync } = require('child_process');

const WORKSPACE = `${process.env.HOME}/.openclaw/workspace-ai-brain`;

async function main() {
  const bvids = process.argv.slice(2);
  
  if (bvids.length === 0) {
    console.log('用法: node manual-batch.js BV1... BV2... BV3...');
    return;
  }
  
  console.log(`📦 批量采集 ${bvids.length} 个视频\n`);
  
  let success = 0;
  
  for (const bvid of bvids) {
    try {
      execSync(
        `node ${WORKSPACE}/scripts/bilibili-extractor.js ${bvid}`,
        { stdio: 'inherit' }
      );
      success++;
    } catch (error) {
      console.error(`❌ ${bvid} 失败`);
    }
  }
  
  console.log(`\n✅ 成功: ${success}/${bvids.length}`);
}

main().catch(console.error);
