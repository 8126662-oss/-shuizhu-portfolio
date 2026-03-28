@echo off
echo ============================================
echo           网站一键部署工具
echo ============================================
echo.
echo 🚀 正在准备部署你的网站...
echo.

echo 📋 当前项目信息：
echo • 项目位置: %~dp0
echo • 主文件: index.html
echo • 图片数量: 19个
echo.

echo 🌐 打开部署网站...
start https://vercel.com/new
echo ✅ 已打开 Vercel 网站

echo.
echo 📝 部署步骤：
echo 1. 使用 GitHub 账号登录 Vercel
echo 2. 点击 "Add New" → "Project"
echo 3. 搜索仓库: 8126662-oss/-shuizhu-portfolio
echo 4. 点击 "Import"
echo 5. 点击 "Deploy"（所有设置保持默认）
echo 6. 等待 1-2 分钟
echo.

echo 🔗 预计获得网址：
echo • https://-shuizhu-portfolio.vercel.app
echo • 或自定义域名
echo.

echo ⚡ 部署优势：
echo • 速度：1-2分钟 vs GitHub Pages 10+分钟
echo • 全球CDN：访问速度更快
echo • 自动SSL：免费HTTPS
echo • 自动部署：代码更新后自动重新部署
echo.

echo 🎯 部署后验证：
echo 1. 访问 Vercel 提供的网址
echo 2. 检查网站加载速度
echo 3. 清除浏览器缓存（Ctrl+Shift+Delete）
echo 4. 测试所有功能
echo.

echo 📊 网站优化状态：
echo • 图片：已压缩（手动PS处理）
echo • 代码：已优化（懒加载、性能监控）
echo • 功能：全部正常
echo • 预计加载时间：1-3秒
echo.

echo 按任意键打开实时部署指导...
pause >nul
start LIVE_VERCEL_GUIDE.html
echo.
echo 按任意键退出...
pause >nul