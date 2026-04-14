// 分类规则配置
module.exports = {
  'AI绘画': {
    '模型更新': {
      keywords: ['模型', '版本', '更新', '发布', 'LTX', 'Flux', 'SDXL', 'Wan', 'Remix', 'VBVR', '测评', '对比'],
      titlePatterns: [/v?\d+\.\d+/, /版本/, /更新/, /发布/],
      priority: 10
    },
    '工作流': {
      keywords: ['工作流', '节点', 'ComfyUI', '连线', '参数', '配置', '教程'],
      titlePatterns: [/工作流/, /节点/, /ComfyUI/],
      priority: 8
    },
    '提示词技巧': {
      keywords: ['提示词', 'prompt', '写法', '公式', '技巧', '方法'],
      titlePatterns: [/提示词/, /prompt/, /公式/],
      priority: 9
    },
    '工具测评': {
      keywords: ['测评', '对比', '选型', '推荐', '工具'],
      titlePatterns: [/测评/, /对比/, /vs/i],
      priority: 7
    }
  },
  'Agent系统': {
    '实战案例': {
      keywords: ['实测', '实战', '案例', '项目', '部署'],
      titlePatterns: [/实测/, /实战/, /案例/],
      priority: 9
    },
    'OpenClaw教程': {
      keywords: ['OpenClaw', '教程', '入门', '指南'],
      titlePatterns: [/OpenClaw.*教程/, /入门/, /指南/],
      priority: 10
    },
    '架构设计': {
      keywords: ['架构', '设计', '工作区', 'Agent类型', 'Persistent', 'Sub-Agent'],
      titlePatterns: [/架构/, /设计/, /工作区/],
      priority: 8
    },
    '插件开发': {
      keywords: ['插件', '协议', 'A2A', 'MCP', '开发'],
      titlePatterns: [/插件/, /协议/, /A2A/],
      priority: 7
    }
  }
};
