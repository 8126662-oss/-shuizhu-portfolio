@echo off
echo ============================================
echo         Vercel网址查找工具
echo ============================================
echo.

echo 📋 可能的Vercel网址：
echo 1. https://-shuizhu-portfolio.vercel.app
echo 2. https://-shuizhu-portfolio-git-main-8126662-oss.vercel.app
echo 3. https://-shuizhu-portfolio-8126662-oss.vercel.app
echo.

echo 🚀 正在测试网址...
echo.

echo 🔍 测试网址1: https://-shuizhu-portfolio.vercel.app
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://-shuizhu-portfolio.vercel.app' -Method Head -TimeoutSec 3; echo '✅ 可访问 (状态码: ' + $response.StatusCode + ')'; echo '🌐 请访问: https://-shuizhu-portfolio.vercel.app'; } catch { echo '❌ 不可访问或尚未部署'; }"

echo.
echo 🔍 测试网址2: https://-shuizhu-portfolio-git-main-8126662-oss.vercel.app
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://-shuizhu-portfolio-git-main-8126662-oss.vercel.app' -Method Head -TimeoutSec 3; echo '✅ 可访问 (状态码: ' + $response.StatusCode + ')'; echo '🌐 请访问: https://-shuizhu-portfolio-git-main-8126662-oss.vercel.app'; } catch { echo '❌ 不可访问或尚未部署'; }"

echo.
echo 🔍 测试网址3: https://-shuizhu-portfolio-8126662-oss.vercel.app
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://-shuizhu-portfolio-8126662-oss.vercel.app' -Method Head -TimeoutSec 3; echo '✅ 可访问 (状态码: ' + $response.StatusCode + ')'; echo '🌐 请访问: https://-shuizhu-portfolio-8126662-oss.vercel.app'; } catch { echo '❌ 不可访问或尚未部署'; }"

echo.
echo ============================================
echo 📝 如果以上网址都不可访问：
echo 1. 请打开 https://vercel.com
echo 2. 登录你的账号
echo 3. 查看"Projects"页面
echo 4. 找到"-shuizhu-portfolio"项目
echo 5. 点击进入查看部署详情
echo.

echo 🎯 快速访问Vercel控制台：
start https://vercel.com/dashboard

echo.
echo 按任意键退出...
pause >nul