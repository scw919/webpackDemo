import {
 	LogoUrl,
    BASE_URL,
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
    execI18n
} from './common/c_utils.js';
import foottpl from '../art/common/foot.art';
import layer from './layer/layer.js';
var isDetail = $('.detail-body').length>0;
var docWidth = document.body.clientWidth;
var docHeight = document.body.clientHeight;
var slideBanHeight = docWidth*(800/1920);
var getCookieLan=function(name){
	 var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
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
var curLan = getCookieLan('userLanguage')||getNavLanguage();
// 搜索 quwey-ipt
var searchActivities=function(){
	var searchVal = $.trim($('.query-ipt').val());
	if(searchVal.length>0){
		var searchUrl = encodeURI("./search.html?searchText=" + searchVal); //使用encodeURI编码
		// window.open(searchUrl);
		sessionStorage.removeItem('initPage');
		window.location.href=searchUrl
	}
}

// 下载app
var downloadApp=function(){
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
	   	window.open("https://itunes.apple.com/cn/app/whensup/id1359771802?ls=1&mt=8");
	}else if(/(Android)/i.test(navigator.userAgent)) {  //判断Android
	   	window.open("https://sj.qq.com/myapp/detail.htm?apkName=com.whensupapp");
	}
}
// viewMore
var viewMoreViews = function(obj){
	var module_id = $(obj).attr('data-id');
	var module_name=$(obj).attr('data-name');
	var module_poster=$(obj).attr('data-imgurl');
	var type = $(obj).attr('data-type');
	var searchUrl = encodeURI("http://192.168.1.130:5656/view/viewMore.html?searchText=" + module_id); //使用encodeURI编码
	window.open(searchUrl);
}
// 城市活动列表页
var cityListViews =  function(obj){
	var city_id = $(obj).attr('data-id');
	var module_name=$(obj).attr('data-name');
	var module_poster=$(obj).attr('data-imgurl');
	var type = $(obj).attr('data-type');
	var searchUrl = encodeURI("./citylist.html?searchText=" + city_id); //使用encodeURI编码
	window.open(searchUrl);
};


// search nav init
function searchNavInit(docWidth){
	$('.city-search .over-scroll-x .item').mouseover(function(){
		var index = $(this).index()
		$(this).siblings('.active').removeClass('active');
		$(this).addClass('active');
		$('.city-search .right-ct-result').find('.cate').addClass('xs-hidden');
		$('.city-search .right-ct-result').find('.cate').eq(index).removeClass('xs-hidden');
	})
	var index = $('.city-search .over-scroll-x .item.active').index();
	// console.log(index,$('.city-search .right-ct-result').eq(index))
	$('.city-search .right-ct-result .cate').eq(index).removeClass('xs-hidden')
	if(docWidth<=414){
		var scrollItem = $('.city-search .over-scroll-x').find('.item');
		var scrollWidth = 0;
		scrollItem.each(function(index ,item){
			console.log($(item).outerWidth())
			scrollWidth+=$(item).outerWidth()
		})
		
		$('.city-search .over-scroll-x').css('width',scrollWidth+'px')
		$('.city-search .left-ct-part').css('overflow-x','scroll')
	}
}

// searchControl
function searchControlHide(){
	if(docWidth<=414&&$('.filter-container').length>0){
		$('.filter-container').removeClass('fix-top');
		$('.xs-container.result-container').addClass('padding-20');
	}else{
		$('.filter-container').addClass('fix-top');
		$('.xs-container.result-container').removeClass('padding-20');
	}
}
// backtop
function BackTop(domE,distance) {
    if (!domE) return;
    var _onscroll = window.onscroll,
        _onclick = domE.onclick;

    window.onscroll = throttle(function(){
        typeof _onscroll === 'function' && _onscroll.apply(this, arguments);
        toggleDomE();
    },100);
    domE.onclick = function(){
        typeof _onclick === 'function' && _onclick.apply(this, arguments);
        if($(domE).attr('id')=="index-header"){
        	return false;
        }

        $('body').animate({scrollTop:'0'},500);
    };

    function toggleDomE(){
    	var isScroll = (document.documentElement.scrollTop || document.body.scrollTop) > (distance || 80)
        if($(domE).attr('id')=="index-header"){
        	isScroll?$(domE).addClass('whiteBg'):$(domE).removeClass('whiteBg')
        }else{
    		domE.style.display = isScroll ? 'block' : 'none';
        }
    }

    function throttle(func, wait) { 
        var timer = null;
        return function () {
            var self = this, args = arguments;
            if (timer) clearTimeout(timer);
            timer = setTimeout(function () {
                return typeof func === 'function' && func.apply(self, args);
            }, wait);
        }
    }
};
// bottom load notice
function closeBottomNotice(obj){
	// var _this = $(obj);
	// _this.closest("#loadNotice");
	$('#loadNotice').stop().animate({opacity:'0'},300,function(){
		$('#loadNotice').remove();
		getCookie('showLoad','0');
	})
}
// rangeSlider
function sliderRange(){
 	var $document   = $(document);
    var selector    = '[data-rangeslider]';
    var $inputRange = $(selector);
    if($inputRange.length==0){
    	return false;
    }
    // Example functionality to demonstrate a value feedback
    // and change the output's value.
    function valueOutput(element) {
        var value = element.value;
        var output = element.parentNode.getElementsByTagName('output')[0];
        $(selector).val(value)
        output.innerHTML = value==2000?'':value;
    }

    // Initial value output
    for (var i = $inputRange.length - 1; i >= 0; i--) {
        valueOutput($inputRange[i]);
    };

    // Update value output
    $document.on('input', selector, function(e) {
        if(e.target.value==2000){
            $(e.target).closest('.slider-box').find('output').html(' ')
            return false;
        }
        valueOutput(e.target);
    });

    // Initialize the elements
    $inputRange.rangeslider({
        polyfill: false
    });
}
// 页头 手机端点击下载 跳转页脚
var anchorsDownload=function(obj){
	var bottomScroll = $('#loadBtnBox').offset().top-300;
	$('body').animate({scrollTop:bottomScroll},500);
	$('#loadBtnBox').click();
	$('.navbar-collapse.in').closest('.xs-navbar').find('.navbar-toggle').click();
};
// 页脚  未开放 提示
var notOpenedNotice=function(){
	var noticeWord = openNoticeTit[curLan];
	layer.msg(noticeWord);
};
//head-logo
var headLogoLoad=function(){
	// var lang = getCookieLan('userLanguage')||'zh_cn';
	if(curLan=="zh_cn"){
		return LogoUrl['CN']
	}else{
		return LogoUrl['Other']
	}
};

// document.ready
var onloadFUN = function(){
	$('footer.footer').html(foottpl);
	$(function(){
	window.onunload = function(){
		sessionStorage.removeItem('initPage');
	}
	$('#head-logo-a').length>0&&$('#head-logo-a').html(headLogoLoad());
	// 营业执照
	$('[id*="license-btn"]').click(function(){
		var license = $('#license');
		if(license.is(":visible")){
			license.hide();
		}else{
			license.show();
		}
	})
	// 卡片点击跳转
	$('.wrap').on('click','.act-card',function(){
		var _this = $(this);
		var id = _this.attr('data-url');
		if(id){
			var searchUrl = encodeURI("./activitydetail.html?acttivitiesId=" + id); //使用encodeURI编码
			window.open(searchUrl);
		}
	})
	// 关联enter
	$('.query-ipt').keypress(function (e) {
	    if (e.which == 13) {
	        searchActivities()
	    }
	});
	$('#index-header').hover(function(){
		$(this).addClass('whiteBg ')
	},function(){
		var isScroll = (document.documentElement.scrollTop || document.body.scrollTop) > 80;
		var isOpen = $(this).has($('.dropdown.open')).length>0;
		if(!isScroll&&!isOpen){
			$(this).removeClass('whiteBg ');
		}
	})
	// backtop
 	new BackTop(document.getElementById('backTop') ,500)

	// 页脚  lan-choose  下拉  
	$('.lan-choose').click(function(e){
		e.stopPropagation();
		$(this).siblings('.active').removeClass('active');
		$(this).toggleClass('active');
	})
	// tab 初始化
	$(".tab-box").on('click','.tab-item',function(){
		var index = $(this).index();
		$(this).siblings('.active').removeClass('active');
		$(this).addClass('active');
		$(this).closest('.tab-handle-box').find('.tab-cont').addClass('xs-hidden');
		$(this).closest('.tab-handle-box').find('.tab-cont').eq(index).removeClass('xs-hidden')
	})
	// 页面点击  清除 下拉 hover
	$(document).on('click touchstart',function(e){
		e.stopPropagation();
		var _this = $(e.target);
		// alert($(_this).is($('.m_aside_user_center'))||$('.m_aside_user_center').has(_this).length>0);
		if(_this.closest('.search-control').length>0){
			//
		}else{
			$('.city-search').addClass('xs-hidden')
		}

		if($('.navbar-collapse').hasClass('in')&&_this.closest('.navbar-collapse').length<1){
			$('.navbar-toggle').click();
		}
		/*if(_this.is($('.navbar-toggle'))||!$('.navbar-toggle').has(_this).length==0){
			$('.m_slide_shadow').addClass('show').css('marginLeft','-40%');
			$('.m_aside_user_center').addClass('active');
		}else if(!$(_this).is($('.m_aside_user_center'))&&$('.m_aside_user_center').has(_this).length==0){
			$('.m_aside_user_center').removeClass('active');
			$('.m_slide_shadow.show').css('marginLeft',0);
			setTimeout(function(){
				$('.m_slide_shadow').removeClass('show');
			},350)
		}*/

	})
	
	// $('.city-search .right-ct-result').mousedown(function(e){
	// 	console.log(e.target)
	// })
  
    // rangeslider 初始化
	sliderRange();
    
	// search.html
	$(document).on('touchstart click','.headr-search-ipt>.pointer',function(){
		searchActivities();
	})
	$(document).on('click','.headr-search-icon',function(){
		$(this).closest('.navbar-header').find('.headr-search-ipt').removeClass('hidden-xs').addClass('abs-search').find('.query-ipt').focus();
	})

	$(document).on('click','.headr-search-ipt .cancel',function(){
		$(this).closest('.navbar-header').find('.headr-search-ipt').addClass('hidden-xs').removeClass('abs-search').find('.query-ipt').blur();
	})
	// 手机端点击下载 滚动页脚
	$('.model-before').on('click',function(){
		anchorsDownload()
	})
	$(document).on('click','.notOpenedNotice',function(){
		notOpenedNotice();
	})
	// 下载提示
	$('#loadNotice').on('click','.close-icon',function(){
		closeBottomNotice();
	})
	$('#loadNotice').on('click','.load-btn',function(){
		downloadApp();
	})
});
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
$(window).resize(function(){
	docWidth = document.body.clientWidth;
	searchNavInit(docWidth);
})

$(window).scroll(function(e){
	// 页面滚动高度
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	
	//鼠标 滚动 方向
	// var point = 
	var isScroll = scrollTop > 80;
	// initBookBox();
	searchControlHide();
	if($('#loadNotice')&&docWidth<=414){
		if(isScroll){
			$('#loadNotice').removeClass('scroll');
		}else{
			$('#loadNotice').addClass('scroll');
		}
	}
	/*if(docWidth>414&&$('.rt-fix-book').length>0){
		initBookBox()
	}*/
	if($("#index-header .navbar-collapse").hasClass('in')||$('.dropdown.open').length>0){
		return false;
	}else{
		isScroll?$("#index-header").addClass('whiteBg'):$("#index-header").removeClass('whiteBg')
	}
})
}
/**/
export {
	onloadFUN,
	cityListViews
}