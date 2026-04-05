---
title: OpenHarness：用3%代码量复刻Claude Code核心功能，港大HKUDS开源超轻量Agent框架
platform: 微信公众号+GitHub
source: 未来摸鱼办 / HKUDS
author: 何三/港大数据科学实验室
date: 2026-05-05
link: https://github.com/hkuds/openharness
tags: [OpenHarness, HKUDS, Agent框架, Claude_Code, 轻量级, Harness_Engineering]
score: ⭐⭐⭐⭐
freshness: 🆕 新发现
---

## 核心发现

**OpenHarness** 是香港大学数据科学实验室（HKUDS）开源的 Agent Harness 框架，用约 **1 万行 Python 代码**实现了 Claude Code 约 **98% 的核心功能**，代码量只有后者的 **3%**，体积缩小 **44 倍**。

核心理念：**"The model is the agent. The code is the harness."**
——模型是执行者，代码是驾驭框架。

---

## 基本信息

- **GitHub**：https://github.com/hkuds/openharness
- **官网**：https://docs.open-harness.dev/
- **技术栈**：Python + TypeScript，基于 Vercel AI SDK
- **Star**：3.5k+（快速增长中）
- **协议**：开源

---

## 核心架构

OpenHarness 提供四大轻量级基础设施：

| 能力 | 说明 |
|------|------|
| **Tool-use** | 多步骤工具调用循环 |
| **Skills** | 技能系统 |
| **Memory** | 记忆机制 |
| **Multi-agent** | 多智能体协同 |

### 快速示例（官方代码）

```python
import { Agent, createFsTools, createBashTool, NodeFsProvider, NodeShellProvider } from "@openharness/core";
import { openai } from "@ai-sdk/openai";

const agent = new Agent({
  name: "dev",
  model: openai("gpt-5.4"),
  tools: {
    ...createFsTools(new NodeFsProvider()),
    ...createBashTool(new NodeShellProvider()),
  },
  maxSteps: 20,
});

for await (const event of agent.run([], "Refactor the auth module")) {
  if (event.type === "text.delta") process.stdout.write(event.text);
}
```

---

## 对比主流框架

| 框架 | 代码规模 | 特色 |
|------|---------|------|
| Claude Code | 50万行 / 上千文件 | 最全但最重 |
| OpenClaw | 中等 | 跨平台 Agent 管理 |
| **OpenHarness** | **~1万行（3%）** | **轻量 + 可编程** |

---

## 应用场景

- 在自有应用中嵌入轻量级 Agent 能力
- 不想引入重型框架时的替代方案
- 多 Agent 协同系统的底层框架
- 实时可观测性与行为控制

---

## 与 OpenClaw 的关系

抖音视频「未来摸鱼办」将 OpenHarness 定位为"给大模型穿笼子"的框架——通过代码层对 Agent 行为进行约束和控制，与 OpenClaw 的设计理念（通过 Skills/Cron/Sessions 管理 Agent）有相通之处，但定位不同：
- **OpenHarness**：开发者 SDK，用于构建应用
- **OpenClaw**：终端用户 Agent 管理平台

两者可互补使用：OpenHarness 作为底层引擎，OpenClaw 作为上层编排层。

---

## 一句话总结

> OpenHarness 是 Agent 领域的"轻骑兵"——用最少的代码驾驭最强的模型，为不想引入重型框架的开发者提供了一条轻量化的捷径。
