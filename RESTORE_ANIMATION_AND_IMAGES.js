/**
 * 恢复图层动画并修复图片显示
 * 立即执行，最高优先级
 */

(function() {
    console.log('🎬 恢复图层动画并检查图片...');
    
    // 1. 立即检查图片状态
    function checkImageStatus() {
        console.log('🖼️ 检查图片状态...');
        
        const layerImages = [
            'public/showcase/01.jpg',
            'public/showcase/02.jpg', 
            'public/showcase/03.jpg',
            'public/showcase/04.jpg',
            'public/showcase/05.jpg'
        ];
        
        let totalSize = 0;
        let failedImages = [];
        
        // 检查每张图片
        layerImages.forEach((src, index) => {
            const img = new Image();
            img.onload = function() {
                const sizeKB = Math.round(this.naturalWidth * this.naturalHeight * 4 / 1024);
                totalSize += sizeKB;
                console.log(`✅ 图层${index + 1}: ${src} - ${sizeKB}KB`);
                
                if (sizeKB > 500) { // 如果图片大于500KB
                    console.warn(`⚠️ 图层${index + 1}可能过大: ${sizeKB}KB`);
                }
            };
            
            img.onerror = function() {
                failedImages.push(src);
                console.error(`❌ 图层${index + 1}加载失败: ${src}`);
            };
            
            img.src = src;
        });
        
        // 延迟显示结果
        setTimeout(() => {
            console.log(`📊 图片检查完成:`);
            console.log(`   总大小: ${Math.round(totalSize)}KB`);
            console.log(`   失败数量: ${failedImages.length}`);
            
            if (totalSize > 2000) { // 如果总大小超过2MB
                console.warn('🚨 图片总大小可能过大，建议压缩');
                showSizeWarning(totalSize);
            }
            
            if (failedImages.length > 0) {
                console.error('🚨 有图片加载失败，需要检查路径');
            }
        }, 1000);
    }
    
    // 2. 显示大小警告
    function showSizeWarning(totalSizeKB) {
        const warning = document.createElement('div');
        warning.id = 'image-size-warning';
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 100, 100, 0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-family: sans-serif;
            z-index: 99999;
            box-shadow: 0 5px 20px rgba(255, 100, 100, 0.3);
            text-align: center;
            max-width: 80%;
        `;
        
        const sizeMB = (totalSizeKB / 1024).toFixed(1);
        warning.innerHTML = `
            <strong>⚠️ 图片大小警告</strong><br>
            图层图片总大小: ${sizeMB}MB<br>
            可能影响加载速度<br>
            <small style="opacity:0.8;">建议压缩图片后再继续</small>
        `;
        
        document.body.appendChild(warning);
        
        // 10秒后隐藏
        setTimeout(() => {
            warning.style.opacity = '0';
            warning.style.transition = 'opacity 1s';
            setTimeout(() => warning.remove(), 1000);
        }, 10000);
    }
    
    // 3. 恢复图层动画
    function restoreLayerAnimation() {
        console.log('🎬 恢复图层动画...');
        
        const container = document.getElementById('layerStackContainer');
        if (!container) {
            console.error('❌ 找不到图层容器');
            return;
        }
        
        // 添加加载类
        container.classList.add('loading');
        
        // 确保所有图层图片显示
        const layerImages = container.querySelectorAll('.layer-img');
        layerImages.forEach(img => {
            // 强制显示
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            
            // 修复懒加载
            if (img.dataset.src && !img.src) {
                img.src = img.dataset.src;
            }
        });
        
        // 等待图片加载
        setTimeout(() => {
            // 移除加载状态
            container.classList.remove('loading');
            container.classList.add('loaded');
            
            // 触发一次动画
            triggerLayerAnimation();
            
            console.log('✅ 图层动画恢复完成');
        }, 500);
    }
    
    // 4. 触发图层动画
    function triggerLayerAnimation() {
        const container = document.getElementById('layerStackContainer');
        if (!container) return;
        
        // 添加动画类
        container.classList.add('animating');
        
        // 3秒后移除动画类，恢复可交互状态
        setTimeout(() => {
            container.classList.remove('animating');
            
            // 添加悬停效果
            container.addEventListener('mouseenter', () => {
                container.classList.add('hovering');
            });
            
            container.addEventListener('mouseleave', () => {
                container.classList.remove('hovering');
            });
        }, 3000);
    }
    
    // 5. 修复所有图片显示
    function fixAllImages() {
        console.log('🔧 修复所有图片显示...');
        
        const allImages = document.querySelectorAll('img');
        let fixedCount = 0;
        
        allImages.forEach(img => {
            // 检查图片是否显示
            const computedStyle = window.getComputedStyle(img);
            const isHidden = computedStyle.display === 'none' || 
                           computedStyle.visibility === 'hidden' ||
                           computedStyle.opacity === '0';
            
            if (isHidden) {
                // 强制显示
                img.style.display = 'block';
                img.style.visibility = 'visible';
                img.style.opacity = '1';
                fixedCount++;
            }
            
            // 确保尺寸正确
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            
            // 修复懒加载
            if (img.dataset.src && !img.src) {
                img.src = img.dataset.src;
            }
        });
        
        console.log(`✅ 修复了 ${fixedCount} 张隐藏的图片`);
        return fixedCount;
    }
    
    // 6. 显示修复状态
    function showRepairStatus() {
        const status = document.createElement('div');
        status.id = 'repair-status';
        status.style.cssText = `
            position: fixed;
            bottom: 60px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: #0f0;
            padding: 12px 18px;
            border-radius: 8px;
            font-size: 13px;
            font-family: monospace;
            z-index: 99998;
            border: 2px solid #0f0;
            box-shadow: 0 0 20px rgba(0,255,0,0.3);
        `;
        
        const allImages = document.querySelectorAll('img').length;
        const layerImages = document.querySelectorAll('.layer-img').length;
        
        status.textContent = `🖼️ 总图片: ${allImages} | 图层: ${layerImages}`;
        document.body.appendChild(status);
        
        // 更新状态
        setTimeout(() => {
            const fixedCount = fixAllImages();
            status.textContent = `✅ 修复完成 | 修复: ${fixedCount}张 | 总图片: ${allImages}`;
            
            // 5秒后隐藏
            setTimeout(() => {
                status.style.opacity = '0';
                status.style.transition = 'opacity 1s';
                setTimeout(() => status.remove(), 1000);
            }, 5000);
        }, 1000);
    }
    
    // 7. 主修复函数
    function mainRepair() {
        console.log('🚀 开始主修复流程...');
        
        // 步骤1: 检查图片状态
        checkImageStatus();
        
        // 步骤2: 修复图片显示
        const fixedCount = fixAllImages();
        
        // 步骤3: 恢复图层动画
        restoreLayerAnimation();
        
        // 步骤4: 显示状态
        showRepairStatus();
        
        console.log(`🎉 修复完成: 修复了 ${fixedCount} 张图片，恢复了图层动画`);
        
        // 返回状态信息
        return {
            imagesFixed: fixedCount,
            animationRestored: true,
            timestamp: new Date().toISOString()
        };
    }
    
    // 8. 立即执行修复
    const result = mainRepair();
    
    // 9. 监听DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mainRepair);
    }
    
    // 10. 监听窗口加载完成
    window.addEventListener('load', () => {
        // 再次检查，确保所有资源加载完成
        setTimeout(mainRepair, 500);
    });
    
    // 11. 导出结果供调试
    window.layerRepairResult = result;
    
    console.log('🎬 图层动画和图片修复已部署');
})();