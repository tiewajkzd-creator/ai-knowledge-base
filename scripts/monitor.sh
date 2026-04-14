#!/bin/bash
# 监控批量处理任务并通知

WORKSPACE="$HOME/.openclaw/workspace-ai-brain"
LOG_FILE="$WORKSPACE/batch_process.log"

# 等待任务完成
while ps aux | grep -v grep | grep "process-list.js" > /dev/null; do
  sleep 30
done

# 任务完成，发送通知
MESSAGE="✅ 批量处理完成！6个视频已处理并推送到知识库。\n\n访问: https://tiewajkzd-creator.github.io/ai-knowledge-base/"

# 通过sessions_send发送消息到当前会话
# 这里需要你的session key
echo "$MESSAGE"
