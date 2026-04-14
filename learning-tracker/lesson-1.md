# 📚 Lesson 1：注册账号，准备好学习工具

## 🎯 今天的目标

完成这两件事：
1. ✅ 注册 Google Colab（云端Python环境）
2. ✅ 注册 HuggingFace（下载AI模型的网站）

---

## 📖 先理解我们要用什么

### Google Colab 是什么？
就像一个**免费的云端电脑**，你不需要在你自己电脑上装任何东西，直接在浏览器里写代码、跑代码。

**类比：**
- 普通编程 = 在自己厨房做饭（要买锅、买食材、自己洗菜）
- Colab = 外卖平台点餐（别人帮你做好，你只管吃）

我们用Colab，因为这门课需要GPU（显卡），Colab免费提供。

---

### HuggingFace 是什么？
全球最大的**AI模型仓库**，类似GitHub，但专门存AI模型。

这门课所有的大模型（Llama、GPT-2等）都从HuggingFace下载。

**类比：**
- HuggingFace = 菜市场（各种预制菜）
- 你 = 厨师（选菜回去加工）
- Colab = 厨房（加工的地方）

---

## 🔧 任务1：注册 Google Colab

### 步骤：

**① 打开这个链接：**
https://colab.research.google.com

**② 用你的Google账号登录**
（如果没有Google账号，先去 https://accounts.google.com 注册一个，只需要邮箱）

**③ 登录成功后，你应该看到这个界面：**
- 左边有 "文件"、"代码片段" 等标签
- 中间有一个大输入框
- 右下角有 "连接" 按钮

**✅ 完成标志：** 打开链接并登录后，截图发给我

---

## 🔧 任务2：注册 HuggingFace

### 步骤：

**① 打开这个链接：**
https://huggingface.co

**② 点击右上角 "Sign Up"（注册）**

**③ 填写信息：**
- Email（邮箱）：用你的常用邮箱
- Password（密码）：设一个密码
- Username（用户名）：取一个好记的名字，比如 `mylearn01`

**④ 验证邮箱**
注册后去你邮箱点验证链接

**⑤ 生成一个Token（重要！）**

Token就像一把钥匙，以后我们的代码要用这个钥匙从HuggingFace下载模型。

**生成步骤：**
1. 登录后，点击右上角你的头像
2. 选择 "Settings"
3. 左边找到 "Access Tokens"
4. 点击 "New token"
5. Name随便填，比如 `colab-access`
6. Role选 **"read"**
7. 点击生成
8. **把生成的token复制保存下来**（长这样：`hf_xxxxxxxxxxxxx`）

**✅ 完成标志：** 把你的HuggingFace用户名发给我，并告诉我Token已经生成好了

---

## 📋 今日任务检查清单

| 任务 | 状态 | 交付物 |
|------|------|--------|
| 注册 Google Colab | ⬜ 未完成 | 打开 https://colab.research.google.com 并登录 |
| 注册 HuggingFace | ⬜ 未完成 | 告诉我你的HF用户名 |
| 生成 HF Token | ⬜ 未完成 | 回复 "Token已生成" |

---

## 💬 完成后发消息给我

格式随意，比如：
- "Colab注册好了，HF用户名是xxx"
- "我都弄完了"

我会记录你的进度，等你告诉我三项都完成，再给你布置今天的"考试题" 📝

---

## ❓ 有问题随时问我

如果注册过程中遇到任何问题（验证码打不开、邮箱收不到等），直接发给我描述，我帮你解决 🔧
