# 图片替换检查脚本
Write-Host "🔍 检查图片替换状态..." -ForegroundColor Cyan
Write-Host "=" * 50

# 检查关键图片
$keyImages = @(
    "portfolio-5.jpg",
    "outline-1.jpg", 
    "3-after.jpg",
    "01.jpg",
    "02.jpg",
    "03.jpg",
    "04.jpg",
    "05.jpg"
)

$results = @()

foreach ($image in $keyImages) {
    $path = "public\showcase\$image"
    if (Test-Path $path) {
        $file = Get-Item $path
        $sizeKB = [math]::Round($file.Length / 1KB, 0)
        $lastWrite = $file.LastWriteTime.ToString("HH:mm:ss")
        $hash = (Get-FileHash $path -Algorithm MD5).Hash.Substring(0, 8)
        
        $status = if ($sizeKB -gt 500) { "❌ 过大" } else { "✅ 正常" }
        
        $results += [PSCustomObject]@{
            图片名称 = $image
            大小 = "$sizeKB KB"
            状态 = $status
            修改时间 = $lastWrite
            哈希值 = $hash
        }
    } else {
        $results += [PSCustomObject]@{
            图片名称 = $image
            大小 = "文件不存在"
            状态 = "❌ 缺失"
            修改时间 = "N/A"
            哈希值 = "N/A"
        }
    }
}

# 显示结果
$results | Format-Table -AutoSize

Write-Host "`n📊 分析结果：" -ForegroundColor Yellow
$largeCount = ($results | Where-Object { $_.状态 -eq "❌ 过大" }).Count
$totalCount = $results.Count

Write-Host "• 检查图片数量: $totalCount" -ForegroundColor White
Write-Host "• 过大图片数量: $largeCount" -ForegroundColor $(if ($largeCount -gt 0) { "Red" } else { "Green" })

if ($largeCount -gt 0) {
    Write-Host "`n⚠️ 发现问题：" -ForegroundColor Red
    Write-Host "以下图片仍然过大，需要压缩：" -ForegroundColor Yellow
    $results | Where-Object { $_.状态 -eq "❌ 过大" } | ForEach-Object {
        Write-Host "  • $($_.图片名称): $($_.大小)" -ForegroundColor Red
    }
    
    Write-Host "`n🎯 解决方案：" -ForegroundColor Cyan
    Write-Host "1. 打开 https://tinypng.com/" -ForegroundColor White
    Write-Host "2. 上传上述大图片" -ForegroundColor White
    Write-Host "3. 下载压缩后的图片" -ForegroundColor White
    Write-Host "4. 复制到: public\showcase\" -ForegroundColor White
    Write-Host "5. 覆盖原文件" -ForegroundColor White
} else {
    Write-Host "✅ 所有图片大小正常！" -ForegroundColor Green
}

Write-Host "`n🔧 文件位置：" -ForegroundColor Cyan
$fullPath = Resolve-Path "public\showcase\"
Write-Host "图片文件夹: $fullPath" -ForegroundColor White

Write-Host "`n🚀 下一步操作：" -ForegroundColor Magenta
Write-Host "1. 如果图片已压缩但显示过大 → 清除浏览器缓存 (Ctrl+Shift+Delete)" -ForegroundColor White
Write-Host "2. 如果图片未压缩 → 立即使用 TinyPNG 压缩" -ForegroundColor White
Write-Host "3. 压缩后运行此脚本再次验证" -ForegroundColor White

Write-Host "`n" + ("=" * 50) -ForegroundColor Cyan