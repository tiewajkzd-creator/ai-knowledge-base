#!/usr/bin/env node

const https = require('https');
const config = require('./feishu-config.json');

const WIKI_SPACE_ID = 'FZjRwEqnFijAC2k8gelcQpyJncd';

function getAccessToken() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      app_id: config.app_id,
      app_secret: config.app_secret
    });

    const options = {
      hostname: 'open.feishu.cn',
      path: '/open-apis/auth/v3/tenant_access_token/internal',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        const result = JSON.parse(body);
        if (result.code === 0) {
          resolve(result.tenant_access_token);
        } else {
          reject(new Error(`获取token失败: ${result.msg}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function createWikiNode(token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      obj_type: "doc",
      parent_node_token: "",
      node_type: "origin",
      origin_node_token: "",
      title: "测试内容 - " + new Date().toLocaleString('zh-CN')
    });

    const options = {
      hostname: 'open.feishu.cn',
      path: `/open-apis/wiki/v2/spaces/${WIKI_SPACE_ID}/nodes`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        const result = JSON.parse(body);
        console.log('API响应:', JSON.stringify(result, null, 2));
        if (result.code === 0) {
          resolve(result.data.node);
        } else {
          reject(new Error(`创建节点失败: ${result.msg || JSON.stringify(result)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  try {
    console.log('🔐 正在获取访问令牌...');
    const token = await getAccessToken();
    console.log('✅ 令牌获取成功');

    console.log('\n📝 正在写入测试内容到知识库...');
    const node = await createWikiNode(token);
    console.log('✅ 内容写入成功！');
    console.log(`\n📄 节点ID: ${node.node_token}`);
    console.log(`🔗 访问链接: https://my.feishu.cn/wiki/${WIKI_SPACE_ID}?p=${node.node_token}`);

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

main();
