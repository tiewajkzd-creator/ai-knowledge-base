#!/usr/bin/env node

const { google } = require('googleapis');
const fs = require('fs');

const credentials = JSON.parse(fs.readFileSync('./google-credentials.json'));

async function main() {
  try {
    console.log('🔐 正在认证...');
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('\n📊 正在创建Google Sheets...');
    const response = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: 'AI大脑知识库'
        },
        sheets: [
          { properties: { title: '🎨 AI绘画' } },
          { properties: { title: '💻 AI编程' } },
          { properties: { title: '🤖 OpenAWS·Agent' } },
          { properties: { title: '🔭 AI前沿动态' } },
          { properties: { title: '📖 个人成长' } }
        ]
      }
    });

    const spreadsheetId = response.data.spreadsheetId;
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

    console.log('✅ 表格创建成功！');
    console.log(`\n🔗 访问链接: ${url}`);
    console.log(`📝 表格ID: ${spreadsheetId}`);

    const config = { spreadsheet_id: spreadsheetId, spreadsheet_url: url };
    fs.writeFileSync('./google-sheets-config.json', JSON.stringify(config, null, 2));
    console.log('\n💾 配置已保存');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

main();
