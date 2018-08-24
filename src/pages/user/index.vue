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
            <div class="leader">
                <div class="title" @click="jumpPath('/pages/myLeader/main')">
                    <div class="txt">我带队的活动</div>
                    <div class="iconfont icon-Group104"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
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
            //跳到我的活动
            jump(type){
                wx.navigateTo({
                    url:'/pages/myActivity/main?type='+type
                })
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
            }
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
    }
</style>