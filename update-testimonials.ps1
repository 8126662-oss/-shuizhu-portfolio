# 客户评价文案更新脚本
$htmlPath = "C:\Users\86152\Documents\trae_projects\box1\index.html"
$content = Get-Content $htmlPath -Encoding UTF8 -Raw

# 定义替换映射
$replacements = @{
    # 课程学员组（课程教学好评）
    '虚空终端选手' = '磕盐*选手'
    '水煮老师的 AI\+3D 合成思路真的绝了！以前做合成总觉得假，看完课程才发现光影逻辑才是灵魂。B套餐太值了。' = '之前在网上看教程云里雾里的，水煮老师的课全是干货，不画饼。特别是那个 AI 焚诀篇，直接打开了新世界大门。'
    
    'Lxi\*' = '喵*呜呜'
    '干货满满，基本在最短时间内接触并应用到了行业大部分软件。不愧是行业天花板，学费值这个价，非常赞。' = '报了老师的入门篇，从零基础开始带。老师讲课很细，作业点评也特别扎实，现在已经能自己修简单的合成图了！'
    
    '努力修图的小白' = '极地*光'
    '老师的直播答疑简直是救命稻草，每晚十点的固定答疑帮我解决了很多接单时的技术难题，推荐给想转副业的同学。' = '市面上很多后期课都太老了，水煮老师的真的领先版本。老师很有耐心，不是那种收钱就不管人的类型，超级推荐。'
    
    # 约稿客户组（修图服务好评）
    '某知名Cos社团长' = '是一只*酱'
    '找水煮后期很多年了，审美非常在线。这次的3D场景搭建直接让作品上了一个档次，交付速度也快，靠谱。' = '水煮老师真的是神仙后期！修图没那种假面感，皮肤纹理留得特别好，特效合成更是氛围感拉满了，返图快得离谱，下次出片还要约！'
    
    '孤\*快' = '咕咕*子'
    '很有想法的后期师，能精准捕捉到 Coser 想要的氛围感。AI 的运用自然不突兀，合作非常愉快。' = '终于找到能听懂人话的后期了...之前找过几个都修得像伪人，水煮老师把我那个简陋的背景直接修成了大片，太神了。'
    
    '某出片狂魔' = '橙*橙'
    '不管是 PS 重绘还是大场景合成，水煮的审美永远可以信任，这种光影质感真的很难在其他地方看到。' = '本来是废片，结果老师直接救活了，这种高级感真的值这个价，姐妹们冲就完了！'
}

# 执行替换
foreach ($key in $replacements.Keys) {
    $oldValue = $key
    $newValue = $replacements[$key]
    Write-Host "替换: $oldValue -> $newValue"
    $content = $content -replace $oldValue, $newValue
}

# 更新头像首字母
$content = $content -replace '<span>V</span>', '<span>磕</span>'
$content = $content -replace '<span>L</span>', '<span>喵</span>'
$content = $content -replace '<span>努</span>', '<span>极</span>'
$content = $content -replace '<span>某</span>', '<span>是</span>'
$content = $content -replace '<span>孤</span>', '<span>咕</span>'
# 第二个"某"需要特殊处理，因为有两个"某"
# 先处理第一个"某"（某知名Cos社团长 -> 是一只*酱）
$content = $content -replace '<span>某</span>\s*\n\s*</div>\s*\n\s*<div class="testimonial-info">\s*\n\s*<h4 class="testimonial-author">是一只\*酱</h4>', '<span>是</span>
                                </div>
                                <div class="testimonial-info">
                                    <h4 class="testimonial-author">是一只*酱</h4>'

# 处理第二个"某"（某出片狂魔 -> 橙*橙）
$content = $content -replace '<span>某</span>\s*\n\s*</div>\s*\n\s*<div class="testimonial-info">\s*\n\s*<h4 class="testimonial-author">橙\*橙</h4>', '<span>橙</span>
                                </div>
                                <div class="testimonial-info">
                                    <h4 class="testimonial-author">橙*橙</h4>'

# 保存文件
Set-Content $htmlPath -Value $content -Encoding UTF8
Write-Host "客户评价文案更新完成！"