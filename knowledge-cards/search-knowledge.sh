#!/bin/bash
# search-knowledge.sh - 接收关键词参数，搜索 knowledge-cards/ 下所有 JSON，返回匹配度最高的卡片
# 用法: ./search-knowledge.sh <关键词> [关键词2] ...
# 示例: ./search-knowledge.sh "生图" "工作流"

CARDS_DIR="$HOME/.openclaw/workspace-ai-brain/knowledge-cards"

# 检查参数
if [ -z "$1" ]; then
    echo "用法: $0 <关键词> [关键词2] ..."
    echo "示例: $0 生图 工作流"
    exit 1
fi

KEYWORDS_JSON=$(printf '%s\n' "$@" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read().strip().split()))")

python3 << PYTHON_SCRIPT
import json
import os
import sys
from pathlib import Path

cards_dir = Path("$CARDS_DIR")
keywords = $KEYWORDS_JSON

results = []

for card_file in cards_dir.glob("*.json"):
    if card_file.name in ['triggers.json', 'last-7-days.md']:
        continue
    
    try:
        with open(card_file, 'r') as f:
            card = json.load(f)
        
        score = 0
        matched = []
        
        for kw in keywords:
            kw_lower = kw.lower()
            
            # core 和 pattern 字段
            for field in ['core', 'pattern']:
                if field in card and kw_lower in str(card[field]).lower():
                    score += 10
                    matched.append(f'{field}: {kw}')
            
            # category
            if 'category' in card and kw_lower in card['category'].lower():
                score += 8
                matched.append(f'category: {card["category"]}')
            
            # triggers 权重更高
            if 'triggers' in card:
                for trigger in card['triggers']:
                    if kw_lower in trigger.lower():
                        score += 15
                        matched.append(f'trigger: {trigger}')
            
            # scenarios
            if 'scenarios' in card:
                for scenario in card['scenarios']:
                    if kw_lower in scenario.lower():
                        score += 8
                        matched.append(f'scenario: {scenario}')
        
        if score > 0:
            results.append({
                'score': score,
                'file': str(card_file),
                'matched': matched[:5],
                'card': card
            })
            
    except Exception as e:
        pass

# 排序输出
results.sort(key=lambda x: x['score'], reverse=True)

if results:
    print(f"找到 {len(results)} 个相关卡片\n")
    for i, r in enumerate(results[:10], 1):
        print(f"{'='*50}")
        print(f"#{i} [{r['score']}分] {r['card'].get('source', 'unknown')}")
        print(f"类别: {r['card'].get('category', 'N/A')}")
        print(f"核心: {r['card'].get('core', 'N/A')}")
        print(f"匹配: {'; '.join(r['matched'])}")
        print()
else:
    print("没有找到匹配的卡片")
PYTHON_SCRIPT

echo ""
echo "关键词: $@"
