# 十个顶级 Claude Code Skills 推荐

**来源：** 微信公众号 | Feisky  
**原文链接：** [点击查看原文](https://mp.weixin.qq.com/s/b-0ppca5YhiGgxR_mWJNVA)  
**发布时间：** 2026-03-12  
**质量评分：** ⭐⭐⭐⭐⭐  
**成熟度：** 🌿 有参考价值（实战经验+完整安装命令）

---

## Skill vs Plugin

- **Skill**：包含 SKILL.md 的文件夹，教 Claude 怎么做某类任务
- **Plugin**：更完整，可打包命令、SubAgent、Hook 和 MCP 服务器
- 对使用者来说差不多，下面不做区分

---

## 1. Superpowers ⭐⭐⭐⭐⭐

**如果只能装一个，选这个。**

**核心价值：**
- 打包 20+ 可组合 Skill，覆盖软件开发完整流程
- brainstorming、TDD、代码审查、Git 提交，每个环节都有约束

**最常用功能：**

**① brainstorming**
- Claude 不会拿到需求就直接开写
- 先问一轮问题，探索不同方案
- 把设计决策摊开讨论
- 生成设计文档存到本地
- **价值**：很多问题在讨论阶段就暴露，而非写了三百行代码才发现方向不对

**② TDD 工作流**
- 强制 Claude 先写测试再写实现
- 跑不过就继续改，直到全绿
- **对比**：Claude 默认行为是直接写代码然后说"应该没问题"

**使用建议：**
- 20+ Skill 全开可能有点重
- 一般只启用 brainstorming 和 TDD 两个
- 其他按需打开

```bash
claude plugin install superpowers
```

**GitHub:** https://github.com/obra/superpowers

---

## 2. Planning with Files

**解决问题：**
Claude Code 自带 Plan Mode 的致命缺陷：规划存在对话上下文里，上下文一压缩就丢了。

**核心机制：**
- 把规划、进度和知识都写进 Markdown 文件
- Claude 开始干活前先创建计划文件
- 每完成一步就更新进度
- 遇到有用信息就记到知识文件里
- 文件在磁盘上不会丢，即使上下文被压缩也能恢复状态

**思路来源：**
Manus 在复杂任务上表现好，核心原因之一就是中间状态都持久化了。Planning with Files 是社区版实现。

```bash
claude plugin marketplace add OthmanAdi/planning-with-files
claude plugin install planning-with-files
```

**GitHub:** https://github.com/OthmanAdi/planning-with-files

---

## 3. UI UX Pro Max

**解决问题：**
让 Claude 写前端页面，出来的东西大都长一个样：紫色渐变背景、圆角卡片、居中布局，典型的"AI 审美"。

**核心能力：**
- 内置 67 种 UI 风格
- 161 套行业配色方案
- 根据项目类型自动推荐设计系统
- 从配色到排版到交互模式，一步到位

**技术栈支持：**
React、Vue、Svelte、SwiftUI、Flutter（不只是 Web）

**实战效果：**
做 SaaS 后台 dashboard，选 Bento Grid 风格，出来的效果比 Claude 默认的好太多，至少看起来不像 AI 做的了。

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**GitHub:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

---

## 4. Code Review

**官方 Plugin 里设计最精巧的一个。**

**核心机制：**
- 不是让一个 Claude 从头到尾看代码
- 启动多个 Agent 并行审查同一个 PR
- 有的看逻辑正确性，有的看安全漏洞，有的看代码风格
- 每个 Agent 给出的问题都带置信度分数
- 最后按分数过滤，只保留高置信度反馈

**为什么这么设计？**
AI 代码审查最大问题是假阳性太多。以前让 Claude 审代码，总能挑出一堆潜在问题，看着很认真，但大部分都是过度谨慎的废话。有了置信度过滤，留下来的基本都值得看。

**使用注意：**
- 大 PR 跑起来 token 消耗猛
- 好几个 Agent 同时跑，一次 review 吃掉的 token 可能比写代码本身还多
- 小 PR 用着舒服，大 PR 建议先拆再审

```bash
claude plugin install code-review
```

**GitHub:** https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-review

---

## 5. Code Simplifier

**核心功能：**
写代码时容易堆逻辑，写完跑通了就不想再碰。Code Simplifier 帮你做"写完再看一遍"的事情。

**聚焦点：**
- 最近修改过的代码
- 检查重复逻辑
- 多余的中间变量
- 可以合并的条件分支
- 不改功能，只做简化

**实战案例：**
写了一段数据处理逻辑，里面有三段几乎一样的错误处理，跑完 Code Simplifier 它给合并成了一个通用函数，代码量少了三分之一。

```bash
claude plugin install code-simplifier
```

**GitHub:** https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-simplifier

---


## 6. Webapp Testing

**解决问题：** 前端写完了，测试怎么办？手动点来点去太慢，写 Playwright 脚本又太繁琐。

**自动化流程：** 告诉 Claude 要测什么场景 → 它自己用 Playwright 写脚本 → 启动浏览器、跑测试、截屏 → 有问题还会自己调试

```bash
claude plugin marketplace add anthropics/skills
claude plugin install example-skills@anthropic-agent-skills
```

**GitHub:** https://github.com/anthropics/skills/tree/main/skills/webapp-testing

---

## 7. Ralph Loop

**核心机制：** 通过 Stop Hook 拦截 Claude 的退出，把同一个任务重新喂给它。

**解决问题：** Claude Code 有个习惯：做到一半觉得差不多了就停下来说"我已经完成了基础框架"。Ralph Loop 不让它停。

**关键技巧：** 完成条件要写得越具体越好。

✅ 正确示例："所有 CRUD 端点可用，测试覆盖率超过 80%，README 包含 API 文档，完成后输出 COMPLETE"

```bash
claude plugin install ralph-loop
```

---

## 8. MCP Builder

**核心流程：** 把构建过程拆成四个阶段：理解 API → 设计工具接口 → 实现 → 测试

```bash
claude plugin marketplace add anthropics/skills
claude plugin install example-skills@anthropic-agent-skills
```

**GitHub:** https://github.com/anthropics/skills/tree/main/skills/mcp-builder

---

## 9. PPTX

**核心能力：** 让 Claude 直接生成 .pptx 文件，支持母版、图表、动画。

**价值：** 解决"从零开始太痛苦"的问题。起点有了，后面就快了。

```bash
claude plugin marketplace add anthropics/skills
claude plugin install document-skills@anthropic-agent-skills
```

**GitHub:** https://github.com/anthropics/skills/tree/main/skills/pptx

---

## 10. Skill Creator (Meta)

**核心功能：** Anthropic 官方出的，用来帮你创建新的 Skill 的技能。

**关键更新：** 加了 eval 测试框架，可以给 Skill 写测试用例，验证效果，做 A/B 对比。

```bash
claude plugin install skill-creator
```

**GitHub:** https://github.com/anthropics/claude-plugins-official/tree/main/plugins/skill-creator

---

## 使用建议

1. **精选原则：** 不在多，在合适。装太多互相打架，反而影响性能。
2. **项目级管理：** 项目相关的 Skills 放到项目中，提交到 Git，方便管理和团队共享。

---

## 相关资源

- Anthropic 官方 Skills 仓库：https://github.com/anthropics/skills
- Anthropic 官方 Plugins 仓库：https://github.com/anthropics/claude-plugins-official
- Awesome Claude Skills 社区列表：https://github.com/travisvn/awesome-claude-skills
- Claude Code Skills 文档：https://code.claude.com/docs/en/skills
- Skills 市场：https://skillsmp.com/

---

## 我的消化

### 核心洞察

**1. Skill 的本质是约束**
- 不是让 Claude "更聪明"，而是让它按规矩来
- brainstorming 约束它先讨论再写
- TDD 约束它先测试再实现
- Ralph Loop 约束它做完才能停

**2. 工程化思维**
- Planning with Files：持久化状态
- Code Review：多 Agent 并行+置信度过滤
- Skill Creator：eval 测试框架

**3. 分工协作**
- UI UX Pro Max + Webapp Testing：前端全流程
- Superpowers + Code Review + Code Simplifier：开发全流程

### 对 AI大脑+知识库 系统的启发

**1. 约束型思维**
- 统一小结模板 = 输出约束
- 去重引擎 = 质量约束
- 白名单 = 来源约束

**2. 持久化状态**
- Planning with Files 的思路可以借鉴
- 采集进度、过滤规则、白名单都应该持久化

**3. 多 Agent 协作**
- Code Review 的多 Agent 并行+置信度过滤很有启发
- 可以设计多个采集 Agent 并行抓取不同平台

**4. 测试驱动**
- Skill Creator 的 eval 框架值得学习
- 为采集流程设计测试用例

### 可迁移原则

1. **专注单一职责**：每个 Skill 只做一件事
2. **可组合性**：多个 Skill 组合覆盖完整流程
3. **持久化状态**：关键信息写文件，不依赖上下文
4. **数据驱动**：用测试和数据验证效果

---

**关键词：** #Claude-Code #Skills #工程化 #约束型设计 #多Agent协作 #测试驱动
