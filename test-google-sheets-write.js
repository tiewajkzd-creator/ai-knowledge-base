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

    console.log('\n📝 正在写入测试数据...');
    
    // 写入表头
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1:G1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [['标题', '来源', '链接', '日期', '核心观点', '标签', '评分']]
      }
    });

    // 写入测试数据
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A2',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          '测试内容 - AI知识库',
          'B站',
          'https://example.com',
          new Date().toLocaleDateString('zh-CN'),
          '这是一条测试数据，验证API写入功能',
          'AI绘画,测试',
          '5'
        ]]
      }
    });

    console.log('✅ 数据写入成功！');
    console.log(`\n🔗 查看表格: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

main();
