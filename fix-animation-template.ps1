# 修复动画模板脚本
# 只保留6个独特的评价卡片，然后复制它们来实现无缝循环

$htmlPath = "C:\Users\86152\Documents\trae_projects\box1\index.html"
$content = Get-Content $htmlPath -Encoding UTF8 -Raw

# 定义6个独特的评价卡片（按照用户要求的顺序）
$uniqueTestimonials = @'

                        <div class="testimonial-card">
                            <div class="testimonial-header">
                                <div class="testimonial-avatar">
                                    <span>磕</span>
                                </div>
                                <div class="testimonial-info">
                                    <h4 class="testimonial-author">磕盐*选手</h4>
                                    <p class="testimonial-tag">课程学员</p>
                                </div>
                            </div>
                            <p class="testimonial-content">之前在网上看教程云里雾里的，水煮老师的课全是干货，不画饼。特别是那个 AI 焚诀篇，直接打开了新世界大门。</p>
                        </div>
                        <div class="testimonial-card">
                            <div class="testimonial-header">
                                <div class="testimonial-avatar">
                                    <span>喵</span>
                                </div>
                                <div class="testimonial-info">
                                    <h4 class="testimonial-author">喵*呜呜</h4>
                                    <p class="testimonial-tag">课程学员</p>
                                </div>
                            </div>
                            <p class="testimonial-content">报了老师的入门篇，从零基础开始带。老师讲课很细，作业点评也特别扎实，现在已经能自己修简单的合成图了！</p>
                        </div>
                        <div class="testimonial-card">
                            <div class="testimonial-header">
                                <div class="testimonial-avatar">
                                    <span>极</span>
                                </div>
                                <div class="testimonial-info">
                                    <h4 class="testimonial-author">极地*光</h4>
                                    <p class="testimonial-tag">课程学员</p>
                                </div>
                            </div>
                            <p class="testimonial-content">市面上很多后期课都太老了，水煮老师的真的领先版本。老师很有耐心，不是那种收钱就不管人的类型，超级推荐。</p>
                        </div>
                        <div class="testimonial-card">
                            <div class="testimonial-header">
                                <div class="testimonial-avatar">
                                    <span>是</span>
                                </div>
                                <div class="testimonial-info">
                                    <h4 class="testimonial-author">是一只*酱</h4>
                                    <p class="testimonial-tag">约稿客户</p>
                                </div>
                            </div>
                            <p class="testimonial-content">水煮老师真的是神仙后期！修图没那种假面感，皮肤纹理留得特别好，特效合成更是氛围感拉满了，返图快得离谱，下次出片还要约！</p>
                        </div>
                        <div class="testimonial-card">
                            <div class="testimonial-header">
                                <div class="testimonial-avatar">
                                    <span>咕</span>
                                </div>
                                <div class="testimonial-info">
                                    <h4 class="testimonial-author">咕咕*子</h4>
                                    <p class="testimonial-tag">约稿客户</p>
                                </div>
                            </div>
                            <p class="testimonial-content">终于找到能听懂人话的后期了...之前找过几个都修得像伪人，水煮老师把我那个简陋的背景直接修成了大片，太神了。</p>
                        </div>
                        <div class="testimonial-card">
                            <div class="testimonial-header">
                                <div class="testimonial-avatar">
                                    <span>橙</span>
                                </div>
                                <div class="testimonial-info">
                                    <h4 class="testimonial-author">橙*橙</h4>
                                    <p class="testimonial-tag">约稿客户</p>
                                </div>
                            </div>
                            <p class="testimonial-content">本来是废片，结果老师直接救活了，这种高级感真的值这个价，姐妹们冲就完了！</p>
                        </div>
'@

# 创建完整的动画模板（复制一份以实现无缝循环）
$animationTemplate = $uniqueTestimonials + @'

                        <!-- 复制一份子元素以实现无缝循环 -->
'@ + $uniqueTestimonials

# 找到评价部分的开始
$startMarker = '<div class="testimonials-masonry">'
$endMarker = '                </div>
            </div>
        </div>
    </section>'

$startIndex = $content.IndexOf($startMarker)
if ($startIndex -eq -1) {
    Write-Host "错误：未找到评价部分开始标记"
    exit 1
}

# 找到第一个testimonial-track的开始
$trackStart = $content.IndexOf('<div class="testimonial-track">', $startIndex)
if ($trackStart -eq -1) {
    Write-Host "错误：未找到testimonial-track开始标记"
    exit 1
}

# 找到第一个testimonial-track的结束
$trackEnd = $content.IndexOf('</div>', $trackStart)
$trackEnd = $content.IndexOf('</div>', $trackEnd + 1)  # 需要找到第二个</div>

# 构建新的内容
$before = $content.Substring(0, $trackStart)
$trackContent = @'
                    <div class="testimonial-track">
'@ + $animationTemplate + @'
                    </div>
'@

# 找到整个评价部分的结束
$sectionEnd = $content.IndexOf($endMarker, $startIndex)
if ($sectionEnd -eq -1) {
    Write-Host "错误：未找到评价部分结束标记"
    exit 1
}

$after = $content.Substring($sectionEnd)

# 构建完整的新内容
$newContent = $before + $trackContent + $after

# 保存文件
Set-Content $htmlPath -Value $newContent -Encoding UTF8
Write-Host "动画模板已修复！只修改了文字内容，保持了原有的动画模板结构。"