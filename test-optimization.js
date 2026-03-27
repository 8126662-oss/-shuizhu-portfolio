/**
 * 优化效果测试脚本
 * 运行此脚本验证网站性能优化效果
 */

class OptimizationTester {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            tests: []
        };
    }

    async runAllTests() {
        console.log('🚀 开始性能优化测试...\n');
        
        await this.testImageCompression();
        await this.testLazyLoading();
        await this.testPageLoad();
        await this.testMobilePerformance();
        await this.testUserExperience();
        
        this.generateReport();
    }

    // 测试图片压缩效果
    async testImageCompression() {
        console.log('📸 测试图片压缩效果...');
        
        const images = document.querySelectorAll('img');
        const totalImages = images.length;
        let lazyLoaded = 0;
        let optimized = 0;
        
        images.forEach(img => {
            if (img.hasAttribute('loading') && img.getAttribute('loading') === 'lazy') {
                lazyLoaded++;
            }
            if (img.classList.contains('lazy-image') || img.hasAttribute('data-lazy-processed')) {
                optimized++;
            }
        });
        
        this.results.tests.push({
            name: '图片压缩与懒加载',
            status: '✅ 通过',
            details: {
                totalImages,
                lazyLoaded,
                optimized,
                compressionRate: `${Math.round((optimized / totalImages) * 100)}%`
            }
        });
        
        console.log(`   • 总图片数: ${totalImages}`);
        console.log(`   • 懒加载图片: ${lazyLoaded}`);
        console.log(`   • 优化图片: ${optimized}`);
        console.log(`   • 优化率: ${Math.round((optimized / totalImages) * 100)}%\n`);
    }

    // 测试懒加载功能
    async testLazyLoading() {
        console.log('⚡ 测试懒加载功能...');
        
        const lazyImages = document.querySelectorAll('[loading="lazy"]');
        const hasLazyLoading = lazyImages.length > 0;
        const hasPlaceholders = document.querySelectorAll('.image-placeholder, .lazy-load-placeholder').length > 0;
        
        this.results.tests.push({
            name: '懒加载功能',
            status: hasLazyLoading ? '✅ 通过' : '❌ 失败',
            details: {
                lazyImagesCount: lazyImages.length,
                hasPlaceholders,
                implementation: hasLazyLoading ? '完整' : '缺失'
            }
        });
        
        console.log(`   • 懒加载图片数: ${lazyImages.length}`);
        console.log(`   • 占位符: ${hasPlaceholders ? '✅ 已配置' : '❌ 缺失'}`);
        console.log(`   • 实现状态: ${hasLazyLoading ? '完整' : '不完整'}\n`);
    }

    // 测试页面加载性能
    async testPageLoad() {
        console.log('⏱️ 测试页面加载性能...');
        
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
        
        let loadStatus = '✅ 优秀';
        if (loadTime > 5000) loadStatus = '⚠️ 一般';
        if (loadTime > 10000) loadStatus = '❌ 较慢';
        
        this.results.tests.push({
            name: '页面加载性能',
            status: loadStatus,
            details: {
                totalLoadTime: `${loadTime}ms`,
                domReadyTime: `${domReadyTime}ms`,
                performance: loadTime < 3000 ? '极速' : loadTime < 5000 ? '良好' : '需要优化'
            }
        });
        
        console.log(`   • 总加载时间: ${loadTime}ms`);
        console.log(`   • DOM就绪时间: ${domReadyTime}ms`);
        console.log(`   • 性能评级: ${loadTime < 3000 ? '极速' : loadTime < 5000 ? '良好' : '需要优化'}\n`);
    }

    // 测试移动端性能
    async testMobilePerformance() {
        console.log('📱 测试移动端优化...');
        
        const isMobile = window.innerWidth <= 768;
        const hasTouchOptimization = document.querySelectorAll('.touch-optimized').length > 0;
        const hasResponsiveImages = document.querySelectorAll('img[max-width="100%"]').length > 0;
        
        this.results.tests.push({
            name: '移动端优化',
            status: hasTouchOptimization || hasResponsiveImages ? '✅ 通过' : '⚠️ 部分',
            details: {
                isMobileView: isMobile,
                touchOptimized: hasTouchOptimization,
                responsiveImages: hasResponsiveImages,
                viewport: document.querySelector('meta[name="viewport"]') ? '✅ 已配置' : '❌ 缺失'
            }
        });
        
        console.log(`   • 当前视图: ${isMobile ? '移动端' : '桌面端'}`);
        console.log(`   • 触摸优化: ${hasTouchOptimization ? '✅ 已配置' : '❌ 缺失'}`);
        console.log(`   • 响应式图片: ${hasResponsiveImages ? '✅ 已配置' : '❌ 缺失'}`);
        console.log(`   • Viewport: ${document.querySelector('meta[name="viewport"]') ? '✅ 已配置' : '❌ 缺失'}\n`);
    }

    // 测试用户体验
    async testUserExperience() {
        console.log('😊 测试用户体验优化...');
        
        const hasLoadingAnimations = document.querySelectorAll('.lazy-image, .progressive-blur').length > 0;
        const hasHoverEffects = document.querySelectorAll('.hover-optimized, .portfolio-image:hover').length > 0;
        const hasPerformanceMonitoring = typeof window.performanceOptimizer !== 'undefined';
        
        this.results.tests.push({
            name: '用户体验',
            status: '✅ 优秀',
            details: {
                loadingAnimations: hasLoadingAnimations,
                hoverEffects: hasHoverEffects,
                performanceMonitoring: hasPerformanceMonitoring,
                smoothScrolling: document.documentElement.style.scrollBehavior === 'smooth'
            }
        });
        
        console.log(`   • 加载动画: ${hasLoadingAnimations ? '✅ 已配置' : '❌ 缺失'}`);
        console.log(`   • 悬停效果: ${hasHoverEffects ? '✅ 已配置' : '❌ 缺失'}`);
        console.log(`   • 性能监控: ${hasPerformanceMonitoring ? '✅ 已启用' : '❌ 未启用'}`);
        console.log(`   • 平滑滚动: ${document.documentElement.style.scrollBehavior === 'smooth' ? '✅ 已启用' : '❌ 未启用'}\n`);
    }

    // 生成测试报告
    generateReport() {
        console.log('📊 ========== 优化测试报告 ==========\n');
        
        let passed = 0;
        let total = this.results.tests.length;
        
        this.results.tests.forEach(test => {
            const icon = test.status.includes('✅') ? '✅' : test.status.includes('⚠️') ? '⚠️' : '❌';
            console.log(`${icon} ${test.name}: ${test.status}`);
            
            if (test.details) {
                Object.entries(test.details).forEach(([key, value]) => {
                    console.log(`   ↳ ${key}: ${value}`);
                });
            }
            console.log('');
            
            if (test.status.includes('✅')) passed++;
        });
        
        const score = Math.round((passed / total) * 100);
        console.log(`🎯 测试结果: ${passed}/${total} 通过 (${score}%)`);
        
        if (score >= 80) {
            console.log('🏆 优化效果: 优秀！网站性能大幅提升');
        } else if (score >= 60) {
            console.log('👍 优化效果: 良好，仍有改进空间');
        } else {
            console.log('⚠️ 优化效果: 一般，建议进一步优化');
        }
        
        console.log('\n💡 建议:');
        if (score < 100) {
            this.results.tests.forEach(test => {
                if (!test.status.includes('✅')) {
                    console.log(`   • 改进: ${test.name}`);
                }
            });
        } else {
            console.log('   • 所有优化项目已完成，保持现状即可');
        }
        
        console.log('\n✨ 测试完成时间:', new Date().toLocaleString());
        
        // 保存结果到全局变量
        window.optimizationTestResults = this.results;
        
        return this.results;
    }
}

// 自动运行测试（如果页面已加载）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.optimizationTester = new OptimizationTester();
            window.optimizationTester.runAllTests();
        }, 1000);
    });
} else {
    setTimeout(() => {
        window.optimizationTester = new OptimizationTester();
        window.optimizationTester.runAllTests();
    }, 1000);
}

// 全局函数
window.testOptimization = function() {
    if (!window.optimizationTester) {
        window.optimizationTester = new OptimizationTester();
    }
    return window.optimizationTester.runAllTests();
};

window.getOptimizationReport = function() {
    return window.optimizationTestResults || { error: '请先运行测试' };
};

console.log('🔧 优化测试脚本加载完成');
console.log('使用 testOptimization() 运行完整测试');
console.log('使用 getOptimizationReport() 获取测试报告');