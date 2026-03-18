# 十个顶级Claude Code Skills推荐

**来源：** 微信公众号「Feisky」  
**发布时间：** 2026-03-12  
**原文链接：** https://mp.weixin.qq.com/s/b-0ppca5YhiGgxR_mWJNVA

---

## 1. Superpowers

**如果只能装一个，选这个。**

打包了20多个可组合的Skill，覆盖软件开发完整流程。

**核心功能：**
- **brainstorming** - 不会拿到需求就直接开写，先问一轮问题，探索方案，把设计决策摊开讨论，生成设计文档
- **TDD工作流** - 强制Claude先写测试再写实现，跑不过就继续改，直到全绿

```bash
claude plugin install superpowers
```

**项目地址：** https://github.com/obra/superpowers

---

## 2. Planning with Files

**解决Plan Mode的痛点：规划存在对话上下文里，上下文一压缩就丢了。**

把规划、进度和知识都写进Markdown文件。Claude开始干活前先创建计划文件，每完成一步就更新进度，遇到有用的信息就记到知识文件里。

```bash
claude plugin marketplace add OthmanAdi/planning-with-files
claude plugin install planning-with-files
```

**项目地址：** https://github.com/OthmanAdi/planning-with-files

---

## 3. UI UX Pro Max

**告别"AI审美"（紫色渐变背景+圆角卡片+居中布局）**

内置67种UI风格和161套行业配色方案，根据项目类型自动推荐设计系统。技术栈支持：React、Vue、Svelte、SwiftUI、Flutter

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**项目地址：** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

---

## 4. Code Review

**官方Plugin里设计最精巧的一个。**

启动多个Agent并行审查同一个PR：有的看逻辑正确性，有的看安全漏洞，有的看代码风格。每个Agent给出的问题都带置信度分数，最后按分数过滤。

**注意：** 大PR的token消耗很猛，建议先拆再审

```bash
claude plugin install code-review
```

**项目地址：** https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-review

---

## 5. Code Simplifier

**写完跑通了就不想再碰？它帮你做"写完再看一遍"的事情。**

聚焦最近修改过的代码，检查重复逻辑、多余的中间变量、可以合并的条件分支。不改功能，只做简化。

```bash
claude plugin install code-simplifier
```

**项目地址：** https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-simplifier

---

## 6. Webapp Testing

**前端写完了，测试怎么办？**

告诉Claude要测什么场景，它自己用Playwright写脚本、启动浏览器、跑测试、截屏，有问题还会自己调试。

```bash
claude plugin marketplace add anthropics/skills
claude plugin install example-skills@anthropic-agent-skills
```

**项目地址：** https://github.com/anthropics/skills/tree/main/skills/webapp-testing

---

## 7. Ralph Loop

**名字来自辛普森动画里的Ralph Wiggum。**

通过Stop Hook拦截Claude的退出，把同一个任务重新喂给它。Claude试图退出，Hook拦截，检查完成条件，没满足就塞回去。

**关键技巧：** 完成条件要写得越具体越好。

```bash
claude plugin install ralph-loop

# 使用示例
/ralph-loop:ralph-loop "实现用户认证模块。完成标准：JWT登录注册、测试通过、README更新。完成后输出COMPLETE" --max-iterations 20 --completion-promise "COMPLETE"
```

**详细例子：** https://awesomeclaude.ai/ralph-wiggum

---

## 8. MCP Builder

**从零写一个MCP Server门槛不低。**

把构建过程拆成四个阶段，引导Claude一步步完成：理解API、设计工具接口、实现、测试。Claude会主动考虑rate limiting和token过期处理等边界情况。

```bash
claude plugin marketplace add anthropics/skills
claude plugin install example-skills@anthropic-agent-skills
```

**项目地址：** https://github.com/anthropics/skills/tree/main/skills/mcp-builder

---

## 9. PPTX

**做PPT大概是程序员最不想做的事。**

让Claude直接生成.pptx文件，支持母版、图表、动画。生成的PPT不可能直接拿去做重要汇报，但用它生成初稿已经完全够用。

```bash
claude plugin marketplace add anthropics/skills
claude plugin install document-skills@anthropic-agent-skills
```

**项目地址：** https://github.com/anthropics/skills/tree/main/skills/pptx

---

## 10. Skill Creator

**Meta技能：用来帮你创建新Skill的技能。**

加了eval测试框架，可以给Skill写测试用例，验证它到底有没有在起作用，还能做A/B对比，看数据说话而不是凭感觉。

```bash
claude plugin install skill-creator
```

**项目地址：** https://github.com/anthropics/claude-plugins-official/tree/main/plugins/skill-creator

---

## 使用建议

**选择原则：** 不在多，在合适。装太多互相打架，反而会影响整体性能，上下文也吃不消。

**项目管理：** 对不同功能的Skills，特别是仅跟项目相关的Skills，推荐放到项目中，提交到Git，方便管理和团队共享。

---

**相关资源：**
- Anthropic官方Skills仓库：https://github.com/anthropics/skills
- Anthropic官方Plugins仓库：https://github.com/anthropics/claude-plugins-official
- Awesome Claude Skills社区列表：https://github.com/travisvn/awesome-claude-skills
- Claude Code Skills文档：https://code.claude.com/docs/en/skills
- Skills市场：https://skillsmp.com/

**标签：** `#Claude Code` `#Skills` `#开发工具` `#工作流` `#最佳实践`

**知识成熟度：** 🌳 成熟原则（实战验证，精选推荐）
