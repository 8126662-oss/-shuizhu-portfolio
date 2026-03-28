/**
 * 手机端性能优化器
 * 解决手机端加载慢、卡顿问题
 */

(function() {
    if (typeof window === 'undefined' || typeof document === 'undefined' || typeof navigator === 'undefined') {
        return;
    }

    console.log('📱 手机端性能优化器启动...');
    
    var ua = navigator.userAgent || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    
    if (!isMobile) {
        console.log('💻 检测到桌面设备，跳过手机端优化');
        return;
    }
    
    console.log('📱 检测到移动设备，开始性能优化...');
    
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimizeForMobile);
    } else {
        optimizeForMobile();
    }
    
    function optimizeForMobile() {
        console.log('⚡ 开始移动端性能优化...');
        
        // 1. 延迟加载非关键CSS
        delayNonCriticalCSS();
        
        // 2. 优化图片加载
        optimizeImageLoading();
        
        // 3. 减少JavaScript执行
        reduceJavaScriptExecution();
        
        // 4. 优化动画和过渡效果
        optimizeAnimations();
        
        // 5. 监控性能
        monitorPerformance();
        
        console.log('✅ 移动端性能优化完成');
    }
    
    function delayNonCriticalCSS() {
        console.log('🎨 延迟加载非关键CSS...');
        
        // 需要延迟加载的CSS文件
        const nonCriticalCSS = [
            'performance-optimizations.css',
            'fix-lazy-loading.css',
            'EMERGENCY_GREEN_BOX_FIX.css'
        ];
        
        nonCriticalCSS.forEach(cssFile => {
            const link = document.querySelector(`link[href="${cssFile}"]`);
            if (link) {
                link.media = 'print';
                link.onload = () => {
                    link.media = 'all';
                    console.log(`✅ ${cssFile} 已延迟加载`);
                };
            }
        });
        
        // 内联关键CSS
        inlineCriticalCSS();
    }
    
    function inlineCriticalCSS() {
        console.log('🔧 内联关键CSS规则...');
        
        const style = document.createElement('style');
        style.textContent = `
            /* 移动端关键CSS */
            * {
                -webkit-tap-highlight-color: transparent !important;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            
            body {
                overflow-x: hidden;
                max-width: 100vw;
            }
            
            img, video {
                max-width: 100%;
                height: auto;
            }
            
            /* 移动端触摸优化 */
            button, a, .gallery-item, .portfolio-image {
                min-height: 44px;
                min-width: 44px;
            }
            
            /* 减少重绘 */
            .gallery-track, .testimonial-track {
                will-change: transform;
            }
            
            /* 移动端字体优化 */
            @media (max-width: 768px) {
                body {
                    font-size: 14px;
                    line-height: 1.5;
                }
                
                h1 { font-size: 1.8rem; }
                h2 { font-size: 1.5rem; }
                h3 { font-size: 1.2rem; }
                
                .gallery-item {
                    flex: 0 0 min(250px, 85vw) !important;
                }
                
                .testimonial-card {
                    flex: 0 0 min(280px, 90vw) !important;
                }
            }
            
            /* 极简动画 - 移动端 */
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ 关键CSS已内联');
    }
    
    function optimizeImageLoading() {
        console.log('🖼️ 优化图片加载...');
        
        // 使用Intersection Observer实现懒加载
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[loading="lazy"], .lazy-image');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // 加载图片
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            delete img.dataset.src;
                        }
                        
                        // 添加加载完成类
                        img.classList.add('loaded');
                        
                        observer.unobserve(img);
                        console.log(`🖼️ 图片懒加载完成: ${img.alt || '未命名图片'}`);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
            
            console.log(`✅ ${lazyImages.length} 张图片启用懒加载`);
        }
        
        // 优化图片尺寸 - 移动端使用更小的图片
        optimizeImageSizes();
    }
    
    function optimizeImageSizes() {
        const images = document.querySelectorAll('img[src*=".jpg"], img[src*=".png"], img[src*=".webp"]');
        
        images.forEach(img => {
            const src = img.src;

            if (img.classList.contains('layer-img') || img.closest('#layerStackContainer')) {
                return;
            }
            
            // 如果是大图，尝试使用移动端优化版本
            // 注意：暂时注释掉srcset优化，因为移动端优化版本图片可能不存在
            // 这会导致图片加载失败
            /*
            if (src.includes('portfolio-') || src.includes('showcase/')) {
                // 添加srcset属性
                const fileName = src.split('/').pop();
                const baseName = fileName.split('.')[0];
                const extension = fileName.split('.')[1];
                
                img.srcset = `
                    ${src} 1x,
                    ${src.replace(fileName, `${baseName}-mobile.${extension}`)} 2x
                `.trim();
                
                img.sizes = '(max-width: 768px) 100vw, 50vw';
                
                console.log(`📐 图片尺寸优化: ${fileName}`);
            }
            */
            
            // 确保图片在移动端正确显示
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
        });
        
        console.log(`✅ ${images.length} 张图片已确保正确显示`);
    }
    
    function reduceJavaScriptExecution() {
        console.log('⚡ 减少JavaScript执行...');
        
        // 延迟执行非关键JavaScript
        const nonCriticalScripts = document.querySelectorAll('script[src*="test-"], script[src*="diagnose-"]');
        
        nonCriticalScripts.forEach(script => {
            script.defer = true;
            script.async = true;
            console.log(`⏳ 延迟执行脚本: ${script.src.split('/').pop()}`);
        });
        
        // 节流滚动事件
        throttleScrollEvents();
        
        // 优化resize事件
        optimizeResizeEvents();
    }
    
    function throttleScrollEvents() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // 这里可以添加需要响应滚动的代码
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        console.log('🔄 滚动事件已节流优化');
    }
    
    function optimizeResizeEvents() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // 这里可以添加需要响应窗口大小变化的代码
                console.log('🔄 窗口大小变化优化处理');
            }, 250);
        }, { passive: true });
        
        console.log('📏 窗口大小变化事件已优化');
    }
    
    function optimizeAnimations() {
        console.log('🎬 优化动画和过渡效果...');
        
        // 减少动画复杂度
        const style = document.createElement('style');
        style.textContent = `
            /* 移动端简化动画 */
            @media (max-width: 768px) {
                .gallery-item:hover,
                .portfolio-image:hover,
                .testimonial-card:hover {
                    transform: none !important;
                    transition: none !important;
                }
                
                /* 简化加载动画 */
                .image-placeholder {
                    animation-duration: 2s !important;
                }
                
                /* 减少模糊效果 */
                .gallery-image {
                    backdrop-filter: blur(10px) saturate(120%) !important;
                }
                
                /* 简化阴影 */
                .gallery-image:hover {
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
                }
            }
            
            /* 优先考虑性能的动画 */
            .performance-first {
                transform: translateZ(0);
                backface-visibility: hidden;
                perspective: 1000px;
            }
        `;
        
        document.head.appendChild(style);
        
        // 为动画元素添加性能优化类
        document.querySelectorAll('.gallery-track, .testimonial-track').forEach(el => {
            el.classList.add('performance-first');
        });
        
        console.log('✅ 动画和过渡效果已优化');
    }
    
    function monitorPerformance() {
        console.log('📊 开始性能监控...');
        
        // 监控首次内容绘制 (FCP)
        if ('PerformanceObserver' in window) {
            const fcpObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log(`🎨 首次内容绘制 (FCP): ${entry.startTime.toFixed(2)}ms`);
                    
                    if (entry.startTime > 3000) {
                        console.warn('⚠️ FCP时间较长，考虑进一步优化');
                    }
                }
            });
            
            fcpObserver.observe({ entryTypes: ['paint'] });
        }
        
        // 监控最大内容绘制 (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log(`📸 最大内容绘制 (LCP): ${entry.startTime.toFixed(2)}ms`);
                    
                    if (entry.startTime > 4000) {
                        console.warn('⚠️ LCP时间较长，图片加载可能需要优化');
                    }
                }
            });
            
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        }
        
        // 监控累积布局偏移 (CLS)
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        console.log(`📐 累积布局偏移 (CLS): ${clsValue.toFixed(4)}`);
                        
                        if (clsValue > 0.1) {
                            console.warn('⚠️ CLS值较高，布局稳定性需要优化');
                        }
                    }
                }
            });
            
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
        
        // 资源加载监控
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('resource');
            const totalSize = perfData.reduce((total, resource) => total + resource.transferSize, 0);
            
            console.log(`📦 总资源大小: ${(totalSize / 1024).toFixed(2)} KB`);
            console.log(`🔗 资源请求数量: ${perfData.length}`);
            
            // 找出最大的资源
            const largestResources = perfData
                .sort((a, b) => b.transferSize - a.transferSize)
                .slice(0, 3);
            
            console.log('📊 最大的3个资源:');
            largestResources.forEach((resource, index) => {
                console.log(`  ${index + 1}. ${resource.name}: ${(resource.transferSize / 1024).toFixed(2)} KB`);
            });
        });
        
        console.log('✅ 性能监控已启用');
    }
    
    // 添加移动端特定的事件监听器
    document.addEventListener('touchstart', () => {
        // 触摸开始时的优化
    }, { passive: true });
    
    document.addEventListener('touchmove', () => {
        // 触摸移动时的优化
    }, { passive: true });
    
    console.log('📱 手机端性能优化器初始化完成');
})();