require('../less/plugin/bootstrap.css');
require('../less/plugin/swiper.min.css');
require('../js/layer/theme/default/layer.css');
require('../less/plugin/toPage.css');
require('../less/common/common.css');
require('../less/main.css');
require('../less/response.css');
require('../js/whensup.js');
require('../js/layer/layer.js');
import 'core-js/stable';
import 'regenerator-runtime/runtime';
const Swiper = require('../js/plugin/swiper.min.js');
const template = require('art-template/lib/template-web');
var runtime = require('art-template/lib/runtime');
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
import {page_ctrl} from './plugin/toPage.js';
import {onloadFUN} from '../js/indexCommon.js';
// template
const actinfotpl = require ('../art/activitydetail/actinfo.art');
const actinfotraveltpl = require ('../art/activitydetail/actinfotravel.art');
const addressCont = require ('../art/activitydetail/addressCont.art');
const bannerswiper = require ('../art/activitydetail/bannerswiper.art');
const bookNoticeTml = require ('../art/activitydetail/bookNoticeTml.art');
const bookNoticeTmlold = require ('../art/activitydetail/bookNoticeTmlold.art');
const bookTime = require ('../art/activitydetail/bookTime.art');
const commentTmlmb = require ('../art/activitydetail/commentTmlmb.art');
const commentTmlpc = require ('../art/activitydetail/commentTmlpc.art');
const gallarytop = require ('../art/activitydetail/gallarytop.art');
const galleryThumbs = require ('../art/activitydetail/galleryThumbs.art');
const rmdacv = require ('../art/activitydetail/rmdacv.art');
const ticketmb = require ('../art/activitydetail/ticketmb.art');
const ticketpc = require ('../art/activitydetail/ticketpc.art');
// 页面 公用js初始化
onloadFUN();
// 当前页 js
var lang = getCookie('userLanguage');
// template filter poster
runtime.filterPoster = function(value){
	if(value.indexOf(';')>-1){
		var posterArr=value.split(';');
		return posterArr[0];
	}
	return value;
}
runtime.filterEnter = function(value){
	var reg = new RegExp("\n\t", "g")
	var info = value.replace(reg, "<br/>");
	return info;
}
runtime.filterLang = function(value){
	if(typeof(value)=='string'){
		return value
	}
	// console.log(value);
	switch(lang){
		case "zh_cn":
			return  value.name_cn;
			break;
		case "zh_hk":
			return value.name_hk;
			break;
		case "en_us":
			return value.name_us;
			break;
	}
};
runtime.getAdmissionVoucherDesc = function(value){
	if(value.admission_voucher!=null&&value.admission_voucher!=""){
		var data = JSON.parse(value.admission_voucher);
		return data.admissionVoucherDesc
	}
};
runtime.advanceJudge = function(value){
	if(lang=='zh_cn'){
		var day = '';
		if(value.advance_day==0){
			day='当'
		}else{
			day=value.advance_day
		}
		return day+'天'+value.advance_hour+'点前可预订'
	}else{
		return value.indate
	}
}
var docWidth = document.body.clientWidth;
var detail={
	scrollTop: 0,
	detailBanHover:function(){
		$('.poster-box img').hover(function(){
			// _le7w2kl
			$('.poster-box img').each(function(){
				$(this).addClass('_le7w2kl');
			})
			$(this).removeClass('_le7w2kl');
		},function(){
			$('.poster-box img').each(function(){
				$(this).removeClass('_le7w2kl');
			})
		})
	},
	checkPicture:function(obj){
		$('#check_det_pic').show();
	 	var galleryThumbs = new Swiper('.gallery-thumbs', {
	      spaceBetween: 10,
	      slidesPerView: 4,
	      loop: true,
	      freeMode: true,
	      loopedSlides: 5, //looped slides should be the same
	      watchSlidesVisibility: true,
	      watchSlidesProgress: true,
	    });
	    var galleryTop = new Swiper('.gallery-top', {
	      spaceBetween: 10,
	      loop:true,
	      loopedSlides: 5, //looped slides should be the same
	      navigation: {
	        nextEl: '.swiper-button-next',
	        prevEl: '.swiper-button-prev',
	      },
	      thumbs: {
	        swiper: galleryThumbs,
	      },
	    });
	},
	close_ck_pic:function(){
		$('#check_det_pic').hide();
	},
	checkMap:function(){
		$('.det-intro-tabs .tab-item:nth-child(3)').click();
	},
	showDetails:function(obj){//pc端 门票点击查看
		var _this = $(obj);
		var light = _this.closest('.ticket-item').find('.light-icon');
		var tit_item_box = _this.closest('.ticket-item-box');
		if(light.hasClass('active')){
			_this.closest('.ticket-item').find('.dropdown-box').stop(0,1).slideUp();
			tit_item_box.removeClass('active');
			light.removeClass('active');
		}else{
			_this.closest('.ticket-item').find('.dropdown-box').stop(0,1).slideDown();	
			tit_item_box.addClass('active');
			light.addClass('active')
		}
	},
	dropdownticktList: function(obj){
		var _this = $(obj);
		var downIcon = _this.find('.dropdown-icon');
		if(downIcon.hasClass('active')){
			_this.closest('.ticket-kinds').find('.ticket-kinds-box').stop().slideUp();
			downIcon.removeClass('active');
		}else{
			_this.closest('.ticket-kinds').find('.ticket-kinds-box').stop().slideDown();
			downIcon.addClass('active');
		}
	},
	showTicketIntro:function(obj,modal){
		var _this=$(obj);
		_this.closest('.ticket-item').find('.det-ticket-intro').addClass('active');
		$('#'+modal).fadeIn(100);
		this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		$('body').addClass('noScroll').css('top', -this.scrollTop+'px');
	},
	closeTicketIntro:function(obj){
		var _this = $(obj);
		if(_this.closest('.det-ticket-intro')>length>0){
			_this.closest('.det-ticket-intro').removeClass('active');
			$('#modal').fadeOut(300);
		}else{
			$('.det-ticket-intro.active').removeClass('active');
			$('#modal').fadeOut(300);
		}
		$('body').removeClass('noScroll').scrollTop(detail.scrollTop)
	},
	bookbills:function(){
		var lang = getCookie('userLanguage')||getNavLanguage();
		layer.ready(function(){ 
		  	layer.open({
		    	type: 1,
		    	title:  docWidth>768?loadNoticeTit[lang]:loadNoticeTitMobile[lang],
		    	maxmin: false,
		    	area: [docWidth<640?docWidth+'px':'640px'],
		    	content: docWidth>768?$('.loadAppCode-pc'):$('.loadAppCode-mobile'),
		    	closeBtn: 1,
		    	end: function(){
		      	// layer.tips('Hi', '#about', {tips: 1})
		    	}
		  	});
		});
	},
 	checkIntroTabs:function(){
		var obj = $('.det-intro-tabs');
		obj.on('click','.tab-item',function(){
			var scrollTop = $('.det-intro-container').offset().top;
			$('body').animate({scrollTop: scrollTop+10},500);
		})
	},
	checkTabCont:function(index,nameVal,obj){
		$('.scroll-tab-box').off('click','.tab-item');
		obj.initScroll($('.scroll-tab-box'),$('.activity-wrap'),$('.det-tab-container'));
	},
	moreReviews:function(obj){
		var _this = $(obj);
		var event_id = _this.attr('data-id');
		var commentsURL=encodeURI("http://192.168.1.130:5656/view/morecomments.html?searchText=" + event_id);
		window.location.href=commentsURL;
	},
	scrollEle:{
		headerH:0,
		bannerH:null,
		tabH:0,
		scrollTabArr:[],
		scrollContArr:[],
		scrollTopArr:[],
		initScroll:function(scrollTab,scrollCont,tabCont,callback){
			var _this =this;
			_this.scrollTab=scrollTab;
			_this.scrollTabCont=tabCont;
			_this.headerH = $('.head-container').outerHeight(true);
			_this.bannerH = $('.xs-intro-vr').outerHeight(true);
			_this.tabH = $('.det-tab-container').outerHeight(true);
			_this.priceFixH = $('.price_fix').outerHeight(true);
			_this.scrollTabArr = scrollTab.find('.tab-item');
			_this.scrollContArr=scrollCont.find('.scroll-item');
			_this.rmdTop = $('.act-rmd-container').offset().top;
			_this.isArriveRmd = _this.scrollTop-(_this.rmdTop-_this.priceFixH);
			_this.scrollContArr.each(function(i,obj){
				var top = $(this).offset().top-(_this.headerH+_this.tabH);
				_this.scrollTopArr[i]=top;
			})
			scrollTab.on('click','.tab-item',function(){
				var index = $(this).index();
				$(this).siblings('.active').removeClass('active');
				$(this).addClass('active');
				var nameVal = $(this).attr('name');
				detail.checkTabCont(index,nameVal,_this);
				$('body').animate({scrollTop: _this.scrollTopArr[index]},500);
			})
			$(window).scroll(function(){
				_this.scrollCheck(scrollTab);
				_this.scrollContArr.each(function(i,obj){
					var top = $(this).offset().top-(_this.headerH+_this.tabH);
					_this.scrollTopArr[i]=top;
				})
			})
		},
		scrollCheck:function(){
			var _this = this;
			_this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			if(_this.scrollTop>=_this.bannerH){
				_this.scrollTabCont.addClass('fixed').css('top',_this.headerH+'px');
			}else{
				_this.scrollTabCont.removeClass('fixed').css('top',0);
			}
			// console.log(_this.scrollTop);
			var index=_this.curNavIndex();
			_this.scrollTab.find('.tab-item.active').removeClass('active');
			_this.scrollTab.find('.tab-item').eq(index).addClass('active');
		},
		curNavIndex:function(){
			var _this= this;
			var len = _this.scrollTopArr.length;
            for(var i = 0; i < len; i++) {
                //判断当currentIndex在height1和height2之间的时候显示
                var height1 = _this.scrollTopArr[i];
                var height2 = _this.scrollTopArr[i + 1];
                var scrollTop=_this.scrollTop+50;
                // console.log(_this.scrollTopArr);
                // console.log('height1:'+height1+',scrollTop:'+scrollTop+',height2:'+height2);
                if(scrollTop < height1){
                	return 0;
                }else if(!height2 || (scrollTop >= height1 && scrollTop < height2)) {
                    return i;
                }
            }
            return 0;
        },
        checkBookBox:function(){
        	var _this= this;
        	if(_this.scrollTop>=_this.headerH+_this.bannerH){
				_this.scrollTabCont.addClass('fixed').css('top',_this.headerH+'px');
			}else{
				_this.scrollTabCont.removeClass('fixed').css('top',0);
			}
        },
        // act 预定悬浮框
		initBookBox:function (resetWidth,offsetLeft,left,top){
			var _this = this;
			if(docWidth>768){
				// var ltWidth=$('.price_fix').offset().left;
				var scrollTop=$(window).scrollTop();
				var offsetTop=$( ".rt-fix-book" ).offset().top-_this.headerH-_this.tabH;
				var maxScroll=$(".act-rmd-container").offset().top-$(window).scrollTop();
				var head_poster_H=$('.head-container').outerHeight(true)+$('.xs-intro-vr').outerHeight(true);
				var head_book_box_H=$('.head-container').outerHeight(true)+$('.price_fix').outerHeight(true);
				var absTop=$(".act-rmd-container").offset().top - $('.price_fix').outerHeight(true)-head_poster_H;
				if(scrollTop>offsetTop){
					if(maxScroll>head_book_box_H){
						$('.price_fix').css('position','fixed').css('top',top+'px').css('left',offsetLeft+'px').css('width',resetWidth+'px');
					}else{
						$('.price_fix').css('position','absolute').css('left',left+'px').css('top',absTop+'px')
					}
				}else{
					$('.price_fix').css('position','absolute').css('left',left+'px').css('top',0).css('width',resetWidth+'px');
				}
			}else{
				$('.price_fix').css('position','static').css('left',0).css('top',0).width('auto')
			}
		}
	},	
	headerLift:{
		scrollTop: 0,
		headerH:null,
		bannerH:null,
		tabH:null,
		tabTop:null,
		toTabTop:null,
		overTop:null,
		rmdTop:null,
		isArriveRmd:null,
		initHeaderLift:function(){
			var _this = this;
			_this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			_this.headerH = $('.head-container').outerHeight(true);
			_this.bannerH = $('.xs-intro-vr').outerHeight(true);
			_this.tabH = $('.det-tab-container').outerHeight(true);
			_this.tabTop = $('.det-intro-container').offset().top;
			_this.toTabTop = _this.tabTop - _this.tabH;
			_this.overTop = _this.scrollTop - _this.toTabTop;
			_this.rmdTop = $('.act-rmd-container').offset().top;
			_this.isArriveRmd = _this.scrollTop-(_this.rmdTop-_this.tabH);
			if(_this.isArriveRmd>0){
				$('.det-intro-tabs-row.fixed').css('top',_this.isArriveRmd)
			}
			if(_this.overTop>0&&_this.overTop<=_this.headerH){
				$('.head-container').css('top',-(_this.overTop+2)+'px');
				$('.det-intro-tabs-row').addClass('fixed').css('position','fixed').css({'top':(_this.headerH-_this.overTop),'width':'100%'}).css('zIndex',1002);
				$('.det-intro-container .tab-handle-box').addClass('fixed')
			}else{
				if(_this.overTop>0&&_this.overTop>_this.headerH){
					var setTop = 0;
					if(_this.isArriveRmd>0){
						setTop = -_this.isArriveRmd
					}
					$('.head-container').css('top',-_this.headerH+'px');
					$('.det-intro-tabs-row').addClass('fixed').css('position','fixed').css({'top':setTop,'width':'100%'}).css('zIndex',1002);
					$('.det-intro-container .tab-handle-box').addClass('fixed')
				}else{
					$('.head-container').css('top',0);
					$('.det-intro-tabs-row').removeClass('fixed').css('position','static').css('top',0);
					$('.det-intro-container .tab-handle-box').removeClass('fixed')
				}
			}	
		}

	},
	showTraffic:function(obj){
		var _this = $(obj);
		var ellipsis = _this.closest('.relative').find('.traffic_div');
		if(ellipsis.hasClass('ellipsis ellipsisP')){
			ellipsis.removeClass('ellipsis ellipsisP');
		}else{
			ellipsis.addClass('ellipsis ellipsisP');	
		}
		_this.hide();
		_this.siblings('.moreInfo').show();
	},
	
}
window.onload= function(){
	function loadAmap(position){
		if(position.location_long!="undefined"&&position.location_long!=""&&position.location_lat!="undefined"&&position.location_lat!=""){
			var initLocal = true;
			var center=[position.location_long, position.location_lat];
			var zoom = 15;
		}else{
			var initLocal = false;
			var center=[114.0412, 22.3712];
			var zoom = 8;
		}
		// var center=[position.location_long||114.0412, position.location_lat||22.3712];
        var map = new AMap.Map("content_map", {
          resizeEnable: true,
          center: center,
          zoom: zoom
        })
        if(initLocal){
        	var marker = new AMap.Marker({
	          map: map,
	          icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
	          position: center
	        });
        	//创建信息窗体
			var infoWindow = new AMap.InfoWindow({
				content: position.detail_address//信息窗体的内容
			});
			//如果希望的是点击标记才 出现这个信息窗口，那把 下面的注释去掉即可
			//	AMap.event.addListener(marker,'click',function(){ //监听点标记的点击事件
			infoWindow.open(map,marker.getPosition()); //信息窗体打开
			//	})
        }
	}
	function loadGoogle(cb){
	 	var script=document.createElement('script');
	    var ad_oneTimeout=-1,ad_onetime=0;
	    function ad_one_check(){
	         if(ad_onetime>3000){;
	            clearTimeout(ad_oneTimeout);
	            if(window.stop){
	            	window.stop();
	            }else{
	            	document.execCommand("Stop");
	            }
	            cb(window.address,false);
	            return false;
	        }else{
	            ad_oneTimeout=setTimeout(function(){             
	            ad_onetime=ad_onetime+1000;
	            ad_one_check();
	                },1000);
	        }
		}
	    script.type='text/javascript';
	    script.async='async';
	    script.defer='defer';
	    script.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCWN4l13uPEA3bvg8Dq6Dsp-EmYgtY0yxU&libraries=places&lx";
	    document.body.appendChild(script);
	    ad_one_check();
　　　　 if(script.readyState){   //IE
			script.onreadystatechange=function(){
				clearTimeout(ad_oneTimeout);
				if(script.readyState=='complete'||script.readyState=='loaded'){
					script.onreadystatechange=null;
                	cb(window.address,true);
                	return false;
				}else{
				 	cb(window.address,false);
					return false
				}
        	}
	    }else{    //非IE
	        script.onload=function(){
	            clearTimeout(ad_oneTimeout);
	            cb(window.address,true);
	            return false;
	        }
	        script.onerror=function(){
	            clearTimeout(ad_oneTimeout);
             	cb(window.address,false);
	           	return false;
	        }
	　　}　　
	}
	function initializeMap(position, judge) {
		if(judge){
			latlng = new google.maps.LatLng(position.location_lat, position.location_long);
			var myOptions = {
				zoom: 15,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			map = new google.maps.Map(document.getElementById("content_map"), myOptions);
			addMarker(latlng, window.address);
		}else{
			loadAmap(position);
			
	 		// var htmlAddress = template('address', act_detail_data);
	 		// $('#content_map').html(htmlAddress);
		}
		//	geocoder = new google.maps.Geocoder();
	}

	function addMarker(location,item) {
		var marker = new google.maps.Marker({
			position : location,
			title : item.detail_address,
			// icon:"img/icon.png",
			map : map
		});
		var contentString = '<div style="color:black;text-align:center;">' +item.detail_address+'<br /></div>';
        
		var infowindow = new google.maps.InfoWindow({
		   	content: contentString
		});
		infowindow.open(map, marker);
		// google.maps.event.addListener(marker, 'click', function() {
		// 	infowindow.open(map, marker);
		// });
	}
	var isTravel;//判断是否是深度旅游
	//获取 上一个搜索页面传来的参数 
  	var searchUrl = window.location.href;
  	var searchData = searchUrl.split("="); //截取 url中的“=”,获得“=”后面的参数
  	var activitiesId = decodeURI(searchData[1]); //decodeURI解码
  	// var activitiesId = 15472731202163;
	var lang = getCookie('userLanguage')||getNavLanguage();
	var currency;
	if(lang=='zh_hk'){
		currency = getCookie('paramscCurrency')||'HK'
	}else{
		currency = getCookie('paramscCurrency')||'rmb'
	}
	// console.log(lang)
	var act_detail_data,act_detail_list,
	rmdList={data:[]},
	bookNoticeList={data:[]},
	ticketListData={data:[]};
	var postData = {
	  	"request": {
	    	"lang": lang,
		    "data": {
            	"activities_id": activitiesId,
            	"params_currency": currency
	        }
	  	}
	}
	/*addressCont
bannerswiper
bookNoticeTml
bookNoticeTmlold
bookTime
commentTmlmb
commentTmlpc
gallarytop
galleryThumbs
rmdacv
tikcetmb
tikcetpc*/
  	var load1=layer.load(2);
	$.ajax({
        type: "POST",
        async: true,//false同步 true 异步
        url: base_url+"webapi/explore_detail_api",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(postData),
        dataType: "json",
        success: function (res) {
        	var code = res.response.code;
        	var data = res.response.data;
        	isTravel = data.scenic_type==5||data.scenic_type==6;
        	data.start_datetime = timestamp(data.start_datetime)
        	data.end_datetime = timestamp(data.end_datetime)
        	data.rate = parseInt(data.rate)/20;
        	act_detail_data = data;
        	act_detail_list= {
        		"data":act_detail_data.details_content
        	}
        	var htmlActInfo;
        	if(isTravel){
        		window.address=null;
	        	htmlActInfo = actinfotraveltpl(act_detail_data);
	        	$('.det-tit-container').removeClass('scroll-item').addClass('isTravel');
	        	$('#addressInto').remove();
	        	$('.viewIntro-relate').attr('name','Overview');
        	}else{
        		htmlActInfo = actinfotpl(act_detail_data);
        		window.address={
	        		detail_address: data.address?data.address:data.detail_address,
				}
				if(data.latitude&&data.longitude){
					window.address['location_lat']=data.latitude;
					window.address['location_long']=data.longitude;
				}else if(data.glocation&&data.glocation!="null,null"){
					var glocation=data.glocation.split(',');
					window.address['location_lat']=glocation[0];
					window.address['location_long']=glocation[1];
				}else if(data.blocation&&data.blocation!="null,null"){
					var blocation=data.blocation.split(',');
					window.address['location_lat']=blocation[1];
					window.address['location_long']=blocation[0];
				}else{
					window.address=null;
				}
        	}
        	$('.det-tit-container').html(htmlActInfo);
    		// act-info
        	if(docWidth<500){
        		$('.det-tit-container').removeClass('scroll-item');
        		$('#addressInto').remove();
        	}
			// .xs-intro-vr
			if(act_detail_data.poster_url&&act_detail_data.poster_url.indexOf(';')<0){
				// poster-box
				// https://m.tuniucdn.com/filebroker/cdn/olb/c2/b7/c2b783bd14f32cf9c0d74a43156582fc_w800_h400_c1_t0.jpg
				// $('.xs-intro-vr').css("background-image","url(" + act_detail_data.poster_url + ")");
				$('.checkImg').hide();
				var imgUrl = act_detail_data.poster_url;
				if(docWidth>414){
					if(imgUrl.indexOf('_w')>0){
						var imgStr = imgUrl.split('_w')[0];
						var imgType = imgUrl.split('_w')[1].split('.')[1];
						var judgeSize;
						if(docWidth>1440){
							judgeSize = 'big'
						}else if(docWidth>1040){
							judgeSize = 'mid'
						}else{
							judgeSize = 'sml'
						}
						imgUrl = imgStr + ImgSize[judgeSize] + imgType;
					}else{
						// $('.xs-intro-vr').addClass('act-detail');	
					}
				}
				$('.xs-intro-vr').css("background-image","url(" + imgUrl + ")");
			}else{
				var posterArr={
					data: act_detail_data.poster_url.split(';')
				}
				if(docWidth<=414){
					$('.xs-intro-vr').css("background-image","url(" + posterArr['data'][0] + ")");
				}else{
					var b_swiper=bannerswiper(posterArr);
					$('.poster-box').append(b_swiper);
					detail.detailBanHover();
				}
				var galleryTopHtml = gallarytop(posterArr);
				var galleryThumbsHtml = galleryThumbs(posterArr);
				$('#gallery-top').html(galleryTopHtml);
				$('#gallery-thumbs').html(galleryThumbsHtml);
			}
        	
        	// return false

        	// 预订须知
        	// var bookNotice = JSON.parse(act_detail_data.book_notice);
        	var bookNotice = act_detail_data.book_notice||act_detail_data.hp_book_notice||act_detail_data.df_book_notice;
        	// console.log(bookNoticeList);
        	if(bookNotice&&bookNotice!=""){
        		bookNoticeList={
	        		"data": bookNotice
	        	}
	        	var htmlBookNotice = bookNoticeTml(bookNoticeList);
	        	$('#book-notice').html(htmlBookNotice);
        	}else{
        		$('.book-notice-relate').remove();
        	}

    		// 景点介绍
        	if(act_detail_data.details&&act_detail_data.details!=""){
        		$('#details').html(act_detail_data.details);
        	}else{
        		$('.viewIntro-relate').remove();
        	}
        	
        	
        	

        	// 门票
        	if(act_detail_data.ticket_types!=""&&act_detail_data.ticket_types!=null){
        		var ticketInitData = act_detail_data.ticket_types;
	        	var ticketHandleData = sortPrice(ticketInitData);
	        	var ticketListData = {"data": ticketInitData};
	        	var htmlTicket = docWidth>414?ticketpc(ticketListData):ticketmb(ticketListData);
	        	$('#ticketsBox').append(htmlTicket);
        	}else{
        		$('.ticketsBox-relate').remove();
        	}
        	
        	// bookTime
        	var htmlBookTime = bookTime(act_detail_data);
        	$('.avalid-time .time-slot').html(htmlBookTime);
			
        	var validDate =[{
        		adultMarketPrice: 266,
				planDate: "2019-01-19",
				planWeek: "周六",
				priceDesc: "",
				priceTip: "日历价格为当日最低优惠价，您可以选择可享用的最大优惠",
				startPrice: 285,
				tuniuChildPrice: 0,
				tuniuPrice: 285,
			}];
			if($('.dateinputShow').length){
				jeDate('.dateinputShow',{
					language:jedateCtr['language'][curLan],
					isShow: false,
					isToday: false,
					isClear: false,
					showYearBtn:true,
	    			// markText:jedateCtr['markText'][curLan],
			        // theme:{ bgcolor:"#148fff",color:"#ffffff", pnColor:"#00CCFF"},
			    	format: "YYYY-MM-DD",
			    	minDate: act_detail_data.start_datetime, //设定最小日期为当前日期
			    	maxDate: act_detail_data.end_datetime,
			        /*maxDate: function (that) {
			            //that 指向实例对象
			            return jeDate.valText(that.valCell) == "" ? jeDate.nowDate({DD:0}) : start.maxDate;
			        }, */
	        		scwMarks:validDate, 
			    	donefun:function(obj){
			    		console.log(obj)
			    	}
			    });  
			}
        	// book-box
		 	/*var htmlBookBox = template('bookBox', act_detail_data);
        	$('.book-box').html(htmlBookBox);*/
        	$('.price_fix .goto_book').click(function(){
				layer.ready(function(){ 
				  layer.open({
				    type: 1,
				    title:  docWidth>768?loadNoticeTit[lang]:loadNoticeTitMobile[lang],
				    maxmin: false,
				    area: [docWidth<640?docWidth+'px':'640px'],
				    content: docWidth>768?$('.loadAppCode-pc'):$('.loadAppCode-mobile'),
				    closeBtn: 1,
				    end: function(){
				      // layer.tips('Hi', '#about', {tips: 1})
				    }
				  });
				});
			})
			// 推荐
			if(act_detail_data.recommend_activity_list!=""&&act_detail_data.recommend_activity_list!=null&&act_detail_data.recommend_activity_list.length>0){
				var rmdLists = act_detail_data.recommend_activity_list;
        		var dataTodata = filterActivity(rmdLists);
        		if(dataTodata.length>0){
		        	rmdList.data=dataTodata;
					var htmlRmd = rmdacv(rmdList);
					$('.act-rmd-slider').html(htmlRmd);
				  	var swiperRmd = new Swiper('.actRmdSlider', {
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
			  		$('#recommend-a').remove();
    				$('.act-rmd-container>.container').addClass('xs-hidden');
			  	}
        	}else{
        		$('#recommend-a').remove();
    			$('.act-rmd-container>.container').addClass('xs-hidden');
        	}
    		
			// 地图标题
			var htmlAddress = addressCont(act_detail_data);
				$('.addressMap').html(htmlAddress);
			/*if(!isTravel){
				var htmlAddressHeader = template('addressHeader', act_detail_data);
 				$('.addressMap header').html(htmlAddressHeader);
			}else{

			}*/
		  	
 			/*if(act_detail_data.traffic_bus!=''&&act_detail_data.traffic_bus!=null){
 				$('.addressMap footer .ft_traffic').html(act_detail_data.traffic_bus);
 			}else{
 				$('.addressMap footer').hide();
 			}*/
        },
        error: function (message) {
            // console.log(message)
        },
        complete:function(){
        	$(".lazyLoad img").lazyload({
				// placeholder : "http://www.d-du.com/images/grey.gif", 
				threshold : 50,
				effect : "fadeIn",
				skip_invisible : false,
				// placeholder: "images/loading.gif",
				// effect : "fadeIn",
				// skip_invisible : false,
				// threshold : 100,
				// event : "sporty",
				// container:$('.bx-viewport')
				// failure_limit : 100,
			});
			execI18n();
			// 地图 初始化
			if(window.address){
				if(lang=='zh_hk'||"en_us"){
					loadGoogle(initializeMap);
				}else{
		 			loadAmap(window.address);
				}
			}else{
				$('#content_map').remove();
			}
			// 初始化 
			$(function(){
				// 初始化 电梯
				var parentWidth = $('.rt-fix-book').outerWidth(true);
				var resetWidth = $('.rt-fix-book').width();
				var left = (parentWidth-resetWidth)/2;
				var ltWidth=0;
				/*if($('.price_fix').length>0){
					ltWidth=$('.price_fix').offset().left;
				}*/
				var headerH = $('.head-container').outerHeight(true);
				var tabH = $('.det-tab-container').outerHeight(true);
				var top = headerH+tabH;
				detail['scrollEle'].initScroll($('.scroll-tab-box'),$('.activity-wrap'),$('.det-tab-container'));
				$(window).scroll(function(){
					if($('.price_fix').length>0){
						// ltWidth=$('.price_fix').offset().left;
						// ltWidth=$('.price_fix')[0].getBoundingClientRect().left;
						ltWidth=$('.price_fix').offset().left;
						detail['scrollEle'].initBookBox(resetWidth,ltWidth,left,top);
					}
				});
				detail.detailBanHover();
				window.scrollTo(0,1);
				// 初始化 
				var swiperRmd = new Swiper('#det-tab-swiper', {
			      	// centeredSlides: true,
			      	freeMode: true,
			      	slidesPerView: 'auto',
			      	spaceBetween: 40,
			      	breakpoints: {
		        	 	1024: {
				          spaceBetween: 20,
				        },
				        768: {
				          spaceBetween: 15,
				        },
				        640: {
				          spaceBetween: 10,
				        },
				        320: {
				          spaceBetween: 10,
				        }
			      	},
			    });
			})
        }     
    });
	// 详情评论 api webapi/comments_api
	var commentPost = {
	  	"request": {
		    "lang": lang,
		    "data": {
		      	"params_currency": currency,
		      	"activities_id": activitiesId,
		      	"p": "1"
		    }
	  	}
	}
	function getComments(data){
		var total = 0
		var promise = new Promise(function(resolve, reject){
			$.ajax({
		        type: "POST",
		        async: true,//false同步 true 异步
		        url: base_url+"webapi/comments_api",
		        contentType: "application/json; charset=utf-8",
		        data: JSON.stringify(data),
		        dataType: "json",
		        success: function (res) {
		        	if(res.response.code==1000){
		        		var data = res.response.data;
		        		total = data.row_total;
		        		if(total<1){
		        			$('#more-comment').hide();
		        		}else{
		        			$('#more-comment>a').attr('data-id',activitiesId)
		        		}
		        		var commentData = {"data":data.results};
		        		var htmlComment = docWidth>414?commentTmlpc(commentData):commentTmlmb(commentData);
		        		$('#commentList').html(htmlComment);
		        	}else{
		        		layer.alert('error')
		        	}
		        },
		        error: function (message) {
		            // console.log(message)
		        },
		        complete:function(){
		        	$(".lazyLoad img").lazyload({
						// placeholder : "http://www.d-du.com/images/grey.gif", 
						threshold : 50,
						effect : "fadeIn",
						skip_invisible : false,
					});
					execI18n();
					layer.close(load1);
					resolve(total);
		        }     
		    });
		})
		return promise;
	}
	getComments(commentPost).then(function(total){
		var obj = {
		    obj_box: '.comment-pagination', //翻页容器(css选择器均可)
		    total_item: total, //条目总数
		    per_num: '10', //每页条目数
		    current_page: '1', //当前页
		    change_content: function(per_num, current_page) {
		    	// console.log(current_page);
		    	// $('.hike-tab .tab-item.active').click();
		    	$('#commentList').html('').addClass('loading');
		    	var commentPostCopy = JSON.parse(JSON.stringify(commentPost));
		    	commentPostCopy.request.data.p=current_page;
		    	getComments(commentPostCopy).then(function(){
		    		$('#commentList').removeClass('loading');
		    	});
		    }
		};
		page_ctrl(obj); //调用分页插件
	})
}

$(function(){
	$('.xs-intro-vr').on('click','.checkImg',function(){
		detail.checkPicture(this);
	})
	$(document).on('click','.close_ck_pic',function(){
		detail.close_ck_pic();
	})
	$('.det-tik-container').on('click','.ticket-kinds-tit',function(){
		detail.dropdownticktList(this);
	})
	// det-ticket-intro
	$('.det-tik-container').on('click','.ticket-item-tit,.light-icon',function(){
		detail.showDetails(this);
	})
	$('.det-tik-container').on('click','.ticket-item-box button.book-ticket',function(){
		detail.bookbills();
	})
	$('.det-tik-container').on('click','.showTicketIntro',function(){
		detail.showTicketIntro(this,'modal');
	})
	$('.det-tik-container').on('click','.det-ticket-intro>.close-btn',function(){
		detail.closeTicketIntro(this);
	})
	$('.det-tik-container').on('click','.det-ticket-book .buy',function(){
		detail.bookbills();
	})
	$('.comment-body').on('click','.moreReviews',function(){
		detail.moreReviews(this)
	})
})