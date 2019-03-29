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
	        url: base_url+"/webapi/city_list_api",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(Data),
	        dataType: "json",
	        success: function (res) {
	        	var data = res[0];
	        	$('.xs-intro-vr').css("background-image","url(" + data.image_url + ")");
	        	var partTit,partTitHK;
	        	partTitHK = data.name_hk;
	        	if(lang=='zh_cn'){
	        		partTit = data.name_cn;
	        	}else if(lang=='zh_hk'){
	        		partTit = data.name_hk;
	        	}else{
	        		partTit = data.name_us
	        	}
	        	var partTitHtml ='<p class="part-tit ft-24"><span class="grayStyle">'+partTit+'</span><span class="blueStyle i18n" name="Play"></span</p>';
	        	$('.part-tit').html(partTitHtml);
	        	$(document).attr("title",partTitHK+'旅遊-'+partTitHK+'景點-行書APP官網');
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
				
				$('.star').raty({
				  	score: function() {
					    return $(this).attr('data-score');
				  	},
				   	path: 'http://192.168.1.130:5656/view/assets/image/content',
				   	readOnly: true
				});
				execI18n();
				// layer.close(load1)
	        }
	    })  
	}
	function searchTotalList(Data){
		var promise = new Promise(function(resolve, reject){
			var load1=layer.load(2);
			$.ajax({
		        type: "POST",
		        async: true,//false同步 true 异步
		        url: base_url+"/webapi/city_search_api",
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
	//获取 上一个搜索页面传来的参数
	// jsp
	/*var searchUrl = window.location.href;
	var searchData = searchUrl.split("keys/");
  	var searchText = decodeURI(searchData[1]||''); */
  	
	// html 
	var initPage = sessionStorage.getItem('initPage');
	initPage=initPage>1?initPage:1;
  	var searchUrl = window.location.href;
  	var searchData = searchUrl.split("="); //截取 url中的“=”,获得“=”后面的参数
  	var searchText = decodeURI(searchData[1]||''); //decodeURI解码
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
	var postDataList = {
	  	"request": {
	    	"lang": lang,
		    "data": {
		    	"city_id": searchText,
   			 	"params_currency": currency,
   			 	"p": initPage
		    }
	  	}
	}
	var postDataInfo = {
	  	"request": {
	    	"lang": lang,
		    "data": {
		    	"id":searchText,
   			 	"params_currency": currency
		    }
	  	}
	}

  	// $('.searchIpt').val(searchText);
  	// seacch.html 排序
  	getCityInfo(postDataInfo);
  	searchTotalList(postDataList).then(function(){
  		$(".pagination").Page({
		    totalPages: pagerSet.totalPages,//total Pages
		    liNums: 5,//the li numbers(advice use odd)
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
		    	$('body').scrollTop(0);
		    }
		});
  	});
})
