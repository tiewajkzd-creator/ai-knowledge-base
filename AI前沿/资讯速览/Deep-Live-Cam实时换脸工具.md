---
title: Deep-Live-Cam — 实时AI换脸工具
---
# Deep-Live-Cam — 实时AI换脸工具

## 基本信息
- **GitHub**：https://github.com/hacksider/deep-live-cam
- **官网**：https://deeplivecam.net/
- **最新版本**：2.7-beta（2026-03-11发布）
- **Stars**：83,155 ⭐ | **Forks**：12,156
- **语言**：Python
- **License**：AGPL-3.0
- **更新**：2026-03-28

---

## 📌 核心定位

只需**一张照片**，即可实现实时换脸和视频深度伪造。零门槛，3步完成实时换脸直播/视频通话。

---

## 🚀 3步实时换脸

1. 选择一张人脸照片
2. 选择摄像头
3. 点击启动（Live!）

---

## 🎯 核心功能

| 功能 | 说明 |
|------|------|
| **Mouth Mask** | 保留原始嘴巴，确保口型准确同步 |
| **Face Mapping** | 同时对多人换不同脸 |
| **Movie Mode** | 实时替换电影中的人物脸 |
| **Live Show** | 直播换脸表演 |
| **Omegle** | 视频通话随机换脸恶搞 |
| **Many Faces** | 批量换脸，适合表情包创作 |

---

## 🔧 技术规格

### 模型需求
| 模型 | 用途 | 大小 |
|------|------|------|
| GFPGANv1.4 | 人脸修复增强 | ~ |
| inswapper_128_fp16.onnx | 换脸核心模型 | ~300MB |

### 硬件要求
- **GPU**：NVIDIA GPU（CUDA 12.8.0 + cuDNN 8.9.7）效果最佳
- **CPU**：可用但速度较慢
- **Mac Silicon**：M1/M2/M3 支持（需特殊配置）

### 安装方式
1. **懒人包（推荐）**：下载预构建版本，Windows/Mac/CPU通用，含30+额外功能，优先技术支持
   - 地址：https://deeplivecam.net/index.php/quickstart

2. **手动安装**：需 Python 3.11 + ffmpeg + Visual Studio 2022 Runtimes（Windows）

---

## 🆕 2.7-beta 新功能（最大更新）

- Realtime face enhancer（实时人脸增强）
- Inswapper optimizer（换脸优化器）
- 2个新人脸增强模型：GPEN 512 和 GPEN 256
- Face enhancer Scaler
- Quick lip mask / Lip Mask / Chin Mask / Eyes Mask
- Interpolation（插帧）
- GPU changer（多GPU支持）
- LUT's 色彩校正
- Window Projection（窗口投影）
- In-window preview
- Realtime Video Watching（实时视频观看）
- Camera Refresh
- Resolution Changer
- 开启人脸增强后可达 **27fps**

---

## ⚠️ 免责声明与伦理规范

**设计初衷**：帮助艺术家动画化自定义角色、内容创作、服装设计

**内置防护**：
- 自动拦截不当内容（裸体、暴力、敏感画面）
- 违法时可能关闭项目或添加水印

**用户责任**：
- 使用真实人脸需获得本人同意
- 分享时必须标注为深度伪造
- 自行承担使用后果

---

## 📊 热度趋势

| 指标 | 数值 |
|------|------|
| GitHub Stars | 83,155 ⭐ |
| Forks | 12,156 |
| 最新版本 | 2.7-beta（2026-03-11） |
| 趋势排名 | Trendshift Top 100 |

---

*整理时间：2026-03-28*
*知识来源：GitHub + 官方README*
*新鲜度：🆕 近期活跃（2.7-beta 3月11日发布）*
