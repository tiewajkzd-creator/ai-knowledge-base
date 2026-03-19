#!/bin/bash
# 智能分类+自动同步脚本

set -e  # 遇到错误立即退出

# 切换到知识库目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ARTICLE_PATH="$1"
ARTICLE_TITLE="$2"

# 转换为绝对路径
if [[ "$ARTICLE_PATH" != /* ]]; then
    ARTICLE_PATH="$SCRIPT_DIR/$ARTICLE_PATH"
fi

if [ -z "$ARTICLE_PATH" ] || [ ! -f "$ARTICLE_PATH" ]; then
    echo "❌ 文件不存在: $ARTICLE_PATH"
    exit 1
fi

# 读取文章内容进行分类
CONTENT=$(cat "$ARTICLE_PATH")

# ============================================
# 提示词收录 智能识别（多信号打分机制）
# ============================================
PROMPT_VAULT_SCORE=0

# 信号1：显式标签（直接命中，最高优先）
if echo "$CONTENT" | grep -q "#提示词收录\|#PromptVault\|#提示词素材"; then
    PROMPT_VAULT_SCORE=100
fi

# 仅在未直接命中时才走打分逻辑
if [ "$PROMPT_VAULT_SCORE" -lt 100 ]; then
    # 信号2：含生图参数（高权重 +30）
    if echo "$CONTENT" | grep -qE -- '--ar\s|--style\s|--v\s|--quality\s|--q\s|--seed\s|--niji|--chaos\s|Steps:\s|CFG:\s|Sampler:'; then
        PROMPT_VAULT_SCORE=$((PROMPT_VAULT_SCORE + 30))
    fi

    # 信号3：含负面提示词标记（高权重 +30）
    if echo "$CONTENT" | grep -qi "negative prompt\|负面提示词\|反向提示词\|Negative:"; then
        PROMPT_VAULT_SCORE=$((PROMPT_VAULT_SCORE + 30))
    fi

    # 信号4：标题含提示词分享意图（中权重 +25）
    if echo "$ARTICLE_TITLE" | grep -qi "提示词分享\|prompt分享\|咒语\|魔法词\|提示词合集\|prompt collection\|收录"; then
        PROMPT_VAULT_SCORE=$((PROMPT_VAULT_SCORE + 25))
    fi

    # 信号5：含目标模型字段（中权重 +20）
    if echo "$CONTENT" | grep -q "**目标模型：**\|**模型：**\|target_model"; then
        PROMPT_VAULT_SCORE=$((PROMPT_VAULT_SCORE + 20))
    fi

    # 信号6：来源为提示词平台（中权重 +20）
    if echo "$CONTENT" | grep -qi "civitai\|liblib\|nanobanana\|prompthero\|lexica\.art"; then
        PROMPT_VAULT_SCORE=$((PROMPT_VAULT_SCORE + 20))
    fi

    # 信号7：含代码块且内容像英文prompt而非代码（中权重 +15）
    # 检查代码块中是否含有典型prompt词汇但不含编程关键词
    if echo "$CONTENT" | grep -qP '```[\s\S]*?(masterpiece|best quality|highly detailed|8k|photorealistic|cinematic|anime|illustration)' 2>/dev/null; then
        PROMPT_VAULT_SCORE=$((PROMPT_VAULT_SCORE + 15))
    fi
fi

# ============================================
# 分类决策
# ============================================

# 提示词收录：分数≥50 即归入
if [ "$PROMPT_VAULT_SCORE" -ge 50 ]; then
    TARGET_DIR="AI绘画/提示词收录"
    echo "🗂️ 识别为提示词收录内容（置信度: ${PROMPT_VAULT_SCORE}分）"
elif echo "$CONTENT" | grep -q "#模型更新\|#AI前沿"; then
    TARGET_DIR="AI前沿/模型更新"
elif echo "$CONTENT" | grep -q "#AI视频\|#分镜\|#Seedance\|#提示词工程"; then
    TARGET_DIR="AI绘画/工作流教程"
elif echo "$CONTENT" | grep -q "#Agent系统\|#Skill开发\|#Claude.*Skill"; then
    TARGET_DIR="Agent系统/Skill开发"
elif echo "$CONTENT" | grep -q "#AI编程\|#Claude.*Code\|#Cursor"; then
    TARGET_DIR="AI编程/Claude-Code"
elif echo "$CONTENT" | grep -q "#OpenClaw\|#OpenAWS"; then
    TARGET_DIR="Agent系统/OpenClaw教程"
elif echo "$CONTENT" | grep -q "#AI前沿\|#模型更新"; then
    TARGET_DIR="AI前沿/模型更新"
else
    # 默认根据一级分类判断
    if echo "$ARTICLE_PATH" | grep -q "AI绘画"; then
        TARGET_DIR="AI绘画/工作流教程"
    elif echo "$ARTICLE_PATH" | grep -q "Agent系统"; then
        TARGET_DIR="Agent系统/Skill开发"
    elif echo "$ARTICLE_PATH" | grep -q "AI编程"; then
        TARGET_DIR="AI编程/工具指南"
    else
        TARGET_DIR="AI前沿/资讯速览"
    fi
fi

# 确保目标目录存在
mkdir -p "$TARGET_DIR"

# 获取文件名
FILENAME=$(basename "$ARTICLE_PATH")
TARGET_PATH="$SCRIPT_DIR/$TARGET_DIR/$FILENAME"

# 如果文件不在正确位置，移动它
if [ "$ARTICLE_PATH" != "$TARGET_PATH" ]; then
    echo "📦 移动文件: $ARTICLE_PATH → $TARGET_DIR/$FILENAME"
    mv "$ARTICLE_PATH" "$TARGET_PATH"
    ARTICLE_PATH="$TARGET_PATH"
fi

# 重新生成data.json
echo "🔄 重新生成data.json..."
if ! node generate-data.js; then
    echo "❌ data.json生成失败"
    exit 1
fi

# Git提交推送
echo "📤 推送到GitHub..."
git add -A

if git diff --cached --quiet; then
    echo "⚠️  没有变更需要提交"
    exit 0
fi

if ! git commit -m "新增：${ARTICLE_TITLE:-更新知识库}"; then
    echo "❌ Git提交失败"
    exit 1
fi

if ! git push; then
    echo "❌ Git推送失败"
    exit 1
fi

echo "✅ 同步完成！"
echo "📍 文件位置: $TARGET_DIR/$FILENAME"
echo "🌐 预计1-2分钟后在线可见: https://tiewajkzd-creator.github.io/ai-knowledge-base/"
