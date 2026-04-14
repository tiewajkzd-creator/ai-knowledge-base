---
title: Claude Code 源码泄漏：51万行代码里藏着什么
---
# Claude Code 源码泄漏：51万行代码里藏着什么

- 文章标题：Claude Code 源码泄漏：51万行代码里藏着什么
- 来源平台：微信
- 原始链接：https://mp.weixin.qq.com/s/BP3mjcU-fWLSFN6ezCqbIA
- 作者：Feisky
- 发布时间：2026-03-31 22:09
- 标签：Claude Code, 源码分析, KAIROS, BUDDY, DAEMON, 技术架构

## 泄漏原因

Claude Code的构建流程漏了排除.map文件，一个57MB的source map文件被发布到npm registry。更离谱的是，这个source map里引用的原始TypeScript源码托管在Cloudflare R2存储桶上，公开可访问。

## 规模数据

- 约**1900个**TypeScript源文件
- 超过**51.2万行**代码
- **40多个**内置工具
- **50多个**slash命令
- 技术栈：Bun运行时 + React/Ink终端UI + Commander.js + Zod v4

## 核心架构

### QueryEngine：4.6万行的大脑
处理所有LLM API交互：流式响应、工具调用循环、思考模式、重试逻辑、token计数。4.6万行塞在一个文件里，说明Claude Code在API调用层做了大量工程优化。

### 七层记忆系统
```
Managed → 组织管理员配置的CLAUDE.md
User → ~/.claude/CLAUDE.md
Project → {项目}/CLAUDE.md
Local → {项目}/CLAUDE.local.md
AutoMem → 自动提取的记忆
TeamMem → 团队共享记忆
Session → ~/.claude/projects/{session}/session-memory/*.md
```

**Dream机制**：当积累超过24小时且至少5个会话时，触发后台记忆整理子代理，分四个阶段：
- Orient（定位）→ Gather（收集）→ Consolidate（整合）→ Prune（修剪）

### 工具系统
- BashTool → Shell命令执行
- FileReadTool → 文件读取（支持图片、PDF、Notebook）
- AgentTool → 子代理生成
- MCPTool → MCP服务器工具调用
- LSPTool → 语言服务器协议集成
- CronCreateTool → 定时触发器
- SleepTool → 主动模式下的等待

### 多Agent编排
三层基础设施：
- AgentTool：生成子代理，独立上下文+独立工具权限
- coordinator/：多Agent协调，任务分配和结果汇总
- TeamCreateTool：创建代理团队并行工作

## 未发布功能解析

### KAIROS：永远在线的助手
- 跨会话记住所有内容
- 每天自动写日志（~/.claude/.../logs/YYYY/MM/DD.md）
- append-only模式
- Dream过程只读，整理时间上限15秒
- proactive模式：定期`<tick>`提示自动触发，主动执行操作
- 核心slogan："take initiative without waiting for instructions"

### BUDDY：AI宠物
- 18个物种（鸭子、龙、章鱼、水豚、蘑菇……）
- 6个稀有度等级（普通→闪光）
- 5个属性值（调试力、耐心、混乱值、智慧、毒舌）
- 待机和眨眼动画、语音气泡
- 可用/buddy pet命令撸它
- Teaser：2026年4月1-7日，正式上线可能在5月

### ULTRAPLAN：云端深度规划
- 复杂任务甩到云端独立实例
- 用Opus模型跑最多30分钟
- 规划完在浏览器审批，选择云端执行或"传送"到本地

### DAEMON：后台守护进程
- Claude会话在后台运行，像系统服务一样
- 完整命令集：daemon/ps/logs/attach/kill
- 配合--bg参数在tmux里运行
- 和Docker容器管理思路很像

### 32个Feature Flag
通过bun:bundle在构建时做死代码消除，配合GrowthBook做灰度发布。

## 工程细节

### 启动优化
main.tsx里在模块加载前并行预取MDM设置和Keychain读取，重型模块全用动态import()懒加载。启动序列有18步，在看到光标前就跑完了。

### 遥测系统
100多种事件类型，几乎覆盖所有操作。几个有意思的发现：

- **阿谀检测器**：对每条模型响应做模式匹配，检测是否过度迎合
- **会话质量分类器**：每个会话都会被分类器评估质量
- **系统提示词指纹**：计算SHA-256哈希上报，不需要读完整提示词就知道你改没改过

### 远程Kill Switch
通过Statsig的tengu-off-switch配置，可以远程让特定模型停止响应。但OAuth用户被豁免，API Key用户可以被远程关闭。

## 一句话总结

Claude Code的51万行源码揭示了一个架构极其复杂的Agent系统，KAIROS（主动助手）、BUDDY（AI宠物）、DAEMON（后台守护）等未发布功能让Claude Code正在从一个编程助手进化为"本地AI操作系统"。

---

## 我的消化

🌱 **新鲜观点**

1. **Claude Code不是套壳，是复杂Agent系统**：1900个文件+51万行代码，QueryEngine单文件4.6万行，架构复杂度远超预期
2. **记忆系统7层设计**：AutoMem+TeamMem+Session的分工很值得借鉴
3. **Dream机制=记忆压缩**：用后台整理子代理做记忆压缩，类比人类睡眠记忆巩固，优雅
4. **DAEMON设计思路**：借鉴Docker的容器管理思路，做CLI的进程管理
5. **KAIROS=OpenClaw官方版**：Anthropic在做OpenClaw做的事，但集成度更高
6. **遥测的边界**：阿谀检测、会话质量分类、提示词指纹——这些隐私边界值得注意

**工程借鉴**：
- 启动18步的模块化初始化流程
- Feature Flag + 灰度发布的工程实践
- append-only日志 + 后台整理的记忆模式

**相关资源**：
- GitHub镜像：https://github.com/instructkr/claude-code
- 隐藏功能整理：https://ccleaks.com

- 自动标签：Claude Code, 源码分析, KAIROS, BUDDY, DAEMON, 技术架构, Anthropic
- 质量评分：⭐⭐⭐⭐⭐（5星）
- 知识成熟度：🌱 新鲜观点
- 写入时间：2026-04-01
