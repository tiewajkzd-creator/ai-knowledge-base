const fs = require('fs');
const path = require('path');

const categories = {
    'Agent系统': '🤖',
    'AI绘画': '🎨',
    'AI编程': '💻',
    'AI前沿': '🔭',
    '个人成长': '📖'
};

const grouped = {};
const articles = [];

Object.keys(categories).forEach(cat => {
    grouped[cat] = {};
    const catPath = path.join(__dirname, cat);
    if (!fs.existsSync(catPath)) return;
    
    fs.readdirSync(catPath).forEach(sub => {
        const subPath = path.join(catPath, sub);
        if (!fs.statSync(subPath).isDirectory()) return;
        
        grouped[cat][sub] = [];
        fs.readdirSync(subPath).forEach(file => {
            if (!file.endsWith('.md')) return;
            
            const content = fs.readFileSync(path.join(subPath, file), 'utf-8');
            
            // 解析 frontmatter（如果有）
            let body = content;
            let frontmatter = {};
            if (content.startsWith('---')) {
                const end = content.indexOf('\n---', 3);
                if (end !== -1) {
                    const fm = content.slice(3, end).trim();
                    fm.split('\n').forEach(line => {
                        const idx = line.indexOf(':');
                        if (idx !== -1) {
                            frontmatter[line.slice(0, idx).trim()] = line.slice(idx+1).trim();
                        }
                    });
                    body = content.slice(end + 4);
                }
            }
            
            const lines = body.split('\n');
            
            // 标题优先取 frontmatter 的 title，其次取第一个 # 标题
            let title = frontmatter.title || '';
            if (!title) {
                const h1 = lines.find(l => l.startsWith('# '));
                title = h1 ? h1.replace(/^#\s*/, '') : (lines[0]?.trim() || '');
            }
            
            let author = '未知';
            const sourceLine = lines.find(l => l.startsWith('**来源：**'));
            if (sourceLine) {
                const match = sourceLine.match(/\*\*来源：\*\*\s*(.+)/);
                if (match) {
                    const parts = match[1].split('-').map(p => p.trim());
                    author = parts.length > 1 ? parts[1] : parts[0];
                }
            }
            
            const dateStr = lines.find(l => l.includes('**发布时间：**'))?.match(/\*\*发布时间：\*\*\s*(.+)/)?.[1] || '';
            const scoreStr = lines.find(l => l.includes('**质量评分：**'))?.match(/\*\*质量评分：\*\*\s*(.+)/)?.[1] || '';
            
            const article = {
                category: cat,
                subCategory: sub,
                title: title,
                file,
                date: dateStr,
                dateSort: parseDateForSort(dateStr),
                score: scoreStr,
                scoreNum: (scoreStr.match(/⭐/g) || []).length,
                author,
                freshness: lines.find(l => l.includes('**成熟度：**'))?.match(/\*\*成熟度：\*\*\s*(.+)/)?.[1] || '📚 经典教程',
                path: `${cat}/${sub}/${file}`
            };
            
            function parseDateForSort(str) {
                if (!str) return 0;
                const match = str.match(/(\d{4})-(\d{2})-(\d{2})/);
                if (match) return new Date(match[0]).getTime();
                const yearMatch = str.match(/(\d{4})年(\d{1,2})月/);
                if (yearMatch) return new Date(`${yearMatch[1]}-${yearMatch[2].padStart(2,'0')}-01`).getTime();
                const yearOnly = str.match(/(\d{4})年/);
                if (yearOnly) return new Date(`${yearOnly[1]}-01-01`).getTime();
                return 0;
            }
            
            grouped[cat][sub].push(article);
            articles.push(article);
        });
    });
});

fs.writeFileSync(
    path.join(__dirname, 'data.json'),
    JSON.stringify({ categories, grouped, articles }, null, 2)
);

console.log('✅ data.json 已生成');
