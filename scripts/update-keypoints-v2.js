#!/usr/bin/env node
// 更新4个视频的详细核心观点（30-50字）

const fs = require('fs');
const path = require('path');

const KB_DIR = `${process.env.HOME}/.openclaw/workspace-ai-brain/ai-knowledge-base`;

const updates = {
  'BV133NwzHEgy': {
    file: 'Agent系统/🚀OpenClaw高级玩法之跨机器跨Gateway交互：自研A2A协议插件打通多Agent互相通信，Token节省50%【龙虾教程】.md',
    keyPoints: [
      'OpenClaw A2A插件实现不同机器、不同Gateway之间的Agent通信，解决多实例协作难题',
      '支持同一设备上不同Gateway之间的消息传递，实现本地多Agent协同工作',
      '通过A2A协议打通跨机器Agent通信，可在工作机和远程服务器之间共享上下文和任务状态',
      'Token消耗可节省约50%，通过共享上下文避免重复传输相同信息',
      '适用于需要多机器协作的复杂任务场景，如分布式数据处理、多环境测试等'
    ]
  },
  'BV1X4wAzEEMe': {
    file: 'Agent系统/🚀OpenClaw高级玩法之工作区优化+三大Agent深度解析！龙虾保姆级教程让你学会Persistent Agent、Sub-Agent和ACP Agent.md',
    keyPoints: [
      'OpenClaw工作区Markdown文件（AGENTS.md、TOOLS.md等）会在每次新会话时自动加载，未优化会浪费大量上下文token',
      '开发了专门的Skill用于自动优化工作区Markdown文件，通过自然语言安装后可一键审计和精简文件内容',
      '支持创建定时任务（如每周一早上9点）自动调用Skill对工作区进行定期优化，保持文件精简高效',
      'Persistent Agent保持长期记忆和状态，Sub-Agent用于任务分解和并行处理，ACP Agent负责Agent间通信协议',
      'LanceDB记忆插件已从个人项目升级为官方组织项目，贡献者达20人，新版本新增多项强大功能'
    ]
  },
  'BV1MFNAzUEF8': {
    file: 'AI绘画/LTX2.3 全面进化，数字人、图生视频、文生视频，高清画质工作流.md',
    keyPoints: [
      'LTX2.3支持数字人生成功能，可创建虚拟主播和角色，适用于视频制作和直播场景',
      '图生视频功能全面升级，支持高清画质输出，画面细节和流畅度显著提升',
      '文生视频能力增强，提示词理解更准确，能更好地遵循用户意图生成视频内容',
      'ComfyUI工作流优化，节点配置更简洁，降低了使用门槛，新手也能快速上手',
      '显存要求较高，消费级显卡建议90系以上，否则可能出现卡顿或无法运行的情况'
    ]
  },
  'BV1REArzwEoW': {
    file: 'AI绘画/视频 AI 终于长脑子了！实测 VBVR × Wan2.2 Remix：让 AI 视频的物理逻辑大幅提升.md',
    keyPoints: [
      'VBVR（Video Brain VR）技术让AI视频理解物理逻辑，生成的视频运动规律更符合真实世界',
      'Wan2.2 Remix版本对提示词遵从度更高，但在某些场景下可能不遵循提示词，需要调整参数',
      'VQA节点需要正确连接参考图才能生效，否则无法读取参考图导致生成效果不佳',
      'AI视频生成的物理逻辑和运动规律大幅提升，物体运动、碰撞、重力等表现更真实',
      'Remix版本在复杂场景下表现更稳定，但需要更多显存和计算资源'
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
  
  const keyPointsText = data.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n');
  content = content.replace(
    /## 核心观点\n\n[\s\S]*?\n\n---/,
    `## 核心观点\n\n${keyPointsText}\n\n---`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ 已更新: ${bvid}`);
}

console.log('\n🎉 全部更新完成');

