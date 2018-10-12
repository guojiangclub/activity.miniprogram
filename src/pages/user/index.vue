<template>
    <div id="user">
        <div class="banner">
            <div class="set" @click="jumpPath('/pages/usersetting/main')">
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
        </div>
        <!--<button class="binding__phone binding__user" open-type="getUserInfo" @getuserinfo="bindUserInfo">
            <i class="iconfont icon-warning"></i>
            <view class="phone-text">请完善个人信息</view>
            &lt;!&ndash;<i class="iconfont icon-Chevron"></i>&ndash;&gt;
        </button>-->
        <div class="content">
            <div class="sign-up">
                <div class="title" @click="jump(0)">
                    <div class="txt">我报名的活动</div>
                    <div class="iconfont icon-Group104"></div>
                </div>
                <div class="status-box">
                    <div class="item" @click="jump(2)">
                        <image src="/static/image/underway-ico.png"></image>
                        <div class="txt">进行中</div>
                    </div>
                    <div class="item" @click="jump(1)">
                        <image src="/static/image/no-start-ico.png"></image>
                        <div class="txt">未开始</div>
                    </div>
                    <div class="item" @click="jump(3)">
                        <image src="/static/image/over-ico.png"></image>
                        <div class="txt">已结束</div>
                    </div>
                    <div class="item" @click="jump(4)">
                        <image src="/static/image/cancel-ico.png"></image>
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
        </div>
        <div class="tabbar">
            <div class="mx-1px-right" @click="jumpIndex('index')">活动列表</div>
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
                token:''
            }
        },
        mounted(){
            var token = this.$storage.get('user_token');
            this.token = token;
           if(token){
               this.getMe();
           }
        },
        methods:{
            //跳到首页
            jumpIndex(type){
                var token = this.$storage.get('user_token');
                if(token){
                    if(type=='index'){
                        wx.reLaunch({
                            url:'/pages/index/main'
                        })
                    } else {
                        wx.navigateTo({
                            url:'/pages/myLeader/main'
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
            jumpPath(url){
                wx.navigateTo({
                    url:url
                })
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
            bindUserInfo(e) {
                if (e.mp.detail.encryptedData) {
                    wx.login({
                        success: res => {
                            e.mp.detail.code = res.code;
                            this.updateUserInfo(e.mp.detail)
                        }
                    })
                }
            },
            updateUserInfo(data) {
                var token = this.$storage.get('user_token');
                this.$http
                    .get(this.$config.GLOBAL.baseUrl + 'market/user/bindUserInfo', data, {
                        headers:{
                            Authorization:token
                        }
                    })
                    .then(res => {
                        res = res.data;

                    })
            },
        }
    }
</script>
<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";
    #user{
        .banner{
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
        .content{
            margin-top:10px;
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
            .status-box{
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
    }
</style>