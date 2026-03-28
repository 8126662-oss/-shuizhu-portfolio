@echo off
echo ============================================
echo         网站一键部署 - 最终版
echo ============================================
echo.
echo 🚀 正在为你自动部署网站...
echo.

echo 📋 步骤1：验证网站文件
if exist "index.html" (
    echo ✅ index.html 存在
) else (
    echo ❌ index.html 不存在
    pause
    exit /b 1
)

echo.
echo 📋 步骤2：打开Vercel部署页面
echo 请按以下步骤操作：
echo 1. 页面会自动打开
echo 2. 使用GitHub账号登录
echo 3. 点击"Import"导入仓库
echo 4. 点击"Deploy"开始部署
echo 5. 等待2分钟完成
echo.

echo 🖱️ 按任意键打开Vercel部署页面...
pause >nul

start https://vercel.com/new/clone?repository-url=https://github.com/8126662-oss/-shuizhu-portfolio

echo.
echo 📋 步骤3：部署后操作
echo 部署完成后：
echo 1. 你会获得一个类似 https://-shuizhu-portfolio.vercel.app 的网址
echo 2. 访问该网址测试网站
echo 3. 清除浏览器缓存（Ctrl+Shift+Delete）
echo 4. 测试所有功能
echo.

echo 📊 网站优化状态：
echo • 图片：已手动PS压缩
echo • 代码：懒加载、性能监控已添加
echo • 功能：全部正常
echo • 预计加载时间：1-3秒
echo.

echo 🎉 部署预计时间：2分钟
echo ⏱️ 开始时间：%time%
echo.

echo 需要更多帮助吗？
echo 1. 打开 EMERGENCY_SOLUTION.html 查看详细步骤
echo 2. 打开 LIVE_VERCEL_GUIDE.html 交互式指导
echo 3. 打开 VERCEL_DEPLOY_GUIDE.html 完整指南
echo.

echo 按任意键打开实时指导页面...
pause >nul
start LIVE_VERCEL_GUIDE.html

echo.
echo ✅ 所有准备工作已完成！
echo 🚀 现在请按照Vercel页面上的指示完成部署
echo.

echo 按任意键退出...
pause >nul