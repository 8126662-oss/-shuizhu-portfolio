# GitHub Pages 部署指南

## 📱 手机端适配已完成

已添加手机端响应式修复：
1. **图片溢出修复**：所有图片添加 `max-width: 100%`
2. **横向容器修复**：移动端改为垂直布局
3. **触摸设备优化**：增加触摸目标大小
4. **iOS Safari修复**：解决特定兼容性问题
5. **防止横向滚动**：确保页面不产生水平滚动条

## 🚀 部署前准备

### 1. 安装 Git（如果尚未安装）
- 下载地址：https://git-scm.com/downloads
- 选择适合你操作系统的版本
- 安装时选择默认选项即可

### 2. 配置 Git（首次使用）
```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

## 📦 部署步骤

### 第一步：在GitHub创建仓库
1. 访问 https://github.com/new
2. 仓库名称：`shuizhu-portfolio`（或其他你喜欢的名称）
3. 描述：`水煮｜后期合成全体系课程 - 专业作品集网站`
4. **重要**：选择 **Public**（公开）
5. **不要**初始化README、.gitignore或license
6. 点击"Create repository"

### 第二步：获取仓库地址
创建成功后，复制以下两行命令：
```bash
git remote add origin https://github.com/你的用户名/仓库名称.git
git branch -M main
```

### 第三步：本地Git操作
1. 打开命令提示符或PowerShell
2. 进入项目目录：
   ```bash
   cd "C:\Users\86152\Documents\trae_projects\box1"
   ```
3. 执行Git初始化：
   ```bash
   git init
   git add .
   git commit -m "Deploy: Professional Portfolio v1.0"
   ```
4. 粘贴第二步中的两行命令
5. 推送代码：
   ```bash
   git push -u origin main
   ```

## 🌐 启用GitHub Pages

### 第四步：配置GitHub Pages
1. 进入你的GitHub仓库页面
2. 点击 **Settings**（设置）
3. 左侧菜单选择 **Pages**
4. 在"Source"部分：
   - Branch: **main**
   - Folder: **/(root)**
5. 点击 **Save**

### 第五步：等待部署完成
1. GitHub会自动开始部署（约1-2分钟）
2. 刷新页面，看到绿色提示"Your site is published at..."
3. 点击链接访问你的网站

## 🔧 自定义域名（可选）

如果需要使用自定义域名：
1. 在Pages设置中找到"Custom domain"
2. 输入你的域名（如：shuizhu.com）
3. 在你的域名注册商处添加CNAME记录：
   ```
   CNAME @ 你的用户名.github.io
   ```

## 📝 更新网站

后续更新代码：
```bash
git add .
git commit -m "更新描述"
git push origin main
```
GitHub会自动重新部署。

## 🛠️ 故障排除

### 问题1：页面显示404
- 等待1-2分钟让部署完成
- 检查仓库是否为Public
- 确认Pages设置正确（Branch: main, Folder: /root）

### 问题2：样式或图片不显示
- 检查控制台错误（F12）
- 确保图片路径正确（使用相对路径）
- 清除浏览器缓存

### 问题3：手机端显示异常
- 已添加手机端修复，确保`mobile-fix.css`内容已合并
- 使用Chrome开发者工具模拟移动设备测试

## 📞 技术支持

如有问题，请检查：
1. GitHub Pages文档：https://docs.github.com/pages
2. 静态网站部署指南：https://pages.github.com
3. 或联系技术支持

---
**部署完成时间**：2026-03-27  
**项目状态**：✅ 手机端适配完成  
**部署类型**：静态HTML网站  
**预计部署时间**：2-3分钟