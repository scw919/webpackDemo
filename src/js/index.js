require('../less/plugin/bootstrap.css');
require('../less/plugin/swiper.min.css');
require('../js/layer/theme/default/layer.css');
require('../less/common/common.css');
require('../less/main.css');
require('../less/response.css');

require('../js/plugin/bootstrap.min.js');
require('../js/plugin/jquery.i18n.properties.js');
require('../js/plugin/jquery.json.min.js');
require('../js/plugin/jquery.lazyload.min.js');
require('../js/plugin/clamp.min.js');
require('../js/layer/layer.js');

import {
    onloadFUN,
    cityListViews
} from '../js/indexCommon.js';
// import template from 'art-template';
const Swiper = require('../js/plugin/swiper.min.js');
const template = require('art-template/lib/template-web');
import {
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
} from './common/c_utils.js';
// const render = require ('../art/index.art');
const renderBan = require ('../art/index/ban.art');
const hotBan = require ('../art/index/hot.art');
const arroundBan = require ('../art/index/arround.art');
const hiketabBan = require ('../art/index/hiketab.art');
const hikecontBan = require ('../art/index/hikecont.art');
const hikecont2Ban = require ('../art/index/hikecont2.art');
const specialBan = require ('../art/index/special.art');
const special2Ban = require ('../art/index/special2.art');
// template filter poster 
template.defaults.imports.filterPoster = function(value){
	if(value.poster_url!=""&&value.poster_url!=null){
		if(value.poster_url.indexOf(';')>-1){
			var posterArr=value.split(';');
			return posterArr[0];
		}
	}
	return value.poster_url;
}
// template.helper('filterPoster', function(value ){
//     if(value.poster_url!=""&&value.poster_url!=null){
//         if(value.poster_url.indexOf(';')>-1){
//             var posterArr=value.split(';');
//             return posterArr[0];
//         }
//     }
//     return value.poster_url;
// });
// mb _heaad
$('.m_slide_shadow').removeClass('show');
$('.m_aside_user_center').removeClass('active');
function show_mb_head(e){
	$('.m_slide_shadow').addClass('show');
	$('.m_aside_user_center').addClass('active');
}
// 跳转 更多
function checkMore(type,id){
	// console.log(id)
	var searchUrl = encodeURI("./viewmore.html?"+type+"=" + id); //使用encodeURI编码
	window.open(searchUrl); 
}
// 将 参数 id  传递给  moreAcrBtn 按钮
function changeTabData(p){
	if(p.hasClass('hike-container')){
		var cityId = p.find('.tab-item.active').attr('data-moduleId');
		p.find('[class^="moreActBtn"]').data('module_id',cityId);
	}else{
		var moduleId = p.data('module_id');
		p.find('[class^="moreActBtn"]').data('module_id',moduleId);
	}
}
// 切换tab时  将 id值 同步更新到 moreAC=ctBtn 按钮
function hikeTabInit(tab){
	tab.on('click','.tab-item',function(){
		// 标题截取
	    $('.act-card .tit:visible:not(.splice)').each(function(i,obj){
	        // spliceWord(obj);
	        clampWord(obj);
	        // $clamp(obj, {clamp: 2});
	    })
		var cityId = $(this).attr('data-moduleId');
		$(this).closest('.xs-container').find('[class^="moreActBtn"]').data('module_id',cityId);
	})
}
window.onload=function(){
	var docWidth = document.body.clientWidth;
	var mobile = docWidth<=414;
	var lang = getCookie('userLanguage')||getNavLanguage();
	var currency = getCookie('paramscCurrency')||'rmb';
	var showLoad = getCookie('showLoad');
	var banList={data:[]},
	arroundList={data:[]},
	hotList={data:[]},
	hikeList={data:[]},
	specialList={data:[]};
	var postData = {
	  	"request": {
	    	"lang": lang,
		    "data": {
		      "params_currency": currency
    		}
	  	}
	}
	// 修改 title
	$(document).attr("title",indexTitle[lang]);
	// 开始请求
	var load1=layer.load(2);
    console.log(process.env.NODE_ENV);
	$.ajax({
        type: "POST",
        async: true,//false同步 true 异步
        url: base_url+"webapi/explore_api",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(postData),
        dataType: "json",
        success: function (res) {
			layer.close(load1)
        	$('#loader').fadeOut();
        	var data = res.response.data;
        	banList.data = data.url_list;
        	var dataTotal = data.explore_list;
        	// 热门活动dataTotal[1]// 特色体验dataTotal[2// 周边玩乐dataTotal[3]// 深度旅游dataTotal[4]
        	for(var i = 0, len = dataTotal.length; i < len; i++){
        		switch (dataTotal[i].id){
        			case 2:
        				hotList.data=dataTotal[i].value;
        				$('.hot-container').data('module_id',dataTotal[i].id)
        				break;
        			case 3:
        				specialList.data=dataTotal[i].value;
        				$('.special-container').data('module_id',dataTotal[i].id);
        				break;
        			case 4:
        				arroundList.data=dataTotal[i].value;
        				break;
        			case 5:
        				hikeList.data=dataTotal[i].value;
        				break;
        		}
        	}
			// banner
        	var htmlBan = renderBan(banList);
			$('.slider-ban').find('.swiper-wrapper').html(htmlBan);
		
			var swiperBan = new Swiper('.slider-ban', {
		      spaceBetween: 0,
		      effect: 'fade',
		      autoplay: true,
		    });
			// hotAdv
			if(hotList.data!=null&&hotList.data!=""){
				var htmlHot = hotBan(hotList);
				$('.hot-slider').html(htmlHot);
				var swiperHot = new Swiper('.hotSlider', {
			      // centeredSlides: true,
			      freeMode: true,
			      slidesPerView: 4,
			      spaceBetween: 20,
			      // init: false,
			      pagination: {
			        el: '.swiper-pagination',
			        clickable: true,
			      },
	       		  navigation: {
			        nextEl: '.swiper-button-next',
			        prevEl: '.swiper-button-prev',
			      },
			      breakpoints: {
			        1024: {
			          slidesPerView: 3,
			          spaceBetween: 20,
			        },
			        768: {
			          slidesPerView: 2.2,
			          spaceBetween: 15,
			        },
			        640: {
			          slidesPerView: 1.2,
			          spaceBetween: 10,
			        },
			        320: {
			          slidesPerView: 1.2,
			          spaceBetween: 10,
			        }
			      },
			      scrollbar: {
			        el: '.swiper-scrollbar',
			        hide: true,
			      },
			    });
			}else{
				$('.hot-container').remove();
			}
		  	if(arroundList.data!=null&&arroundList.data!=""){
		  		var htmlArround = arroundBan(arroundList);
				$('.arround-slider').html(htmlArround);
				var swiperArround = new Swiper('.arroundSlider', {
			      // centeredSlides: true,
			      freeMode: true,
			      slidesPerView: 6,
			      spaceBetween: 20,
			      // init: false,
			      breakpoints: {
			        1024: {
			          slidesPerView: 5.2,
			          spaceBetween: 20,
			        },
			        768: {
			          slidesPerView: 2.8,
			          spaceBetween: 15,
			        },
			        640: {
			          slidesPerView: 2.5,
			          spaceBetween: 10,
			        },
			        375: {
			          slidesPerView: 2.2,
			          spaceBetween: 10,
			        },
			        320: {
			          slidesPerView: 2.2,
			          spaceBetween: 10,
			        }
			      },
			      navigation: {
			        nextEl: '.swiper-button-next',
			        prevEl: '.swiper-button-prev',
			      },
			      scrollbar: {
			        el: '.swiper-scrollbar',
			        hide: true,
			      },
			    });
		  	}else{
		  		$('.arround-container').remove();
		  	}
		  	if(hikeList.data!=null&&hikeList.data!=""){
				hikeList.data=filterActivityIndex(hikeList.data);
		  		if(hikeList.data.length==0){
		  			$('.hike-container').remove();
		  		}else{
		  			var htmlHikeTabs = hiketabBan(hikeList);
					$('.hike-tab').html(htmlHikeTabs);
					if(docWidth>768){
						var htmlHikeCont = hikecontBan(hikeList);
						// console.log(hikeList.data.length);
						// var hikeLength = hikeList.data.length,swiperHike=[];
						$('.hike-container .swiper-container').removeClass('hikeSlider row').html(htmlHikeCont);
					}else{
						var htmlHikeCont = hikecont2Ban(hikeList);
						var hikeLength = hikeList.data.length,swiperHike=[];
						$('.hike-container .swiper-container').html(htmlHikeCont);
						for(var index=0; index<hikeLength; index++){
							var swiperContainer = ".hikeSlider"+index;
							// console.log(swiperContainer);
						  	swiperHike[index] = new Swiper(swiperContainer, {
							  lazy: true,
						      freeMode: true,
						      slidesPerView: 3,
						      spaceBetween: 30,
					       	  observer: true,//修改swiper自己或子元素时，自动初始化swiper
　　　　						  observeParents: true,//修改swiper的父元素时，自动初始化swiper
						      // init: false,
				       		  navigation: {
						        nextEl: '.swiper-button-next',
						        prevEl: '.swiper-button-prev',
						      },
						      breakpoints: {
						        1024: {
						          slidesPerView: 3,
						          spaceBetween: 20,
						        },
						        768: {
						          slidesPerView: 2.2,
						          spaceBetween: 15,
						        },
						        640: {
						          slidesPerView: 1.2,
						          spaceBetween: 10,
						        },
						        320: {
						          slidesPerView: 1.2,
						          spaceBetween: 10,
						        }
						      },
						      scrollbar: {
						        el: '.swiper-scrollbar',
						        hide: true,
						      },
						    });
						}
						// console.log(swiperHike)
					}
		  		}
		  	}else{
		  		$('.hike-container').remove();
		  	}
			
			// special
			if(specialList.data!=null&&specialList.data!=""){
				if(docWidth>768){
					var htmlSpecial = specialBan(specialList);
					$('.special-container .specialSlider').append(htmlSpecial);
				}else{
					var htmlSpecial = special2Ban(specialList);
					$('.special-container .specialSlider').html(htmlSpecial);
					var swiperSpecial = new Swiper(".specialSlider", {
					  lazy: true,
				      freeMode: true,
				      slidesPerView: 3,
				      spaceBetween: 30,
			       	  observer: true,//修改swiper自己或子元素时，自动初始化swiper
　　　　						  observeParents: true,//修改swiper的父元素时，自动初始化swiper
				      // init: false,
		       		  navigation: {
				        nextEl: '.swiper-button-next',
				        prevEl: '.swiper-button-prev',
				      },
				      breakpoints: {
				        1024: {
				          slidesPerView: 4,
				          spaceBetween: 20,
				        },
				        768: {
				          slidesPerView: 2.2,
				          spaceBetween: 15,
				        },
				        640: {
				          slidesPerView: 1.2,
				          spaceBetween: 10,
				        },
				        320: {
				          slidesPerView: 1.2,
				          spaceBetween: 10,
				        }
				      },
				      scrollbar: {
				        el: '.swiper-scrollbar',
				        hide: true,
				      },	
				    });
				}
			}else{
				$('.special-container').remove();
			}
        },
        error: function (message) {
            // console.log(message)
        },
        complete:function(){

        	$(".lazyLoad img").lazyload({
				// placeholder : "http://www.d-du.com/images/grey.gif", 
				// threshold : 50,
				effect : "fadeIn",
				skip_invisible : false,
				// event : "sporty",
				// container:$('.swiper-wrapper'),
				// failure_limit : 100,
			});
			// 深度旅游 更多按钮 数据绑定更新
			changeTabData($('.hike-container'));
			changeTabData($('.special-container'));
			changeTabData($('.hot-container'));
			hikeTabInit($('.hike-container .hike-tab'));
			$('[class^="moreActBtn"]').each(function(i,obj){
				var _this=$(obj);
				// console.log(_this);
				_this.off().click(function(){
					var parent = _this.closest('.hike-container')[0];
					var type = parent?'cityid':'moduleid';
					checkMore(type,_this.data('module_id'));
				})
			})
			execI18n();
        }
    });
}
$(function(){
    $('.arround-container').on('click','.swiper-slide',function(){
        cityListViews(this);
    })
})
onloadFUN();