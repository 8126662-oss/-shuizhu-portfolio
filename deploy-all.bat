@echo off
echo ========================================
echo 🚀 水煮作品集一键部署脚本
echo ========================================
echo.

echo 步骤1：检查Git配置
echo.
git config --global user.name
if %errorlevel% neq 0 (
    echo ❌ Git用户信息未配置！
    echo 请运行：
    echo   git config --global user.name "你的GitHub用户名"
    echo   git config --global user.email "你的GitHub邮箱"
    echo.
    pause
    exit /b 1
)

git config --global user.email
if %errorlevel% neq 0 (
    echo ❌ Git邮箱未配置！
    echo 请运行：
    echo   git config --global user.email "你的GitHub邮箱"
    echo.
    pause
    exit /b 1
)

echo ✅ Git配置检查通过
echo.

echo 步骤2：显示部署指南
echo.
echo 📋 请按照以下步骤操作：
echo.
echo 1. 访问 https://github.com/new 创建仓库
echo 2. 仓库名称建议：shuizhu-portfolio
echo 3. 必须选择：Public（公开）
echo 4. 不要勾选：README、.gitignore、license
echo 5. 点击 Create repository
echo.
echo 创建成功后，GitHub会显示两行命令：
echo   git remote add origin https://github.com/你的用户名/仓库名.git
echo   git branch -M main
echo.
echo 请复制这两行命令！
echo.
pause

echo.
echo 步骤3：Git初始化
echo.
git init
if %errorlevel% neq 0 (
    echo ❌ Git初始化失败！
    pause
    exit /b 1
)

git add .
if %errorlevel% neq 0 (
    echo ❌ 添加文件失败！
    pause
    exit /b 1
)

git commit -m "Deploy: Professional Portfolio v1.0"
if %errorlevel% neq 0 (
    echo ❌ 提交失败！
    pause
    exit /b 1
)

echo ✅ Git初始化完成！
echo.

echo 步骤4：等待你粘贴GitHub命令
echo.
echo 请粘贴GitHub给你的两行命令：
echo （按Enter键开始输入，输入完成后按Ctrl+Z然后按Enter）
echo.
set /p github_commands="请输入命令："

echo.
echo 你输入的命令是：
echo %github_commands%
echo.
set /p confirm="确认执行这些命令吗？(y/n): "
if /i "%confirm%" neq "y" (
    echo 取消执行
    pause
    exit /b 0
)

echo.
echo 执行GitHub命令...
%github_commands%
if %errorlevel% neq 0 (
    echo ❌ 执行GitHub命令失败！
    pause
    exit /b 1
)

echo.
echo 步骤5：推送代码到GitHub
echo.
git push -u origin main
if %errorlevel% neq 0 (
    echo ❌ 推送失败！
    pause
    exit /b 1
)

echo.
echo ========================================
echo 🎉 部署完成！
echo ========================================
echo.
echo ✅ 代码已推送到GitHub
echo.
echo 最后一步：启用GitHub Pages
echo 1. 进入你的GitHub仓库页面
echo 2. 点击 Settings
echo 3. 点击 Pages
echo 4. 设置：Branch: main, Folder: /(root)
echo 5. 点击 Save
echo.
echo 等待1-2分钟，访问你的网站：
echo https://你的用户名.github.io/仓库名/
echo.
pause