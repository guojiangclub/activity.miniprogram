function formatNumber(n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}
export const is = {
    env() {
        return process.env.NODE_ENV
    },
    has(val) {
        return !!val;
    },
    isNum(val){
        return val && /^[0-9]$/.test(val);
    },
    not(val) {
        return !val;
    },
    empty(val) {
        return val === '';
    },
    age(val){
        return val && /^[0-9]{1,2}$/.test(val);
    },
    equal(v1, v2) {
        return v1 === v2;
    },
    qq(val) {
        return val && /^[1-9]\d{4,12}$/.test(val);
    },
    name(val) {
        return val && /^[A-Za-z0-9\u4E00-\u9FA5_]{2,10}$/.test(val);
    },
    mobile(val) {
        return val && /^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|66|7[^249\D]|8\d|9[89])\d{8}$/.test(val);
    },
    fifteen(val) {
        return val && /^[\d\-_\+]{2,15}$/.test(val);
    },
    email(val) {
        return val && /^[a-zA-Z0-9_\-\.]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val);
    },
    password(val) {
        return val && val.length && val.length > 5 && !/^\d+$/.test(val);
    },
    bank(val) {
        if (!val) return false;
        val = String(val);


        var lastNum = val.substr(val.length - 1, 1);     //取出最后一位（与luhm进行比较）
        var first15Num = val.substr(0, val.length - 1);  //前15或18位
        var newArr = [];
        for (var i = first15Num.length - 1; i > -1; i--) {    //前15或18位倒序存进数组
            newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = [];  //奇数位*2的积 <9
        var arrJiShu2 = []; //奇数位*2的积 >9

        var arrOuShu = [];  //偶数位数组
        for (var j = 0; j < newArr.length; j++) {
            if ((j + 1) % 2 == 1) {//奇数位
                if (parseInt(newArr[j]) * 2 < 9) {
                    arrJiShu.push(parseInt(newArr[j]) * 2);
                } else {
                    arrJiShu2.push(parseInt(newArr[j]) * 2);
                }
            } else {
                //偶数位
                arrOuShu.push(newArr[j]);
            }
        }

        var jishu_child1 = [];//奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = [];//奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
            jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
            jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }

        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
        var sumOuShu = 0; //偶数位数组之和
        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal;
        for (var m = 0; m < arrJiShu.length; m++) {
            sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }

        for (var n = 0; n < arrOuShu.length; n++) {
            sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }

        for (var p = 0; p < jishu_child1.length; p++) {
            sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
            sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        }
        //计算总和
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

        //计算Luhm值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhm = 10 - k;

        return lastNum == luhm;
    },
    identity_no(code){
        var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
        var tip = "";
        var pass= true;

        if(!code || !/^[1-9]\d{5}((1[89]|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dx]$/i.test(code)){
            tip = "身份证号格式错误";
            pass = false;
        }

        else if(!city[code.substr(0,2)]){
            tip = "地址编码错误";
            pass = false;
        }

        else{
            //18位身份证需要验证最后一位校验位
            if(code.length == 18){
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                //校验位
                var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++)
                {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if(parity[sum % 11] != code[17]){
                    tip = "校验位错误";
                    pass =false;
                }
            }
        }
        return pass;
    }
};
/*获取当前页带参数的url*/
export function getUrl() {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var options = currentPage.options    //如果要获取url中所带的参数可以查看options

    //拼接url的参数
    var urlWithArgs = url + '?'
    for (var key in options) {
        var value = options[key]
        urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

    return encodeURIComponent(urlWithArgs)
};


// 时间戳
const timeMap={
    y: 31536000000,
    m: 2592000000,
    d: 86400000,
    h: 3600000,
    n: 60000,
    s: 1000
};

//缓存模块  时间可以是1y 1m 1d.. 还有毫秒数
export const cookieStorage = {
    set: function (key, value, time) {
        let data = {};
        data.data = value;
        let timestamp = "";
        time += "";
        // 缓存时间设置
        if (time) {
            var last = time.charAt(time.length - 1);
            console.log(last);
            if (!is.isNum(last)) {
                timestamp = (time.slice(0, time.length - 1)) * (timeMap[last]) + new Date().getTime();
            }
            else {
                timestamp = time * 1 + new Date().getTime();
            }
        }
        else {
            timestamp = null;
        }
        data.expire = timestamp;
        wx.setStorageSync(key, data);
        console.log(timestamp);
    },
    get: function (key) {
        if(!wx.getStorageSync(key)){
            return null;
        }
        let data=wx.getStorageSync(key),
            expireTime=data.expire;
        if(expireTime){
            if(expireTime>new Date().getTime()){
                return data.data;
            }else{
                this.clear(key);
                return null;
            }
        }
        else{
            return data.data;
        }
    },
    clear: function (key) {
        wx.removeStorageSync(key);
    }
}

// 页面登陆
export function pageLogin(url, callback) {
    var token = wx.getStorageSync('user_token')
    if (!token) {
        var pageLen = getCurrentPages().length;
        if (pageLen > 8) {
            wx.reLaunch({
                url: '/pages/loginType/main?url=' + url
            })
        } else {
            wx.navigateTo({
                url: '/pages/loginType/main?url=' + url
            })
        }
    } else {
        callback && callback(token);
    }
}

export function formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    const t1 = [year, month, day].map(formatNumber).join('/')
    const t2 = [hour, minute, second].map(formatNumber).join(':')

    return `${t1} ${t2}`
}


