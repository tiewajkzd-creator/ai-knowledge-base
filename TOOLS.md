# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Model Manager 命令

星爸爸的模型管理快捷命令：

### 添加新模型
告诉我：`添加模型 <提供商名称> <API密钥> <URL> <模型ID> [模型名称] [API类型]`
- API类型可选：openai（默认）、anthropic、google

### 列出所有模型
告诉我：`列出模型` 或 `查看模型`

### 切换会话模型（临时）
告诉我：`切换模型 <provider/model>` 或使用 `/model <provider/model>`

### 设置默认模型（永久）
告诉我：`设置默认模型 <provider/model>`

### 删除模型
告诉我：`删除模型 <提供商名称>`

---

Add whatever helps you do your job. This is your cheat sheet.

## 🔧 全局Skills索引
**详见：** `~/.openclaw/global-capabilities/SKILLS-REGISTRY.md`

---

## 📺 B站视频转写工作流（2026-04-02 验证）

**工具链：** yt-dlp + ffmpeg + whisper.cpp（ggml-small 模型存于 ~/.whisper/ggml-small.bin）

**完整流程：**
1. `yt-dlp -f "bestaudio[ext=m4a]" --max-filesize 100M -o "/tmp/视频名.m4a" "B站链接"`
2. `ffmpeg -i /tmp/视频名.m4a -ar 16000 -ac 1 -c:a pcm_s16le /tmp/视频名.wav`
3. `whisper-cli -m ~/.whisper/ggml-small.bin -l zh -f /tmp/视频名.wav -otxt -of /tmp/视频名`
4. 读取 /tmp/视频名.txt → 整理 → 写入知识库 → 执行 auto-classify-and-sync.sh
5. 清理临时文件

**支持范围：** B站、YouTube、抖音（yt-dlp 自动识别各平台链接）
