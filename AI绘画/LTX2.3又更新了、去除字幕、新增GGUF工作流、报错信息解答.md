# LTX2.3又更新了、去除字幕、新增GGUF工作流、报错信息解答

**来源：** B站 - 三层楼的小肥猴  
**原文链接：** [点击查看](https://www.bilibili.com/video/BV1EMNMzmEhd)  
**发布时间：** 2026-03-08  
**质量评分：** ⭐⭐  
**成熟度：** 🌱 新鲜观点

---

## 核心观点

1. LTX2.3新增负面提示词增强节点，通过加大负面权重使CFG=1的扩散模型也能有效去除字幕，解决数字人视频字幕问题
2. 反推模板已优化，修复中文台词被翻译成英文的问题，现在可以保持中文对话原样输出
3. 千问3.5模型推荐使用Qwen2.5-Coder-7B-Instruct-Q8替代9B版本，效果更好且显存占用更低
4. 常见报错解决：推理节点加载错误需更新推理插件和ComfyUI本体到最新版本
5. 音频细节获取节点需单独安装CT插件，该插件还提供连线动画、节点对齐等增强功能
6. 千问3.5选项不显示需更新轮子（wheel），在节点仓库文件中有对应下载链接和安装说明
7. 针对12GB/16GB显存用户推出GGUF量化版本工作流，配合Qwen2.5-Coder-7B-Instruct-Q8可显著提升运行速度

---

## 实用工具

- ComfyUI
- GGUF

---

## 资源链接

- **相关链接：** https://www.runninghub.cn/?inviteCode=rh-v1325
- **相关链接：** https://www.runninghub.cn/post/2029940383601397761/?inviteCode=rh-v1325
- **相关链接：** https://www.runninghub.cn/ai-detail/2030239724551544833/?inviteCode=rh-v1325
- **相关链接：** https://www.runninghub.cn/post/2029933769326600194/?inviteCode=rh-v1325
- **相关链接：** https://www.runninghub.cn/ai-detail/2030240696480833538/?inviteCode=rh-v1325

---

## 用户反馈

**1. 漏网掂长** (👍1)  
> 去字幕地节点默认是停用的，开启后，做的视频还是有字幕

**2. manningmanning** (👍0)  
> 哇, 请教 整个工作流 需要多大的 显存?

---

## 标签

`视频生成` `工作流`
