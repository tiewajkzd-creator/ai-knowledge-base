#!/bin/bash
# 主采集流程 - 一键执行

set -e

SCRIPT_DIR="$HOME/.openclaw/workspace-ai-brain/scripts"

echo "🚀 开始完整采集流程..."
echo ""

# 1. 采集视频列表
echo "📥 步骤1: 采集视频列表"
bash "$SCRIPT_DIR/bilibili-collector.sh"
echo ""

# 2. 解析视频信息
echo "📊 步骤2: 解析视频信息"
node "$SCRIPT_DIR/parse-videos.js"
echo ""

# 3. 抓取视频详情
echo "📹 步骤3: 抓取视频详情（字幕+评论）"
node "$SCRIPT_DIR/video-detail-processor.js"
echo ""

# 4. 生成内容小结
echo "📝 步骤4: 生成内容小结"
node "$SCRIPT_DIR/generate-summary.js"
echo ""

echo "✅ 全部完成！结果保存在: $HOME/.openclaw/workspace-ai-brain/queue"
