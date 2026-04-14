# TOOLS.md - Local Notes

## 视频处理工具

### Whisper（本地语音转写）
- CLI路径：`/opt/homebrew/bin/whisper-cli`
- 模型：`~/.whisper/ggml-small.bin`
- 常用命令：`whisper-cli -m ~/.whisper/ggml-small.bin -l zh -f audio.wav -otxt -of output`
- Apple Silicon Metal 加速自动启用

### yt-dlp（B站/YouTube视频下载）
- B站无需Cookie，直接可用
- 常用命令：`yt-dlp -f <format> "<链接>"`
- 查看格式：`yt-dlp --list-formats "<链接>"`

### ffmpeg（音视频处理）
- 提取音频：`ffmpeg -i video.mp4 -ar 16000 -ac 1 audio.wav`

## 平台对应工具

| 平台 | 推荐工具 | 备注 |
|------|---------|------|
| B站 | yt-dlp | 直接支持，无需Cookie |
| YouTube | yt-dlp | 直接支持 |
| 抖音 | Browser Relay + 手机分享 | 需要登录态，目前不稳定 |
| 小红书 | xiaohongshu-mcp | 需要显示设备登录QR |
| **微信公众号** | **wechat-article-extractor** | **直接支持 mp.weixin.qq.com** |

## 微信公众号文章抓取

**工具路径：** `/Users/lewicklin/.agents/skills/wechat-article-extractor/`

**触发条件：** 收到 mp.weixin.qq.com 链接

**完整执行流程：**

```bash
# 1. 提取文章内容
node ~/.agents/skills/wechat-article-extractor/scripts/extract.js "<文章链接>"

# 2. 读取输出，整理为结构化摘要
# （JSON 格式：title, author, account, publish_time, content, cover_image）

# 3. 存 JSON 主记录 → records/YYYY-MM-DD-{article-id}.json
# 4. 存知识库正文 → knowledge-base/{分类}/YYYY-MM-DD-{article-id}.md
# 5. 更新 records/index.json 和 knowledge-base/index.json
# 6. git add + commit
# 7. 推 Telegram 告知结果（成功/失败）
```

**注意：**
- 微信公众号文章直接用此工具提取，无需 Cookie
- 文章内容为 HTML，需提取纯文本存入知识库
- 封面图链接单独记录

## 知识库路径

- 本地：`/Users/lewicklin/.openclaw/workspace/ai-brain/knowledge-base/`
- GitHub Pages：`https://tiewajkzd-creator.github.io/ai-knowledge-base/`
- 记录文件：`/Users/lewicklin/.openclaw/workspace/ai-brain/records/`
