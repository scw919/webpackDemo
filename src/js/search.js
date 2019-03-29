require('../less/plugin/bootstrap.css');
require('../less/plugin/swiper.min.css');
require('../js/layer/theme/default/layer.css');
require('../less/plugin/jquery.page.css');
require('../less/plugin/rangeslider.css');
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
    $('.price-sure').on('click',function(){
        var priceVal = $('[data-rangeslider]').val();
        searchInfo.price=priceVal=='2000'?'':priceVal;
        postData['request']['data'].p=1;
        initPage=1;
        sessionStorage.removeItem('initPage');
        searchCallback(postData);
    })
    function searchActList(Data){
        var promise = new Promise(function(resolve,reject){
            var load1=layer.load(2);
            $.ajax({
                type: "POST",
                async: true,//false同步 true 异步
                url: base_url+"webapi/explore_search_api",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(Data),
                dataType: "json",
                success: function (res) {
                    var data = res;
                    totalData = data.results;
                    pagerSet.total = data.row_total;
                    pagerSet.totalPages = Math.ceil(pagerSet.total/pagerSet.pageSize);
                    actList.data=filterActivity(totalData);
                    htmlActList = itemtpl(actList);
                    $('.search-result-list').html(htmlActList);
                    resolve()
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
                }     
            });
        })
        return promise;
    }
    
    //获取 上一个搜索页面传来的参数 
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
    var totalData=[],actList={data:[]},htmlActList;
    var pagerSet={
        total:0,
        curpage:1,
        pageSize:16,
        totalPages:0
    };
    var priceVal = $('[data-rangeslider]').val();
    priceVal=priceVal=='2000'?'':priceVal;
    var searchInfo={
        "keys": searchText,
        "price": priceVal,
        "hotsort": "2",
        "soldsort": "0",
        "newsort": "0",
        "pricesort": "0",
        "params_currency": currency,
        "p": initPage
    };
    var postData = {
        "request": {
            "lang": lang,
            "data": searchInfo
        }
    }
    $('.searchIpt').val(searchText);
    // seacch.html 排序
    $('.turns-btn-box').on('click','.turns-btn', function(){
        initPage = sessionStorage.getItem('initPage');
        initPage=initPage>1?initPage:1;
        var _this=$(this);
        var priceVal = $('[data-rangeslider]').val();
        priceVal=priceVal=='2000'?'':priceVal;
        if(_this.hasClass('t-b-price')){
            if(_this.hasClass('active')){
                var value = parseInt(_this.attr('data-value'));
                switch(value){
                    case 1:
                        _this.find('.glyphicon').removeClass('active').eq(1).addClass('active');
                        _this.attr('data-value',2)
                        break;
                    case 2:
                        _this.find('.glyphicon').removeClass('active').eq(0).addClass('active');
                        _this.attr('data-value',1)
                        break;
                }
            }else{
                _this.siblings('.active').removeClass('active');
                _this.addClass('active');
                _this.find('.glyphicon').removeClass('active').eq(0).addClass('active');
                _this.attr('data-value',1)
            }
            searchInfo={
                "keys": searchText,
                "price": $('[data-rangeslider]').val(),
                "hotsort": "0",
                "soldsort": "0",
                "newsort": "0",
                "pricesort": $('.t-b-price').attr('data-value'),
                "params_currency": currency,
                "p": initPage,
            }
        }else{
            if(_this.hasClass('t-b-human')){
                searchInfo={
                    "keys": searchText,
                    "price": $('[data-rangeslider]').val(),
                    "hotsort": "2",
                    "soldsort": "0",
                    "newsort": "0",
                    "pricesort": "0",
                    "params_currency": currency,
                    "p": initPage,
                }
            }else if(_this.hasClass('t-b-sales')){
                searchInfo={
                    "keys": searchText,
                    "price": $('[data-rangeslider]').val(),
                    "hotsort": "0",
                    "soldsort": "2",
                    "newsort": "0",
                    "pricesort": "0",
                    "params_currency": currency,
                    "p": initPage,
                }
            }else if(_this.hasClass('t-b-new')){
                searchInfo={
                    "keys": searchText,
                    "price": $('[data-rangeslider]').val(),
                    "hotsort": "0",
                    "soldsort": "0",
                    "newsort": "2",
                    "pricesort": "0",
                    "params_currency": currency,
                    "p": initPage,
                }
            }
            _this.siblings('.active').removeClass('active');
            _this.addClass('active');
        }
        searchInfo.price=priceVal;
        postData.request.data = searchInfo  ;           
        searchCallback(postData);
    })
    function searchCallback(postData){
        searchActList(postData).then(function(){
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
                    var postDataListCopy = JSON.parse(JSON.stringify(postData));
                    postDataListCopy.request.data.p=page;
                    searchActList(postDataListCopy);
                    $('body').scrollTop(0);
                }
            });
        });
    }
    // searchActList(postData);
    searchCallback(postData);
    
})