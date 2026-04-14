#!/usr/bin/env node

const { google } = require('googleapis');
const fs = require('fs');

const credentials = JSON.parse(fs.readFileSync('./google-credentials.json'));
const SPREADSHEET_ID = '1KIh5NH8AWnxuHPm0dQv5yc2FeaZTbfs_AYdc1U_0EEc';

async function main() {
  try {
    console.log('🔐 正在认证...');
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('\n📖 正在读取表格信息...');
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });

    console.log('✅ 连接成功！');
    console.log(`表格标题: ${response.data.properties.title}`);
    console.log(`工作表数量: ${response.data.sheets.length}`);

  } catch (error) {
    console.error('❌ 错误:', error.message);
    if (error.code) console.error('错误码:', error.code);
    process.exit(1);
  }
}

main();
