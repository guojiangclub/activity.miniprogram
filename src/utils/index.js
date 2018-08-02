function formatNumber (n) {
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
    return val &&　/^[1-9]\d{4,12}$/.test(val);
  },
  name(val) {
    return val &&　/^[A-Za-z0-9\u4E00-\u9FA5_]{2,10}$/.test(val);
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


    var lastNum=val.substr(val.length-1,1);     //取出最后一位（与luhm进行比较）
    var first15Num=val.substr(0,val.length-1);  //前15或18位
    var newArr=[];
    for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
      newArr.push(first15Num.substr(i,1));
    }
    var arrJiShu=[];  //奇数位*2的积 <9
    var arrJiShu2=[]; //奇数位*2的积 >9

    var arrOuShu=[];  //偶数位数组
    for(var j=0;j<newArr.length;j++){
      if((j+1)%2==1){//奇数位
        if(parseInt(newArr[j])*2<9) {
          arrJiShu.push(parseInt(newArr[j])*2);
        } else {
          arrJiShu2.push(parseInt(newArr[j])*2);
        }
      } else {
        //偶数位
        arrOuShu.push(newArr[j]);
      }
    }

    var jishu_child1=[];//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2=[];//奇数位*2 >9 的分割之后的数组十位数
    for(var h=0;h<arrJiShu2.length;h++){
      jishu_child1.push(parseInt(arrJiShu2[h])%10);
      jishu_child2.push(parseInt(arrJiShu2[h])/10);
    }

    var sumJiShu=0; //奇数位*2 < 9 的数组之和
    var sumOuShu=0; //偶数位数组之和
    var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal;
    for(var m=0;m<arrJiShu.length;m++){
      sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
    }

    for(var n=0;n<arrOuShu.length;n++){
      sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
    }

    for(var p=0;p<jishu_child1.length;p++){
      sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
      sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);

    //计算Luhm值
    var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;
    var luhm= 10-k;

    return lastNum == luhm;
  }
};
/*获取当前页带参数的url*/
export function getUrl(){
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length-1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  var options = currentPage.options    //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for(var key in options){
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length-1)

  return encodeURIComponent(urlWithArgs)
};
// 页面登陆
export function pageLogin(url,callback){
  var token= wx.getStorageSync('user_token')
  if(!token){
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

export function formatTime (date) {
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


