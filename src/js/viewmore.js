require('../less/plugin/bootstrap.css');
require('../less/plugin/swiper.min.css');
require('../js/layer/theme/default/layer.css');
require('../less/plugin/jquery.page.css');
require('../less/common/common.css');
require('../less/main.css');
require('../less/response.css');

require('../js/plugin/bootstrap.min.js');
require('../js/plugin/jquery.i18n.properties.js');
require('../js/plugin/jquery.json.min.js');
require('../js/plugin/jquery.lazyload.min.js');
require('../js/plugin/clamp.min.js');
require('../js/plugin/rangeslider.min.js');
require('../js/layer/layer.js');
require('../js/plugin/jquery.page.js');
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
// import {page_ctrl} from './plugin/toPage.js';
import {
	onloadFUN
} from '../js/indexCommon.js';
// template
const itemtpl = require ('../art/citylist/item.art');
// 页面 公用js初始化
onloadFUN();
// 当前页 js

// template filter poster
runtime.filterPoster = function(value){
	if(value.indexOf(';')>-1){
		var posterArr=value.split(';');
		return posterArr[0];
	}
	return value;
}
$(function(){
	function getCityInfo(Data){
		$.ajax({
	        type: "POST",
	        async: true,//false同步 true 异步
	        url: base_url+curApi['info'],
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(Data),
	        dataType: "json",
	        success: function (res) {
	        	var data = res[0];
	        	var bgImage = type=="moduleid"?data.poster_url:data.image_url ;
	        	$('.xs-intro-vr').css("background-image","url(" + bgImage + ")");
	        	var partTit=[];
	        	var partTitHK = data.name_hk;
	        	if(lang=='zh_cn'){
	        		var partTitInit = data.name_cn;
	        		partTit[0]=partTitInit.substr(0,2);
	        		partTit[1]=partTitInit.substr(2)
	        	}else if(lang=='zh_hk'){
	        		var partTitInit = data.name_hk;
	        		partTit[0]=partTitInit.substr(0,2);
	        		partTit[1]=partTitInit.substr(2)
	        	}else{
	        		var partTitInit = data.name_us;
	        		if(type=='moduleid'){
	        			var partTitArr = partTitInit.split(' ');
	        			partTit=partTitArr;
	        		}else{
	        			partTit = partTitInit;
	        		}
	        	}
	        	var len = partTit.length,titFirst='',titSecond='';
	        	if(type=='moduleid'){
	        		if(len>1){
	        			titFirst=partTit[0];
	        			delete partTit[0];
	        			for(var i=1;i<len;i++){
	        				titSecond = titSecond+partTit[i]
	        			}
	        		}else{
	        			titFirst=partTit[0];
	        			titSecond='';
	        		}
	        		var partTitHtml ='<p class="part-tit ft-24"><span class="grayStyle">'+titFirst+'</span><span class="blueStyle">'+titSecond+'</span></p>';
	        		$(document).attr("title",partTitHK+'旅遊-'+partTitHK+'景點-行書APP官網');
	        	}else{
	        		for(var i=0;i<len;i++){
        				titSecond = titSecond+partTit[i]
        			}
	        		var partTitHtml ='<p class="part-tit ft-24"><span class="grayStyle">'+titSecond+'</span><span class="blueStyle i18n" name="Play"></span></p>';
	        	}
	        	$('.part-tit').html(partTitHtml);
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
	        }
	    })  
	}
	function searchTotalList(Data){
		var promise = new Promise(function(resolve, reject){
			var load1=layer.load(2);
			$.ajax({
		        type: "POST",
		        async: true,//false同步 true 异步
		        url: base_url+curApi['list'],
		        contentType: "application/json; charset=utf-8",
		        data: JSON.stringify(Data),
		        dataType: "json",
		        success: function (res) {
		        	var data = res;
		        	totalData = data.results;
		        	pagerSet.total = data.row_total;
		        	pagerSet.totalPages = Math.ceil(pagerSet.total/pagerSet.pageSize);
		        	// pagerSet.totalPages = 3;
		        	TotalList.data=filterActivity(totalData);
					htmlTotalList = itemtpl(TotalList);
					$('.search-result-list').html(htmlTotalList);
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
					layer.close(load1);
					resolve()
		        }     
		    });
		})
		return promise;
	}
	// 接口

	var curApi={};
	var webApi= {
		'cityid':{
			'list':'/webapi/deep_modules_api',
			'info':'/webapi/city_list_api'
		},
		'moduleid':{
			'list':'/webapi/more_modules_api',
			'info':'/webapi/moduel_list_api'
		}
	}
	// jsp
  	/*var searchUrl = window.location.href;
  	var type,keyVal;
  	if(searchUrl.indexOf('cityid')>-1){
  		type = 'cityid';
  		keyVal = searchUrl.split('cityid/')[1];
  	}else{
  		type="moduleid";
  		keyVal = searchUrl.split('moduleid/')[1];
  	}
  	var searchText = decodeURI(keyVal||''); */
  	// html
  	var searchUrl = window.location.href;
  	var searchData = searchUrl.split('?')[1]; //截取 url中的“=”,获得“=”后面的参数
  	var keyVal = searchData.split('=');
  	var type = keyVal[0];
  	var searchText = decodeURI(keyVal[1]||''); //decodeURI解码

  	curApi=webApi[type];
	var docWidth = document.body.clientWidth;
	var lang = getCookie('userLanguage')||getNavLanguage();
	var currency;
	if(lang=='zh_hk'){
		currency = getCookie('paramscCurrency')||'HK'
	}else{
		currency = getCookie('paramscCurrency')||'rmb'
	}
	var totalData=[],TotalList={data:[]},htmlTotalList;
	var pagerSet={
		total:0,
		curpage:1,
		pageSize:16,
		totalPages:0
	};
	// 传参
  	var initPage = sessionStorage.getItem('initPage');
	initPage=initPage>1?initPage:1;
	//深度 city
	var postDataListCity = {
	  	"request": {
	    	"lang": lang,
		    "data": {
		    	"city_id": searchText,
   			 	"params_currency": currency,
   			 	"p": initPage
		    }
	  	}
	}
	var postDataInfoCity = {
	  	"request": {
	    	"lang": lang,
		    "data": {
		    	"id":searchText,
   			 	"params_currency": currency
		    }
	  	}
	}
	//模块 module_id
	var postDataListModule = {
	  	"request": {
	    	"lang": lang,
		    "data": {
		    	"module_id": searchText,
   			 	"params_currency": currency,
   			 	"p": initPage
		    }
	  	}
	}
	var postDataInfoModule = {
	  	"request": {
	    	"lang": lang,
		    "data": {
		    	"id":searchText,
   			 	"params_currency": currency
		    }
	  	}
	}
	var postData = {
		'cityid':{
			'info':postDataInfoCity,
			'list':postDataListCity
		},
		'moduleid':{
			'info':postDataInfoModule,
			'list':postDataListModule
		}
	}
	

  	// $('.searchIpt').val(searchText);
  	var postDataInfo = postData[type]['info'];
  	var postDataList = postData[type]['list'];
  	getCityInfo(postDataInfo);
  	searchTotalList(postDataList).then(function(){
  		$(".pagination").Page({
		    totalPages: pagerSet.totalPages,//total Pages
		    liNums: 16,//the li numbers(advice use odd)
		    activeClass: 'activP', //active class style
		    firstPage: '',//first button name
		    lastPage: '',//last button name
		    prv: '«',//prev button name
		    next: '»',//next button name
		    hasFirstPage: false,//whether has first button
		    hasLastPage: false,//whether has last button
		    hasPrv: true,//whether has prev button
		    hasNext: true,//whether has next button
		    initPage: initPage,
		    callBack : function(page){
		    	sessionStorage.setItem('initPage',page);
		    	var postDataListCopy = JSON.parse(JSON.stringify(postDataList));
		    	postDataListCopy.request.data.p=page;
		    	searchTotalList(postDataListCopy);
		    	// $('body').animate({scrollTop:'0'},500);
		    	$('body').scrollTop(0);
		    }
		});
  	});
})