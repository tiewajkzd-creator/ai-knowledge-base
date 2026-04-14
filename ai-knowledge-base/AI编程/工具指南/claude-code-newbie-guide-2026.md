# Claude Code 完全新手指南（2026版）

## 基本信息

| 字段 | 内容 |
|------|------|
| **标题** | Claude Code 完全新手指南（2026版）：从入门到精通 |
| **来源平台** | 微信公众号：程序员AI破局指南 |
| **原始链接** | https://mp.weixin.qq.com/s/48cSPlibbZ0n8S7ZDLtcJQ |
| **发布时间** | 2026-03-14 07:01 |
| **作者** | 程康健 |
| **评分** | ⭐⭐⭐⭐⭐ |
| **质量评分** | 95分 |
| **新鲜度** | 🆕 新发现 |
| **标签** | AI编程, Claude Code, Anthropic, Agent, 提示词工程, 新手指南, SOP, 2026版 |
| **状态** | ✅ 已验证 |

---

## 核心定位

**一句话：** Claude Code 是一个可以直接操作代码仓库的 AI 软件工程师。

**你的角色转变：** 从「写代码」变成「描述需求 + 设定边界 + 审查结果」。

---

## 核心能力全景

| 能力类别 | 具体能力 |
|---------|---------|
| 代码开发 | 读懂整个 repo → 写代码 → 跨文件实现功能 → 安装依赖 |
| 调试修复 | 复现 bug → 追踪根因 → 修改 → 运行测试验证 |
| 重构升级 | JS→TS迁移、框架版本升级、模块化拆分 |
| 测试自动化 | 单元测试、集成测试、修复失败用例 |
| Git工作流 | commit message、解决冲突、创建PR、代码审查 |
| 文档生成 | README、API文档、CHANGELOG |
| 外部集成 | MCP协议（数据库/API/浏览器控制） |
| CI/CD | GitHub Actions自动代码审查 |

---

## 与其他AI编程工具的核心区别

| 工具 | 本质 | 使用方式 | 最适合场景 |
|------|------|---------|-----------|
| **Claude Code** | CLI Agent | 终端命令行 | Repo级自动化、大规模重构、DevOps |
| **Cursor** | AI IDE | 编辑器内联 | 逐行辅助、实时补单文件精细操作 |
| **Windsurf** | AI IDE | 编辑器内联 | 代码上下文感知、内联建议 |
| **Claude.ai** | AI聊天 | 浏览器 | 轻量查询、移动端、无需安装 |

**💡 两者互补：** Cursor适合精细的逐行操作，Claude Code适合大任务自动化。很多高阶开发者同时使用两者。

---

## 安装与配置

### 系统要求
- macOS 12+ / Linux (Ubuntu 20.04+) / Windows (原生或WSL2)
- 需要互联网连接（云端API）

### macOS / Linux 安装
```bash
# 官方安装脚本（推荐）
curl -fsSL https://claude.ai/install.sh | bash

# 验证
claude --version

# Homebrew 安装
brew install --cask claude-code
```

### Windows 安装
```powershell
# PowerShell 一键安装
irm https://claude.ai/install.ps1 | iex

# WinGet
winget install Anthropic.ClaudeCode
```

### 首次登录
```bash
cd ~/your-project
claude  # 首次启动，弹出浏览器授权
claude /doctor  # 运行诊断，确认正常
```

---

## 订阅方案

| 方案 | 说明 | 适合人群 |
|------|------|---------|
| Claude Pro | claude.ai订阅，含Claude Code访问 | 个人开发者、初学者 |
| Claude Max | 更高用量+高峰期优先+新功能优先 | 重度日常使用者 |
| API按量付费 | Anthropic Console充值，按token计费 | 评估阶段、轻量使用 |
| Team/Enterprise | 团队协作+共享CLAUDE.md+管理后台 | 开发团队 |

**新手建议：** 先充值约20美元API额度，用自己真实工作流评估1-2周，再决定是否订阅Max。

---

## 核心概念

### Agent Loop（代理循环）

```
①收集上下文 → ②规划任务 → ③执行操作 → ④验证结果 → ⑤自我纠正
     ↑                                                          ↓
     ←←←←←←←←←←← 循环重复，直到任务完成 ←←←←←←←←←←←←←←←←←←
```

### 上下文管理命令

| 命令 | 作用 | 何时使用 |
|------|------|---------|
| `/clear` | 清空全部对话历史 | 切换任务前（必须养成习惯） |
| `/compact [说明]` | 智能压缩历史，保留摘要 | 上下文超过70%时 |
| `/context` | 可视化显示上下文使用比例 | 长时间工作时随时检查 |
| `/cost` | 查看当前会话token用量 | 了解成本，优化使用习惯 |

**重要原则：** 同一个问题修正超过两次，直接 `/clear` 用更精确的提示重新开始。新会话 + 好提示 > 长会话 + 累积修正。

### 三种权限模式

| 模式 | 触发 | 行为 | 适用场景 |
|------|------|------|---------|
| Normal（默认） | 默认启动 | 重大操作前弹窗请求批准 | 日常开发任务 |
| Plan Mode | Shift+Tab两次 或 `/plan` | 只读分析，不执行任何修改 | 复杂任务先分析再执行 |
| Auto-Accept | `--dangerously-skip-permissions` | 自动批准所有操作 | CI/CD等完全自动化场景 |

---

## 黄金提示词公式

**【目标】+【位置】+【验证】+【约束】**

**示例：**
> 「为 @src/api/users.ts 中的 getUserById 函数添加 Redis 缓存，缓存有效期 5 分钟，使用现有的 @src/lib/redis.ts 客户端。实现后运行 pnpm test 确保所有测试通过，禁止修改函数签名和返回类型，解决根本问题而不是压制错误。」

| 要素 | 好的示例 | 差的示例 |
|------|---------|---------|
| 目标 | 为getUserById添加Redis缓存 | 优化代码 |
| 位置 | @src/api/users.ts + @src/lib/redis.ts | （不指定） |
| 验证 | 运行pnpm test确保通过 | （不要求验证） |
| 约束 | 禁止修改函数签名 | （不加限制） |

---

## 探索→规划→执行 三步法

```
Step 1（Plan Mode）：分析现有实现，给我一个方案
Step 2（确认）：方案可以，开始实现
Step 3（自动）：Claude 执行，完成后跑测试验证
```

**复杂功能始终先「describe → plan → approve → implement」**，避免改了一大堆再回头。

---

## MCP服务器集成

| MCP服务器 | 能力 | 添加命令 |
|-----------|------|---------|
| Context7 | 实时获取第三方库最新文档 | `claude mcp add context7 npx @context7/mcp` |
| Playwright | 控制浏览器做自动化测试 | `claude mcp add playwright npx '@playwright/mcp@latest'` |
| Sentry | 直接读取线上报错 | `claude mcp add sentry --transport http https://mcp.sentry.dev/mcp` |
| GitHub | 查看issue、创建PR | `claude mcp add github npx @github/mcp` |
| PostgreSQL | 直接查询数据库 | `claude mcp add postgres npx @postgresql/mcp` |

---

## Subagents（专用子代理）

**核心价值：**
- 隔离大量输出（不污染主会话上下文）
- 强制工具限制（只读代理无法写文件）
- 并行探索（多个Subagent同时在不同模块调查）
- 跨会话记忆

**内置类型：**

| 类型 | 模型 | 工具权限 | 适用场景 |
|------|------|---------|---------|
| Explore（探索） | Haiku（快速） | 只读 | 文件发现、代码搜索、技术债扫描 |
| Plan（规划） | 继承主会话 | 只读 | Plan Mode下的代码库研究 |
| General（通用） | 继承主会话 | 全部工具 | 复杂研究、多步操作 |

---

## Hooks（自动化触发器）

| Hook类型 | 触发时机 | 典型用途 |
|---------|---------|---------|
| PreToolUse | 工具调用前 | 验证、拦截危险操作 |
| PostToolUse | 工具调用后 | 自动格式化、自动Lint、通知 |
| Notification | Claude需要介入时 | 系统通知提醒 |

**使用原则：** Hooks命令要快（30秒内），避免阻塞Claude的工作流。

---

## Worktree（并行任务隔离）

**核心价值：**
- 同时开发多个功能
- 隔离风险（实验性改动失败可丢弃）
- Writer / Reviewer 双会话模式

```bash
# 在隔离Worktree中启动
claude --worktree feature-auth

# 双会话模式
# 终端1：实现会话
claude --worktree feature-payment
# 终端2：审查会话（全新上下文）
claude
```

---

## 实战SOP

### SOP A：老项目重构

| 阶段 | 目标 | 关键操作 |
|------|------|---------|
| Phase 0 摸底 | 只读探索，生成技术债地图 | Plan Mode + Subagent扫描 |
| Phase 1 安全网 | 先补测试，固定现有行为 | 覆盖公开方法，设置Hook自动跑测试 |
| Phase 2 规划 | 制定分步计划 | Plan Mode生成重构清单 |
| Phase 3 执行 | Worktree隔离，每步验证 | 每个Step独立Worktree |
| Phase 4 收尾 | 全量对比验证 | 测试对比 + API签名检查 + PR |

**最常见陷阱：**
- ❌ 跳过测试直接重构 → 没有安全网
- ❌ 单次改动太多文件 → 出问题无法定位
- ❌ 在主分支上直接改 → 失败无法回滚

### SOP B：快速需求迭代（1-2天）

| 阶段 | 目标 | 时间 |
|------|------|------|
| Phase 0 需求规格化 | 把一句话需求变成可执行SPEC | 5-10分钟 |
| Phase 1 影响面评估 | 知道要动哪些文件 | 5分钟 |
| Phase 2 并行开发 | Worktree并行进行 | 并行节省30-50% |
| Phase 3 互审 | 新会话全新上下文做审查 | 15分钟 |
| Phase 4 交付 | 创建PR + 通知 | 10分钟 |

### SOP C：全新项目研发

| 阶段 | 目标 |
|------|------|
| Phase 0 架构决策 | ADR文档化，早期决策有据可查 |
| Phase 1 项目脑初始化 | CLAUDE.md + Subagents + Hooks一次配齐 |
| Phase 2 骨架生成 | Plan Mode确认后生成，先跑通再实现 |
| Phase 3 迭代开发 | 每个功能走完整的特性循环 |
| Phase 4 CI/CD接入 | 从第一天就有自动化流水线 |

---

## CLAUDE.md 写作原则

- 写规则而非故事
- 聚焦「Claude最容易弄错的事」
- 重要规则加「IMPORTANT:」或「YOU MUST」
- 「禁止事项」比「建议事项」更有价值
- 定期维护，技术栈变化时及时更新

---

## 常见错误与避坑

| 错误 | 后果 | 解决 |
|------|------|------|
| 不清空上下文就切换任务 | Claude被历史干扰，给出矛盾回答 | 每次切换前执行 `/clear` |
| 提示词太模糊 | Claude做了意想不到的大规模改动 | 使用黄金提示词公式 |
| 不先规划就执行大改动 | 多文件重构影响范围不清 | 超过3个文件先用Plan Mode |
| 完全信任AI不审查输出 | 业务逻辑和安全问题被忽略 | 人工审查边界条件、权限检查 |
| 不配置CLAUDE.md | 每次都重新解释，浪费token | 新项目第一件事执行 `/init` |

---

## 章节目录

- 第一章 认识Claude Code——Agentic编程工具的本质
- 第二章 安装与账号配置（macOS / Linux / Windows / WSL）
- 第三章 核心概念——Agent Loop、上下文管理、权限模式
- 第四章 快速入门——30分钟完成第一个真实任务
- 第五章 CLAUDE.md——让Claude记住你的项目规范
- 第六章 完整命令速查手册（斜杠命令 + 快捷键）
- 第七章 进阶技巧——Plan Mode、提示词公式、MCP集成
- 第八章 Subagents——独立上下文的专用AI助手（新增）
- 第九章 Hooks——自动化触发器配置（新增）
- 第十章 Worktree——并行任务隔离工作区（新增）
- 第十一章 实战SOP——老项目重构/快速迭代/新项目研发（新增）
- 第十二章 常见错误与避坑指南
- 附录 速查卡 + 专业级配置参考

---

## 官方资源

- 完整文档（含中文）：code.claude.com/docs
- Anthropic Console：console.anthropic.com
- 社区资源：github.com/hesreallyhim/awesome-claude-code
