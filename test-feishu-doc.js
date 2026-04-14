#!/usr/bin/env node

const https = require('https');
const config = require('./feishu-config.json');

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

async function createDoc(token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      title: "AI大脑知识库 - 测试文档"
    });

    const options = {
      hostname: 'open.feishu.cn',
      path: '/open-apis/docx/v1/documents',
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
          resolve(result.data.document);
        } else {
          reject(new Error(`创建文档失败: ${result.msg || JSON.stringify(result)}`));
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

    console.log('\n📝 正在创建测试文档...');
    const doc = await createDoc(token);
    console.log('✅ 文档创建成功！');
    console.log(`\n🔗 文档链接: ${doc.url}`);
    console.log(`📝 文档ID: ${doc.document_id}`);

    config.test_doc_id = doc.document_id;
    config.test_doc_url = doc.url;
    require('fs').writeFileSync('./feishu-config.json', JSON.stringify(config, null, 2));
    console.log('\n💾 配置已更新');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

main();
