#!/usr/bin/env node
// 手动更新4个视频的核心观点

const fs = require('fs');
const path = require('path');

const KB_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/ai-knowledge-base`;

const updates = {
  'BV133NwzHEgy': {
    file: 'Agent系统/🚀OpenClaw高级玩法之跨机器跨Gateway交互：自研A2A协议插件打通多Agent互相通信，Token节省50%【龙虾教程】.md',
    keyPoints: [
      'OpenClaw A2A插件实现不同机器、不同Gateway之间的Agent通信',
      '支持同一设备上不同Gateway之间的消息传递和协作',
      '解决多OpenClaw实例（工作机+远程服务器）的跨机器协同问题',
      '通过A2A协议打通Agent互相通信，共享上下文',
      'Token消耗可节省约50%，提升多Agent协作效率'
    ]
  },
  'BV1X4wAzEEMe': {
    file: 'Agent系统/🚀OpenClaw高级玩法之工作区优化+三大Agent深度解析！龙虾保姆级教程让你学会Persistent Agent、Sub-Agent和ACP Agent.md',
    keyPoints: [
      'OpenClaw工作区Markdown文件优化，避免加载过多内容浪费上下文',
      'Persistent Agent：持久化Agent，保持长期记忆和状态',
      'Sub-Agent：子Agent，用于任务分解和并行处理',
      'ACP Agent：Agent Communication Protocol，用于Agent间通信',
      'LanceDB插件已升级为官方组织项目，贡献者达20人，新增多项功能'
    ]
  },
  'BV1MFNAzUEF8': {
    file: 'AI绘画/LTX2.3 全面进化，数字人、图生视频、文生视频，高清画质工作流.md',
    keyPoints: [
      'LTX2.3支持数字人生成，可创建虚拟主播和角色',
      '图生视频功能全面升级，支持高清画质输出',
      '文生视频能力增强，提示词理解更准确',
      'ComfyUI工作流优化，节点配置更简洁',
      '显存要求较高，消费级显卡建议90系以上'
    ]
  },
  'BV1REArzwEoW': {
    file: 'AI绘画/视频 AI 终于长脑子了！实测 VBVR × Wan2.2 Remix：让 AI 视频的物理逻辑大幅提升.md',
    keyPoints: [
      'VBVR（Video Brain VR）技术让AI视频理解物理逻辑',
      'Wan2.2 Remix版本对提示词遵从度更高',
      'VQA节点需要正确连接参考图才能生效',
      'AI视频生成的物理逻辑和运动规律大幅提升',
      'Remix版本在某些场景下可能不遵循提示词，需要调整参数'
    ]
  }
};

for (const [bvid, data] of Object.entries(updates)) {
  const filePath = path.join(KB_DIR, data.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ 文件不存在: ${data.file}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 替换核心观点部分
  const keyPointsText = data.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n');
  content = content.replace(
    /## 核心观点\n\n[\s\S]*?\n\n---/,
    `## 核心观点\n\n${keyPointsText}\n\n---`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ 已更新: ${bvid}`);
}

console.log('\n🎉 全部更新完成');
