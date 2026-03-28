/**
 * 最终图片修复 - 确保所有图片立即显示
 * 最高优先级，立即执行
 */

// 立即执行，不等待任何事件
(function() {
    console.log('🚨 最终图片修复启动');
    
    // 1. 立即修复所有图片
    function fixAllImages() {
        console.log('🖼️ 修复所有图片...');
        
        // 获取所有图片
        const allImages = document.querySelectorAll('img');
        console.log(`📊 找到 ${allImages.length} 张图片`);
        
        // 修复每张图片
        allImages.forEach((img, index) => {
            // 强制显示属性
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            
            // 修复懒加载
            if (img.dataset.src && !img.src) {
                console.log(`🔄 修复懒加载图片 ${index + 1}`);
                img.src = img.dataset.src;
                img.classList.add('loaded');
            }
            
            // 确保图片加载
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
        const containers = document.querySelectorAll('.gallery-image, .portfolio-image, [class*="image"]');
        containers.forEach(container => {
            container.style.display = 'block';
            container.style.visibility = 'visible';
            container.style.overflow = 'visible';
        });
        
        // 3. 移除所有可能隐藏图片的样式
        const hiddenElements = document.querySelectorAll('[style*="display: none"], [style*="visibility: hidden"], .hidden, .hide');
        hiddenElements.forEach(el => {
            if (el.tagName === 'IMG' || el.querySelector('img')) {
                el.style.display = 'block';
                el.style.visibility = 'visible';
            }
        });
        
        console.log('✅ 图片修复完成');
        
        // 4. 显示状态
        showStatus(allImages.length);
    }
    
    // 显示修复状态
    function showStatus(imageCount) {
        const status = document.createElement('div');
        status.id = 'image-fix-status';
        status.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.9);
            color: #0f0;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 12px;
            font-family: monospace;
            z-index: 99999;
            border: 2px solid #0f0;
            box-shadow: 0 0 20px rgba(0,255,0,0.5);
        `;
        status.textContent = `🖼️ 已修复 ${imageCount} 张图片`;
        document.body.appendChild(status);
        
        // 5秒后隐藏
        setTimeout(() => {
            status.style.opacity = '0';
            status.style.transition = 'opacity 1s';
            setTimeout(() => status.remove(), 1000);
        }, 5000);
    }
    
    // 立即执行修复
    fixAllImages();
    
    // 监听DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixAllImages);
    }
    
    // 监听窗口加载完成
    window.addEventListener('load', fixAllImages);
    
    // 监听动态添加的图片
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'IMG' || (node.querySelector && node.querySelector('img'))) {
                        console.log('🆕 检测到新图片，立即修复');
                        setTimeout(fixAllImages, 100);
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('🚨 最终图片修复已部署');
})();