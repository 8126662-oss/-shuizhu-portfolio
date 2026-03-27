# 🚀 极简三步走部署手册

## ✅ 已完成的工作
1. **手机端适配修复**：添加了移动端响应式CSS
2. **GitHub Pages配置**：创建了.nojekyll和package.json
3. **部署文档**：创建了详细说明

## 📋 你需要做的三步

### 第一步：安装Git（如果未安装）
- 下载：https://git-scm.com/downloads
- 安装：一路下一步即可

### 第二步：创建GitHub仓库
1. **点击这里**：https://github.com/new
2. **填写信息**：
   - Repository name: `shuizhu-portfolio`
   - Description: `水煮｜后期合成全体系课程`
   - **必须选择**：Public（公开）
   - **不要勾选**：README、.gitignore、license
3. **点击**：Create repository

### 第三步：复制这两行命令
创建成功后，GitHub会显示这两行命令，**复制它们**：
```bash
git remote add origin https://github.com/你的用户名/shuizhu-portfolio.git
git branch -M main
```

## 🖱️ 最后点击哪里？
1. **创建仓库后**：点击绿色的"Code"按钮
2. **复制上面两行命令**
3. **回到项目文件夹**执行Git操作

## ⚡ 快速命令序列
在项目文件夹中按顺序执行：
```bash
# 1. 初始化Git
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "Deploy: Professional Portfolio v1.0"

# 4. 粘贴GitHub给你的两行命令
git remote add origin https://github.com/你的用户名/shuizhu-portfolio.git
git branch -M main

# 5. 推送
git push -u origin main
```

## 🌐 启用GitHub Pages
推送完成后：
1. 进入仓库页面
2. 点击 **Settings**
3. 点击 **Pages**
4. 设置：
   - Branch: **main**
   - Folder: **/(root)**
5. 点击 **Save**

## ⏱️ 等待1-2分钟
看到绿色提示后，点击链接访问你的网站！

---
**一句话总结**：安装Git → 创建GitHub仓库 → 复制粘贴两行命令 → 启用Pages