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
//详情页按钮
AppData.textStatus = {
    0: '报名未开始',
    1: '活动报名中',
    2: '活动进行中',
    3: '活动已结束',
    4: '报名已截止',
    5: '活动已满额'
};
//详情页按钮样式
AppData.ac_status = function (v) {
    switch (v) {
        case 1:
            return 'red';
        case 2:
            return 'green';
        default:
            return 'grey';
    }
}
// 我的活动列表按钮
AppData.user_status_txt = function (s1,s2) {
    switch (s2) {
        case 0:
            return '待付款';
        case 1:
            switch (s1) {
                case 2:
                    return '立即签到';
                default:
                    return '未签到';
            }
            break;
        case 2:
            return '签到成功';
        case 3:
            return '取消成功';
        case 4:
            return '待审核';
    }
}
// 我的活动列表大按钮 class
AppData.user_status_class = function (s1,s2) {
    switch (s2) {
        case 0:
            return 'red';
        case 1:
            if( s1==2 ) {
                return 'blue';
            } else {
                return 'grey';
            }
            break;
        case 2:
            return 'blue';
        default:
            return 'grey';
    }
}
//我的报名详情 txt
AppData.register_status_txt = function (s1,s2) {
    switch (s2) {
        case 1:
            switch (s1) {
                case 1:
                    return '活动已报名';
                case 2:
                    return '活动进行中';
                case 3:
                    return '活动已结束';
                case 4:
                    return '报名已截止';
                case 5:
                    return '活动已满额';
            }
            break;
        case 2:
            return '活动已签到';
        case 3:
            return '报名已取消';
        case 4:
            return '活动待审核';
        case 0:
            return '活动待支付'
    }
}

//时间处理
AppData.timefiter = function (v1,v2) {
    if(v1 && v2) {
        const weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            date1 = v1.substring(0,10),
            date2 = v2.substring(0,10),
            _date1 = date1.replace(/-/g,"/"),
            _date2 = date2.replace(/-/g,"/"),
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
            'pages/login/main',
            'pages/register/main',
            'pages/enroll/main',
            'pages/pay/main',
            'pages/success/main',
            'pages/enrolmentDetail/main',
            'pages/myLeader/main'



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
