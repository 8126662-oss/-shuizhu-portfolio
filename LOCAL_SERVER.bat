@echo off
echo ========================================
echo 🚀 水墨竹作品集 - 本地紧急服务器
echo ========================================
echo.
echo GitHub Pages部署已等待35分钟仍未完成！
echo 使用本地服务器立即查看压缩后的网站效果。
echo.
echo 正在启动本地HTTP服务器...
echo.

REM 检查Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo 使用Python启动服务器...
    echo 网站地址: http://localhost:8000
    echo 按 Ctrl+C 停止服务器
    echo.
    python -m http.server 8000
    goto :end
)

REM 检查Node.js
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo 使用Node.js启动服务器...
    echo 网站地址: http://localhost:3000
    echo 按 Ctrl+C 停止服务器
    echo.
    npx serve .
    goto :end
)

REM 使用PowerShell
echo 使用PowerShell启动服务器...
echo 网站地址: http://localhost:8080
echo 按 Ctrl+C 停止服务器
echo.
powershell -Command "Start-Process 'http://localhost:8080'; $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8080/'); $listener.Start(); while ($true) { $context = $listener.GetContext(); $response = $context.Response; $filePath = [System.IO.Path]::Combine((Get-Location).Path, $context.Request.Url.LocalPath.TrimStart('/')); if ($filePath -eq (Get-Location).Path) { $filePath = 'index.html' }; if (Test-Path $filePath) { $content = [System.IO.File]::ReadAllText($filePath); $buffer = [System.Text.Encoding]::UTF8.GetBytes($content); $response.ContentLength64 = $buffer.Length; $response.OutputStream.Write($buffer, 0, $buffer.Length) } else { $response.StatusCode = 404 }; $response.Close() }"

:end
echo.
echo 服务器已停止。
pause