/**
 * 图片替换验证脚本
 * 添加到index.html的<head>中
 */

(function() {
    console.log('🔄 图片替换验证启动...');
    
    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVerification);
    } else {
        initVerification();
    }
    
    function initVerification() {
        // 1. 检查所有图片
        const images = document.querySelectorAll('img');
        console.log(`📊 发现 ${images.length} 张图片`);
        
        // 2. 为每张图片添加时间戳，强制刷新
        images.forEach(img => {
            if (!img.src.includes('?')) {
                // 添加时间戳参数，强制浏览器重新加载
                img.src = img.src + '?v=' + Date.now();
            }
        });
        
        // 3. 监控图片加载
        let loadedCount = 0;
        const totalImages = images.length;
        
        images.forEach(img => {
            if (img.complete) {
                loadedCount++;
                checkImageSize(img);
            } else {
                img.addEventListener('load', function() {
                    loadedCount++;
                    checkImageSize(this);
                    
                    // 所有图片加载完成
                    if (loadedCount === totalImages) {
                        showVerificationComplete();
                    }
                });
                
                img.addEventListener('error', function() {
                    loadedCount++;
                    console.warn(`❌ 图片加载失败: ${this.src}`);
                });
            }
        });
        
        // 如果所有图片已加载
        if (loadedCount === totalImages) {
            setTimeout(showVerificationComplete, 500);
        }
        
        // 4. 显示验证提示
        const hint = document.createElement('div');
        hint.id = 'replacement-verification-hint';
        hint.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            color: white;
            padding: 12px 18px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        hint.innerHTML = `
            <strong>🔄 图片替换验证中...</strong><br>
            <small>已强制刷新所有图片缓存</small>
        `;
        document.body.appendChild(hint);
        
        // 5. 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            /* 图片加载动画 */
            img.verifying {
                opacity: 0.5;
                transition: opacity 0.5s ease;
            }
            
            img.verified {
                opacity: 1;
                border: 2px solid #10b981;
                border-radius: 4px;
            }
            
            img.failed {
                border: 2px solid #ef4444;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
        
        // 初始状态
        images.forEach(img => {
            img.classList.add('verifying');
        });
    }
    
    // 检查图片大小
    function checkImageSize(img) {
        // 通过performance API获取传输大小
        const entries = performance.getEntriesByName(img.src);
        if (entries.length > 0) {
            const sizeKB = Math.round(entries[0].transferSize / 1024);
            console.log(`📏 ${img.src.split('/').pop()}: ${sizeKB}KB`);
            
            // 标记大图片
            if (sizeKB > 500) {
                console.warn(`⚠️  ${img.src.split('/').pop()} 仍然较大 (${sizeKB}KB)`);
                img.classList.add('large-image');
                
                // 添加提示
                const warning = document.createElement('div');
                warning.style.cssText = `
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: rgba(245, 158, 11, 0.9);
                    color: white;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    z-index: 10;
                `;
                warning.textContent = `${sizeKB}KB`;
                img.parentNode.style.position = 'relative';
                img.parentNode.appendChild(warning);
            }
        }
        
        img.classList.remove('verifying');
        img.classList.add('verified');
    }
    
    // 显示验证完成
    function showVerificationComplete() {
        const hint = document.getElementById('replacement-verification-hint');
        if (hint) {
            hint.innerHTML = `
                <strong>✅ 图片替换验证完成</strong><br>
                <small>所有图片已强制刷新</small>
                <div style="margin-top: 8px; font-size: 12px;">
                    <button onclick="location.reload(true)" style="background: white; color: #667eea; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
                        再次强制刷新
                    </button>
                </div>
            `;
            
            // 3秒后隐藏
            setTimeout(() => {
                hint.style.opacity = '0';
                setTimeout(() => hint.remove(), 500);
            }, 3000);
        }
        
        console.log('✨ 图片替换验证完成！');
        
        // 检查是否有大图片
        const largeImages = document.querySelectorAll('.large-image');
        if (largeImages.length > 0) {
            console.warn(`⚠️ 发现 ${largeImages.length} 张较大图片，建议进一步压缩`);
            
            // 显示大图片警告
            const warning = document.createElement('div');
            warning.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: rgba(245, 158, 11, 0.9);
                color: white;
                padding: 12px 18px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 9999;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                max-width: 300px;
            `;
            warning.innerHTML = `
                <strong>⚠️ 发现 ${largeImages.length} 张较大图片</strong><br>
                <small>建议使用 TinyPNG 进一步压缩</small>
            `;
            document.body.appendChild(warning);
            
            setTimeout(() => {
                warning.style.opacity = '0';
                setTimeout(() => warning.remove(), 500);
            }, 5000);
        }
    }
    
    // 全局函数：手动触发验证
    window.verifyImageReplacement = function() {
        location.reload(true);
        return '🔄 强制验证已触发，页面重新加载中...';
    };
    
    console.log('📢 使用 verifyImageReplacement() 手动触发验证');
})();