# PromptSkill4image — 图像提示词工程技能

## 基本信息

| 字段 | 内容 |
|------|------|
| 名称 | PromptSkill4image |
| 类型 | AI Agent Skill（提示词工程工具） |
| GitHub | https://github.com/TanShilongMario/PromptSkill4image |
| 许可 | MIT License |
| 定位 | 图像创作提示词的分析、拆分、翻译、变量扩展工具 |
| 适用平台 | Cursor / Claude Code / Windsurf / Copilot Workspace / Aider / 通用 AI Agent |

---

## 核心功能

| 功能 | 说明 |
|------|------|
| 🎯 提示词拆分 | 识别所有可变部分，统一标注为 `{{variable}}` |
| 📊 变量分类 | 按语义分类（主体/道具/场景/视觉/技术参数） |
| 📚 词库生成 | 每个变量生成 5-12 个双语候选词条 |
| 🌐 双语翻译 | 同时输出中文和英文版本的结构化提示词 |
| 📋 PromptFill JSON | 可导出至 PromptFill 的完整 JSON 模板 |
| ⭐ 质量评估 | 从完整性/专业性/可变性三维度评分 |

---

## 三种输出模式

### 模式 A — 仅分析
输入一段提示词 → 输出变量列表、结构分析、改进建议

### 模式 B — 拆分 + 词库（推荐）
输入一段提示词 → 输出结构化提示词（含 `{{变量}}`）+ 每个变量的双语词库 + 示例填充版本

### 模式 C — 完整 PromptFill 模板
输入一段提示词 → 输出模式 B 全部内容 + 可导入 PromptFill 的完整 JSON

---

## 内置词库覆盖

| 类别 | 变量示例 |
|------|---------|
| 视觉风格 | 艺术风格、色彩方案、光照效果、情绪氛围 |
| 主体角色 | 角色类型、发型、表情神态 |
| 服装道具 | 服装风格、配饰、武器 |
| 场景环境 | 场景地点、背景环境 |
| 摄影技术 | 构图视角、景别、渲染质量、画幅比例 |

---

## 安装方式

### Cursor（个人全局）
```bash
git clone https://github.com/TanShilongMario/PromptSkill4image.git
mkdir -p ~/.cursor/skills/prompt-engineering
cp PromptSkill4image/SKILL.md PromptSkill4image/vocabulary-banks.md PromptSkill4image/examples.md ~/.cursor/skills/prompt-engineering/
```

### Claude Code
```bash
git clone https://github.com/TanShilongMario/PromptSkill4image.git
cd /your-project
mkdir -p .claude/skills/prompt-engineering
cp PromptSkill4image/SKILL.md PromptSkill4image/vocabulary-banks.md PromptSkill4image/examples.md .claude/skills/prompt-engineering/
```

### OpenClaw 直接使用
直接粘贴 `SKILL.md` 内容到系统提示词即可，无需额外安装。

---

## 适用平台

适用于 [Midjourney](https://midjourney.com)、[Stable Diffusion](https://stability.ai)、[即梦](https://jimeng.jianying.com)、[可灵](https://kling.kuaishou.com) 等主流 AI 图像创作平台。

---

## 与 PromptForge 的关联

此项目解决的是「**拿到提示词后如何结构化、变量化、生成变体**」的问题，可作为 PromptForge 提示词收录库的**分析引擎层**：

- 收录的提示词 → 通过 PromptSkill4image 拆解结构化
- 变量化后的提示词 → 存入素材库，支持检索和复用
- PromptFill JSON → 支持跨模型转换和批量生成

---

## 文件结构

```
prompt-engineering/
├── SKILL.md              # 主技能指令
├── vocabulary-banks.md   # 15+ 常用变量类别的通用词库参考
├── examples.md           # 4 个完整使用示例
├── README.md             # 说明文档
└── LICENSE               # MIT 许可证
```

---

**标签：** 提示词工程 / 提示词拆分 / 词库生成 / PromptFill / AI绘画 / Skill / Cursor / Claude Code
