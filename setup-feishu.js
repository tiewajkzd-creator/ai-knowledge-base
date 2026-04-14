#!/usr/bin/env node

const https = require('https');

const config = require('./feishu-config.json');

// 获取 tenant_access_token
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

// 创建文件夹（作为知识库根目录）
async function createFolder(token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name: config.knowledge_base.name,
      folder_type: "normal"
    });

    const options = {
      hostname: 'open.feishu.cn',
      path: '/open-apis/drive/v1/files/create_folder',
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
          resolve(result.data);
        } else {
          reject(new Error(`创建文件夹失败: ${result.msg || JSON.stringify(result)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// 主流程
async function main() {
  try {
    console.log('🔐 正在获取访问令牌...');
    const token = await getAccessToken();
    console.log('✅ 令牌获取成功');

    console.log('\n📁 正在创建知识库文件夹...');
    const folder = await createFolder(token);
    console.log('✅ 文件夹创建成功！');
    console.log(`\n📝 文件夹Token: ${folder.token}`);
    console.log(`🔗 访问链接: https://feishu.cn/drive/folder/${folder.token}`);

    // 保存文件夹信息
    config.folder_token = folder.token;
    config.folder_url = folder.url;
    require('fs').writeFileSync('./feishu-config.json', JSON.stringify(config, null, 2));
    console.log('\n💾 配置已更新');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

main();
