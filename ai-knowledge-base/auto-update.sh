#!/bin/bash
cd "$(dirname "$0")"
node generate-data.js
git add data.json
git commit -m "自动更新：重新生成data.json" 
git push
echo "✅ 知识库已自动更新并推送"
