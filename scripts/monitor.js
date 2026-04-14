#!/usr/bin/env node
// 独立监控脚本 - 任务完成后自动通知

const { execSync } = require('child_process');
const fs = require('fs');

const WORKSPACE = `${process.env.HOME}/.openclaw/workspace-ai-brain`;
const LOCK_FILE = `${WORKSPACE}/.processing.lock`;
const RESULT_FILE = `${WORKSPACE}/.last_result.json`;

// 检查是否有任务在运行
function checkRunning() {
  if (!fs.existsSync(LOCK_FILE)) {
    return null;
  }
  
  const lock = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
  const pid = lock.pid;
  
  try {
    // 检查进程是否还在运行
    execSync(`ps -p ${pid}`, { stdio: 'ignore' });
    return lock; // 还在运行
  } catch {
    return 'completed'; // 已完成
  }
}

// 发送通知
function sendNotification(message) {
  try {
    // 使用chatId而不是名称
    execSync(
      `openclaw message send --channel telegram --target "-5211118890" --message "${message.replace(/"/g, '\\"')}"`,
      { stdio: 'inherit' }
    );
    console.log('✅ 通知已发送');
  } catch (e) {
    console.error('❌ 通知发送失败:', e.message);
  }
}

// 主逻辑
const status = checkRunning();

if (status === 'completed') {
  // 任务刚完成，读取结果并通知
  if (fs.existsSync(RESULT_FILE)) {
    const result = JSON.parse(fs.readFileSync(RESULT_FILE, 'utf8'));
    sendNotification(result.message);
    
    // 清理
    fs.unlinkSync(LOCK_FILE);
    fs.unlinkSync(RESULT_FILE);
  }
} else if (status) {
  console.log(`任务运行中: ${status.task}`);
} else {
  console.log('无任务运行');
}
