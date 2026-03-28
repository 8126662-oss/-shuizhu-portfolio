@echo off
echo ============================================
echo 图片压缩状态检查
echo ============================================
echo.
echo 正在检查图片压缩状态...
echo.

cd /d "%~dp0"

REM 检查关键图片
set "problem_count=0"

echo 检查结果：
echo.

REM portfolio-5.jpg
if exist "public\showcase\portfolio-5.jpg" (
    for %%F in ("public\showcase\portfolio-5.jpg") do (
        set /a size=%%~zF / 1024
        if !size! GTR 500 (
            echo ❌ portfolio-5.jpg - !size! KB (目标: < 500KB)
            set /a problem_count+=1
        ) else (
            echo ✅ portfolio-5.jpg - !size! KB
        )
    )
) else (
    echo ❌ portfolio-5.jpg - 文件不存在
    set /a problem_count+=1
)

REM outline-1.jpg
if exist "public\showcase\outline-1.jpg" (
    for %%F in ("public\showcase\outline-1.jpg") do (
        set /a size=%%~zF / 1024
        if !size! GTR 300 (
            echo ❌ outline-1.jpg - !size! KB (目标: < 300KB)
            set /a problem_count+=1
        ) else (
            echo ✅ outline-1.jpg - !size! KB
        )
    )
) else (
    echo ❌ outline-1.jpg - 文件不存在
    set /a problem_count+=1
)

REM 3-after.jpg
if exist "public\showcase\3-after.jpg" (
    for %%F in ("public\showcase\3-after.jpg") do (
        set /a size=%%~zF / 1024
        if !size! GTR 300 (
            echo ❌ 3-after.jpg - !size! KB (目标: < 300KB)
            set /a problem_count+=1
        ) else (
            echo ✅ 3-after.jpg - !size! KB
        )
    )
) else (
    echo ❌ 3-after.jpg - 文件不存在
    set /a problem_count+=1
)

echo.
echo ============================================
if %problem_count% EQU 0 (
    echo ✅ 所有图片压缩成功！
    echo.
    echo 🚀 下一步：部署网站
    echo 1. 运行 QUICK_VERCEL.bat 一键部署
    echo 2. 或打开 EMERGENCY_SOLUTION.html 查看详细步骤
) else (
    echo ❌ 发现 %problem_count% 个问题！
    echo.
    echo 🔧 需要先压缩图片：
    echo 1. 打开 https://tinypng.com/
    echo 2. 上传有问题的图片
    echo 3. 下载压缩后的图片
    echo 4. 替换到 public\showcase\ 文件夹
)

echo.
echo 按任意键打开验证页面...
pause >nul
start VERIFY_IMAGE_COMPRESSION.html
echo.
echo 按任意键退出...
pause >nul