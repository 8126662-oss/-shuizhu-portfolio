@echo off
echo ========================================
echo GitHub Pages 部署脚本
echo ========================================
echo.

REM 步骤1：配置Git用户信息
echo 步骤1：配置Git用户信息
echo 请先运行以下命令配置你的GitHub信息：
echo.
echo git config --global user.name "你的GitHub用户名"
echo git config --global user.email "你的GitHub邮箱"
echo.
pause

REM 步骤2：初始化Git仓库
echo.
echo 步骤2：初始化Git仓库
git init
if %errorlevel% neq 0 (
    echo Git初始化失败！
    pause
    exit /b 1
)

REM 步骤3：添加所有文件
echo.
echo 步骤3：添加所有文件到暂存区
git add .
if %errorlevel% neq 0 (
    echo 添加文件失败！
    pause
    exit /b 1
)

REM 步骤4：提交更改
echo.
echo 步骤4：提交更改
git commit -m "Deploy: Professional Portfolio v1.0"
if %errorlevel% neq 0 (
    echo 提交失败！
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Git初始化完成！
echo ========================================
echo.
echo 接下来你需要：
echo 1. 在GitHub创建仓库
echo 2. 复制GitHub提供的两行命令：
echo    git remote add origin https://github.com/你的用户名/仓库名.git
echo    git branch -M main
echo 3. 运行这两行命令
echo 4. 运行：git push -u origin main
echo.
pause