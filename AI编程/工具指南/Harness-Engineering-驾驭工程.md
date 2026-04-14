---
title: Harness Engineering！驾驭工程如何驾驭AI
---
# Harness Engineering！驾驭工程如何驾驭AI

- 来源平台：抖音「创野小朱」
- 原始链接：https://v.douyin.com/LhjIJLrv2Xs/
- 发布时间：2026-04-01 16:35
- 时长：4分10秒
- 作者：创野小朱（粉丝6.1万，获赞96.0万）
- 评分：⭐⭐⭐⭐⭐
- 标签：Harness Engineering、Agent、上下文工程、AI编程

---

## 核心概念

**Vibe Coding vs Harness Engineering**

Vibe coding（氛围编程）在处理**大规模代码**时会遇到挑战，因为 AI 的注意力有限。

解决方案：**Harness Engineering（驾驭工程）**——将 AI 的行为套进制度的笼子里，使其在规则允许的条件下尽可能发挥最大能力。

---

## 章节内容

### 00:00 引言
Vibe coding 在大规模代码场景下的局限性，引入 Harness Engineering 概念。

### 00:15 AI失控的原因
AI 注意力有限，代码量变大后：
- 修复 bug 耗时费力
- 优化提示词指令也无法解决问题

### 01:11 解决方法
将 AI 行为套进制度笼子，通过索引引入交通规则，让 AI 在规则允许下发挥最大能力。

### 02:07 具体措施
四大方法：
1. **上下文工程**（Context Engineering）
2. **架构约束**（Architecture Constraints）
3. **反馈循环**（Feedback Loops）
4. **垃圾回收**（Garbage Collection）

---

## 热评摘要（来自评论区）

**作者本人（创野小朱）：**
> 一个是模型上下文不够了，一个是垃圾回收做的不好。

> 我现在写的后端项目从0-1都是用 codex + superpowers 写的，基本 review 1-2 次就完全没问题。但是核心业务需要改动时，即使已经写了 plans 和 specs，总是会出现相关业务遗漏修改，或者明确说了不需要保留旧版本代码但实际还是会大量保留。review 三四次都会这样。最后让它按整体需求去 review 全部代码才会发现很多遗漏。

> 子代理也很抽象——主线程会觉得子代理很慢很久没完成，主动关停子代理改自己实现，导致子代理的 token 浪费，主线程再浪费一次，还浪费了上下文。

**其他评论：**
- "我就知道你小子没少看 Claude Code 源码分析"
- "harness 工程，说到底不就是加强版的系统提示词么"（作者回复：没这么简单）
- "vibe coding 做项目真的难受"

---

## 我的消化

**核心洞察：**

Harness Engineering 的本质是**给 AI 设置边界条件**，让它在约束内自由发挥，而不是放任它随机探索。

四大方法对应的痛点：
| 方法 | 解决的问题 |
|------|----------|
| 上下文工程 | AI 注意力有限，上下文不够时质量崩溃 |
| 架构约束 | 防止 AI 随意改动架构，保持代码结构可控 |
| 反馈循环 | 让 AI 能自我纠正，而不是一条道走到黑 |
| 垃圾回收 | 定期清理无用的中间产物和上下文，避免污染 |

**这和 Auto Dream 的记忆整理逻辑是相通的**——都是在解决"系统运行久了会积累垃圾"的问题，只是场景不同：
- Auto Dream = Agent 的记忆垃圾回收
- Harness Engineering = Code Agent 的上下文垃圾回收

**评论区作者的实战经验很真实：**
- Plans 和 Specs 写了也没用，AI 还是会遗漏业务修改
- 子代理分配了又被主线程关停，token 双倍浪费
- 最后还是要靠"整体 review"而不是"按 task review"

→ 说明 **AI 适合做整体规划，但拆分执行时容易丢东西**。分块执行必须有更强的结构化约束。

---

**相关概念：**
- Vibe Coding（氛围编程）
- Context Engineering（上下文工程）
- Claude Code Superpowers

**原文链接：**
- [Harness Engineering！驾驭工程如何驾驭AI](https://v.douyin.com/LhjIJLrv2Xs/)
