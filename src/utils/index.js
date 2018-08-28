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
export const cityArr = [
    ['ABCZQZZZZ','阿坝藏族羌族自治州'],
    ['AKSDQ','阿克苏地区'],
    ['ALES','阿拉尔市'],
    ['ALSM','阿拉善盟'],
    ['ALTDQ','阿勒泰地区'],
    ['ALDQ','阿里地区'],
    ['AKS','安康市'],
    ['AQS','安庆市'],
    ['ASS','安顺市'],
    ['AYS','安阳市'],
    ['ASS','鞍山市'],
    ['AM','澳门'],
    ['BYNES','巴彦淖尔市'],
    ['BYGLMGZZZ','巴音郭楞蒙古自治州'],
    ['BZS','巴中市'],
    ['BCS','白城市'],
    ['BSLZZZX','白沙黎族自治县'],
    ['BSS','白山市'],
    ['BYS','白银市'],
    ['BSS','百色市'],
    ['BBS','蚌埠市'],
    ['BTS','包头市'],
    ['BJS','宝鸡市'],
    ['BDS','保定市'],
    ['BSS','保山市'],
    ['BTLZMZZZX','保亭黎族苗族自治县'],
    ['BHS','北海市'],
    ['BJS','北京市'],
    ['BXS','本溪市'],
    ['BJDQ','毕节地区'],
    ['BZS','滨州市'],
    ['BZS','亳州市'],
    ['BETLMGZZZ','博尔塔拉蒙古自治州'],
    ['CZS','沧州市'],
    ['CDDQ','昌都地区'],
    ['CJHZZZZ','昌吉回族自治州'],
    ['CJLZZZX','昌江黎族自治县'],
    ['CCS','长春市'],
    ['CSS','长沙市'],
    ['CZS','长治市'],
    ['CDS','常德市'],
    ['CZS','常州市'],
    ['CHS','巢湖市'],
    ['CYS','朝阳市'],
    ['CZS','潮州市'],
    ['CZS','郴州市'],
    ['CDS','成都市'],
    ['CDS','承德市'],
    ['CMX','澄迈县'],
    ['CZS','池州市'],
    ['CFS','赤峰市'],
    ['CZS','崇左市'],
    ['CZS','滁州市'],
    ['CXYZZZZ','楚雄彝族自治州'],
    ['DZS','达州市'],
    ['DLBZZZZ','大理白族自治州'],
    ['DLS','大连市'],
    ['DQS','大庆市'],
    ['DTS','大同市'],
    ['DXALDQ','大兴安岭地区'],
    ['DDS','丹东市'],
    ['DZS','儋州市'],
    ['DHDZJPZZZZ','德宏傣族景颇族自治州'],
    ['DYS','德阳市'],
    ['DZS','德州市'],
    ['DQCZZZZ','迪庆藏族自治州'],
    ['DAX','定安县'],
    ['DXS','定西市'],
    ['DFS','东方市'],
    ['DGS','东莞市'],
    ['DYS','东营市'],
    ['EEDSS','鄂尔多斯市'],
    ['EZS','鄂州市'],
    ['ESTJZMZZZZ','恩施土家族苗族自治州'],
    ['FCGS','防城港市'],
    ['FSS','佛山市'],
    ['FZS','福州市'],
    ['FSS','抚顺市'],
    ['FZS','抚州市'],
    ['FXS','阜新市'],
    ['FYS','阜阳市'],
    ['GNCZZZZ','甘南藏族自治州'],
    ['GZCZZZZ','甘孜藏族自治州'],
    ['GZS','赣州市'],
    ['GXS','高雄市'],
    ['GYS','固原市'],
    ['GAS','广安市'],
    ['GYS','广元市'],
    ['GZS','广州市'],
    ['GGS','贵港市'],
    ['GYS','贵阳市'],
    ['GLS','桂林市'],
    ['GLCZZZZ','果洛藏族自治州'],
    ['HEBS','哈尔滨市'],
    ['HMDQ','哈密地区'],
    ['HBCZZZZ','海北藏族自治州'],
    ['HDDQ','海东地区'],
    ['HKS','海口市'],
    ['HNCZZZZ','海南藏族自治州'],
    ['HXMGZCZZZZ','海西蒙古族藏族自治州'],
    ['HDS','邯郸市'],
    ['HZS','汉中市'],
    ['HZS','杭州市'],
    ['HFS','合肥市'],
    ['HTDQ','和田地区'],
    ['HCS','河池市'],
    ['HYS','河源市'],
    ['HZS','菏泽市'],
    ['HZS','贺州市'],
    ['HBS','鹤壁市'],
    ['HGS','鹤岗市'],
    ['HHS','黑河市'],
    ['HSS','衡水市'],
    ['HYS','衡阳市'],
    ['HHHNZYZZZZ','红河哈尼族彝族自治州'],
    ['HHHTS','呼和浩特市'],
    ['HLBES','呼伦贝尔市'],
    ['HZS','湖州市'],
    ['HLDS','葫芦岛市'],
    ['HHS','怀化市'],
    ['HAS','淮安市'],
    ['HBS','淮北市'],
    ['HNS','淮南市'],
    ['HGS','黄冈市'],
    ['HNCZZZZ','黄南藏族自治州'],
    ['HSS','黄山市'],
    ['HSS','黄石市'],
    ['HZS','惠州市'],
    ['JXS','鸡西市'],
    ['JLS','基隆市'],
    ['JAS','吉安市'],
    ['JLS','吉林市'],
    ['JNS','济南市'],
    ['JNS','济宁市'],
    ['JYS','济源市'],
    ['JMSS','佳木斯市'],
    ['JXS','嘉兴市'],
    ['JYS','嘉义市'],
    ['JYGS','嘉峪关市'],
    ['JMS','江门市'],
    ['JZS','焦作市'],
    ['JYS','揭阳市'],
    ['JCS','金昌市'],
    ['JHS','金华市'],
    ['JZS','锦州市'],
    ['JCS','晋城市'],
    ['JZS','晋中市'],
    ['JMS','荆门市'],
    ['JZS','荆州市'],
    ['JDZS','景德镇市'],
    ['JJS','九江市'],
    ['JQS','酒泉市'],
    ['KSDQ','喀什地区'],
    ['KFS','开封市'],
    ['KLMYS','克拉玛依市'],
    ['KZLSKEKZZZZ','克孜勒苏柯尔克孜自治州'],
    ['KMS','昆明市'],
    ['LSS','拉萨市'],
    ['LBS','来宾市'],
    ['LWS','莱芜市'],
    ['LZS','兰州市'],
    ['LFS','廊坊市'],
    ['LDLZZZX','乐东黎族自治县'],
    ['LSS','乐山市'],
    ['LJS','丽江市'],
    ['LSS','丽水市'],
    ['LYGS','连云港市'],
    ['LSYZZZZ','凉山彝族自治州'],
    ['LYS','辽阳市'],
    ['LYS','辽源市'],
    ['LCS','聊城市'],
    ['LZDQ','林芝地区'],
    ['LCS','临沧市'],
    ['LFS','临汾市'],
    ['LGX','临高县'],
    ['LXHZZZZ','临夏回族自治州'],
    ['LYS','临沂市'],
    ['LSLZZZX','陵水黎族自治县'],
    ['LZS','柳州市'],
    ['LAS','六安市'],
    ['LPSS','六盘水市'],
    ['LYS','龙岩市'],
    ['LNS','陇南市'],
    ['LDS','娄底市'],
    ['LZS','泸州市'],
    ['LLS','吕梁市'],
    ['LYS','洛阳市'],
    ['LHS','漯河市'],
    ['MASS','马鞍山市'],
    ['MMS','茂名市'],
    ['MSS','眉山市'],
    ['MZS','梅州市'],
    ['MYS','绵阳市'],
    ['MDJS','牡丹江市'],
    ['NJS','内江市'],
    ['NQDQ','那曲地区'],
    ['NCS','南昌市'],
    ['NCS','南充市'],
    ['NJS','南京市'],
    ['NNS','南宁市'],
    ['NPS','南平市'],
    ['NTS','南通市'],
    ['NYS','南阳市'],
    ['NBS','宁波市'],
    ['NDS','宁德市'],
    ['NJLSZZZZ','怒江傈僳族自治州'],
    ['PZHS','攀枝花市'],
    ['PJS','盘锦市'],
    ['PDSS','平顶山市'],
    ['PLS','平凉市'],
    ['PXS','萍乡市'],
    ['PTS','莆田市'],
    ['PYS','濮阳市'],
    ['PES','普洱市'],
    ['QTHS','七台河市'],
    ['QQHES','齐齐哈尔市'],
    ['QJS','潜江市'],
    ['QDNMZDZZZZ','黔东南苗族侗族自治州'],
    ['QNBYZMZZZZ','黔南布依族苗族自治州'],
    ['QXNBYZMZZZZ','黔西南布依族苗族自治州'],
    ['QZS','钦州市'],
    ['QHDS','秦皇岛市'],
    ['QDS','青岛市'],
    ['QYS','清远市'],
    ['QYS','庆阳市'],
    ['QHS','琼海市'],
    ['QZLZMZZZX','琼中黎族苗族自治县'],
    ['QJS','曲靖市'],
    ['QZS','衢州市'],
    ['QZS','泉州市'],
    ['RKZDQ','日喀则地区'],
    ['RZS','日照市'],
    ['SMXS','三门峡市'],
    ['SMS','三明市'],
    ['SYS','三亚市'],
    ['SNDQ','山南地区'],
    ['STS','汕头市'],
    ['SWS','汕尾市'],
    ['SLS','商洛市'],
    ['SQS','商丘市'],
    ['SHS','上海市'],
    ['SRS','上饶市'],
    ['SGS','韶关市'],
    ['SYS','邵阳市'],
    ['SXS','绍兴市'],
    ['SZS','深圳市'],
    ['SNJLQ','神农架林区'],
    ['SYS','沈阳市'],
    ['SYS','十堰市'],
    ['SHZS','石河子市'],
    ['SJZS','石家庄市'],
    ['SZSS','石嘴山市'],
    ['SYSS','双鸭山市'],
    ['SZS','朔州市'],
    ['SPS','四平市'],
    ['SYS','松原市'],
    ['SZS','苏州市'],
    ['SQS','宿迁市'],
    ['SZS','宿州市'],
    ['SHS','绥化市'],
    ['SZS','随州市'],
    ['SNS','遂宁市'],
    ['TCDQ','塔城地区'],
    ['TBS','台北市'],
    ['TNS','台南市'],
    ['TZS','台中市'],
    ['TZS','台州市'],
    ['TYS','太原市'],
    ['TAS','泰安市'],
    ['TZS','泰州市'],
    ['TSS','唐山市'],
    ['TJS','天津市'],
    ['TMS','天门市'],
    ['TSS','天水市'],
    ['TLS','铁岭市'],
    ['THS','通化市'],
    ['TLS','通辽市'],
    ['TCS','铜川市'],
    ['TLS','铜陵市'],
    ['TRDQ','铜仁地区'],
    ['TMSKS','图木舒克市'],
    ['TLFDQ','吐鲁番地区'],
    ['TCX','屯昌县'],
    ['WNS','万宁市'],
    ['WHS','威海市'],
    ['WFS','潍坊市'],
    ['WNS','渭南市'],
    ['WZS','温州市'],
    ['WCS','文昌市'],
    ['WSZZMZZZZ','文山壮族苗族自治州'],
    ['WHS','乌海市'],
    ['WLCBS','乌兰察布市'],
    ['WLMQS','乌鲁木齐市'],
    ['WXS','无锡市'],
    ['WZS','吴忠市'],
    ['WHS','芜湖市'],
    ['WZS','梧州市'],
    ['WJQS','五家渠市'],
    ['WZSS','五指山市'],
    ['WHS','武汉市'],
    ['WWS','武威市'],
    ['XAS','西安市'],
    ['XNS','西宁市'],
    ['XSBNDZZZZ','西双版纳傣族自治州'],
    ['XLGLM','锡林郭勒盟'],
    ['XMS','厦门市'],
    ['XTS','仙桃市'],
    ['XNS','咸宁市'],
    ['XYS','咸阳市'],
    ['XG','香港'],
    ['XTS','湘潭市'],
    ['XXTJZMZZZZ','湘西土家族苗族自治州'],
    ['XFS','襄樊市'],
    ['XGS','孝感市'],
    ['XZS','忻州市'],
    ['XXS','新乡市'],
    ['XYS','新余市'],
    ['XZS','新竹市'],
    ['XYS','信阳市'],
    ['XAM','兴安盟'],
    ['XTS','邢台市'],
    ['XZS','徐州市'],
    ['XCS','许昌市'],
    ['XCS','宣城市'],
    ['YAS','雅安市'],
    ['YTS','烟台市'],
    ['YAS','延安市'],
    ['YBCXZZZZ','延边朝鲜族自治州'],
    ['YCS','盐城市'],
    ['YZS','扬州市'],
    ['YJS','阳江市'],
    ['YQS','阳泉市'],
    ['YCS','伊春市'],
    ['YLHSKZZZ','伊犁哈萨克自治州'],
    ['YBS','宜宾市'],
    ['YCS','宜昌市'],
    ['YCS','宜春市'],
    ['YYS','益阳市'],
    ['YCS','银川市'],
    ['YTS','鹰潭市'],
    ['YKS','营口市'],
    ['YZS','永州市'],
    ['YLS','榆林市'],
    ['YLS','玉林市'],
    ['YSCZZZZ','玉树藏族自治州'],
    ['YXS','玉溪市'],
    ['YYS','岳阳市'],
    ['YFS','云浮市'],
    ['YCS','运城市'],
    ['ZZS','枣庄市'],
    ['ZJS','湛江市'],
    ['ZJJS','张家界市'],
    ['ZJKS','张家口市'],
    ['ZYS','张掖市'],
    ['ZZS','漳州市'],
    ['ZTS','昭通市'],
    ['ZQS','肇庆市'],
    ['ZJS','镇江市'],
    ['ZZS','郑州市'],
    ['ZSS','中山市'],
    ['ZWS','中卫市'],
    ['ZQS','重庆市'],
    ['ZSS','舟山市'],
    ['ZKS','周口市'],
    ['ZZS','株洲市'],
    ['ZHS','珠海市'],
    ['ZMDS','驻马店市'],
    ['ZYS','资阳市'],
    ['ZBS','淄博市'],
    ['ZGS','自贡市'],
    ['ZYS','遵义市']
];


