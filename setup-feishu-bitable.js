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

async function createBitable(token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name: "AI大脑知识库"
    });

    const options = {
      hostname: 'open.feishu.cn',
      path: '/open-apis/bitable/v1/apps',
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
          resolve(result.data.app);
        } else {
          reject(new Error(`创建多维表格失败: ${result.msg || JSON.stringify(result)}`));
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

    console.log('\n📊 正在创建多维表格...');
    const bitable = await createBitable(token);
    console.log('✅ 多维表格创建成功！');
    console.log(`\n🔗 访问链接: ${bitable.url}`);
    console.log(`📝 表格ID: ${bitable.app_token}`);

    config.bitable_app_token = bitable.app_token;
    config.bitable_url = bitable.url;
    require('fs').writeFileSync('./feishu-config.json', JSON.stringify(config, null, 2));
    console.log('\n💾 配置已更新');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

main();
