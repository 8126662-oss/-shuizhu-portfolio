/**
 * 紧急优化脚本 - 立即解决加载卡顿问题
 */

(function() {
    console.log('🚨 紧急优化启动...');
    
    // 1. 立即添加懒加载到所有图片
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        if (!img.hasAttribute('data-lazy-processed')) {
            img.setAttribute('data-lazy-processed', 'true');
        }
    });
    
    console.log(`✅ 已为 ${document.querySelectorAll('img').length} 张图片添加懒加载`);
    
    // 2. 创建加载进度监控
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #ff6b6b, #ee5a24);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    // 3. 监控图片加载
    let loadedImages = 0;
    const totalImages = document.querySelectorAll('img').length;
    
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            loadedImages++;
        } else {
            img.addEventListener('load', () => {
                loadedImages++;
                const progress = (loadedImages / totalImages) * 100;
                progressBar.style.width = `${progress}%`;
                
                if (loadedImages === totalImages) {
                    setTimeout(() => {
                        progressBar.style.opacity = '0';
                        setTimeout(() => progressBar.remove(), 500);
                        showOptimizationComplete();
                    }, 300);
                }
            });
            
            img.addEventListener('error', () => {
                loadedImages++;
                console.warn(`❌ 图片加载失败: ${img.src}`);
            });
        }
    });
    
    // 如果所有图片已加载
    if (loadedImages === totalImages) {
        progressBar.style.width = '100%';
        setTimeout(() => {
            progressBar.style.opacity = '0';
            setTimeout(() => progressBar.remove(), 500);
            showOptimizationComplete();
        }, 300);
    }
    
    // 4. 显示优化完成提示
    function showOptimizationComplete() {
        const hint = document.createElement('div');
        hint.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 18px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
        `;
        hint.innerHTML = '🚀 紧急优化完成！页面已加速';
        document.body.appendChild(hint);
        
        setTimeout(() => {
            hint.style.opacity = '0';
            setTimeout(() => hint.remove(), 500);
        }, 3000);
        
        console.log('✨ 紧急优化完成！');
    }
    
    // 5. 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        /* 立即优化图片显示 */
        img {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        img.loaded {
            opacity: 1;
        }
        
        /* 占位符 */
        .emergency-placeholder {
            background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 8px;
        }
        
        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    `;
    document.head.appendChild(style);
    
    // 6. 立即应用图片加载动画
    setTimeout(() => {
        document.querySelectorAll('img').forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    }, 100);
    
    console.log('🔧 紧急优化脚本加载完成');
    
    // 7. 性能报告
    setTimeout(() => {
        const images = document.querySelectorAll('img');
        const largeImages = Array.from(images).filter(img => {
            // 检查是否有大图片
            const src = img.src.toLowerCase();
            return src.includes('portfolio-5') || src.includes('outline-1') || src.includes('3-after');
        });
        
        if (largeImages.length > 0) {
            console.warn('⚠️ 发现可能的大图片：');
            largeImages.forEach(img => {
                console.warn(`   • ${img.src}`);
            });
            console.warn('💡 建议：使用 https://tinypng.com/ 进一步压缩');
        }
    }, 2000);
    
})();

// 全局函数
window.forceOptimize = function() {
    location.reload();
    return '🔄 强制优化已应用，页面重新加载中...';
};

console.log('📢 使用 forceOptimize() 强制重新优化');