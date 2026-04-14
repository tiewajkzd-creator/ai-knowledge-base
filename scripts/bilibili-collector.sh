#!/bin/bash
# B站视频采集脚本 - 支持滚动加载

set -e

WORKSPACE="$HOME/.openclaw/workspace-ai-brain"
QUEUE_DIR="$WORKSPACE/queue"

mkdir -p "$QUEUE_DIR"

# 抓取单个博主最新视频
fetch_videos() {
    local uid=$1
    local name=$2
    
    echo "📥 抓取 $name (UID: $uid)"
    
    agent-browser open "https://space.bilibili.com/$uid/video"
    sleep 3
    
    # 滚动3次加载更多视频
    for i in 1 2 3; do
        agent-browser scroll down 1000
        sleep 1
    done
    
    # 获取页面文本
    agent-browser get text body > "$QUEUE_DIR/${uid}_raw.txt"
    
    agent-browser close
    
    echo "✅ 已保存原始数据"
}

# 读取白名单
grep "^| B站" "$WORKSPACE/MEMORY.md" | while IFS='|' read -r _ _ name uid rest; do
    name=$(echo "$name" | xargs)
    uid=$(echo "$uid" | xargs)
    [ -n "$uid" ] && fetch_videos "$uid" "$name"
done

echo "✅ 采集完成！运行 node scripts/parse-videos.js 解析视频"
