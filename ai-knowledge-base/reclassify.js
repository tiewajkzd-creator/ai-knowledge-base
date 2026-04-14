const fs = require('fs');
const path = require('path');
const { classify } = require('./classifier.js');

const baseDir = __dirname;
const categories = ['Agent系统', 'AI绘画', 'AI编程', 'AI前沿', '个人成长'];

categories.forEach(cat => {
  const catPath = path.join(baseDir, cat);
  if (!fs.existsSync(catPath)) return;
  
  fs.readdirSync(catPath).forEach(sub => {
    const subPath = path.join(catPath, sub);
    if (!fs.statSync(subPath).isDirectory()) return;
    
    fs.readdirSync(subPath).forEach(file => {
      if (!file.endsWith('.md')) return;
      
      const filePath = path.join(subPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const title = content.split('\n')[0].replace(/^#\s*/, '');
      
      const suggestedSub = classify(title, content, cat);
      
      if (suggestedSub && suggestedSub !== sub) {
        const newPath = path.join(catPath, suggestedSub);
        if (!fs.existsSync(newPath)) fs.mkdirSync(newPath, { recursive: true });
        
        const newFilePath = path.join(newPath, file);
        fs.renameSync(filePath, newFilePath);
        console.log(`✅ 移动: ${cat}/${sub}/${file} → ${cat}/${suggestedSub}/`);
      }
    });
  });
});

console.log('✅ 重新分类完成');
