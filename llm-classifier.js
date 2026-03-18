const fs = require('fs');
const path = require('path');

function classifyWithLLM(title, content, category) {
  const rules = require('./classify-rules.js');
  const categoryRules = rules[category];
  if (!categoryRules) return null;
  
  // 构建分类提示
  const subCategories = Object.keys(categoryRules).map(sub => {
    return `${sub}：${categoryRules[sub].keywords.slice(0, 5).join('、')}`;
  }).join('\n');
  
  const prompt = `分析以下文章应归属哪个子分类：

【标题】${title}

【内容摘要】${content.substring(0, 500)}

【可选子分类】
${subCategories}

只返回子分类名称，不要解释。如果都不合适，返回"其他"。`;

  return { prompt, fallback: keywordClassify(title, content, category) };
}

function keywordClassify(title, content, category) {
  const rules = require('./classify-rules.js');
  const categoryRules = rules[category];
  const text = (title + ' ' + content).toLowerCase();
  
  let bestMatch = { subCategory: null, score: 0 };
  
  for (const [subCat, rule] of Object.entries(categoryRules)) {
    let score = 0;
    for (const pattern of rule.titlePatterns) {
      if (pattern.test(title)) score += 20;
    }
    for (const keyword of rule.keywords) {
      if (text.includes(keyword.toLowerCase())) score += 5;
    }
    score *= (rule.priority / 10);
    
    if (score > bestMatch.score) {
      bestMatch = { subCategory: subCat, score };
    }
  }
  
  return bestMatch.score > 10 ? bestMatch.subCategory : '其他';
}

module.exports = { classifyWithLLM, keywordClassify };
