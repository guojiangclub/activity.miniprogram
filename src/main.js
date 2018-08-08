import Vue from 'vue'
import App from './App'
import config from '@/utils/config';
import {cookieStorage} from '@/utils/index'
var Fly = require("flyio/dist/npm/wx")
var fly = new Fly;


Vue.prototype.$http = fly;
Vue.prototype.$config = config;
Vue.prototype.$storage = cookieStorage;


Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount();

var AppData = getApp();
AppData.textStatus = {
    0: '报名未开始',
    1: '活动报名中',
    2: '报名已截止',
    3: '活动已结束',
    4: '报名已截止',
    5: '活动已满额'
};
AppData.timefiter = function (v1,v2) {
    if(v1 && v2) {
        const weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            date1 = v1.substring(0,10),
            date2 = v2.substring(0,10),
            _date1 = date1.replace(/-/g,"."),
            _date2 = date2.replace(/-/g,"."),
            day1 = weekDay[new Date(date1).getDay()],
            day2 = weekDay[new Date(date2).getDay()],
            time1 = v1.substring(11,16),
            time2 = v2.substring(11,16);
        if(date1==date2){
            return _date1 +' '+ day1 +' '+ time1 + '-' + time2;
        }else{
            return _date1 +' '+ day1 +' '+ time1 + ' - ' + _date2 +' '+ day2 +' '+ time2;
        }
    }
}

export default {
    // 这个字段走 app.json
    config: {
        // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
        pages: [
            '^pages/index/main',
            'pages/myActivity/main',
            'pages/detail/main',
            'pages/register/main',
            'pages/login/main'
            'pages/register/main',
            'pages/map/main'
        ],
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#fff',
            navigationBarTitleText: 'WeChat',
            navigationBarTextStyle: 'black',
            backgroundColor: '#F3F3F3'
        }
    }
}
