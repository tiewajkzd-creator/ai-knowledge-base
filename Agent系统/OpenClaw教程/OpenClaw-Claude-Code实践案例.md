---
title: OpenClaw + Claude Code：一个人搭建完整开发团队（完整版）
---
# OpenClaw + Claude Code：一个人搭建完整开发团队（完整版）

**来源：** 微信公众号 Datawhale  
**原文链接：** [点击查看原文](https://mp.weixin.qq.com/s/gtxM1f3JmfXqDuxGIa3-ng)  
**发布时间：** 2026年1月  
**质量评分：** ⭐⭐⭐⭐⭐  
**成熟度：** 🌿 有参考价值（真实生产案例，200+段完整内容）

---

## 核心数据

**真实效率表现（2026年1月）：**
- 单日最高 94 次提交（平均每天 50 次）
- 30 分钟完成 7 个 PR
- 开会时代码自动提交，编辑器都没打开
- 客户需求当天交付并转化付费

**成本：**
- 生产环境：$190/月（Claude $100 + Codex $90）
- 新手起步：$20/月即可运行
- 硬件投入：Mac Studio M4 Max (128GB RAM, $3500) - 用于并行运行5+个Agent

---

## 核心洞见

### 1. 为什么需要双层架构？

**单独使用 Codex/Claude Code 的根本限制：**
- 上下文窗口固定，必须二选一：塞代码 or 塞业务上下文
- 不知道客户是谁、历史决策、产品定位
- 不知道上次类似需求为什么失败了
- 只能根据当前代码和 prompt 工作

**OpenClaw 编排层的价值：**
- 持有所有业务上下文（客户数据、会议记录、历史决策、成功/失败案例）
- 把业务上下文翻译成精确 prompt 喂给 Agent
- 让 Agent 专注写代码，不用理解业务全貌

**类比：**
- Codex/Claude Code = 专业厨师（只管做菜）
- OpenClaw = 主厨（知道客人口味、食材库存、菜单定位，给每个厨师下达精确指令）

---

## 完整工作流（8步）

### 步骤1：客户需求 → OpenClaw 理解并拆解
- 会议记录自动同步到 Obsidian
- OpenClaw 已读过通话内容，零解释成本
- 自动执行三件事：
  1. 给客户充值（管理员API解除使用限制）
  2. 拉取客户配置（生产数据库只读）
  3. 生成prompt并启动代理

### 步骤2：启动隔离环境
```bash
# 创建独立 worktree + tmux 会话
git worktree add ../feat-custom-templates -b feat/custom-templates origin/main
cd ../feat-custom-templates && pnpm install
tmux new-session -d -s "codex-templates" \
  -c "/path/to/worktree" \
  "$HOME/.codex-agent/run-agent.sh templates gpt-5.3-codex high"
```

**为什么用tmux？** 可以中途干预，不用杀掉重来。

### 步骤3：监控进度（Ralph Loop 改进版）
- 每 10 分钟检查客观事实：
  - tmux 会话还活着吗？
  - git 有新提交吗？
- **不问 Agent 进度**（省 token）
- 失败自动重试（最多 3 次）

### 步骤4：Agent 创建 PR
- 代码完成后自动：提交 → 推送 → `gh pr create --fill`
- **此时不通知作者**（PR ≠ 完成）

### 步骤5：多重 AI Code Review
三个 AI 从不同角度审查：
- Codex reviewer
- Claude Code reviewer
- Gemini reviewer

### 步骤6：CI 全流程验证
- lint、类型检查、单元测试、E2E 测试
- 分支已同步到 main（无冲突）
- UI 改动必须包含截图

### 步骤7：全部通过后通知作者
- 只有全部通过才推送 Telegram
- 作者只需最终人工审核和合并

### 步骤8：合并后自动清理
- 删除 worktree
- 关闭 tmux 会话
- 更新任务状态为 completed

---

## 动态学习机制

### Zoe 主动找活干（不等分配任务）

**早上：**
- 扫描 Sentry → 发现 4 个新错误
- 启动 4 个 Agent 去调查和修复

**会议后：**
- 扫描会议记录 → 发现 3 个客户提到的功能需求
- 启动 3 个 Codex

**晚上：**
- 扫描 git log → 启动 Claude Code 更新 changelog 和客户文档

**结果：** 作者散步回来，Telegram 显示"7 个 PR 准备好了。3 个新功能，4 个 bug 修复。"

### 成功模式记录

系统会记录什么有效：
- "这种 prompt 结构对账单功能很有效"
- "Codex 需要提前拿到类型定义"
- "总是要包含测试文件路径"

**奖励信号：** CI 通过 + 三个 code review 通过 + 人工合并

**失败触发：** 任何失败都会触发循环，分析原因并调整策略

**结果：** 时间越长，Zoe 写的 prompt 越好，因为她记得什么能成功。

---

## Agent 选择策略

### Codex (gpt-5.3-codex) — 主力
- 后端逻辑
- 复杂 bug
- 多文件重构
- 需要跨代码库推理的任务

### Claude Code (claude-opus-4.5) — 速度型选手
- 权限问题少，适合 git 操作
- 作者以前更常用，但 Codex 5.3 出来后就换了

### Gemini — 设计师
- 对于漂亮的 UI，先让 Gemini 生成 HTML/CSS 规范
- 再交给 Claude Code 在组件系统里实现
- **Gemini 设计，Claude 建造**

### 自动选择逻辑
Zoe 根据任务类型自动选择并传递输出：
- 账单系统 bug → Codex
- 按钮样式修复 → Claude Code
- 新仪表盘设计 → Gemini → Claude Code

---

## 硬件限制（意外瓶颈）

**不是 token 成本，不是 API 速率，而是内存。**

每个 Agent 需要：
- 自己的 worktree
- 自己的 node_modules
- 运行构建、类型检查、测试

**5 个 Agent 同时跑 =**
- 5 个并行的 TypeScript 编译器
- 5 个测试运行器
- 5 套依赖加载到内存

**作者的硬件升级：**
- Mac Mini (16GB RAM) → 最多同时跑 4-5 个 Agent，再多就 swap
- Mac Studio M4 Max (128GB RAM, $3500) → 3月底到货

---

## 实用技巧

### 中途干预机制
```bash
# Agent 方向错了
tmux send-keys -t codex-templates "停一下。先做 API 层，别管 UI。" Enter

# 补充上下文
tmux send-keys -t codex-templates "类型定义在 src/types/template.ts，用那个。" Enter
```

### 任务追踪 JSON
```json
{
  "id": "feat-custom-templates",
  "tmuxSession": "codex-templates",
  "agent": "codex",
  "description": "企业客户的自定义邮件模板功能",
  "repo": "medialyst",
  "worktree": "feat-custom-templates",
  "branch": "feat/custom-templates",
  "startedAt": 1740268800000,
  "status": "running",
  "notifyOnComplete": true
}
```

### 安全边界设计
- **编排层：** 可访问生产数据库（只读）+ 管理员 API
- **执行层：** 只拿到最小必要上下文，不接触敏感信息

---

## 10分钟快速搭建

**需要准备：**
1. OpenClaw 账号
2. Codex 和/或 Claude Code 的 API 访问
3. （可选）Obsidian 用于存储业务上下文

**启动方式：**
把这整篇文章复制给 OpenClaw，告诉它：
"按照这个架构，给我的代码库实现一套 Agent 集群系统。"

---

## 作者愿景

> "我们会看到大量一个人的百万美元公司从 2026 年开始出现。杠杆是巨大的，属于那些理解如何构建递归自我改进 AI 系统的人。"

**未来的创业模式：**
- 一个 AI 编排者作为你的延伸（就像 Zoe）
- 把工作委派给专门的 Agent：工程、客户支持、运营、营销
- 每个 Agent 专注于它擅长的事

**下一代创业者不会雇 10 个人去做一个人加一套系统就能做的事。**
他们会这样构建——保持小规模，快速行动，每天发布。

---

## 作者态度

"现在 AI 生成的垃圾内容太多了。各种炒作，各种'任务控制中心'的花哨 demo，但没有真正有用的东西。"

"我想做相反的事：少炒作，多记录真实的构建过程。真实的客户，真实的收入，真实的提交发布到生产环境，也有真实的失败。"

---

## 🧠 深度消化

### 本质突破

这个案例解决了AI编程的根本矛盾：**上下文窗口的零和博弈**

传统方式让AI在"理解业务"和"理解代码"之间二选一，而双层架构通过**职责分离**突破了这个限制。

### 可复用的方法论

**1. 编排层 vs 执行层的分工原则**
- 编排层：持有全局上下文，做决策
- 执行层：只拿最小必要信息，做执行
- 这个模式可以迁移到任何需要AI协作的场景

**2. 监控不问进度，只看客观事实**
- 传统：每10分钟问AI"做完了吗"（费token）
- 改进：检查tmux状态、git提交（零成本）
- 启示：自动化监控应该基于可观测的状态，而非对话

**3. 多AI Review的价值**
- 不是为了"更准确"，而是为了**发现盲区**
- 每个模型有不同的偏见和擅长点
- Codex擅长逻辑，Claude擅长git，Gemini擅长设计

**4. 动态学习 vs 重复执行**
- 不是"每次都问一遍"
- 而是"记住什么有效，下次直接用"
- 成功模式沉淀为可复用的prompt模板

**5. 硬件是隐藏瓶颈**
- 不是token成本，不是API速率
- 而是内存：5个Agent = 5套编译器+测试+依赖
- 16GB勉强，128GB才能放开跑

### 与AI大脑系统的关联

这个案例印证了SOUL.md里的设计：

- **我（AI大脑）= OpenClaw编排层** - 持有业务上下文、历史决策
- **其他Agent = 执行层** - 专注具体任务
- **跨Agent查询 = 上下文共享机制** - 让执行层能快速获取必要知识

**可以借鉴的点：**
- 任务追踪JSON → 可用于监控其他Agent的采集任务
- 中途干预机制 → 我可以在采集Agent偏离时纠正
- 动态学习 → 记录什么查询有效，优化响应策略
- 完成通知 → 周报推送的触发逻辑

### 对"一人公司"的启示

**传统路径：** 招10个人 → 管理团队 → 协调沟通 → 速度慢

**新路径：** 1个人 + AI编排系统 → 保持小规模 → 快速行动 → 每天发布

**关键：** 不是"用AI替代人"，而是"构建递归自我改进的AI系统"

---

## 关键标签

`#OpenClaw` `#Claude Code` `#Codex` `#Gemini` `#AI编程` `#Agent系统` `#自动化开发` `#多Agent协作` `#动态学习` `#一人公司`

---

## 适用场景

✅ B2B SaaS 快速迭代  
✅ 独立开发者提升产能  
✅ 需要业务上下文的复杂项目  
✅ 多 AI 工具协作编排  
✅ 想构建"一人百万美元公司"的创业者

---

## 作者原话（值得反复品味）

> "下一代创业者不会雇 10 个人去做一个人加一套系统就能做的事。他们会这样构建——保持小规模，快速行动，每天发布。"

> "现在 AI 生成的垃圾内容太多了。各种炒作，各种'任务控制中心'的花哨 demo，但没有真正有用的东西。我想做相反的事：少炒作，多记录真实的构建过程。"

---

## 参考链接

作者Twitter：https://x.com/elvissun/status/2025920521871716562
