/**
 * 水墨竹作品集 - 性能优化脚本
 * 自动添加懒加载、图片优化等功能
 */

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 性能优化系统启动...');
        this.addLazyLoading();
        this.addLoadingAnimations();
        this.optimizeImages();
        this.addPerformanceMonitoring();
    }

    /**
     * 添加图片懒加载
     */
    addLazyLoading() {
        // 为所有图片添加懒加载属性
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            // 跳过已经处理过的图片
            if (img.hasAttribute('data-lazy-processed')) return;
            
            // 保存原始src
            const originalSrc = img.src;
            if (!originalSrc || originalSrc === window.location.href) return;
            
            // 创建占位符
            const placeholder = this.createPlaceholder(img);
            
            // 设置data-src属性
            img.setAttribute('data-src', originalSrc);
            img.removeAttribute('src');
            img.setAttribute('loading', 'lazy');
            img.classList.add('lazy-image');
            img.setAttribute('data-lazy-processed', 'true');
            
            // 插入占位符
            img.parentNode.insertBefore(placeholder, img);
            placeholder.appendChild(img);
            
            // 添加加载完成事件
            this.setupIntersectionObserver(img);
        });
        
        console.log(`✅ 已为 ${images.length} 张图片添加懒加载`);
    }

    /**
     * 创建图片占位符
     */
    createPlaceholder(img) {
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        
        // 保持原图尺寸比例
        const width = img.width || 300;
        const height = img.height || 200;
        const aspectRatio = (height / width) * 100;
        
        placeholder.style.cssText = `
            position: relative;
            width: 100%;
            padding-bottom: ${aspectRatio}%;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 8px;
            overflow: hidden;
        `;
        
        return placeholder;
    }

    /**
     * 设置交叉观察器
     */
    setupIntersectionObserver(img) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px', // 提前50px开始加载
            threshold: 0.1
        });
        
        observer.observe(img);
    }

    /**
     * 加载图片
     */
    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;
        
        const image = new Image();
        image.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.classList.remove('lazy-image');
            
            // 移除占位符背景
            const placeholder = img.closest('.image-placeholder');
            if (placeholder) {
                placeholder.style.background = 'transparent';
                placeholder.style.animation = 'none';
            }
            
            console.log(`🖼️ 图片加载完成: ${src}`);
        };
        
        image.onerror = () => {
            console.error(`❌ 图片加载失败: ${src}`);
            img.classList.add('load-error');
        };
        
        image.src = src;
    }

    /**
     * 添加加载动画CSS
     */
    addLoadingAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            /* 懒加载动画 */
            .lazy-image {
                opacity: 0;
                transition: opacity 0.3s ease;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            
            .lazy-image.loaded {
                opacity: 1;
            }
            
            .lazy-image.load-error {
                opacity: 0.5;
                filter: grayscale(100%);
            }
            
            /* 加载占位动画 */
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            
            /* 响应式图片优化 */
            img {
                max-width: 100%;
                height: auto;
            }
            
            .portfolio-image, .gallery-image {
                transition: transform 0.3s ease;
            }
            
            .portfolio-image:hover, .gallery-image:hover {
                transform: scale(1.02);
            }
            
            /* 渐进式加载 */
            .progressive-load {
                filter: blur(10px);
                transition: filter 0.5s ease;
            }
            
            .progressive-load.loaded {
                filter: blur(0);
            }
        `;
        
        document.head.appendChild(style);
        console.log('🎨 加载动画CSS已添加');
    }

    /**
     * 优化现有图片
     */
    optimizeImages() {
        // 检查图片大小并给出建议
        const images = document.querySelectorAll('img');
        let totalSize = 0;
        let largeImages = [];
        
        images.forEach(img => {
            const src = img.src || img.getAttribute('data-src');
            if (src && src.startsWith('http')) {
                // 对于网络图片，我们可以检查文件大小
                this.checkImageSize(src).then(size => {
                    if (size > 1024 * 1024) { // 大于1MB
                        largeImages.push({
                            src: src,
                            size: (size / (1024 * 1024)).toFixed(2) + 'MB',
                            element: img
                        });
                    }
                    totalSize += size;
                });
            }
        });
        
        // 延迟显示建议
        setTimeout(() => {
            if (largeImages.length > 0) {
                console.warn('⚠️ 发现大图片，建议压缩：', largeImages);
                this.showOptimizationSuggestions(largeImages);
            }
            
            const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
            console.log(`📊 图片总量: ${totalMB}MB`);
        }, 2000);
    }

    /**
     * 检查图片大小
     */
    async checkImageSize(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const size = response.headers.get('content-length');
            return size ? parseInt(size) : 0;
        } catch (error) {
            return 0;
        }
    }

    /**
     * 显示优化建议
     */
    showOptimizationSuggestions(largeImages) {
        const suggestions = document.createElement('div');
        suggestions.id = 'optimization-suggestions';
        suggestions.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 15px;
            border-radius: 10px;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;
        
        let html = '<h4 style="margin: 0 0 10px 0;">⚠️ 图片优化建议</h4>';
        html += '<p style="margin: 0 0 10px 0; font-size: 14px;">发现大图片，影响加载速度：</p>';
        html += '<ul style="margin: 0; padding-left: 20px; font-size: 12px;">';
        
        largeImages.slice(0, 3).forEach(img => {
            html += `<li>${img.src.split('/').pop()} - ${img.size}</li>`;
        });
        
        if (largeImages.length > 3) {
            html += `<li>... 还有 ${largeImages.length - 3} 张</li>`;
        }
        
        html += '</ul>';
        html += '<p style="margin: 10px 0 0 0; font-size: 12px;">';
        html += '建议使用 <a href="https://tinypng.com" target="_blank" style="color: white; text-decoration: underline;">TinyPNG</a> 压缩图片';
        html += '</p>';
        
        suggestions.innerHTML = html;
        document.body.appendChild(suggestions);
        
        // 10秒后自动隐藏
        setTimeout(() => {
            suggestions.style.opacity = '0';
            suggestions.style.transition = 'opacity 0.5s ease';
            setTimeout(() => suggestions.remove(), 500);
        }, 10000);
    }

    /**
     * 添加性能监控
     */
    addPerformanceMonitoring() {
        // 监控页面性能
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                
                console.log(`⏱️ 页面加载时间: ${loadTime}ms`);
                
                if (loadTime > 3000) {
                    console.warn('⚠️ 页面加载较慢，建议优化');
                }
            }, 0);
        });
        
        // 监控图片加载性能
        const originalImage = window.Image;
        window.Image = function() {
            const img = new originalImage();
            const startTime = Date.now();
            
            img.addEventListener('load', function() {
                const loadTime = Date.now() - startTime;
                if (loadTime > 1000) {
                    console.warn(`🐌 图片加载较慢: ${this.src} (${loadTime}ms)`);
                }
            });
            
            return img;
        };
        
        console.log('📊 性能监控已启用');
    }

    /**
     * 生成优化报告
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            images: document.querySelectorAll('img').length,
            lazyLoaded: document.querySelectorAll('[loading="lazy"]').length,
            largeImages: [],
            suggestions: []
        };
        
        // 收集大图片信息
        document.querySelectorAll('img').forEach(img => {
            const src = img.src;
            if (src && !src.startsWith('data:')) {
                report.suggestions.push(`检查图片: ${src.split('/').pop()}`);
            }
        });
        
        console.log('📈 性能优化报告:', report);
        return report;
    }
}

// 自动启动优化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.imageOptimizer = new PerformanceOptimizer();
    });
} else {
    window.imageOptimizer = new PerformanceOptimizer();
}

// 导出全局函数
window.optimizeWebsite = function() {
    if (!window.imageOptimizer) {
        window.imageOptimizer = new PerformanceOptimizer();
    }
    return window.imageOptimizer.generateReport();
};

console.log('✨ 性能优化脚本加载完成');
console.log('使用 optimizeWebsite() 生成优化报告');