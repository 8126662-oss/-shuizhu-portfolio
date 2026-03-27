@echo off
echo ============================================
echo 图片压缩紧急处理脚本
echo ============================================
echo.
echo 🚨 检测到以下图片需要立即压缩：
echo.
echo 1. portfolio-5.jpg    - 9.9MB (目标: < 500KB)
echo 2. outline-1.jpg      - 1.7MB (目标: < 300KB)
echo 3. 3-after.jpg        - 1.5MB (目标: < 300KB)
echo 4. outline-4.jpg      - 1.4MB (目标: < 300KB)
echo 5. course-outline.jpg - 1.2MB (目标: < 300KB)
echo 6. 3-before.jpg       - 1.1MB (目标: < 300KB)
echo 7. 2-after.jpg        - 1.1MB (目标: < 300KB)
echo 8. portfolio-2.jpg    - 1.0MB (目标: < 300KB)
echo 9. portfolio-4.jpg    - 1.0MB (目标: < 300KB)
echo 10. portfolio-1.jpg   - 956KB (目标: < 300KB)
echo 11. portfolio-3.jpg   - 929KB (目标: < 300KB)
echo.
echo ============================================
echo 立即操作步骤：
echo 1. 打开 https://tinypng.com/
echo 2. 一次性上传上面所有图片（可多选）
echo 3. 等待压缩完成
echo 4. 下载所有压缩后的图片
echo 5. 替换到 public/showcase/ 文件夹
echo 6. 刷新网页测试
echo ============================================
echo.
echo 按任意键打开压缩网站...
pause >nul
start https://tinypng.com/
echo.
echo ✅ 网站已打开，请立即上传图片压缩！
echo 压缩完成后按任意键继续...
pause >nul
echo.
echo 🎯 压缩目标：
echo • 所有图片 < 500KB
echo • 总大小从 25MB → < 5MB
echo • 加载时间从 5-10秒 → 1-2秒
echo.
echo 按任意键退出...
pause >nul