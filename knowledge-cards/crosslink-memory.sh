#!/bin/bash
# crosslink-memory.sh - 学新卡片时检查 MEMORY.md 匹配项目，追加关联备注
# 用法: ./crosslink-memory.sh <卡片ID或文件路径>
# 示例: ./crosslink-memory.sh abc12345
# 示例: ./crosslink-memory.sh ~/.openclaw/workspace-ai-brain/knowledge-cards/abc12345.json

set -e

CARDS_DIR="$HOME/.openclaw/workspace-ai-brain/knowledge-cards"
MEMORY_FILE="$HOME/.openclaw/workspace-ai-brain/MEMORY.md"

# 检查参数
if [ -z "$1" ]; then
    echo "用法: $0 <卡片ID或文件路径>"
    exit 1
fi

INPUT="$1"

# 如果是文件路径，提取ID；否则假设输入就是ID
if [ -f "$INPUT" ]; then
    CARD_FILE="$INPUT"
    CARD_ID=$(basename "$CARD_FILE" .json)
else
    CARD_ID="$INPUT"
    CARD_FILE="$CARDS_DIR/${CARD_ID}.json"
fi

# 检查卡片是否存在
if [ ! -f "$CARD_FILE" ]; then
    echo "错误: 卡片不存在: $CARD_FILE"
    exit 1
fi

# 读取卡片内容
python3 << PYTHON_SCRIPT
import json
import re
import sys
from pathlib import Path

card_file = "$CARD_FILE"
memory_file = Path("$MEMORY_FILE")

# 读取卡片
with open(card_file, 'r') as f:
    card = json.load(f)

card_id = card.get('id', '')
card_source = card.get('source', '')
card_category = card.get('category', '')
card_core = card.get('core', '')
card_triggers = card.get('triggers', [])
card_scenarios = card.get('scenarios', [])

# 提取关键词
keywords = []
if card_core:
    keywords.extend(re.findall(r'[\w]+', card_core))
keywords.extend([t for t in card_triggers if isinstance(t, str)])
keywords.extend([s for s in card_scenarios if isinstance(s, str)])
keywords = [k.lower() for k in keywords[:20]]  # 限制数量

# 读取MEMORY.md
if memory_file.exists():
    with open(memory_file, 'r') as f:
        memory_content = f.read()
else:
    memory_content = ""

# 查找匹配的项目
matches = []

# 按行分析MEMORY.md
lines = memory_content.split('\n')
for i, line in enumerate(lines):
    line_lower = line.lower()
    score = 0
    for kw in keywords:
        if kw in line_lower:
            score += 1
    if score > 0:
        matches.append((score, i+1, line.strip()))

# 按分数排序
matches.sort(key=lambda x: x[0], reverse=True)

# 输出结果
if matches:
    print(f"找到 {len(matches)} 个相关MEMORY条目:\n")
    for score, line_num, line_text in matches[:5]:
        print(f"  第{line_num}行 [{score}分]: {line_text[:60]}...")
    
    # 生成关联备注
    association_note = f"\n## 关联知识卡片\n\n- **{card_source}** ({card_category}): {card_core}\n  - 触发词: {', '.join(card_triggers[:5])}\n  - ID: {card_id}\n"
    
    print(f"\n📎 建议添加的关联备注:\n{association_note}")
else:
    print("MEMORY.md 中未找到直接匹配的项目")
    print("可能需要手动关联，或确保卡片核心内容与MEMORY项目相关")
PYTHON_SCRIPT

echo ""
echo "💡 提示: 可将上述关联备注追加到 MEMORY.md 中"
