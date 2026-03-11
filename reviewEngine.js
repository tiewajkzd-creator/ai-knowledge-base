#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

// 艾宾浩斯复习间隔（天）
const REVIEW_INTERVALS = [1, 2, 4, 7, 15];

function loadData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function calculateNextReview(reviewCount) {
  const intervalDays = REVIEW_INTERVALS[Math.min(reviewCount, REVIEW_INTERVALS.length - 1)];
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);
  return nextDate.toISOString().split('T')[0];
}

function updateMaturity(reviewCount) {
  if (reviewCount === 0) return '🌱';
  if (reviewCount <= 2) return '🌿';
  return '🌳';
}

function getDueItems() {
  const data = loadData();
  const today = new Date().toISOString().split('T')[0];
  const dueItems = [];

  Object.entries(data.categories).forEach(([category, items]) => {
    items.forEach((item, index) => {
      if (item.status === 'inbox' && item.nextReviewAt <= today) {
        dueItems.push({ category, index, ...item });
      }
    });
  });

  return dueItems;
}

function markReviewed(category, index) {
  const data = loadData();
  const item = data.categories[category][index];
  
  item.reviewCount++;
  item.nextReviewAt = calculateNextReview(item.reviewCount);
  item.maturity = updateMaturity(item.reviewCount);
  
  if (item.reviewCount >= 5) {
    item.status = 'archived';
  }
  
  saveData(data);
  return item;
}

module.exports = {
  getDueItems,
  markReviewed,
  calculateNextReview,
  updateMaturity
};

if (require.main === module) {
  const dueItems = getDueItems();
  console.log(`📚 今日待复习：${dueItems.length} 条`);
  dueItems.forEach((item, i) => {
    console.log(`${i + 1}. [${item.category}] ${item.title}`);
    console.log(`   复习次数：${item.reviewCount} | 成熟度：${item.maturity}`);
  });
}
