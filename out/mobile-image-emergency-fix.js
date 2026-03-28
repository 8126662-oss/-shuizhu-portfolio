/**
 * 手机端图片显示紧急修复
 * 立即解决图片不显示问题
 */

(function() {
    'use strict';
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
    }

    console.log('🚨 手机端图片显示紧急修复启动...');

    function emergencyImageFix() {
        if (!document.body) {
            return;
        }

        console.log('🖼️ 执行图片显示紧急修复...');
        
        // 1. 修复所有图片元素
        const allImages = document.querySelectorAll('img');
        console.log(`📊 找到 ${allImages.length} 张图片`);
        
        allImages.forEach((img, index) => {
            // 确保图片显示
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';

            var inLayerStack = img.classList.contains('layer-img') || img.closest('#layerStackContainer');
            var inImageSlider = img.classList.contains('slider-image') || img.closest('.image-slider');
            if (inLayerStack || inImageSlider) {
                img.style.removeProperty('max-width');
                img.style.removeProperty('height');
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.maxWidth = 'none';
                img.style.objectFit = 'cover';
                img.style.position = 'absolute';
                img.style.inset = '0';
            } else {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
            
            // 修复懒加载图片
            if (img.dataset.src && !img.src) {
                console.log(`🔄 修复懒加载图片 ${index + 1}: ${img.alt || '未命名'}`);
                img.src = img.dataset.src;
                img.classList.add('loaded');
            }
            
            // 检查图片是否加载成功
            if (!img.complete) {
                img.onload = function() {
                    console.log(`✅ 图片加载成功: ${this.alt || '未命名'}`);
                    this.style.opacity = '1';
                };
                
                img.onerror = function() {
                    console.warn(`❌ 图片加载失败: ${this.alt || '未命名'}`);
                    // 显示占位符
                    this.style.backgroundColor = '#f0f0f0';
                    this.style.minHeight = '100px';
                    this.style.display = 'flex';
                    this.style.alignItems = 'center';
                    this.style.justifyContent = 'center';
                    this.innerHTML = '<span style="color:#666;font-size:12px;">图片加载失败</span>';
                };
            }
        });
        
        // 2. 修复图片容器
        const imageContainers = document.querySelectorAll('.gallery-image, .portfolio-image, .image-container, [class*="image"]');
        imageContainers.forEach(container => {
            if (container.tagName === 'IMG') return;
            if (container.closest('#layerStackContainer') || container.closest('.image-slider')) return;
            container.style.display = 'block';
            container.style.visibility = 'visible';
            container.style.overflow = 'hidden';
            container.style.position = 'relative';
        });
        
        // 3. 修复CSS类可能隐藏的图片
        const hiddenSelectors = [
            '[style*="display: none"]',
            '[style*="visibility: hidden"]',
            '[style*="opacity: 0"]',
            '.hidden',
            '.hide',
            '.invisible',
            '.d-none'
        ];
        
        hiddenSelectors.forEach(selector => {
            const hiddenElements = document.querySelectorAll(selector);
            hiddenElements.forEach(el => {
                if (el.tagName === 'IMG' || el.querySelector('img')) {
                    console.log(`🔓 解除隐藏: ${selector}`);
                    el.style.display = 'block';
                    el.style.visibility = 'visible';
                    el.style.opacity = '1';
                }
            });
        });
        
        // 4. 检查媒体查询影响
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            console.log('📱 移动端模式检测，应用特殊修复');
            
            // 强制显示所有移动端可能隐藏的元素
            const mobileHidden = document.querySelectorAll('[class*="mobile-hide"], [class*="sm-hide"]');
            mobileHidden.forEach(el => {
                el.style.display = 'block';
                el.style.visibility = 'visible';
            });
        }
        
        // 5. 调试信息（仅 body 已存在时；避免阻塞首屏）
        var debugInfo = null;
        try {
            debugInfo = document.createElement('div');
            debugInfo.style.cssText =
                'position:fixed;bottom:10px;right:10px;background:rgba(0,0,0,0.75);color:#0f0;padding:6px 10px;border-radius:6px;font-size:11px;z-index:9998;pointer-events:none;opacity:0.85;';
            debugInfo.textContent = '🖼️ 图片: ' + allImages.length + ' 张';
            document.body.appendChild(debugInfo);
        } catch (e) { /* ignore */ }
        
        // 6. 监控图片加载状态
        setTimeout(() => {
            const loadedImages = Array.from(allImages).filter(img => img.complete && img.naturalHeight > 0);
            const failedImages = Array.from(allImages).filter(img => img.complete && img.naturalHeight === 0);
            
            console.log(`📊 图片加载统计:`);
            console.log(`   ✅ 成功加载: ${loadedImages.length}`);
            console.log(`   ❌ 加载失败: ${failedImages.length}`);
            console.log(`   ⏳ 加载中: ${allImages.length - loadedImages.length - failedImages.length}`);

            if (debugInfo && debugInfo.parentNode) {
                debugInfo.textContent = `🖼️ 图片: ${loadedImages.length}✅ ${failedImages.length}❌`;
            }
            
            // 如果有图片加载失败，尝试重新加载
            if (failedImages.length > 0) {
                console.log('🔄 尝试重新加载失败的图片...');
                failedImages.forEach(img => {
                    const originalSrc = img.src;
                    img.src = '';
                    setTimeout(() => {
                        img.src = originalSrc;
                    }, 100);
                });
            }
        }, 1000);
        
        // 7. 修复Intersection Observer可能的问题
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.tagName === 'IMG') {
                            img.style.opacity = '1';
                            img.style.transform = 'translateZ(0)';
                        }
                    }
                });
            }, { threshold: 0.1 });
            
            allImages.forEach(img => observer.observe(img));
        }
        
        console.log('✅ 图片显示紧急修复完成');
    }
    
    // 监听窗口大小变化，重新应用修复
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(emergencyImageFix, 250);
    });
    
    var domObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.tagName === 'IMG' || (node.querySelector && node.querySelector('img'))) {
                        setTimeout(emergencyImageFix, 100);
                    }
                });
            }
        });
    });

    function attachBodyObserver() {
        if (!document.body) {
            return;
        }
        try {
            domObserver.observe(document.body, { childList: true, subtree: true });
        } catch (e) { /* ignore */ }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function onReady() {
            emergencyImageFix();
            attachBodyObserver();
        });
    } else {
        emergencyImageFix();
        attachBodyObserver();
    }

    window.addEventListener('load', emergencyImageFix);

    console.log('🚨 手机端图片显示紧急修复已部署');
})();