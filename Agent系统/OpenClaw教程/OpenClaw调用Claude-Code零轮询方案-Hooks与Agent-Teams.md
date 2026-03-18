# OpenClaw调用Claude Code零轮询方案：Hooks回调+Agent Teams

**来源：** https://www.aivi.fyi/aiagents/OpenClaw-Agent-Teams  
**日期：** 2026-03-18  
**评分：** ⭐⭐⭐⭐⭐  
**作者：** AI超元域  
**新鲜度：** 🌱 新鲜观点

---

## 核心问题

传统方式下，OpenClaw调用Claude Code时存在严重的Token浪费问题：
- OpenClaw需要每隔几秒轮询一次Claude Code的运行状态
- 任务执行时间越长，轮询次数越多
- Token消耗巨大且不必要

## 零轮询解决方案

### 核心思想：发射后不管，完成自动回报

就像派人干活，干完自动发消息，不需要站旁边看。

### 工作流程

1. **OpenClaw下达任务**：只需向Claude Code发送一次开发任务
2. **Claude Code独立运行**：在后台完全独立运行，不需要OpenClaw参与
3. **自动回调通知**：完成后触发Stop Hook和SessionEnd Hook双重回调
4. **结果持久化**：将执行结果写入文件
5. **唤醒OpenClaw**：自动唤醒OpenClaw
6. **推送通知**：将任务完成通知推送到聊天群组

**Token消耗：** 几乎可以忽略不计

## 技术实现细节

### 1. 双通道机制

#### 📁 latest.json（数据通道）

**作用：** 存储完整的执行结果

```json
{
  "session_id": "abc123",
  "timestamp": "2026-02-09T14:54:27+00:00",
  "cwd": "/home/ubuntu/projects/hn-scraper",
  "event": "SessionEnd",
  "output": "Claude Code 的完整输出内容...",
  "status": "done"
}
```

**为什么需要它：**
- Hook触发时AGI可能不在线（处理其他消息、heartbeat、睡觉）
- 结果必须持久化到文件，确保不丢失
- 类比：外卖快递柜，确保结果随时可取
- 文件最可靠，不依赖任何服务在线

#### 📡 Wake Event（信号通道）

**作用：** 通知AGI立即处理

```bash
curl -X POST "http://127.0.0.1:18789/api/cron/wake" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"text": "Claude Code 任务完成，读取 latest.json", "mode": "now"}'
```

**为什么需要它：**
- 光写文件不够，AGI不知道文件何时被写入
- 没有wake event，AGI只能定时轮询或等heartbeat（可能30分钟后）
- 类比：快递柜的门铃，按一下立刻通知你来取

**mode参数：**
- `"now"` = 立刻唤醒，不等heartbeat
- `"next-heartbeat"` = 等下次heartbeat周期（延迟但省资源）

### 2. 双通道配合关系

| 方案 | 效果 |
|------|------|
| 只有 latest.json | 结果存了，但AGI不知道，要等heartbeat |
| 只有 wake event | AGI被叫醒了，但消息长度有限（~300字） |
| **两者配合** ✅ | **AGI立刻醒来，读文件拿完整结果** |

**为什么不只用wake event传结果？**
- wake event的text字段有长度限制
- Claude Code输出可能很长（几千字符），塞不进一条消息
- 文件没有大小限制

**为什么不只写文件不发wake？**
- 也行，但AGI要到下次heartbeat（~30分钟）才发现
- wake event让AGI秒级响应

### 3. 容错设计

```bash
# wake event失败不影响结果文件
curl ... || true  # 失败也不报错，exit 0
```

即使Gateway API挂了、token过期、网络抖动：
- latest.json依然会被写入
- AGI最迟在下次heartbeat时也能发现
- 这就是双通道的冗余设计：信号丢了，数据还在

## Agent Teams协作模式

### 核心优势

结合Claude Code最新的Agent Teams特性，实现多Agent并行协作开发。

### 实战案例

**任务：** 开发带物理引擎的落沙模拟游戏

**提示词示例：**
```
用 Claude Code 的 Agent Team 协作模式构建一个基于物理引擎和 HTML/CSS 的带材质系统的落沙模拟游戏
```

**效果：**
- 仅用6分钟完成交付
- 主Agent进程不被阻塞
- 可同时处理其他任务

### 其他示例提示词

```
用 Agent Teams 开发一个 Python 命令行计算器，支持加减乘除和历史记录

dispatch 一个任务到 Claude Code：构建一个 Markdown 转 HTML 的工具，要有测试

用 Claude Code 构建一个 REST API，FastAPI + SQLite，管理 TODO 列表
```

## 传统轮询 vs 零轮询对比

| 维度 | 传统轮询 | 零轮询方案 |
|------|---------|-----------|
| Token消耗 | 巨大（每次轮询都消耗上下文） | 几乎为0 |
| 响应速度 | 取决于轮询间隔 | 秒级响应 |
| 主进程阻塞 | 是 | 否 |
| 并行能力 | 差 | 强（支持Agent Teams） |
| 可靠性 | 依赖持续连接 | 双通道冗余 |

## 项目仓库

https://github.com/win4r/claude-code-hooks

---

## 关键要点总结

1. **零轮询核心**：发射后不管，完成自动回报
2. **双通道机制**：latest.json存数据 + wake event发信号
3. **容错设计**：信号丢了数据还在，最迟heartbeat时发现
4. **Agent Teams**：多Agent并行协作，主进程不阻塞
5. **Token节省**：从巨大消耗降至几乎为0
6. **实时响应**：从分钟级延迟降至秒级
