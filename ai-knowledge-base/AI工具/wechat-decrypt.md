---

# wechat-decrypt - 微信本地数据库解密工具

- **来源**：GitHub - ylytdeng/wechat-decrypt
- **发布时间**：持续维护中
- **收录时间**：2026-04-14 01:20
- **防失联**：https://t.me/wechat_decrypt

## 核心能力

从运行中的微信进程内存提取加密密钥，解密所有 SQLCipher 4 加密数据库，提供实时消息监听和 Web UI。

**支持平台**：Windows、macOS、Linux

## 环境要求

- Python 3.10+
- 微信 4.x 在运行中
- 管理员/root 权限（读取进程内存）
- macOS 需额外代码签名：`sudo codesign --force --deep --sign - /Applications/WeChat.app`

## 快速开始

```bash
git clone https://github.com/ylytdeng/wechat-decrypt.git
cd wechat-decrypt
pip install -r requirements.txt

# Windows/Linux
python main.py

# macOS（先编译C扫描器）
cc -O2 -o find_all_keys_macos find_all_keys_macos.c -framework Foundation
sudo ./find_all_keys_macos
python3 decrypt_db.py
```

## Web UI

启动后打开 http://localhost:5678

- 实时消息流（30ms 轮询 WAL 变化）
- 图片内联预览（支持 XOR / V1 / V2 三种 .dat 格式）
- 群名过滤、增量拉取

## HTTP API

| 端点 | 说明 |
|------|------|
| `GET /api/history` | 最近消息列表 |
| `GET /api/history?chat=群名` | 按群名过滤 |
| `GET /api/history?since=时间戳` | 增量拉取 |
| `GET /api/tags` | 联系人标签 |
| `GET /stream` | SSE 实时推送 |

## MCP Server（接入 Claude）

```bash
# 注册到 Claude Code
claude mcp add wechat -- python /path/to/mcp_server.py
```

让 AI 直接查询你的微信消息。

## 与 OpenClaw 结合

可搭配 OpenClaw 的每日简讯功能：
1. 轮询 `/api/history?chat=群名&since=上次时间戳`
2. 过滤重要消息
3. 整理成日报推送到 Telegram

## 注意事项

- 仅限解密**自己的**微信数据，遵守法律法规
- 图片密钥需先在微信内打开几张图片再提取
- 首次运行自动生成 config.json

## 关键词

#微信 #数据解密 #SQLCipher #MCP #Claude集成