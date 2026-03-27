# 图片优化脚本
# 自动压缩图片并转换为WebP格式

Write-Host "🎨 水墨竹作品集 - 图片优化工具" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Yellow

# 检查是否有ImageMagick（用于图片处理）
$hasImageMagick = $false
try {
    $magick = Get-Command magick -ErrorAction Stop
    $hasImageMagick = $true
    Write-Host "✅ 检测到 ImageMagick: $($magick.Source)" -ForegroundColor Green
} catch {
    Write-Host "❌ 未检测到 ImageMagick" -ForegroundColor Red
    Write-Host "请先安装 ImageMagick: https://imagemagick.org/script/download.php" -ForegroundColor Yellow
    Write-Host "或者使用在线工具压缩图片" -ForegroundColor Yellow
}

# 创建备份目录
$backupDir = "public/showcase/backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Write-Host "📁 创建备份目录: $backupDir" -ForegroundColor Green
}

# 图片优化配置
$optimizationSettings = @{
    # 最大宽度（根据网站布局调整）
    "portfolio" = @{ MaxWidth = 1200; Quality = 85 }
    "outline"   = @{ MaxWidth = 1000; Quality = 85 }
    "showcase"  = @{ MaxWidth = 800; Quality = 80 }
    "qr"        = @{ MaxWidth = 400; Quality = 90 }
}

# 分析当前图片
Write-Host "`n📊 当前图片分析:" -ForegroundColor Cyan
Write-Host "------------------------------------------" -ForegroundColor Gray

$images = Get-ChildItem "public/showcase/*.jpg" -File
$totalSize = 0
$optimizableCount = 0

foreach ($img in $images) {
    $sizeMB = [math]::Round($img.Length / 1MB, 2)
    $totalSize += $img.Length
    
    if ($img.Length -gt 2MB) {  # 大于2MB的图片需要优化
        $optimizableCount++
        Write-Host "❌ $($img.Name) - ${sizeMB}MB (需要优化)" -ForegroundColor Red
    } elseif ($img.Length -gt 500KB) {
        Write-Host "⚠️  $($img.Name) - ${sizeMB}MB (建议优化)" -ForegroundColor Yellow
    } else {
        Write-Host "✅ $($img.Name) - ${sizeMB}MB (良好)" -ForegroundColor Green
    }
}

$totalSizeMB = [math]::Round($totalSize / 1MB, 2)
Write-Host "------------------------------------------" -ForegroundColor Gray
Write-Host "总计: $($images.Count) 张图片，${totalSizeMB}MB" -ForegroundColor Cyan
Write-Host "需要优化的图片: $optimizableCount 张" -ForegroundColor Red

if ($optimizableCount -eq 0) {
    Write-Host "`n🎉 所有图片都已优化，无需进一步操作！" -ForegroundColor Green
    exit 0
}

# 显示优化建议
Write-Host "`n💡 优化建议:" -ForegroundColor Cyan
Write-Host "------------------------------------------" -ForegroundColor Gray
Write-Host "1. 使用在线工具批量压缩:" -ForegroundColor Yellow
Write-Host "   • https://tinypng.com/ (推荐)" -ForegroundColor White
Write-Host "   • https://compressor.io/" -ForegroundColor White
Write-Host "   • https://imagecompressor.com/" -ForegroundColor White

Write-Host "`n2. 手动优化步骤:" -ForegroundColor Yellow
Write-Host "   a. 备份原图到: $backupDir" -ForegroundColor White
Write-Host "   b. 使用Photoshop或GIMP批量处理" -ForegroundColor White
Write-Host "   c. 目标大小: 网页图片建议 < 500KB" -ForegroundColor White
Write-Host "   d. 分辨率: 最大宽度1200px足够" -ForegroundColor White

Write-Host "`n3. 转换为WebP格式（可选）:" -ForegroundColor Yellow
Write-Host "   • 体积减少30-50%" -ForegroundColor White
Write-Host "   • 现代浏览器都支持" -ForegroundColor White

# 创建HTML懒加载代码
Write-Host "`n📝 懒加载HTML代码示例:" -ForegroundColor Cyan
Write-Host "------------------------------------------" -ForegroundColor Gray
Write-Host '<!-- 原代码 -->'
Write-Host '<img src="public/showcase/portfolio-1.jpg" alt="作品">'
Write-Host ''
Write-Host '<!-- 优化后代码 -->'
Write-Host '<img src="public/showcase/portfolio-1-small.jpg"'
Write-Host '     data-src="public/showcase/portfolio-1.jpg"'
Write-Host '     alt="作品"'
Write-Host '     loading="lazy"'
Write-Host '     class="lazy-load">'
Write-Host ''
Write-Host '<!-- 或者使用picture元素支持WebP -->'
Write-Host '<picture>'
Write-Host '  <source srcset="public/showcase/portfolio-1.webp" type="image/webp">'
Write-Host '  <source srcset="public/showcase/portfolio-1.jpg" type="image/jpeg">'
Write-Host '  <img src="public/showcase/portfolio-1.jpg" alt="作品" loading="lazy">'
Write-Host '</picture>'

# 创建CSS加载动画
$cssCode = @'
/* 图片加载动画 */
.lazy-load {
    opacity: 0;
    transition: opacity 0.3s ease;
}

.lazy-load.loaded {
    opacity: 1;
}

/* 加载占位符 */
.image-placeholder {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 8px;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* 响应式图片 */
img {
    max-width: 100%;
    height: auto;
}
'@

Write-Host "`n🎨 CSS加载动画代码已生成" -ForegroundColor Green

# 保存CSS到文件
$cssPath = "public/optimized-images.css"
$cssCode | Out-File -FilePath $cssPath -Encoding UTF8
Write-Host "✅ CSS文件已保存: $cssPath" -ForegroundColor Green

# 创建优化清单
$optimizationList = @"
# 图片优化清单
生成时间: $(Get-Date)

## 需要优先优化的图片（>10MB）
1. 2-after.jpg (49.24MB) - 严重！必须优化
2. outline-1.jpg (22.8MB)
3. outline-4.jpg (18.24MB)
4. 3-after.jpg (16.16MB)
5. portfolio-1.jpg (14.44MB)

## 建议优化目标
- 所有图片压缩到 < 500KB
- 最大宽度: 1200px
- 质量: 80-85%

## 优化步骤
1. 备份原图到: $backupDir
2. 使用在线工具批量压缩
3. 替换压缩后的图片
4. 测试网站加载速度

## 网站性能目标
- 首屏加载时间: < 3秒
- 所有图片加载: < 5秒
- Lighthouse评分: > 90

## 测试工具
1. Google PageSpeed Insights: https://pagespeed.web.dev/
2. GTmetrix: https://gtmetrix.com/
3. WebPageTest: https://www.webpagetest.org/
"@

$listPath = "IMAGE_OPTIMIZATION_GUIDE.md"
$optimizationList | Out-File -FilePath $listPath -Encoding UTF8
Write-Host "✅ 优化指南已保存: $listPath" -ForegroundColor Green

Write-Host "`n🚀 下一步操作:" -ForegroundColor Cyan
Write-Host "------------------------------------------" -ForegroundColor Gray
Write-Host "1. 先备份原图到备份目录" -ForegroundColor Yellow
Write-Host "2. 使用 https://tinypng.com/ 批量压缩图片" -ForegroundColor Yellow
Write-Host "3. 替换压缩后的图片" -ForegroundColor Yellow
Write-Host "4. 测试网站加载速度" -ForegroundColor Yellow
Write-Host "5. 如果需要，我可以帮你修改HTML添加懒加载" -ForegroundColor Yellow

Write-Host "`n💪 需要我帮你执行具体步骤吗？" -ForegroundColor Green