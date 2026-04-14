---
title: 我把 Claude Code 接进微信后，才发现它比"龙虾"更像生活助手
---
# 我把 Claude Code 接进微信后，才发现它比"龙虾"更像生活助手

> 原文发表于 2026-03-29（发布时间以原文为准）
> 来源：微信公众号「爱喝可乐的糯米」
> 链接：https://mp.weixin.qq.com/s/2HOz2SAOaHOpbDPgO98vPQ

---

## 核心观点

1. **Claude Code 安装极简**：一条命令即可完成安装（Mac/Windows通用）
   ```bash
   curl -fsSL https://claude.ai/install.sh | bash
   ```

2. **国内用户不建议直接用 Claude 官方模型**：两个现实问题——网络/账号/支付门槛，以及高成本压力。

3. **Claude Code 可以无缝接入国产大模型**：DeepSeek、智谱 GLM-5、MiniMax、通义千问等都支持，只需配置模型层即可。保留 Claude Code 的交互方式和工作流，底层换用国产模型。

4. **cc-connect 是桥接微信的关键工具**：
   - 本质不是云端机器人，而是把你本地机器上的 Claude Code 桥接到微信入口
   - **接入个人微信必须用 beta 版**：`npm install -g cc-connect@beta`
   - 微信只是入口，真正干活的是本地 Claude Code

5. **连上微信后真正有价值的使用场景**：
   - 编码和项目推进（远程查看代码、改稿、总结进度）
   - 生活规划/写文章/整理资料（绑定目录后，微信里直接说"帮我新建四月计划"）
   - **核心逻辑**：微信是入口，目录才是事实源，Claude Code 变成可远程调度的本地助理

6. **作者推荐的完整链路**：Claude Code + 国产模型 + cc-connect + 微信

---

## 我的消化

这篇文章和飞书CLI那篇的核心逻辑一致：**工具的价值在于能被AI操控，而不在于GUI多好看**。

两个值得注意的点：
- **cc-connect 的 beta 版限制**：很多人装个人微信桥接失败，原因是没装 `@beta` 版本
- **"远程入口"vs"聊天机器人"** 的思维转变——cc-connect 不是给你在微信里加一个AI聊天机器人，而是让你在微信里远程调用本地Claude Code继续干活

---

## 标签

#AI编程 #Claude Code #cc-connect #微信 #国产模型 #工作流

---

**原文链接：**
- [微信公众号 - 爱喝可乐的糯米](https://mp.weixin.qq.com/s/2HOz2SAOaHOpbDPgO98vPQ)
- [cc-connect GitHub](https://github.com/chenhg5/cc-connect)
