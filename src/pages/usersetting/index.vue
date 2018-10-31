<template>
        <div id="user-setting">
            <div class="headImg" @click="changeImage">
                <image :src="detail.avatar" alt=""></image>
            </div>
            <div class="user_setting">
                <div class="code">
                    <div class="detail">昵称</div>
                    <input type="text" placeholder="填写您的昵称" @input="changeName" :value="detail.nick_name"/>
                </div>
                <div class="code">
                    <div class="detail">性别</div>
                    <picker :value=selectedIndex :range=list @change="change($event,1)">
                        <!--<div class="picker">{{list[selectedIndex]}}</div>-->
                        <input type="text" placeholder="选择你的性别" disabled  :value=list[selectedIndex] />
                        <div class="iconfont icon-Group98 under"></div>
                    </picker>
                    <!--<input type="text" placeholder="选择你的性别"/>-->
                </div>
                <div class="code">
                    <div class="detail">出生日期</div>
                    <picker mode="date"  :end=end @change="changeDate">
                        <input type="text" placeholder="请输入出生日期" disabled :value=birthdaydate />
                        <view class="iconfont icon-Group98 under"></view>
                    </picker>
                </div>
                <div class="code">
                    <div class="detail">QQ</div>
                    <input type="text" placeholder="请输入QQ号码" @input="changeQQ" :value="qq"/>
                </div>
                <div class="code">
                    <div class="detail">手机号码</div>
                    <input type="text"   disabled :value="mobile"/>
                    <span @click="changeMobile">更换号码</span>
                </div>
                <div class="code">
                    <div class="detail">邮箱</div>
                    <input type="text" placeholder="请输入邮箱" @input="changeEmail" :value="email"/>
                </div>
                <div class="code">
                    <div class="detail">上衣尺寸</div>
                    <picker :value=jackIndex :range=jacket  @change="change($event,2)">
                        <input type="text" placeholder="请输入上衣尺寸" disabled :value=jacket[jackIndex] />
                        <view class="iconfont icon-Group98 under"></view>
                    </picker>
                </div>
                <div class="code">
                    <div class="detail">裤子尺寸</div>
                    <picker :value=pantsIndex :range=pants  @change="change($event,3)">
                        <input type="text" placeholder="请输入裤子尺寸" disabled :value=pants[pantsIndex] />
                        <view class="iconfont icon-Group98 under"></view>
                    </picker>
                </div>
                <div class="code">
                    <div class="detail">鞋子尺寸</div>
                    <picker :value=shoesIndex :range=shoes  @change="change($event,4)">
                        <input type="text" placeholder="请输入鞋子尺寸" disabled :value=shoes[shoesIndex] />
                        <view class="iconfont icon-Group98 under"></view>
                    </picker>
                </div>
            </div>
            <div class="submit" @click="updateUserInfo">
                <button type="primary">确定</button>
            </div>
        </div>
</template>
<script>
    import { getUrl,is } from '../../utils';
    export default{
        data(){
            return{
                detail:{},
                list:[
                    '男',
                    '女',
                ],
                selectedIndex:"",
                birthdaydate:'',
                end:'',
                jacket:[
                    'XS',
                    'S',
                    'M',
                    'L',
                    'XL'
                ],
                pants:[
                    'XS',
                    'S',
                    'M',
                    'L',
                    'XL'
                ],
                shoes:[
                    35,36,37,38,39,410,41,42,43,44,45,46,47,48,49
                ],
                jackIndex:'',
                pantsIndex:'',
                shoesIndex:'',
                url: '',
                qq:'',
                mobile:'',
                email:''


            }
        },
        mounted(){
            this.getMe();
            var url = this.$root.$mp.query.url;
            if (url) {
                this.url = decodeURIComponent(url);
            };
            Date.prototype.format = function(fmt) {
                var o = {
                    "M+" : this.getMonth()+1,                 //月份
                    "d+" : this.getDate(),                    //日
                    "h+" : this.getHours(),                   //小时
                    "m+" : this.getMinutes(),                 //分
                    "s+" : this.getSeconds(),                 //秒
                    "q+" : Math.floor((this.getMonth()+3)/3), //季度
                    "S"  : this.getMilliseconds()             //毫秒
                };
                if(/(y+)/.test(fmt)) {
                    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
                }
                for(var k in o) {
                    if(new RegExp("("+ k +")").test(fmt)){
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                    }
                }
                return fmt;
            };
            var time = new Date().format("yyyy-MM-dd");
            this.end = time;
        },
        methods:{
            //手机号
            changeMobile(){
                wx.navigateTo({
                    url:'/pages/bindPhone/main'
                })
            },
            //邮箱
            changeEmail(e){
                this.email = e.target.value
            },
            //qq
            changeQQ(e){
                this.qq = e.target.value
            },
            //更换头像
            changeImage(){
                wx.chooseImage({
                    count:1,
                    success:res=> {
                        var tempFilePaths = res.tempFilePaths;
                        var token = this.$storage.get('user_token');
                        wx.uploadFile({
                            header: {
                                'content-type': 'multipart/form-data',
                                Authorization: token
                            },
                            url: this.$config.GLOBAL.baseUrl + 'api/users/upload/avatar',
                            filePath: tempFilePaths[0],
                            name: 'avatar_file',
                            success: rej => {
                                var result = JSON.parse(rej.data);
                                this.detail.avatar = result.data.url;
                            }
                        })
                    }
                })

            },
            changeName(e){
                    this.detail.nick_name = e.target.value
            },
            change:function(e,type){
                    if (type==1){
                        this.selectedIndex = e.target.value
                    } else if(type==2){
                        this.jackIndex = e.target.value
                    } else if(type==3){
                        this.pantsIndex = e.target.value
                    } else if(type==4){
                        this.shoesIndex = e.target.value
                    }
            },
            changeDate(e){
                    this.birthdaydate = e.target.value
            },
            //请求我的数据
            getMe(){
                var token = this.$storage.get('user_token');
                wx.showLoading({
                    title:"加载中",
                    mask:true
                });
                this.$http
                    .get(this.$config.GLOBAL.baseUrl+'api/me',{
                        include:'group,size'
                    },{
                        headers:{
                            Authorization:token
                        }
                    })
                    .then(res=>{
                        res=res.data;
                        if (res.status){
                            var info = res.data;
                            //性别
                            var sex = info.sex;
                             var sexIndex = this.list.findIndex(val=>{
                             return val == sex;
                             })
                             if(sexIndex== -1) sexIndex = '';

                             if (info.size) {
                                 // 上衣尺寸
                                 var jack = info.size.upper;
                                 var jackIndex = this.jacket.findIndex(val=>{
                                     return val = jack;
                                 })
                                 if (jackIndex == -1) jackIndex='';
                                 //下衣尺寸
                                 var pants = info.size.lower;
                                 var pantsIndex = this.pants.findIndex(val=>{
                                     return val = pants;
                                 })
                                 if (pantsIndex == -1) pantsIndex = '';
                                 //鞋子尺寸
                                 var shoes = info.size.shoes;
                                 var shoesIndex = this.shoes.findIndex(val=>{
                                     return val = shoes;
                                 })
                                 if (shoesIndex == -1) shoesIndex = '';
                             }

                            //修改数据
                            this.detail = res.data;
                            this.selectedIndex = sexIndex;
                            this.jackIndex = jackIndex;
                            this.pantsIndex = pantsIndex;
                            this.shoesIndex = shoesIndex;
                            this.birthdaydate = info.birthday;
                            this.qq = info.qq;
                            this.mobile = info.mobile;
                            this.email = info.email;
                        } else {
                            wx.showModal({
                                content:res.message || "请求失败",
                                showCancel:false
                            })
                        }
                        wx.hideLoading()
                    },err=>{
                        wx.showModal({
                            content: '请求失败，请重试',
                            showCancel: false,
                        })
                        wx.hideLoading()
                    })
            },
            //保存修改
            updateUserInfo(){
                var token = this.$storage.get('user_token')
                var message=null;
                if(!this.detail.nick_name){
                    message="请填写用户昵称";
                } else if(this.email !="" && !is.email(this.email)){
                    message="请填写正确的邮箱";
                }
                if(message){
                    wx.showModal({
                        content: message,
                        showCancel: false
                    });
                    return
                }
                this.$http
                    .post(this.$config.GLOBAL.baseUrl+'api/users/update/info',{
                        nick_name:this.detail.nick_name,
                        sex:this.list[this.selectedIndex],
                        avatar:this.detail.avatar,
                        birthday:this.birthdaydate,
                        qq:this.qq,
                        mobile:this.mobile,
                        email:this.email,
                        size:{
                            lower:this.pants[this.pantsIndex],
                            shoes:this.shoes[this.shoesIndex],
                            upper:this.jacket[this.jackIndex]
                        }
                    },{
                        headers:{
                            Authorization:token
                        }
                    })
                    .then(res=>{
                        var res = res.data;
                        if(res.status){
                            wx.showToast({
                                title:res.message,
                                duration: 1500,
                                success: res=> {
                                    console.log(res);
                                    setTimeout(() => {
                                        console.log(1);
                                        if (this.url) {
                                            wx.redirectTo({
                                                url: "/" + this.url
                                            })
                                        } else {
                                            wx.redirectTo({
                                                url: '/pages/user/main'
                                            })
                                        }

                                    }, 1500)
                                }
                            })
                        } else {
                            wx.showModal({
                                title:"提示",
                                content:"修改失败",
                            });
                        }
                    },err=>{
                        wx.showModal({
                            title:"提示",
                            content:"请求失败",
                        });
                    })
            }
        }
    }
</script>
<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";
    #user-setting{
        .headImg{
            position: relative;
            width: 90px;
            height: 90px;
            border: 1px solid #8d8d8d;
            //background-color: red;
            border-radius: 100%;
            display: block;
            margin: 20px auto;
            &:after{
                position: absolute;
                content: "";
                background: url("http://ovef29y3v.bkt.clouddn.com/ic_camer.png") no-repeat;
                width: 23px;
                height: 23px;
                bottom: 0px;
                right: 0px;
                background-size:100% 100%;
            }
            image{
                //width: 100%;
                //height: 100%;
                width: 90px;
                height: 90px;
                border-radius: 50%;
            }
        }
        .user_setting{
            background-color: #ffffff;
            .code{
                border-bottom: 1px solid #e5e5e5;
                padding: 10px 0 10px 0;
                display: flex;
                align-items: center;
                font-size: 14px;
                .detail{
                    padding-left: 10px;
                    width: 80px;
                    color: #a4a3a3;

                }
                input{
                    flex: 1;
                    color: #000000;
                }
                picker{
                    flex: 1;
                    position: relative;
                }
                .under{
                    position: absolute;
                    right: 15px;
                    top: 5px;
                    font-size: 10px;
                    color: #a4a3a3;
                }
                span{
                    padding: 0 15px;
                    color: #00b4ff;
                }
            }
        }
        .submit{
            width: 100%;
            position: fixed;
            bottom: 0px;
            button[type=primary] {
                color:#FFFFFF;
                background-color:@globalColor;
                border-radius: 0;
            }
        }
    }
</style>