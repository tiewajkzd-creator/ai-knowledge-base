---
title: Harness Engineering — AI工程的第三次重心迁移（完整版）
date: 2026-04-14
source: B站视频 BV1Zk9FBwELs
tags: Agent / Harness Engineering / Prompt Engineering / Context Engineering / 技能开发
---

# Harness Engineering — AI工程的第三次重心迁移（完整版）

> 来源：B站视频 https://www.bilibili.com/video/BV1Zk9FBwELs/
> 采集时间：2026-04-14
> 时长：18分30秒
> 分类：AI方法论
> 标签：Harness Engineering、Agent、Prompt Engineering、Context Engineering

## 核心定义

Harness Engineering 是 AI 工程领域继 **Prompt Engineering**、**Context Engineering** 之后的**第三次重心迁移**。

核心公式：**Agent = Model + Harness**，而 **Harness = Agent − Model**

---

## 三次重心的演进

### 第一阶段：Prompt Engineering
- **核心问题**：模型有没有听懂你在说什么
- **做什么**：角色设定、风格约束 Few-shot、分布引导、输出格式
- **本质**：塑造一个局部的概率空间
- **局限**：只解决"表达的问题"，不解决"信息的问题"

### 第二阶段：Context Engineering
- **核心问题**：模型有没有拿到足够且正确的信息
- **做什么**：文档切块、结果排序、压缩历史对话、选择性传递工具返回
- **本质**：所有影响模型当前决策的信息的总和管理
- **局限**：主要解决"输入侧"的问题，不解决"执行侧"的问题

### 第三阶段：Harness Engineering
- **核心问题**：模型在真实的执行里能不能持续做对
- **做什么**：任务编排、状态管理、评估观测、约束校验、失败恢复
- **本质**：对整个运行系统的工程化
- **关键洞察**：Prompt 解决表达、Context 解决输入、Harness 解决执行系统的稳定性

---

## Harness Engineering 六层架构

### 第一层：Context（重新审视）
让模型在正确的信息边界内思考，包括：
- 角色目标和定义（我是谁、任务是什么、成功标准是什么）
- 信息的检索和选择（不是越多越好，而是越相关越好）
- 结构化的组织（固定规则、当下任务、运行状态、外部证据分层清楚）

### 第二层：工具系统
- 给什么工具（太少能力不够，太多模型会乱用）
- 什么时候调用（不该查的时候别乱查，该查证时别硬答）
- 工具结果怎么重新喂回（提炼、筛选、保持与任务的相关性）

### 第三层：执行编排
解决"下一步该做什么"的串接问题，包括：
- 理解目标 → 判断信息够不够 → 继续补充 → 击结果继续分析 → 上车输出 → 检查输出 → 不满足则重新修正

### 第四层：记忆和状态
让 Agent 分清三类东西：
- 当前任务的状态
- 对话中的中间结果
- 长期的记忆和用户偏好

### 第五层：评估和观测
- 独立于生成的验收和观测能力
- 包括：输出验收、环境验证、自动测试、日志和指标、错误归因
- **核心原则**：生产验收必须分离

### 第六层：约束、校验、失败恢复
- 约束：哪些能做、哪些不能做
- 校验：输出前后要怎么检查
- 恢复：失败之后怎么从事、切入境、回滚到稳定状态

---

## 真实案例

### Anthropic 的实践
1. **Context Reflect**：不是压缩上下文，而是换一个新的干净 Agent 把工作交接给它（类似内存泄漏后重启进程）
2. **自评偏差问题**：用 Planner（干活）和 Evaluator（QA，分离）替代 self-evaluation

### OpenAI 的实践
1. **工程师的新工作**：人类不需要写代码，只负责设计环境——把产品目标拆解成 Agent 能力阶的小任务；问"环境缺了什么能力"而非"模型是否更努力"
2. **Agent MD 目录化**：不是一开始全塞，而是变成目录页，按需再钻进去（见尽时披露）
3. **完整验证闭环**：Agent 不仅写代码，还自己在隔离环境里跑起来、看结果、翻 Bug、修 Bug、再验证

### LangChain 的效果
只改造 Harness，在底层模型完全不变的情况下，将 Agent 排名从 30 名以外杀到前 5。

---

## 关键结论

> AI 落地的核心挑战正在从"让模型看起来更聪明"转向"让模型在真实世界里稳定地工作"。

- 真正决定上限的是模型
- 真正决定能不能落地、能不能稳定交付的是 Harness
- 三者不是替代关系，而是包含关系：Harness > Context > Prompt（边界一层比一层大）

---

## 推荐资源

- 《OpenClaw 完全指南（花园版）》：https://my.feishu.cn/wiki/QzGAwOH4LiZOYXktGyhcHoLUnRe
- 《code秘密花园 AI 教程资源合集》：https://my.feishu.cn/wiki/U9rYwRHQoil6vBkitY8cbh5tnL9
- 《Easy AI 项目》：https://github.com/ConardLi/easy-learn-ai
