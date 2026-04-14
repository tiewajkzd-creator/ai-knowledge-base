---
title: OpenClaw + Gemma 4 31B IT 修复配置说明
---
# OpenClaw + Gemma 4 31B IT 修复配置说明

**来源：** B站 · AI超元域（UP主：AI已来！AI超元域开源项目作者）
**原始链接：** https://www.bilibili.com/opus/1187063956310589507
**发布日期：** 2026年（具体日期待补）
**知识成熟度：** 🌱 新鲜观点

---

## 问题

需要将 OpenClaw 配置为使用 `gemma-4-31b-it` 作为默认模型，并确保其能够正常工作。

---

## 根本原因

修复这个问题主要涉及三层兼容性问题：

1. **OpenRouter / HuggingFace Router 不支持 Gemma 4 的 tool/function calling**
   — OpenClaw 的 agent 依赖工具调用，因此这些接入方式不可用

2. **OpenClaw 内置的 `google/` provider 不包含 Gemma 模型**
   — 因此直接使用内置 Google provider 时，`gemma-4-31b-it` 会被识别为未知模型

3. **Gemma 4 的流式响应中包含 `"thought": true` 的 thinking/reasoning token**
   — OpenClaw 的响应解析器会尝试将其按结构化 reasoning 输出处理，进而触发 `MALFORMED_RESPONSE` 错误

---

## 修复方式

解决方案是：

- 使用**自定义 `google-ai` provider**
- 使用 Google Generative AI 原生 API 格式
- 在模型定义中加入 `"reasoning": false`

这样可以让 OpenClaw 跳过对 reasoning/thinking token 的解析，从而避免 Gemma 4 的 thought chunk 导致解析失败。

---

## 需要修改的配置

### 1. 在 `~/.openclaw/openclaw.json` 中添加自定义 provider

在 `models.providers` 下加入 `google-ai` 自定义 provider。

### 2. 在 `~/.openclaw/openclaw.json` 中设置默认模型和主 agent 模型

配置 `gemma-4-31b-it` 为默认模型。

### 3. 在 `~/.openclaw/agents/main/agent/auth-profiles.json` 中添加认证配置

配置 Google AI API Key。

---

## 关键点总结

要让 OpenClaw 正常使用 Gemma 4 31B IT，核心是三点：

- ❌ 不使用 OpenRouter / HuggingFace Router 作为 Gemma 4 的 tool use 接入方式
- ✅ 通过自定义 `google-ai` provider 直连 Google AI Studio
- ✅ 在模型定义中设置 `"reasoning": false`，避免 OpenClaw 解析 Gemma 4 的 thinking token 时出错

---

**自动标签：** Agent系统 · OpenClaw配置 · Gemma 4 · 模型接入 · 故障排除

**质量评分：** ⭐⭐⭐⭐（实战验证，B站原创内容，图文并茂）
