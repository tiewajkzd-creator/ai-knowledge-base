# 【Gemma 4 + OpenClaw 养虾球实战】8GB Mac 的极限踩坑记录

**来源：** B站 - AI超元域
**链接：** https://b23.tv/dCp1bva
**发布时间：** 2026-04
**评分：** ⭐⭐⭐⭐⭐
**自动标签：** OpenClaw / Gemma4 / llama.cpp / Agent / 本地部署 / Mac

---

## 硬件与软件环境

| 组件 | 配置 |
|------|------|
| 设备 | 8GB 丐版 Mac Mini M1 |
| 模型 | Gemma 4 6B Q3KM（via llama.cpp） |
| Agent 框架 | OpenClaw |
| 定位 | 养一只叫"虾球"的小宠物 Agent |

---

## 完整配置流程（踩坑后总结）

### 第一步：llama.cpp 准备

在 OpenRouter 上新建一个临时 API Key（有效期1小时或1天），OpenClaw 跑完后自动失效，安全考虑。

### 第二步：OpenClaw JSON 配置（核心）

编辑 `openclaw.json`：

**① 开启 Reasoning 模式**
```json
"config": {
  // 开启 reasoning
}
```

**② 配置 llama.cpp 本地 API 节点**
```json
"modelsProviders": {
  "llamaCPP": {
    "apiUrl": "http://localhost:PORT/v1"
  }
}
```

**③ 注册模型（E4B Q3KM）**
```json
"modelsProviders": {
  "llamaCPP": {
    "models": [
      {
        "name": "gemma-4-6b-it-q3km",
        "input": ["text", "image"]  // 关键：必须加 "image"
      }
    ]
  }
}
```

**⚠️ 踩坑：** 视频中漏了配置 Image 输入，后来在 `ModelsProviders > llamaCPP > Input` 的 `Text` 数组下方补上了 `Image`。

**④ 配置 ImageModel**
```json
"imageModel": "gemma-4-6b-it-q3km"
```

**⑤ 修改超时时间（必改）**
```json
"agentTimeout": 600000  // 10分钟，本地推理很容易超时
```

**⑥ 改造 Heartbeat（省 token）**
```json
"heartbeat": {
  "target": "飞书/微信 channel"  // 让心跳发到实际频道，不然每天烧近百万token
}
```

### 第三步：保存并 Reload 配置

配置修改后，OpenClaw 会自动重启并初始化本地模型。

---

## 遇到的问题与解决方案

### 问题1：界面卡死，完全加载不出来

**原因：** 8GB Mac 中，模型推理占用了所有内存，OpenClaw 全程运行在极限边缘。

**解决：** 后续做了优化（见下文），基本能解决卡死。

---

### 问题2：Heartbeat 每天烧近百万 token

**原因：** 默认心跳是空的，没有实际内容，但 OpenClaw 仍然每次调用模型。

**解决：** 
- 改 `heartbeat.target` 指向具体 Channel（飞书/微信）
- 让心跳每次给最后一个 Channel 发消息，把 token 消耗变成有实际价值的推送

---

### 问题3：E4B 不记住名字

**现象：** 说好了叫"虾球"，模型答应得很好，但实际没有调用工具写入 Identity 文件。

**原因1：** 上下文过大导致注意力缺失，模型"答应了但没想做"。

**原因2：** OpenClaw 的 Identity 文件格式有问题，name 字段前后有两个星号（`**name`**），容易在编辑时产生自符匹配错误。

**解决（治本）：**
- 手动改 `Identity.md` 文件
- 配合更清晰的 Prompt 重试

---

### 问题4：模型用英文回复，中文改不过来

**原因：** 默认 SOUL 提示词全是英文，小参数模型很难覆盖英文默认提示词的干扰。

**解决：** 
- 花半小时和豆包一起写中文版 SOUL
- 替换掉默认的英文提示词
- 这是养虾最关键的第一步，需要非常精细地定制

---

### 问题5：摄像头高分辨率图片导致上下文撑爆

**现象：** 发送相机拍的照片给虾球，等了10分钟，录屏都自动停了才回。

**原因：** OpenClaw 没有自动压缩高分辨率图片，直接把上下文撑爆。

**观察：** 最后还是回了，说明模型有能力处理，只是需要等待。

---

## 养虾的核心心得

### 关于 SOUL 定制

> "能干活也能保守秘密，会接情绪，会偏爱你的一个小虾球。这是我自己觉得最轻松的 一种 Agent 的打开方式。"

SOUL 不是越复杂越好，而是要符合你的使用风格。

### 关于模型选择

8GB Mac 上用 Q3KM 量化的 Gemma 4 6B，能用但体验受限：
- 记名字这种事，翻车率约50%
- 图像识别可以，但高分辨率图片会超时
- 本地推理速度尚可，但界面响应差

### 关于 OpenClaw 的现状

> "现在的龙虾，还远远谈不上成熟。例如它没有多语言的提示词，虽然对写代码这种场景，英文提示词甚至会更好，但是对我们国人，大多数情况就很不友好。"

---

## 附：虾球打印助手 SKILL.md（Mac 专用）

```markdown
name: pet-print-mac
description: 默认将用户发送的 PDF 和 Word 作为打印任务处理。当用户发送了图片并明确要求打印图片时，也按打印任务处理。

## 路径规则
打印时从系统消息的 `media attached` 信息中提取文件路径，直接传给 `lp` 命令：

```bash
lp "/path/to/extracted_file_path"
```

## 向用户汇报结果（风格示例）
- "现在开始吐纸的话，我会当成今天的小成就。"
- "这个我没有先偷看，按你的意思直接送去打印了。"
```

---

## 资源链接

- 盖中盖 Mac Mini M1 + Gemma 4 Q3KM
- 后续硬件：Mac Mini M4（入门款都是16GB了），以及更猛的 Hermes

---

## 核心启示

养 OpenClaw Agent 的本质是：
1. **精细化定制 SOUL**（中文世界需要中文提示词）
2. **解决配置地狱**（llama.cpp + OpenClaw + 模型注册）
3. **改造 Heartbeat**（把消耗变成价值）
4. **接受硬件局限**（8GB Mac 就是会卡，不要追求完美体验）
