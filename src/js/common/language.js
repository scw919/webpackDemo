/**
 * 获取浏览器语言类型
 * @return {string} 浏览器国家语言
 */
/*页面执行加载执行*/
$(function(){
    var webLanguage = ['zh_cn', 'zh_hk', 'en_us'];
    var currency,showCurrency, i18nLanguage;
    currency=getCookie("paramscCurrency");
    /*执行I18n翻译*/
    // execI18n();
    if (getCookie("userLanguage")) {
        i18nLanguage = getCookie("userLanguage");
        // console.log(i18nLanguage)
    } else {
        // 获取浏览器语言
        var navLanguage = getNavLanguage();
        // console.log(navLanguage)
        if (navLanguage) {
            // 判断是否在网站支持语言数组里
            var charSize = $.inArray(navLanguage, webLanguage);
            if (charSize > -1) {
                i18nLanguage = navLanguage;
                // 存到缓存中
                getCookie("userLanguage",navLanguage);
            };
        } else{
            console.log("not navigator");
            return false;
        }
    }
    console.log(i18nLanguage)
    /*将语言选择默认选中缓存中的值*/
    $("#language [data-value="+i18nLanguage+"]").addClass('active');
    // var lanVal= $("#language [data-value="+i18nLanguage+"] a").html();
    var lanVal = HTMLLANG[i18nLanguage];
    $('#lanVal').html(lanVal);

    // body 添加 es语言属性
    $('body').addClass(i18nLanguage=='en_us'?'en-US':(i18nLanguage=="zh_hk"?'zh-HK':''));   
    /* 选择语言 */
    $("#language").on('click','li',function() {
        sessionStorage.removeItem('initPage');
        var language = $(this).attr('data-value')
        // console.log(language)
        getCookie("userLanguage",language);
        if(language=="zh_hk"&&!currency){
            showCurrency = 'HKD';
            getCookie('paramscCurrency','HK');
        }
        location.reload();
    });
   // currency tab
    
    if(currency){
        if(currency=='rmb'){
            showCurrency = 'RMB';
            $('#currency').find("[data-currency='rmb']").addClass('active');
            $('#curVal').html(showCurrency)
            // $('#currency').prev().find('.cur-val').html(showCurrency).prev('.cur-flag').removeClass().addClass('cur-flag CHN');
        }else{
            showCurrency = 'HKD';
            $('#currency').find("[data-currency='HK']").addClass('active');
            $('#curVal').html(showCurrency)
            // $('#currency').prev().find('.cur-val').html(showCurrency).prev('.cur-flag').removeClass().addClass('cur-flag HK');
        }
    }else{
        if(i18nLanguage=="zh_hk"){
            getCookie('paramscCurrency','HK');
            showCurrency = 'HKD';
            $('#curVal').html(showCurrency)
            // $('.currency-tab').prev().find('.cur-val').html(showCurrency).prev('.cur-flag').addClass('HK');
        }else{
            getCookie('paramscCurrency','rmb');
            showCurrency = 'RMB';
            $('#curVal').html(showCurrency)
            // $('.currency-tab').prev().find('.cur-val').html(showCurrency).prev('.cur-flag').addClass('CHN');
        }
    }
    $('#currency').on('click','li',function(){
        currency = $(this).attr('data-currency');
        getCookie("paramscCurrency",$(this).attr('data-currency'));
        // $('#curVal').html(currency);
        location.reload();
    })  
});