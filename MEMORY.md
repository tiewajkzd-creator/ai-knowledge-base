# MEMORY.md — AI大脑+知识库 长期记忆

## 系统状态
- 启动时间：2026-03-09
- 知识库条目：0条
- 白名单博主：待补充
- 自动模式进度：0/30触发 | 0/100条目 | 命中率：0%

## 白名单博主清单
| 平台 | 账号名 | UID | 内容方向 | 优先级 |
|------|--------|-----|----------|--------|
| B站 | AI超元域 | 1648704464 | AI工具 | 中 |
| B站 | 三层楼的小肥猴 | 389291683 | AI绘画 | 高 |

## 核心关键词词库

### 1️⃣ AI绘画
**新兴模型/工具：**
- 视频生成：Sora, Pika, Runway Gen-3, 可灵(Kling), Luma Dream Machine, Seedance 2.0
- 图像生成：Ideogram, Leonardo AI, Playground AI, Midjourney, DALL-E 3
- 谷歌系：Imagen 3, Veo, Gemini Image
- 国产：即梦(Jimeng), 通义万相, 文心一格, Minimax, Hailuo AI
- 开源：Stable Diffusion, SDXL, Flux, ComfyUI, Automatic1111, Fooocus

**具体功能场景：**
- 图像编辑：局部重绘/inpainting, 背景替换, 风格迁移, 图像超分/upscale
- 人物处理：换脸/face swap, 表情迁移, 年龄变化, 虚拟试衣
- 视频相关：图生视频, 文生视频, 视频插帧, 动作捕捉, AI舞蹈生成
- 创意工具：分镜生成/storyboard, 角色一致性, 场景扩展, 3D建模
- 辅助功能：提示词反推, 提示词优化, 参数推荐, 批量生成

### 2️⃣ Agent
- 框架：LangChain, LangGraph, AutoGPT, CrewAI, MetaGPT, BabyAGI
- 核心概念：多智能体协作, 工具调用, 记忆系统/RAG, 规划推理, 任务分解
- 应用：自动化工作流, 代码生成, 数据分析, 知识管理

### 3️⃣ 提示词
- 技术：Chain of Thought, Few-shot, System prompt, Prompt engineering, 角色扮演
- 应用：文案写作, 代码生成, 图像生成, 数据提取

### 4️⃣ AI工具
- 生产力：ChatGPT, Claude, Gemini, Cursor, GitHub Copilot, Notion AI, Perplexity
- 创意：Runway, Pika, Sora, ElevenLabs, Suno AI
- 开发：Vercel v0, Bolt.new, Replit, Hugging Face
- 新兴：AI搜索, AI浏览器, AI视频编辑, AI音频处理

### 5️⃣ OpenClaw
- 核心：Skills, MCP, Cron, Sessions, Gateway
- 生态：ClawHub, Browser control, Node pairing, Messaging
- 场景：自动化采集, 知识库构建, 多平台集成, 定时推送

### 6️⃣ Claude/Code
- 特性：Claude 3.5 Sonnet/Opus, Artifacts, Extended thinking, Vision, MCP
- 代码：代码审查, 重构优化, 调试排错, 架构设计, 测试生成

### 7️⃣ AI编程
- 工具：Cursor, Windsurf, Zed, Aider, Continue, Cline, GitHub Copilot
- 功能：代码补全, 代码生成, 单元测试, 文档生成

### 8️⃣ AI前沿动态
- 平台：ProductHunt, Hugging Face, GitHub Trending, Papers with Code
- 内容：AI新闻, 模型评测, benchmark, 开源项目

### 9️⃣ 工作流自动化
- 工具：n8n, Zapier, Make, Shortcuts, Alfred
- 功能：数据采集, web scraping, API集成, webhook

### 🔟 个人成长
- 方向：学习方法论, 认知升级, 效率工具, 知识管理/PKM, 时间管理/GTD

---

## 关键词动态更新机制

**每周日 21:00 自动执行：**

1. 抓取新工具（ProductHunt AI / Hugging Face / GitHub Trending）
2. 提取功能词（分析本周采集内容，提取高频词≥3次）
3. 生成更新报告（新增工具X个，新增功能词Y个）
4. 推送至Telegram供审核
5. 确认后自动写入MEMORY.md并生效

**更新来源：**
- ProductHunt AI分类 Top 10
- Hugging Face Papers Top 10
- GitHub Trending AI/ML Top 10
- Reddit r/StableDiffusion, r/ArtificialIntelligence
- X (Twitter) AI KOL账号
- 本周采集内容的高频标签

## 已接入平台
- GitHub Pages知识库：https://tiewajkzd-creator.github.io/ai-knowledge-base/
- 更新方式：本地修改data.json → git push自动部署

## 历史教训
（踩坑后记录）
