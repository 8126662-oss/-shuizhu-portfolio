/**
 * 动态外边框比例匹配解决方案
 * 根据实际图片比例动态调整外边框，而不是固定为4:3
 */

(function() {
    console.log('🎨 动态外边框比例匹配脚本启动...');
    
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDynamicBorders);
    } else {
        initDynamicBorders();
    }
    
    function initDynamicBorders() {
        console.log('🖼️ 开始检测图片并匹配外边框比例...');
        
        // 找到所有后期作品选集的图片
        const portfolioImages = document.querySelectorAll('#portfolio .portfolio-image');
        
        if (portfolioImages.length === 0) {
            console.log('⚠️ 未找到后期作品选集图片，使用默认4:3比例');
            return;
        }
        
        console.log(`📸 找到 ${portfolioImages.length} 张图片，开始检测比例...`);
        
        // 为每张图片设置加载监听器
        portfolioImages.forEach((img, index) => {
            // 如果图片已经加载完成
            if (img.complete) {
                adjustBorderToImageRatio(img, index);
            } else {
                // 等待图片加载完成
                img.addEventListener('load', () => adjustBorderToImageRatio(img, index));
                img.addEventListener('error', () => handleImageError(img, index));
            }
        });
        
        // 监听窗口大小变化，重新调整
        window.addEventListener('resize', debounce(() => {
            portfolioImages.forEach((img, index) => {
                if (img.complete && img.naturalWidth > 0) {
                    adjustBorderToImageRatio(img, index);
                }
            });
        }, 250));
        
        console.log('✅ 动态外边框比例匹配已初始化');
    }
    
    function adjustBorderToImageRatio(img, index) {
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        
        if (naturalWidth === 0 || naturalHeight === 0) {
            console.log(`⚠️ 图片 ${index + 1} 尺寸无效，使用默认4:3比例`);
            setDefaultAspectRatio(img);
            return;
        }
        
        // 计算图片实际比例
        const imageRatio = naturalWidth / naturalHeight;
        
        console.log(`📐 图片 ${index + 1}: ${naturalWidth}×${naturalHeight}, 比例: ${imageRatio.toFixed(2)}:1`);
        
        // 找到外边框容器（gallery-image）
        const borderContainer = img.closest('.gallery-image');
        if (!borderContainer) {
            console.log(`❌ 图片 ${index + 1} 未找到外边框容器`);
            return;
        }
        
        // 移除固定的aspect-ratio
        borderContainer.style.aspectRatio = `${imageRatio} / 1`;
        
        // 根据比例调整样式
        if (imageRatio > 1.5) {
            // 宽屏图片（16:9, 21:9等）
            borderContainer.style.maxWidth = '100%';
            borderContainer.style.margin = '0 auto';
            console.log(`🖥️  图片 ${index + 1}: 宽屏比例 (${imageRatio.toFixed(2)}:1)`);
        } else if (imageRatio < 0.8) {
            // 竖屏图片（3:4, 9:16等）
            borderContainer.style.maxWidth = '250px';
            borderContainer.style.margin = '0 auto';
            console.log(`📱 图片 ${index + 1}: 竖屏比例 (${imageRatio.toFixed(2)}:1)`);
        } else {
            // 接近方形的图片（1:1, 4:3, 3:4等）
            borderContainer.style.maxWidth = '300px';
            console.log(`⬜ 图片 ${index + 1}: 方形比例 (${imageRatio.toFixed(2)}:1)`);
        }
        
        // 确保图片填充整个容器
        img.style.objectFit = 'contain';
        img.style.width = '100%';
        img.style.height = '100%';
        
        console.log(`✅ 图片 ${index + 1} 外边框已匹配图片比例: ${imageRatio.toFixed(2)}:1`);
    }
    
    function setDefaultAspectRatio(img) {
        const borderContainer = img.closest('.gallery-image');
        if (borderContainer) {
            borderContainer.style.aspectRatio = '4 / 3';
            borderContainer.style.maxWidth = '300px';
        }
    }
    
    function handleImageError(img, index) {
        console.log(`❌ 图片 ${index + 1} 加载失败，使用默认4:3比例`);
        setDefaultAspectRatio(img);
        
        // 显示占位符
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.innerHTML = `<p>作品 ${index + 1}</p>`;
        
        const container = img.closest('.gallery-image');
        if (container) {
            container.appendChild(placeholder);
        }
    }
    
    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        /* 动态外边框比例匹配样式 */
        .gallery-image {
            transition: aspect-ratio 0.3s ease, max-width 0.3s ease;
        }
        
        /* 宽屏图片样式 */
        .gallery-image.widescreen {
            max-width: 100% !important;
        }
        
        /* 竖屏图片样式 */
        .gallery-image.portrait {
            max-width: 250px !important;
        }
        
        /* 方形图片样式 */
        .gallery-image.square {
            max-width: 300px !important;
        }
        
        /* 确保图片正确显示 */
        .portfolio-image {
            object-fit: contain !important;
            width: 100% !important;
            height: 100% !important;
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
            .gallery-image.portrait {
                max-width: 200px !important;
            }
            
            .gallery-image.square {
                max-width: 250px !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('🎨 动态外边框比例匹配样式已注入');
})();