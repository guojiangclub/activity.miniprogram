<template>
    <div id="user">
        <!--<div class="banner">
            <div class="set" @click="jumpIndex('setting')">
                <image src="http://ovef29y3v.bkt.clouddn.com/seting.png"></image>
            </div>
            <div class="avatar" v-if="!token" @click="jumpPath('/pages/register/main')">
                <div class="text">登录/注册</div>
            </div>
            <div class="avatar" v-if="token">
                <div class="img">
                    <image :src=info.avatar></image>
                </div>
                <div class="nick-name">{{info.nick_name}}</div>
            </div>
        </div>-->
        <div class="navbar">
            <div class="avatar" @click="jumpLogin">
                <image :src="info.avatar" v-if="token&& info.user_info_fill"></image>
                <image src="https://ibrand-miniprogram.oss-cn-hangzhou.aliyuncs.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F/%E5%A4%B4%E5%83%8F_%E7%94%BB%E6%9D%BF%201.png" v-else></image>
            </div>
            <div class="nick-name" @click="jumpLogin">
                <block v-if="token && info.user_info_fill">
                    {{info.nick_name}}
                </block>
                <block v-if="token && init && !info.user_info_fill">
                    点击完善信息
                </block>
                <block v-if="!token">
                    点击登录
                </block>
            </div>
            <div class="iconfont icon-shezhi setting" v-if="token && info.user_info_fill"  @click="jumpIndex('setting')"></div>

            <button open-type="getUserInfo" @getuserinfo="bindUserInfo" v-if="token && !info.user_info_fill">

            </button>
        </div>
        <!--<button class="binding__phone binding__user" open-type="getUserInfo" @getuserinfo="bindUserInfo" v-if="token && !info.user_info_fill && init">
            <i class="iconfont icon-warning"></i>
            <view class="phone-text">请完善个人信息</view>
            &lt;!&ndash;<i class="iconfont icon-Chevron"></i>&ndash;&gt;
        </button>-->
        <!--<div class="content">
            <div class="sign-up">
                <div class="title mx-1px-bottom" @click="jump(0)">
                    <div class="txt">我的活动</div>
                    <div class="iconfont icon-Group104"></div>
                </div>
                <div class="status-box">
                    <div class="item" @click="jump(2)">
                        <div class="iconfont icon-jinhangzhong"></div>
                        <div class="txt">进行中</div>
                    </div>
                    <div class="item" @click="jump(1)">
                        <div class="iconfont icon-weikaishi"></div>
                        <div class="txt">未开始</div>
                    </div>
                    <div class="item" @click="jump(3)">
                        <div class="iconfont icon-yijieshu"></div>
                        <div class="txt">已结束</div>
                    </div>
                    <div class="item" @click="jump(4)">
                        <div class="iconfont icon-yiquxiao"></div>
                        <div class="txt">已取消</div>
                    </div>
                </div>
            </div>
            <div class="leader" v-if="info.coach">
                <div class="title" @click="jumpIndex('list')">
                    <div class="txt">我带队的活动</div>
                    <div class="iconfont icon-Group104"></div>
                </div>
            </div>
        </div>-->
        <div class="commets">
            <div class="title mx-1px-bottom" @click="jump(0)">
                <div class="txt">我的活动</div>
                <div class="iconfont icon-jiantou"></div>
            </div>
            <div class="content">
                <div class="item" @click="jump(2)">
                    <div class="top"><span class="iconfont icon-jinhangzhong"></span></div>
                    <div class="txt">进行中</div>
                </div>
                <div class="item"  @click="jump(1)">
                    <div class="top"><span class="iconfont icon-weikaishi"></span></div>
                    <div class="txt">未开始</div>
                </div>
                <div class="item"@click="jump(3)">
                    <div class="top"><span class="iconfont icon-yijieshu"></span></div>
                    <div class="txt">已结束</div>
                </div>
                <div class="item"  @click="jump(4)">
                    <div class="top"><span class="iconfont icon-yiquxiao"></span></div>
                    <div class="txt">已取消</div>
                </div>
            </div>

        </div>
        <div class="leader" v-if="info.coach">
            <div class="title" @click="jumpIndex('list')">
                <div class="txt">我带队的活动</div>
                <div class="iconfont icon-Group104"></div>
            </div>
        </div>
       <!-- <div class="info-detail">
            <div class="item" @click="jumpPath()">
                <div class="number"><span>{{marketInfo.favorite || 0}}</span></div>
                <div>收藏</div>
            </div>
           &lt;!&ndash; <div class="item">
                <div class="number"><span>0</span></div>
                <div>地址</div>
            </div>
            <div class="item">
                <div class="number"><span>0</span></div>
                <div>余额</div>
            </div>&ndash;&gt;
            <div class="item" @click="jumpPath('/pages/myPoint/main')">
                <div class="number"><span>{{marketInfo.point || 0}}</span></div>
                <div>积分</div>
            </div>
            <div class="item" @click="jumpPath('/pages/myCoupon/main')">
                <div class="number"><span>{{marketInfo.coupon || 0}}</span></div>
                <div>优惠券</div>
            </div>
        </div>
        <div class="section-serve">
            <div class="title mx-1px-bottom">我的服务</div>
            <div class="server-box mx-1px-bottom">
                <navigator target="miniProgram" hover-class="none" app-id="wx38e537a9de6d096a" class="item">
                    <div class="iconfont icon-wanyoujingxuan info mall"></div>
                    <div>万有会员</div>
                </navigator>

                <navigator target="miniProgram" hover-class="none"  app-id="wx8eed5123f76a1cf2" class="item">
                    <div class="iconfont icon-wanyoulinli info team"></div>
                    <div>万有严选</div>
                </navigator>
            </div>
        </div>-->
        <div class="tabbar">
            <div class="mx-1px-right" @click="jumpList">活动列表</div>
            <div class="active">个人中心</div>
        </div>
    </div>
</template>
<script>
    import { getUrl } from '../../utils';
    export default{
        data(){
            return{
                info:{},
                token:'',
                init: false,
                code: '',
                marketInfo:''
            }
        },
        mounted(){
            var token = this.$storage.get('user_token');
            this.token = token;
           if(token){
               this.getMe();
               // this.getMarket();
           }
        },
        onShow() {
            if (this.code) {
                wx.checkSession({
                    success: res => {
                        if (res.errMsg != 'checkSession:ok') {
                            this.getCode();
                        }
                    }
                })
            } else {
                this.getCode();
            }
        },
        methods:{
            //请求收藏 积分 优惠券信息
            getMarket(){
                this.$http.get(this.$config.GLOBAL.baseUrl+'api/users/market/ucenter',{
                    type:'activity'
                },{
                    headers:{
                        Authorization: this.token
                    }
                }).then(res=>{
                    res = res.data;
                    if (res.status){
                        this.marketInfo = res.data;
                    } else {
                        wx.showModal({
                            content: res.message || '服务器有点小拥挤，请重试！',
                            showCancel: false
                        })
                    }
                },err=>{
                    wx.showModal({
                        content: '服务器有点小拥挤，请重试！',
                        showCancel: false
                    })
                })
            },
            // 跳到首页
            jumpList(){
                wx.reLaunch({
                    url:'/pages/index/main'
                })
            },
            jumpPath(path) {
                if(!path) {
                    return
                }
                var token = this.$storage.get('user_token');
                if (!token) {
                    this.jumpLogin();
                    return
                }

                wx.navigateTo({
                    url: path
                })
            },

            jumpLogin() {
                console.log(1);
                var token = this.$storage.get('user_token');
                if (token) {
                    return
                }
                wx.navigateTo({
                    url: '/pages/register/main?url=' + getUrl()
                })
            },
            //跳到我带队的活动
            jumpIndex(type){
                var token = this.$storage.get('user_token');
                if(token){
                    if(type == 'list'){
                        wx.navigateTo({
                            url:'/pages/myLeader/main'
                        })
                    } else {
                        wx.navigateTo({
                            url:'/pages/usersetting/main'
                        })
                    }

                } else {
                    var url = getUrl();
                    wx.showModal({
                        content: '请先登录',
                        success: res => {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: '/pages/register/main?url=' + url
                                })
                            }
                        }
                    })
                }
            },
            //跳到我的活动
            jump(type){
                var token = this.$storage.get('user_token');
                if(token){
                    wx.navigateTo({
                        url:'/pages/myActivity/main?type='+type
                    })
                } else {
                    var url = getUrl();
                    wx.showModal({
                        content: '请先登录',
                        success: res => {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: '/pages/register/main?url=' + url
                                })
                            }
                        }
                    })
                }
            },
            //请求我的数据
            getMe(){
                var token = this.$storage.get('user_token');
                wx.showLoading({
                    title:"加载中",
                    mask:true
                });
                this.$http
                    .get(this.$config.GLOBAL.baseUrl+'api/me',{},{
                        headers:{
                            Authorization:token
                        }
                    })
                    .then(res=>{
                        res=res.data;
                        if (res.status){
                            this.info = res.data;
                            this.init = true;
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
            getCode() {
                wx.login({
                    success: res => {
                        if (res.code) {
                            this.code = res.code;
                        }
                    }
                })
            },
            bindUserInfo(e) {
                if (e.mp.detail.encryptedData) {
                    e.mp.detail.code = this.code;
                    e.mp.detail.app_type = 'activity';
                    this.updateUserInfo(e.mp.detail)
                }
            },
            updateUserInfo(data) {
                wx.showLoading({
                    title: '更新中',
                    mask: true
                })
                var token = this.$storage.get('user_token');
                this.$http
                    .get(this.$config.GLOBAL.baseUrl + 'api/user/bindUserMiniInfo', data, {
                        headers:{
                            Authorization:token
                        }
                    })
                    .then(res => {
                        res = res.data;
                        if (res.status) {
                            this.getMe();
                        } else {
                            wx.showModal({
                                content: res.message || '请求失败',
                                showCancel: false
                            })
                            this.getCode();
                        }
                        wx.hideLoading();
                    }, err => {
                        wx.showModal({
                            content: '请求失败',
                            showCancel: false
                        })
                        this.getCode();
                        wx.hideLoading();
                    })
            },
        }
    }
</script>
<style rel="stylesheet/less" lang="less" type="text/less">
    @import "../../../static/global.less";
    #user{

        /*.banner{
            height: 175px;
            background-color: @globalColor;
            .set{
                padding:20px 15px 0 15px;
                image{
                    width: 21px;
                    height: 20px;
                }

            }
            .avatar{
                text-align: center;
                .img{
                    width:84px;
                    height:84px;
                    display:inline-block;
                    overflow:visible;
                    border-radius:100%;
                    border:2px solid #FFFFFF;
                    image{
                       width: 84px;
                        height: 84px;
                        border-radius: 50%;
                    }

                }
                .nick-name{
                    color:#FFFFFF;
                    font-size: 16px;
                }
                .text{
                    font-size: 25px;
                    color: #FFFFFF;
                    line-height: 80px;
                }
            }
        }*/
        .navbar {
            position: relative;
            padding: 0px 22px 0px 22px;
            display: flex;
            align-items: center;
            height: 154px;
            background-image: url("https://ibrand-miniprogram.oss-cn-hangzhou.aliyuncs.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F/22%20copy.png");
            background-size: cover;
            background-color: @globalColor;
            .setting{
                position: absolute;
                color:#FFFFFF;
                top: 15px;
                right: 15px;
                font-size: 22px;
            }
            .avatar {
                width: 70px;
                height: 70px;
                border-radius: 100%;
                background: #EDF2FC;
                border: 2px solid #ffffff;
                image {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }
            .nick-name {
                font-size: 16px;
                color: #ffffff;
                line-height: 22px;
                flex: 1;
                margin-left: 28px;
            }
            /*&::after {
                content: '';
                position: absolute;
                width: 0px;
                height: 0px;
                border-bottom: 15px solid #F3F3F3;
                border-right: 18px solid transparent;
                bottom: 0;
                left: 0;
            }
            &::before {
                content: '';
                position: absolute;
                width: 0px;
                height: 0px;
                border-bottom: 15px solid #F3F3F3;
                border-left: 18px solid transparent;
                bottom: 0;
                right: 0;
            }*/
        }
        //绑定手机号
        .binding__phone{
            padding: 10px 15px;
            background: #FBF6DC;
            color: #FC6A00;
            font-size: 14px;
            margin-bottom: 5px;
            display:flex;
            justify-content: space-between;
            align-items: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;

            .phone-text{
                flex: 1;
                margin-left: 5px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            &.binding__user{
                text-align: left;
                border-radius: 0;
                line-height: normal;

                &:after {
                    border: none;
                }
            }
        }
        .leader{
            background-color: #FFFFFF;
            margin-top: 10px;

            .title{
                padding: 0 12px;
                height: 40px;
                line-height: 40px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .txt{
                    font-size: 16px;
                    color: #000000;
                }
                .iconfont{
                    color: #9B9B9B;
                    font-size: 14px;
                }
            }
        }
        .content{
            .sign-up{
                background-color: #FFFFFF;
            }
            .leader{
                background-color: #FFFFFF;
                margin-top: 10px;
            }
            .title{
                padding: 0 12px;
                height: 40px;
                line-height: 40px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .txt{
                    font-size: 16px;
                    color: #000000;
                }
                .iconfont{
                    color: #9B9B9B;
                    font-size: 14px;
                }
            }
            /*.status-box{
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px 10px;
                .item{
                    flex: 1;
                    text-align: center;
                    image{
                        width: 45px;
                        height: 45px;
                        margin-bottom: 5px;
                    }
                    .txt{
                        font-size:14px;
                        color: #000000;
                    }
                }
            }*/
        }
        .commets {
            .title {
                padding: 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .txt {
                    color: #6A6A6A;
                    font-size: 14px;
                    line-height: 20px;
                }
                .iconfont {
                    font-size: 14px;
                    color: #B3B3B3;
                }
            }
            background-color: #ffffff;
            z-index: 9;
            .content {
                padding: 18px 0px;
                display: flex;
                .item {
                    flex: 1;
                    text-align: center;
                    .top {
                        display: inline-block;
                        width: 45px;
                        height: 45px;
                        border-radius: 5px;
                       /* background-color: rgba(240, 172, 173, .36);*/
                        text-align: center;
                        line-height: 45px;
                        .iconfont {
                            color: @globalColor;
                            font-size: 22px;
                        }
                    }
                    .txt {
                        padding-top: 7px;
                        line-height: 18px;
                        font-size: 13px;
                        color: #2E2D2D;
                    }
                }
            }

        }
        .info-detail{
            display: flex;
            padding: 15px 0px;
            align-items: center;
            justify-content: center;
            background-color: #ffffff;
            margin-bottom: 12px;
            margin-top: 10px;
            .item{
                flex: 1;
                text-align: center;
                font-size:12px;
                color:#6A6A6A ;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                .number{
                    font-size: 16px;
                    color: @globalColor;
                    line-height: 15px;
                    padding-bottom:7px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
        .section-serve{
            background-color: #ffffff;
            margin-bottom: 12px;
            .title{
                padding: 11px 15px 9px 15px;
                font-size: 14px;
                color: #000000;
                line-height: 20px;
            }
            .server-box{
                display: flex;
                width: 100%;
                align-items: center;
                flex-wrap: wrap;
                .item{
                    width:25%;
                    text-align: center;
                    padding:19px 0;
                    font-size: 12px;
                    color:#6A6A6A;
                    .iconfont{
                        font-size: 20px;
                        color: #ffffff;
                    }
                    .info{
                        display: inline-block;
                        width: 44px;
                        height: 44px;
                        line-height: 44px;
                        text-align: center;
                        background-color: #D06D3C;
                        margin-bottom: 12px;
                        border-radius: 50%;
                    }
                    .mall{
                        background-color:#F8AB2C ;
                    }
                    .order{
                        background-color:#37CEAC;
                    }
                    .mi{
                        background-color:#5787ED;
                    }
                    .custom{
                        background-color: #37CEAC;
                    }
                    .center{
                        background-color:#5787ED ;
                    }
                    .team{
                        background-color:#F25E62;
                    }
                }
            }
        }
        .tabbar{
            display: flex;
            position: fixed;
            bottom: 0;
            width: 100%;
            padding:22px 0 12px 0;
            color: #909090;
            font-size: 16px;
            background-color: #FFFFFF;
            text-align: center;
            align-items: center;
            &::before{
                content: '';
                position: absolute;
                top:0;
                left: 0;
                right: 0;
                height: 10px;
                background:linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(0,0,0,0.13) 100%);
            }
            div{
                flex: 1;
                border-radius: 0px;
                font-size:16px;
                line-height: 25px;
            }
            .active{
                color:#FF2741;
            }
        }
        button {
            position: absolute;
            z-index: 1;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            opacity: 0;
        }
    }
</style>