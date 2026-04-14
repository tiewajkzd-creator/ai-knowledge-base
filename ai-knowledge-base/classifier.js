const rules = require('./classify-rules.js');

function classify(title, content, category) {
  const text = (title + ' ' + content).toLowerCase();
  const categoryRules = rules[category];
  if (!categoryRules) return null;
  
  let bestMatch = { subCategory: null, score: 0 };
  
  for (const [subCat, rule] of Object.entries(categoryRules)) {
    let score = 0;
    
    // 标题模式匹配（高权重）
    for (const pattern of rule.titlePatterns) {
      if (pattern.test(title)) score += 20;
    }
    
    // 关键词匹配
    for (const keyword of rule.keywords) {
      if (text.includes(keyword.toLowerCase())) score += 5;
    }
    
    // 优先级加权
    score *= (rule.priority / 10);
    
    if (score > bestMatch.score) {
      bestMatch = { subCategory: subCat, score };
    }
  }
  
  return bestMatch.score > 10 ? bestMatch.subCategory : null;
}

module.exports = { classify };
