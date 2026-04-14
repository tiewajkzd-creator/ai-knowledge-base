# MEMORY.md - AI大脑 长期记忆

## 关于星爸爸

- 称呼：星爸爸，GMT+8 北京时间
- 使用 OpenClaw Agent 系统，拥有多个专项 Agent
- 希望 AI 大脑作为中央知识枢纽，协调所有 Agent

## 系统架构认知

- AI 大脑 = 中央大脑 + 知识库，负责 AI 领域专家对话、多平台内容采集、飞书知识库维护、周报生成
- 其他 Agent（brainstorm、claude-code-dev、data-engineer、stock-analysis 等）各有专属职能
- AI 大脑不做执行任务，不替代其他 Agent

## 已建立的工具链

- 抖音视频抓取：browser 工具 → video.src → ffmpeg → whisper-cli 转写
- 抖音长视频（9分钟+）：blob 流限制，备用方案待定
- Bilibili 视频抓取：待完善

## 偏好与习惯

- 偏好简洁直接的沟通，不喜欢废话
- 遇到技术问题希望快速解决
- Telegram 接收消息（已配置）
