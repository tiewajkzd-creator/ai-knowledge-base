---
title: 实测拿215项SOTA的Qwen3.5-Omni：摄像头一开，AI给我现场讲论文、撸代码
platform: 微信公众号
source: 量子位
author: 听雨
date: 2026-03-31
link: https://mp.weixin.qq.com/s/KWJ6TGpLdrbS0LiPxF3Wgg
tags: [Qwen, 多模态, 全模态, 视频通话, vibe_coding, 论文解读, 阿里云]
score: ⭐⭐⭐⭐
freshness: 🆕 新发现
---

# 实测拿215项SOTA的Qwen3.5-Omni：摄像头一开，AI给我现场讲论文、撸代码

## 核心发现

**Qwen3.5-Omni** 是阿里通义千问发布的全模态原生模型，无缝理解文本、图片、音频及音视频输入，能生成带时间戳的细粒度音视频脚本。

---

## 规格参数

- **三档型号**：Plus / Flash / Light
- **上下文**：256K
- **语言支持**：113种
- **输入容量**：10小时音频 或 1小时视频
- **Benchmark成绩**：**215项SOTA**，与Gemini 3.1 Pro打得有来有回
  - 通用音频理解、推理、识别、翻译、对话 **全面超越** Gemini 3.1 Pro
  - 音视频理解能力总体 **达到** Gemini 3.1 Pro水平
  - 视觉和文本能力与同尺寸Qwen3.5模型持平

---

## 四大核心能力

### 1️⃣ 视频拆解 + 拉片分析
- 给它一个无字幕预告片（《疯狂动物城2》），几秒内生成带时间戳的详细分镜脚本
- 含字幕、特效、音乐、蒙太奇手法、出场人物全分析
- 支持追问特定时间点的人物行为（实测37秒处完全正确）

### 2️⃣ vibe coding（边视频边编程）
- Qwen Chat打开视频通话功能，AI能看到你摄像头画面
- 对着草图说话，十几秒生成HTML+CSS网页
- 调用WebSearch + FunctionCall填充内容
- 演示：对着草图生成Geoffery Hinton人物介绍网页

### 3️⃣ 实时论文解读
- 打开摄像头让AI"看"论文，直接大白话讲解
- 支持**语义打断**（中途提问能立即切换）
- 背景杂音（开门声）不干扰，仍正常解读
- 演示：解读Yann LeCun团队LeWorldModel世界模型新论文

### 4️⃣ 自然语音对话体验
- **语义打断**：只响应有意义的话，不被背景噪音打断
- **音色克隆 + 语音控制**：对话体验接近真人
- **ARIA技术**（自适应速率交错对齐）：解决"AI说话不稳定、漏读、读错"问题
- **流式设计**：边输入边处理边生成，真正实时对话

---

## 技术架构：Thinker-Talker 双系统

```
Thinker（大脑）→ 理解一切输入（图像/音频/文本混输入）
    ↓ 特殊位置编码理解时间关系
    ↓ 输出文本
Talker（嘴巴）→ 文本变自然语音（RVQ语音压缩，更高效）
```

两者均升级为 **Hybrid-Attention MoE**，效率性能双提升。

---

## 使用入口

- **在线体验**：https://chat.qwen.ai/
- **API（离线）**：https://help.aliyun.com/zh/model-studio/qwen-omni
- **API（实时）**：https://help.aliyun.com/zh/model-studio/realtime
- **视频通话功能**：需手机网页端Qwen Chat使用

---

## 一句话总结

> Qwen3.5-Omni让AI真正进入"视频会议"时代——开着摄像头，AI同步讲论文、撸代码、做分析，实时打断无压力，是目前最接近"AI工作伙伴"体验的多模态模型。
