#!/bin/bash
# generate-card.sh - 接收文章路径，调用 LLM 生成知识卡片
# 用法: ./generate-card.sh <文章路径> [类别]
# 示例: ./generate-card.sh ~/.openclaw/workspace-ai-brain/ai-knowledge-base/AI绘画/xxx.md "AI绘画"

set -e

# 配置
CARDS_DIR="$HOME/.openclaw/workspace-ai-brain/knowledge-cards"
TRIGGERS_FILE="$CARDS_DIR/triggers.json"
MINIMAX_API_URL="https://api.minimaxi.com/anthropic"
MINIMAX_API_KEY="sk-cp-rCEV_COa36wp1NJMRHYfBRXAyiXqJ7SLMMT16z9E2eoUWIOGrjbf3QcFxaRg62T8qMfdaxr3X_1o-sBqsEL-TV31b9e1QF6aRjoSy5p3e9W1C80ICPBa77Q"
MODEL="MiniMax M2.7"

# 检查参数
if [ -z "$1" ]; then
    echo "用法: $0 <文章路径> [类别]"
    exit 1
fi

ARTICLE_PATH="$1"
CATEGORY="${2:-}"

# 检查文件是否存在
if [ ! -f "$ARTICLE_PATH" ]; then
    echo "错误: 文件不存在: $ARTICLE_PATH"
    exit 1
fi

# 获取文件名作为来源
SOURCE_FILE=$(basename "$ARTICLE_PATH")

# 读取文件内容（限制大小）
CONTENT=$(head -c 50000 "$ARTICLE_PATH")

# 如果没有提供类别，从路径推断
if [ -z "$CATEGORY" ]; then
    if [[ "$ARTICLE_PATH" == *"AI绘画"* ]]; then
        CATEGORY="AI绘画"
    elif [[ "$ARTICLE_PATH" == *"AI编程"* ]]; then
        CATEGORY="AI编程"
    elif [[ "$ARTICLE_PATH" == *"Agent"* ]]; then
        CATEGORY="Agent"
    elif [[ "$ARTICLE_PATH" == *"AI前沿"* ]]; then
        CATEGORY="AI前沿"
    elif [[ "$ARTICLE_PATH" == *"个人成长"* ]]; then
        CATEGORY="个人成长"
    else
        CATEGORY="通用"
    fi
fi

# 读取触发词库
TRIGGERS_JSON=$(cat "$TRIGGERS_FILE" 2>/dev/null || echo "{}")

# 构建LLM提示词
PROMPT="你是一个知识提炼专家。从以下文章中提取关键信息，生成知识卡片。

【文章来源】$SOURCE_FILE
【指定类别】$CATEGORY

【文章内容】
$CONTENT

【触发词库】
$TRIGGERS_JSON

请以JSON格式返回知识卡片，包含以下字段：
- id: 基于文件内容的简短哈希（8位）
- source: 源文件名
- category: 类别（从指定类别或触发词库推断）
- date: 当前日期（YYYY-MM-DD格式）
- core: 核心要点（最多50字，简明扼要）
- scenarios: 适用场景数组（1-3个具体场景）
- triggers: 触发关键词数组（3-8个，从触发词库中选择最相关的，覆盖不同类别）
- pattern: 可复用模式/公式（最多200字，总结核心方法论或操作流程）
- confidence: 置信度（0.0-1.0，基于内容完整度评估）
- timesUsed: 初始值0
- lastUsed: 初始值null

只返回JSON，不要有其他内容。"

# 调用MiniMax LLM
RESPONSE=$(curl -s -X POST "$MINIMAX_API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $MINIMAX_API_KEY" \
    -d "{
        \"model\": \"$MODEL\",
        \"messages\": [{\"role\": \"user\", \"content\": $(
            echo "$PROMPT" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read()))"
        )}]
    }" 2>&1)

# 提取JSON响应（处理嵌套的JSON响应）
if echo "$RESPONSE" | python3 -c "import sys,json; json.load(sys.stdin); print('valid')" 2>/dev/null; then
    # 尝试提取content
    CARD_JSON=$(echo "$RESPONSE" | python3 -c "
import sys,json
try:
    d=json.load(sys.stdin)
    if 'content' in d:
        print(d['content'])
    elif 'message' in d:
        print(d['message'].get('content',''))
    else:
        print(d)
except: print(sys.stdin.read())
" 2>/dev/null || echo "$RESPONSE")
else
    # 直接使用响应（可能是模型返回的直接JSON）
    CARD_JSON="$RESPONSE"
fi

# 清理JSON（移除可能的markdown代码块标记）
CARD_JSON=$(echo "$CARD_JSON" | sed 's/^```json//;s/^```//;s/```$//' | tr -d '\n')

# 如果JSON不完整，尝试修复
if ! echo "$CARD_JSON" | python3 -c "import sys,json; json.load(sys.stdin)" 2>/dev/null; then
    echo "警告: LLM返回格式异常，尝试修复..."
    # 提取JSON部分
    CARD_JSON=$(echo "$CARD_JSON" | grep -o '{.*}' | head -1)
fi

# 保存卡片
cd "$CARDS_DIR"
echo "$CARD_JSON" | python3 -c "
import sys,json
try:
    card = json.load(sys.stdin)
    # 生成ID（如果不存在）
    if 'id' not in card or not card['id']:
        import hashlib
        card['id'] = hashlib.md5(card.get('source','').encode()).hexdigest()[:8]
    print(json.dumps(card, ensure_ascii=False, indent=2))
except Exception as e:
    print(f'解析错误: {e}', file=sys.stderr)
    sys.exit(1)
" > "/tmp/card_$$.json" 2>&1

if [ $? -eq 0 ]; then
    # 读取生成的文件获取ID
    CARD_ID=$(python3 -c "import json; print(json.load(open('/tmp/card_$$.json'))['id'])" 2>/dev/null || echo "card")
    
    # 移动到正式位置
    mv "/tmp/card_$$.json" "$CARDS_DIR/${CARD_ID}.json"
    
    echo "✅ 知识卡片生成成功: ${CARD_ID}.json"
    echo "📄 来源: $SOURCE_FILE"
    echo "🏷️ 类别: $CATEGORY"
    cat "$CARDS_DIR/${CARD_ID}.json"
else
    echo "❌ 生成失败，查看临时文件: /tmp/card_$$.json"
    cat "/tmp/card_$$.json"
    exit 1
fi

# 清理
rm -f /tmp/card_$$.json
