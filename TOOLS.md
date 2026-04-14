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

## 知识库路径

- 本地：`/Users/lewicklin/.openclaw/workspace/ai-brain/knowledge-base/`
- GitHub Pages：`https://tiewajkzd-creator.github.io/ai-knowledge-base/`
