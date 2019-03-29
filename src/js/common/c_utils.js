//*AFAE*/
// require('../../../env-config.js');
// if(process.env.BASE_URL){

// }
// console.log(BASE_URL);
const base_url = process.env.BASE_URL;
// const base_url = "https://www.whensup.com/";
console.log(process.env.NODE_ENV,process.env.HOST_CONF);
var isDev = process.env.NODE_ENV == 'development';
var loadNoticeTit={
    'zh_cn' :'请扫描以下二维码进行购买',
    'zh_hk' :'請掃描以下二維碼進行購買',
    'en_us' :'Please scan the following two-dimensional code for purchase',
};

var loadNoticeTitMobile={
    'zh_cn' :'请下载App进行购买',
    'zh_hk' :'请下载App进行购买',
    'en_us' :'Please scan the following two-dimensional code for purchase',
},
openNoticeTit={
    'zh_cn' :'稍后更新',
    'zh_hk' :'稍後更新',
    'en_us' :'Update later',
},
indexTitle={
    'zh_cn' :'行书Whensup - 周边出行找玩乐,请上行书旅游【官网】',
    'zh_hk' :'體驗 · 玩樂 · 生活 | 至抵門票 特色體驗 深度旅遊 盡在WhensUp行書',
    'en_us' :'Explore · Entertainment · Lifestyle Platform - WhensUp',
},
HTMLLANG = {
    'zh_cn' :'中国大陆',
    'zh_hk' :'香港',
    'en_us' :'International',
},
ImgSize = {
    'big' : '_w2048_h520_c0_t0.',
    'mid' : '_w1536_h0_c0_t0.',
    'sml' : '_w350_h0_c0_t0.'
},
LogoUrl = !isDev?{
    'CN': '<div class="navbar-brand-img transparent ML_logo">'+
                '<img src="./image/head/ml-logo.png">'+
            '</div>'+
            '<div class="navbar-brand-img white ML_logo">'+
                '<img src="./image/head/ml-logo-b.png">'+
            '</div>',
    'Other':'<div class="navbar-brand-img transparent HK_logo">'+
                '<img src="./image/head/hk-logo.png">'+
            '</div>'+
            '<div class="navbar-brand-img white HK_logo">'+
                '<img src="./image/head/hk-logo-b.png">'+
            '</div>'
}:{
    'CN': '<div class="navbar-brand-img transparent ML_logo">'+
                '<img src="./image/head/ml-logo.png">'+
            '</div>'+
            '<div class="navbar-brand-img white ML_logo">'+
                '<img src="./image/head/ml-logo-b.png">'+
            '</div>',
    'Other':'<div class="navbar-brand-img transparent HK_logo">'+
                '<img src="./image/head/hk-logo.png">'+
            '</div>'+
            '<div class="navbar-brand-img white HK_logo">'+
                '<img src="./image/head/hk-logo-b.png">'+
            '</div>'
};

var jedateCtr={
    language:{
        'zh_cn':{                            
            name   : "cn",
            month  : ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            weeks  : [ "日", "一", "二", "三", "四", "五", "六" ],
            times  : ["小时","分钟","秒数"],
            timetxt: ["时间选择","开始时间","结束时间"],
            backtxt: "返回日期",
            clear  : "清空",
            today  : "现在",
            yes    : "确定",
            close  : "关闭",
            markText:'已售馨'
        },
        'zh_hk':{                            
            name  : "tw",
            month : ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            weeks : [ "日", "一", "二", "三", "四", "五", "六" ],
            times : ["小時","分鐘","秒數"],
            timetxt: ["時間選擇","開始時間","結束時間"],
            backtxt: "返回日期",
            clear : "清空",
            today : "現在",
            yes   : "確定",
            close : "關閉",
            markText:'已售馨'
        },
        'en_us':{                            
            name  : "en",
            month : ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            weeks : [ "SUN","MON","TUR","WED","THU","FRI","SAT" ],
            times : ["Hour","Minute","Second"],
            timetxt: ["Time","Start Time","End Time"],
            backtxt:"Back",
            clear : "Clear",
            today : "Now",
            yes   : "Confirm",
            close : "Close",
        }
    },
    markText:{
        'zh_cn' :'已售馨',
        'zh_hk' :'已售馨',
        'en_us' :'Sold Out',
    }
};

/**
 * 获取浏览器语言类型
 * @return {string} 浏览器国家语言
 */
var getNavLanguage = function(){
    if(navigator.appName == "Netscape"){
        var navLanguage = navigator.language||navigator.browserLanguage;
        // console.log(navLanguage,navLanguage.indexOf('zh'));
        if(navLanguage.indexOf('zh')!=-1){
            if(navLanguage == 'zh-CN'){
                navLanguage = 'zh_cn'
            }else{
                navLanguage = 'zh_hk'
            }
        }else{
            navLanguage = 'en_us'
        }
        getCookie('userLanguage',navLanguage)
        return navLanguage;
    }
    return false;
};
// 活动过滤
var filterActivityIndex=function(data){
    var initData = data;
    var newIntData=[];
    var len = initData.length;
    for(var i=0;i<len;i++){
        (function(num){  
            var curCity = initData[num];
            var cityArr=curCity.activity_city_list;
            var newCityArr=[];
            var len_city=cityArr.length;
            for(var j=0;j<len_city;j++){
                if(cityArr[j].hasOwnProperty('web_price')){
                    newCityArr.push(cityArr[j]);
                    // delete cityArr[j];
                }
            }
            curCity.activity_city_list=newCityArr;
        })(i);                                                            
    }                                            
    var newArr=[];  
    for(var j=0;j<initData.length;j++){
        var curCity = initData[j];
        if(curCity.activity_city_list.length>0){
            newArr.push(curCity);
        }
    }
    initData=newArr;
    return initData;
};
var filterActivity=function(data){
    if(data==null||data==""){
        return [];
    }
    var initData = data;
    var len = initData.length;
    for(var i=0;i<len;i++){
        if(!initData[i].hasOwnProperty('web_price')){
            delete initData[i];
        }
    }    
    for(var j=0;j<initData.length;j++){
        if(initData[j]==undefined){
            initData.splice(j,1)
        }
    }
    return initData;                                       
};
var sortBy=function (filed,rev,primer){
  rev = (rev) ? -1 : 1;
  return function (a, b) {
    a = a[filed];
    b = b[filed];
    if (typeof (primer) != 'undefined') {
      a = primer(a);
      b = primer(b);
    }
    if (a < b) { return rev * -1; }
    if (a > b) { return rev * 1; }
    return 1;
  }
};
var sortPrice = function(array){
    if(array!=""&&array!=null){
        var len1=array.length;
        for(var i =0;i<len1;i++){
            (function(num){  
                var ticketKind = array[i].types;
                ticketKind.sort(sortBy('sale_price',false,parseFloat));
            })(i);     
        }
        return array
    }else{
        return []
    }
};
var spliceWord = function(obj){
    if($(obj).hasClass('splice')){
        return false;
    }else{
        $(obj).addClass('splice')
    }
    var el = obj;
    var s = el.innerHTML;
    var n = el.offsetHeight;  //取到当前包裹文本的父级元素的高度， 
    for(var i=0; i<s.length; i++) {
        el.innerHTML = s.substr(0, i);  //表示在for循环中取出长度递增的文段
        if(n < el.scrollHeight) { 
            //当前文本高度的内容的高度代表着刚好达到溢出的界限，
            el.style.overflow = 'hidden';  //将父级元素设置为隐藏
            el.innerHTML = s.substr(0, i-2) + '...';  //最后三个字
            break;
        }
    }
};
var clampWord = function(obj){
    if($(obj).hasClass('splice')){
        return false;
    }else{
        $(obj).addClass('splice')
    }
    $clamp(obj, {clamp: 2});
};
/*
    ***
    UTC时间转换为本地时间
*/
var convertUTCTimeToLocalTime = function(UTCDateString) {
    if(!UTCDateString){
      return '-';
    }
    function formatFunc(str) {    //格式化显示
      return str > 9 ? str : '0' + str
    }
    var date2 = new Date(UTCDateString);     //这步是关键
    var year = date2.getFullYear();
    var mon = formatFunc(date2.getMonth() + 1);
    var day = formatFunc(date2.getDate());
    var hour = date2.getHours();
    var noon = hour >= 12 ? 'PM' : 'AM';
    hour = hour>=12?hour-12:hour;
    hour = formatFunc(hour);
    var min = formatFunc(date2.getMinutes());
    var dateStr = year+'-'+mon+'-'+day+' '+noon +' '+hour+':'+min;
    return dateStr;
};
var timestamp=function(value){
                var date = new Date(value);
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                var h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                var minute = date.getMinutes();
                var second = date.getSeconds();
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
            };
/**
 * cookie操作
 */
var getCookie = function(name, value, options) {
    // console.log(name, value, options)
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '; path=/';
        // var domain = options.domain ? '; domain=' + options.domain : '; domain=.whensup.com';
        var domain = options.domain ? '; domain=' + options.domain : '';

        var s = [cookie, expires, path, domain, secure].join('');
        var secure = options.secure ? '; secure' : '';
        var c = [name, '=', encodeURIComponent(value)].join('');
        var cookie = [c, expires, path, domain, secure].join('');
        document.cookie = cookie;
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != ''){
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++){
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
// 图片路径处理
var filterPosterUrl=function(value){
    if(value.poster_url!=""&&value.poster_url!=null){
        if(value.poster_url.indexOf(';')>-1){
            var posterArr=value.split(';');
            return posterArr[0];
        }
    }
    return value.poster_url;
};
/**
 * 执行页面i18n方法
 * @return
 */ 
var execI18n = function(){
    // 标题截取
    var titobj = $('.act-card .tit:visible,.info-card .spliceWord:visible');
    titobj.each(function(i,obj){
        spliceWord(obj);
    })
    /*/**
 * 设置语言类型： 默认为中文
 */
    var i18nLanguage = "zh_cn";

/*
设置一下网站支持的语言种类
 */
    var webLanguage = ['zh_cn', 'zh_hk', 'en_us'];
    var optionEle = $("#i18n_pagename");
    if (optionEle.length < 1) {
        console.log("未找到页面名称元素，请在页面写入\n <meta id=\"i18n_pagename\" content=\"页面名(对应语言包的语言文件名)\">");
        return false;
    };
    var sourceName = optionEle.attr('content');
    sourceName = sourceName.split('-');
    /*
    首先获取用户浏览器设备之前选择过的语言类型
     */
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
    /* 需要引入 i18n 文件*/
    if ($.i18n == undefined) {
        console.log("请引入i18n js 文件")
        return false;
    };

    /*
    这里需要进行i18n的翻译
     */
    jQuery.i18n.properties({    
        name : sourceName, //资源文件名称
        path :isDev?'./assets/i18n/'+i18nLanguage +'/':'./assets/i18n/'+ i18nLanguage +'/', //资源文件路径
        mode : 'map', //用Map的方式使用资源文件中的值
        language : i18nLanguage,
        callback : function() {//加载成功后设置显示内容
            var insertEle = $(".i18n");
            var insertIpt = $(".i18n-ipt");
            var insertBtn = $(".i18n-btn");
            console.log(".i18n 写入中...");
            insertEle.each(function() {
                // 根据i18n元素的 name 获取内容写入
                var _this = $(this);
                var this_name=_this.attr('name');
                if($.i18n.prop(this_name)){
                    $(this).html($.i18n.prop(this_name));
                }
                
                // $(this).html($.i18n.prop($(this).attr('name')));
            });
            console.log("写入完毕");
            console.log(".i18n-input 写入中...");
            insertIpt.each(function(){
                var _this =$(this)
                var placeholder = _this.attr('i18nPlaceholder')
                // console.log(placeholder,$.i18n.prop(placeholder))
                _this.attr('placeholder',$.i18n.prop(placeholder));
            })
            console.log("写入完毕");
            console.log(".i18n-input 写入中...");
            insertBtn.each(function(){
                var _this =$(this)
                var value = _this.attr('btnName')
                // console.log(placeholder,$.i18n.prop(placeholder))
                _this.attr('value',$.i18n.prop(value));
            })
            console.log("写入完毕");
            /* var insertInputEle = $(".i18n-input");
                insertInputEle.each(function() {
                var selectAttr = $(this).attr('selectattr');
                if (!selectAttr) {
                    selectAttr = "value";
                };
                var _this = $(this);
                var this_name=_this.attr('name');
                // $(this).attr(selectAttr, $.i18n.prop($(this).attr('selectname')));
                $(this).attr(selectAttr, $.i18n.prop(this_name));
            });*/
        }
    });
}
export{
    LogoUrl,
    base_url,
    loadNoticeTit,
    loadNoticeTitMobile,
    openNoticeTit,
    HTMLLANG,
    ImgSize,
    jedateCtr,
    indexTitle,
    getNavLanguage,
    filterActivityIndex,
    filterActivity,
    sortBy,
    sortPrice,
    spliceWord,
    clampWord,
    convertUTCTimeToLocalTime,
    timestamp,
    getCookie,
    filterPosterUrl,
    execI18n
}