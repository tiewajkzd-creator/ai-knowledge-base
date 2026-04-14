#!/usr/bin/env node
// 使用通义千问API提取核心观点

const https = require('https');

const API_KEY = process.env.QWEN_API_KEY || 'sk-your-key-here';

async function extractKeyPoints(content) {
  if (content.length < 100) {
    return ['内容过短，无法提取核心观点'];
  }

  const prompt = `从以下视频内容中提取核心观点。观点数量根据内容丰富度决定（3-10个），每个观点详细描述（30-50字），包含具体细节、数据或方法。只返回JSON数组格式：["观点1", "观点2", ...]

内容：${content.slice(0, 2000)}`;

  const data = JSON.stringify({
    model: 'qwen-plus',
    messages: [{ role: 'user', content: prompt }]
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'dashscope.aliyuncs.com',
      path: '/compatible-mode/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          const text = result.choices[0].message.content;
          const match = text.match(/\[[\s\S]*?\]/);
          if (match) {
            resolve(JSON.parse(match[0]));
          } else {
            resolve(['提取失败']);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

module.exports = { extractKeyPoints };

// 测试
if (require.main === module) {
  const fs = require('fs');
  const file = process.argv[2];
  if (!file) {
    console.log('用法: node llm-extractor.js <result.json>');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  extractKeyPoints(data.content || data.transcript || '')
    .then(points => console.log(JSON.stringify(points, null, 2)))
    .catch(err => console.error('错误:', err.message));
}
