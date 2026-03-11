#!/usr/bin/env node
// 每日复习推送脚本
const { getTodayReviews } = require('./lib/reviewEngine');

async function sendDailyReview() {
  const reviews = getTodayReviews();
  
  if (reviews.length === 0) {
    console.log('今日无待复习内容');
    return;
  }
  
  let message = `📚 今日复习清单（${reviews.length}条）\n\n`;
  
  reviews.forEach((item, i) => {
    message += `${i + 1}. ${item.title}\n`;
    message += `   分类：${item.category} | 复习：${item.reviewCount}次 | ${item.maturity}\n`;
    message += `   核心：${item.summary.substring(0, 50)}...\n`;
    if (item.url) message += `   🔗 ${item.url}\n`;
    message += `\n`;
  });
  
  message += `回复"已看 序号"标记完成，如：已看 1`;
  
  console.log(message);
  // TODO: 通过OpenClaw发送到Telegram
}

sendDailyReview();
