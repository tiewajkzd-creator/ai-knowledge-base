#!/usr/bin/env node
// 知识库小结生成器

const fs = require('fs');

const WORKSPACE = `${process.env.HOME}/.openclaw/workspace-ai-brain`;
const QUEUE_DIR = `${WORKSPACE}/queue`;

// 读取提取的内容
function readExtractedContent(bvid) {
  const files = fs.readdirSync(QUEUE_DIR);
  const file = files.find(f => f.includes(bvid));
  if (!file) return null;
  
  const content = fs.readFileSync(`${QUEUE_DIR}/${file}`, 'utf8');
  return JSON.parse(content);
}

// 生成知识库小结（这里需要LLM处理）
async function generateSummary(data) {
  // 优先使用content字段（新版），兼容transcript字段（旧版）
  const content = data.content || (data.transcript || '') + ' ' + (data.description || '');
  
  return {
    title: data.title,
    source: `B站 - ${data.owner}`,
    link: data.url,
    date: data.pubdate,
    category: "AI绘画", // 从LLM分类获取
    keyPoints: await extractKeyPoints(content),
    tools: extractTools(content),
    tags: generateTags(data.title, content)
  };
}

async function extractKeyPoints(content) {
  const https = require('https');
  
  if (content.length < 100) {
    return ['内容过短，无法提取核心观点'];
  }
  
  const prompt = `从以下视频内容中提取核心观点。观点数量根据内容丰富度决定（3-10个），每个观点详细描述（30-50字），包含具体细节、数据或方法。只返回JSON数组格式：["观点1", "观点2", ...]

内容：${content.slice(0, 2000)}`;

  const payload = {
    model: 'claude-opus-4-5-20251101',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  };
  
  const data = JSON.stringify(payload);

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'code.newcli.com',
      path: '/claude/aws/v1/messages',
      method: 'POST',
      headers: {
        'x-api-key': 'sk-ant-oat01-c4flTja7b9DtNimV_AShj_4POS68J9horznzGC_5FNrDs1pqkPETamlcZxpspVhpZmmkmlKWrr26yBKvnQ6fZk5iUF2plAA',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          console.error('API响应:', body.slice(0, 500));
          const result = JSON.parse(body);
          
          if (!result.content || !result.content[0]) {
            throw new Error('API返回格式错误: ' + JSON.stringify(result));
          }
          
          let text = result.content[0].text;
          text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
          
          const match = text.match(/\[[\s\S]*?\]/);
          if (match) {
            resolve(JSON.parse(match[0]));
          } else {
            throw new Error('未找到JSON数组');
          }
        } catch (e) {
          console.error('解析失败:', e.message);
          const sentences = content.split(/[。！？\n]/).filter(s => s.length > 15 && s.length < 100);
          resolve(sentences.slice(0, 5));
        }
      });
    });

    req.on('error', (e) => {
      console.error('请求失败:', e.message);
      const sentences = content.split(/[。！？\n]/).filter(s => s.length > 15 && s.length < 100);
      resolve(sentences.slice(0, 5));
    });

    req.write(data);
    req.end();
  });
}

function extractTools(content) {
  const tools = [];
  const toolKeywords = ['ComfyUI', 'Flux', 'SDXL', 'LoRA', 'ControlNet', 'GGUF'];
  toolKeywords.forEach(tool => {
    if (content.includes(tool)) tools.push(tool);
  });
  return tools;
}

function generateTags(title, content) {
  const text = title + ' ' + content;
  const tags = [];
  const tagMap = {
    '视频生成': ['视频', 'LTX', 'Sora', 'Pika'],
    '图像生成': ['图像', 'Flux', 'SDXL', 'Midjourney'],
    '工作流': ['工作流', 'ComfyUI', 'workflow']
  };
  
  Object.entries(tagMap).forEach(([tag, keywords]) => {
    if (keywords.some(kw => text.includes(kw))) tags.push(tag);
  });
  return tags;
}

const input = process.argv[2];
if (!input) {
  console.log('用法: node knowledge-summarizer.js <BV号|文件路径>');
  process.exit(1);
}

(async () => {
  let data;
  if (input.endsWith('.json')) {
    data = JSON.parse(fs.readFileSync(input, 'utf8'));
  } else {
    data = readExtractedContent(input);
  }

  if (!data) {
    console.log('未找到提取内容');
    process.exit(1);
  }

  const summary = await generateSummary(data);
  console.log(JSON.stringify(summary, null, 2));
})();
