#!/bin/bash
# inject-context.sh - session 启动时读取近7天讨论关键词，搜索相关卡片，输出可注入上下文的格式
# 用法: 直接运行，或 source ./inject-context.sh

CARDS_DIR="$HOME/.openclaw/workspace-ai-brain/knowledge-cards"
LAST_7_DAYS_FILE="$CARDS_DIR/last-7-days.md"

echo "📚 知识上下文注入"
echo "=================="

# 检查是否有最近讨论记录
if [ ! -f "$LAST_7_DAYS_FILE" ]; then
    echo "暂无讨论记录"
    exit 0
fi

# 提取最近7天的关键词
KEYWORDS=$(python3 << 'PYTHON_SCRIPT'
import re
from datetime import datetime, timedelta

today = datetime.now()
week_ago = today - timedelta(days=7)

try:
    with open("$LAST_7_DAYS_FILE", 'r') as f:
        content = f.read()
    
    keywords = []
    current_date = None
    
    for line in content.split('\n'):
        # 匹配日期行
        date_match = re.match(r'^##?\s*(\d{4}-\d{2}-\d{2})', line)
        if date_match:
            try:
                current_date = datetime.strptime(date_match.group(1), '%Y-%m-%d')
            except:
                current_date = None
            continue
        
        # 收集关键词（短于20字的行，且非空）
        if current_date and week_ago <= current_date <= today:
            stripped = line.strip().lstrip('-* ')
            if stripped and len(stripped) < 30 and not stripped.startswith('#'):
                keywords.append(stripped)
    
    # 去重并输出
    unique = list(dict.fromkeys(keywords))[:15]  # 最多15个关键词
    print(' '.join(unique))
    
except Exception as e:
    print("")
PYTHON_SCRIPT
)

if [ -z "$KEYWORDS" ]; then
    echo "最近7天无讨论记录"
    exit 0
fi

echo "最近7天关键词: $KEYWORDS"
echo ""

# 搜索相关卡片
CARDS_DIR="$HOME/.openclaw/workspace-ai-brain/knowledge-cards"

python3 << PYTHON_SCRIPT
import json
import os
import sys
from pathlib import Path

cards_dir = Path("$CARDS_DIR")
keywords = """$KEYWORDS""".strip().split()

if not keywords:
    sys.exit(0)

results = []

for card_file in cards_dir.glob("*.json"):
    if card_file.name in ['triggers.json', 'last-7-days.md']:
        continue
    
    try:
        with open(card_file, 'r') as f:
            card = json.load(f)
        
        score = 0
        for kw in keywords:
            kw_lower = kw.lower()
            card_text = json.dumps(card, ensure_ascii=False).lower()
            
            if kw_lower in card_text:
                score += 1
                if 'triggers' in card:
                    for trigger in card['triggers']:
                        if kw_lower in trigger.lower():
                            score += 5
                if 'core' in card and kw_lower in card['core'].lower():
                    score += 3
        
        if score > 0:
            results.append({'score': score, 'card': card})
            
    except Exception as e:
        pass

results.sort(key=lambda x: x['score'], reverse=True)

if results:
    print("🎯 相关知识卡片:\n")
    for i, r in enumerate(results[:5], 1):
        c = r['card']
        print(f"【{c.get('category', 'N/A')}】{c.get('source', 'unknown')}")
        print(f"  → {c.get('core', 'N/A')}")
        print(f"  → 场景: {', '.join(c.get('scenarios', [])[:2])}")
        print()
else:
    print("暂无相关卡片")
PYTHON_SCRIPT

echo ""
echo "💡 提示: 可使用 /search <关键词> 主动搜索知识库"
