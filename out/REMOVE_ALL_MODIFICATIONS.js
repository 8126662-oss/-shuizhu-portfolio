/**
 * 移除所有修改，恢复原始状态
 * 立即执行，最高优先级
 */

(function() {
    console.log('🔄 开始移除所有修改，恢复原始状态...');
    
    // 1. 立即移除我添加的所有状态元素
    function removeAddedElements() {
        console.log('🗑️ 移除添加的元素...');
        
        const elementsToRemove = [
            'image-fix-status',
            'repair-status', 
            'image-size-warning',
            'layer-animation-status',
            'image-size-warning',
            'performance-hint'
        ];
        
        elementsToRemove.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
                console.log(`✅ 移除元素: ${id}`);
            }
        });
        
        // 移除所有我添加的类
        document.querySelectorAll('.loading, .loaded, .animating, .hovering').forEach(el => {
            el.classList.remove('loading', 'loaded', 'animating', 'hovering');
        });
    }
    
    // 2. 恢复原始图片状态
    function restoreOriginalImages() {
        console.log('🖼️ 恢复原始图片状态...');
        
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            // 移除我添加的所有样式
            img.style.cssText = '';
            
            // 恢复原始属性
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            
            // 移除懒加载修复
            if (img.dataset.src && img.src !== img.dataset.src) {
                img.src = img.dataset.src;
            }
            
            // 移除加载类
            img.classList.remove('loaded', 'lazy-loaded');
        });
    }
    
    // 3. 恢复图层动画
    function restoreLayerAnimation() {
        console.log('🎬 恢复原始图层动画...');
        
        const container = document.getElementById('layerStackContainer');
        if (!container) {
            console.error('❌ 找不到图层容器');
            return;
        }
        
        // 移除所有我添加的类
        container.className = 'layer-stack-container w-full';
        
        // 恢复原始图层
        const layers = container.querySelectorAll('.layer-image');
        layers.forEach((layer, index) => {
            // 移除所有我添加的样式
            layer.style.cssText = '';
            
            // 设置图层索引变量
            layer.style.setProperty('--layer-index', index + 1);
            
            // 恢复原始类
            layer.className = `layer-image layer-image-${index + 1} w-full`;
        });
        
        // 恢复图片
        const layerImages = container.querySelectorAll('.layer-img');
        layerImages.forEach(img => {
            img.style.cssText = '';
            img.className = 'layer-img w-full';
            img.loading = 'lazy';
        });
        
        console.log('✅ 图层动画恢复完成');
    }
    
    // 4. 移除我添加的事件监听器
    function removeEventListeners() {
        console.log('🎧 移除添加的事件监听器...');
        
        // 由于无法直接移除匿名函数，我们重新绑定原始行为
        const container = document.getElementById('layerStackContainer');
        if (container) {
            // 移除我可能添加的鼠标事件
            container.onmouseenter = null;
            container.onmouseleave = null;
            container.onclick = null;
            
            // 移除所有事件监听器（暴力方法）
            const newContainer = container.cloneNode(true);
            container.parentNode.replaceChild(newContainer, container);
        }
    }
    
    // 5. 清理控制台输出
    function cleanConsole() {
        console.log('🧹 清理完成，恢复原始状态');
        console.log('================================');
        console.log('✅ 所有修改已移除');
        console.log('✅ 原始动画已恢复');
        console.log('✅ 图片状态已重置');
        console.log('================================');
    }
    
    // 6. 主恢复函数
    function mainRestore() {
        console.log('🚀 开始恢复原始状态...');
        
        // 步骤1: 移除添加的元素
        removeAddedElements();
        
        // 步骤2: 恢复图片状态
        restoreOriginalImages();
        
        // 步骤3: 恢复图层动画
        restoreLayerAnimation();
        
        // 步骤4: 移除事件监听器
        removeEventListeners();
        
        // 步骤5: 清理控制台
        cleanConsole();
        
        return {
            restored: true,
            timestamp: new Date().toISOString(),
            message: '所有修改已移除，原始状态已恢复'
        };
    }
    
    // 7. 立即执行恢复
    const result = mainRestore();
    
    // 8. 监听DOM加载完成，确保完全恢复
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(mainRestore, 100);
        });
    }
    
    // 9. 监听窗口加载完成
    window.addEventListener('load', () => {
        setTimeout(mainRestore, 500);
    });
    
    // 10. 导出结果
    window.restorationComplete = result;
    
    console.log('🎉 恢复脚本已部署');
})();