---
title: Gemini提示词反推教程！"图生图"来了
---
# Gemini提示词反推教程！"图生图"来了

**来源：** 微信公众号「MetaChat AI工具箱」| **作者：** 小元子
**发布时间：** 2026-03-25 14:38
**标签：** AI绘画 | 提示词工程 | Nano Banana | Gemini | 图生图 | 风格迁移 | MetaChat
**评分：** ⭐⭐⭐⭐ (92/100)

---

## 核心观点

### 1. 工具链：Gemini 反推 + Nano Banana 重绘
这个组合实现了**图生图**的核心需求：看到心仪图片 → 反推提示词 → 用自己的图套用同风格。

**平台：** MetaChat（https://metachat.work）
整合了 ChatGPT / Claude / Gemini / Nano Banana / Midjourney 等30+ AI工具

### 2. 三步工作流

**第一步：Gemini 反推提示词**
在 MetaChat 上打开 Gemini 3.1 Pro，上传风格参考图，输入提示词：

```
请从输入图像中智能、全面地提取视觉风格信息，并将结果以严格有效的 JSON 格式输出。
```

JSON 结构包含：
- `colors`: 色板(HEX/RGB)、主色、点缀色、明度/色温/对比特征
- `typography`: 字体名称/风格、字重/字宽/字型、排版层级
- `composition`: 布局方式、对称/非对称/中心构图、视觉焦点、留白/节奏/密度
- `visual_effects`: 纹理、光影表现、阴影类型、滤镜/后期效果
- `overall_style`: 设计语言(如极简/复古/赛博)、感性气质(如温暖/冷峻)、参考艺术流派

**要求：** 输出纯 JSON，不含额外说明文字。

**第二步：Nano Banana 风格迁移**
打开 Nano Banana 2/Pro，上传想改变风格的图，输入提示词：

```
你是一位室内设计师，帮我根据以下json码，把给你的图片变成同样风格的渲染效果图➕粘贴上刚刚生成的json码。
```

**第三步：出图完成** ✅

### 3. 两种用法对比

| 方式 | 操作 | 准确性 |
|-----|------|-------|
| **提示词法**（推荐） | Gemini提取JSON → 粘贴进Nano Banana | 高，可直接在JSON里调整参数 |
| **垫图法**（懒人） | 两张图直接甩给Nano Banana让它处理 | 较低，提示词不准确效果差 |

### 4. 平台信息
- **MetaChat 国内直达：** https://metachat.work
- **API 文档：** http://metachat.apifprach.cn
- **整合工具：** ChatGPT / Claude / Gemini / Nano Banana / Midjourney 等30+

---

## 消化洞见

> **提示词反推是连接"欣赏"和"创作"的桥梁。**
>
> 这套工作流的价值在于：不再需要自己写复杂提示词，而是让 AI 帮你分析优秀作品的风格要素，再迁移到自己的图上。
>
> **对于你的知识库意义：**
> - 这套 JSON 结构可以作为**提示词库的标准化格式**
> - 每张收录的参考图都可以附带这个 JSON 元数据，方便后续检索和复用
> - Nano Banana 2/Pro 是核心绘图工具，和你之前提到的"nanobanana生图提示词收录"直接相关

**知识成熟度：** 🌿 有参考价值（多工具印证：MetaChat整合了多个平台）

**原文链接：**
- [MetaChat AI工具箱 - Gemini提示词反推教程](https://mp.weixin.qq.com/s/1Gf--lQTq442ysf8zVrO1A)
