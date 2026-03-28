# 图片压缩指南

## 当前图片大小问题

### 图层合成图片（最紧急）
| 图片 | 当前大小 | 建议压缩到 |
|------|----------|------------|
| 01.jpg | 757 KB | 150 KB |
| 02.jpg | 577 KB | 120 KB |
| 03.jpg | 622 KB | 130 KB |
| 04.jpg | 901 KB | 180 KB |
| 05.jpg | 787 KB | 160 KB |
| **总计** | **3.64 MB** | **740 KB** |

### 其他大图片
| 图片 | 当前大小 | 建议压缩到 |
|------|----------|------------|
| outline-1.jpg | 1.66 MB | 300 KB |
| course-outline.jpg | 1.18 MB | 250 KB |
| 3-after.jpg | 1.50 MB | 280 KB |
| portfolio-*.jpg | 平均 1 MB | 200 KB 每张 |

## 压缩建议

### 方法1：使用在线工具（推荐）
1. **TinyPNG** (https://tinypng.com/)
   - 支持JPG和PNG
   - 无损压缩，质量保持好
   - 批量处理，最多20张

2. **Squoosh** (https://squoosh.app/)
   - Google开发，开源
   - 实时预览压缩效果
   - 可调整压缩参数

### 方法2：使用软件
1. **Photoshop**
   - 文件 → 导出 → 存储为Web所用格式
   - 质量设置：60-80%
   - 优化文件大小

2. **GIMP** (免费)
   - 文件 → 导出为
   - 调整JPG质量滑块

### 方法3：命令行工具
```bash
# 安装ImageMagick
# Windows: choco install imagemagick
# Mac: brew install imagemagick

# 压缩单张图片（质量80%）
magick input.jpg -quality 80 output.jpg

# 批量压缩
magick mogrify -quality 80 -path compressed/ *.jpg
```

## 临时解决方案

在您压缩图片期间，我已添加以下临时措施：

1. **延迟加载**: 图片只在进入视口时加载
2. **渐进式加载**: 先显示模糊预览图
3. **大小限制**: 移动端显示缩略图
4. **错误处理**: 加载失败时显示占位符

## 压缩后操作

1. 将压缩后的图片替换 `public/showcase/` 目录中的原文件
2. 保持相同的文件名
3. 清除浏览器缓存测试
4. 使用 `simple-image-test.html` 验证加载

## 质量建议

- **网页显示**: 质量60-80%足够
- **尺寸**: 最大宽度不超过2000px
- **格式**: 使用WebP格式可获得更好压缩（需浏览器支持）

## 紧急处理

如果急需显示，可以先压缩最重要的5张图层图片（01.jpg-05.jpg），其他图片可以稍后处理。