#!/bin/bash
# learn-knowledge.sh - 增量学习流程：读取文章 → 分析 → 生成卡片
# 用法: ./learn-knowledge.sh <文章路径> [类别]
# 示例: ./learn-knowledge.sh ~/.openclaw/workspace-ai-brain/ai-knowledge-base/AI绘画/xxx.md "AI绘画"

set -e

KB_DIR="$HOME/.openclaw/workspace-ai-brain/ai-knowledge-base"
CARDS_DIR="$HOME/.openclaw/workspace-ai-brain/knowledge-cards"
GENERATE_CARD="$CARDS_DIR/generate-card.sh"
LEARNED_LOG="$CARDS_DIR/learned-log.json"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 检查参数
if [ -z "$1" ]; then
    echo "用法: $0 <文章路径> [类别]"
    echo ""
    echo "增量学习流程:"
    echo "  1. 读取文章内容"
    echo "  2. 分析核心要点"
    echo "  3. 生成知识卡片"
    echo "  4. 记录学习历史"
    exit 1
fi

ARTICLE_PATH="$1"
CATEGORY="${2:-}"

# 检查文件是否存在
if [ ! -f "$ARTICLE_PATH" ]; then
    log_error "文件不存在: $ARTICLE_PATH"
    exit 1
fi

# 获取绝对路径
ARTICLE_PATH=$(realpath "$ARTICLE_PATH" 2>/dev/null || echo "$ARTICLE_PATH")
SOURCE_FILE=$(basename "$ARTICLE_PATH")

# 从路径推断类别（如果未指定）
if [ -z "$CATEGORY" ]; then
    if [[ "$ARTICLE_PATH" == *"$KB_DIR/AI绘画"* ]] || [[ "$ARTICLE_PATH" == *"/AI绘画/"* ]]; then
        CATEGORY="AI绘画"
    elif [[ "$ARTICLE_PATH" == *"$KB_DIR/AI编程"* ]] || [[ "$ARTICLE_PATH" == *"/AI编程/"* ]]; then
        CATEGORY="AI编程"
    elif [[ "$ARTICLE_PATH" == *"$KB_DIR/Agent"* ]] || [[ "$ARTICLE_PATH" == *"/Agent/"* ]]; then
        CATEGORY="Agent"
    elif [[ "$ARTICLE_PATH" == *"$KB_DIR/AI前沿"* ]] || [[ "$ARTICLE_PATH" == *"/AI前沿/"* ]]; then
        CATEGORY="AI前沿"
    elif [[ "$ARTICLE_PATH" == *"$KB_DIR/个人成长"* ]] || [[ "$ARTICLE_PATH" == *"/个人成长/"* ]]; then
        CATEGORY="个人成长"
    else
        CATEGORY="通用"
    fi
fi

log_info "开始学习: $SOURCE_FILE"
log_info "类别: $CATEGORY"

# 步骤1: 读取并验证文章内容
CONTENT=$(cat "$ARTICLE_PATH")
CONTENT_LENGTH=${#CONTENT}

if [ "$CONTENT_LENGTH" -lt 100 ]; then
    log_error "文章内容太少，跳过学习"
    exit 1
fi

log_info "文章长度: $CONTENT_LENGTH 字符"

# 步骤2: 生成知识卡片
log_info "调用 LLM 生成知识卡片..."

if [ -x "$GENERATE_CARD" ]; then
    CARD_OUTPUT=$("$GENERATE_CARD" "$ARTICLE_PATH" "$CATEGORY" 2>&1)
    CARD_RESULT=$?
    
    if [ $CARD_RESULT -eq 0 ]; then
        log_info "✅ 知识卡片生成成功"
        
        # 提取卡片ID
        CARD_ID=$(echo "$CARD_OUTPUT" | grep -oP '(?<=\[)[a-f0-9]+(?=\])' | head -1 || echo "")
        
        # 步骤3: 记录学习历史
        log_info "更新学习记录..."
        
        # 初始化或读取学习记录
        if [ -f "$LEARNED_LOG" ]; then
            LEARNED_DATA=$(cat "$LEARNED_LOG")
        else
            LEARNED_DATA='{"learned":[],"lastUpdate":"","total":0}'
        fi
        
        # 添加新记录
        python3 << PYTHON_SCRIPT
import json
from datetime import datetime

learned_data = json.loads('''$LEARNED_DATA''')

new_entry = {
    "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "source": "$SOURCE_FILE",
    "category": "$CATEGORY",
    "path": "$ARTICLE_PATH",
    "cardId": "$CARD_ID",
    "contentLength": $CONTENT_LENGTH
}

learned_data["learned"].insert(0, new_entry)
learned_data["lastUpdate"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
learned_data["total"] = len(learned_data["learned"])

# 只保留最近100条记录
learned_data["learned"] = learned_data["learned"][:100]

print(json.dumps(learned_data, ensure_ascii=False, indent=2))
PYTHON_SCRIPT
        
    else
        log_warn "知识卡片生成失败，但文章已学习"
    fi
else
    log_warn "generate-card.sh 未找到或不可执行，跳过卡片生成"
fi

echo ""
log_info "学习完成!"
log_info "来源: $SOURCE_FILE"
log_info "类别: $CATEGORY"

# 提示可以运行 crosslink
echo ""
echo "💡 可选: 运行以下命令检查 MEMORY.md 关联"
echo "   $CARDS_DIR/crosslink-memory.sh $CARD_ID"
