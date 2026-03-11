// 艾宾浩斯复习引擎
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data.json');
const REVIEW_INTERVALS = [1, 2, 4, 7, 15]; // 天数

function loadData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 计算下次复习时间
function calculateNextReview(reviewCount) {
  const days = REVIEW_INTERVALS[Math.min(reviewCount, REVIEW_INTERVALS.length - 1)];
  const next = new Date();
  next.setDate(next.getDate() + days);
  return next.toISOString().split('T')[0];
}

// 更新成熟度
function updateMaturity(reviewCount) {
  if (reviewCount === 0) return '🌱';
  if (reviewCount <= 2) return '🌿';
  return '🌳';
}

// 标记已复习
function markReviewed(category, itemIndex) {
  const data = loadData();
  const item = data.categories[category][itemIndex];
  
  item.reviewCount++;
  item.nextReviewAt = calculateNextReview(item.reviewCount);
  item.maturity = updateMaturity(item.reviewCount);
  
  if (item.reviewCount >= 5) {
    item.status = 'archived';
  }
  
  saveData(data);
  return item;
}

// 获取今日待复习列表
function getTodayReviews() {
  const data = loadData();
  const today = new Date().toISOString().split('T')[0];
  const reviews = [];
  
  Object.entries(data.categories).forEach(([category, items]) => {
    items.forEach((item, index) => {
      if (item.status === 'inbox' && item.nextReviewAt <= today) {
        reviews.push({ category, index, ...item });
      }
    });
  });
  
  return reviews;
}

module.exports = {
  markReviewed,
  getTodayReviews,
  calculateNextReview,
  updateMaturity
};
