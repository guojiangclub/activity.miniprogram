<template>
    <div id="detailIndex">
        <div class="activity-content">
            <image :src="detail.img" mode="widthFix"></image>
            <div class="introduce">
                <div class="name">
                    {{ detail.title }}
                </div>
                <div class="money mx-1px-bottom">
                    <span class="txt subtitle" v-if="detail.fee_type != 'OFFLINE_CHARGES' && detail.fee_type != 'CHARGING'">{{ detail.subtitle}}</span>
                    <span class="txt" v-if="detail.payments[0] &&detail.payments[0].type == 0">{{detail.payments[0].point}}积分</span>
                    <span class="txt" v-if="detail.payments[0] &&detail.payments[0].type == 1"> <span>￥</span>{{detail.payments[0].price}}</span>
                    <span class="txt" v-if="detail.payments[0] &&detail.payments[0].type == 2"> <span>￥</span>{{detail.payments[0].price}}+{{detail.payments[0].point}}积分</span>
                    <span class="txt" v-if="detail.payments[0] &&detail.payments[0].type == 4"> <span>￥</span>{{detail.payments[0].price}}</span>
                    <span class="btn" :class="{'red':detail.status==1}">{{info[detail.status]}}</span>
                </div>
                <div class="concrete">
                    <div class="date padd mx-1px-bottom">
                        <span class="iconfont icon-carryout"></span>
                        <span class="text">{{time}}</span>
                    </div>
                    <div class="addr padd mx-1px-bottom" @click="jumpMap">
                        <span class="iconfont icon-Group113"></span>
                        <span class="text">{{detail.address}}</span>
                        <span class="iconfont icon-Group104"></span>
                    </div>
                    <div class="num padd">
                        <span class="iconfont icon-Group64"></span>
                        <span class="text">已报名 {{ detail.member_count }}人</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="activity-tab">
            <div class="tab-header">
                <div class="tab-title">
                    <!--<div class="item active">活动详情</div>
                    <div class="item">活动领队</div>-->
                    <div class="item" v-for="(i,k) in tabList" @click="changeTab(k)" :class="activeIndex == k ? 'active':''">
                        <span>{{i.title}}</span>
                    </div>
                </div>
            </div>
            <div class="content" v-if="activeIndex == 0">
                <wxParse :content="article" @preview="preview" @navigate="navigate"></wxParse>
            </div>
            <div class="content" v-if="activeIndex == 1">
                <div class="coach-intro">
                    <div class="avatar">
                        <image :src="detail.coach.avatar"></image>
                    </div>
                    <div class='coach-name'>{{detail.coach.nick_name}}</div>
                    <div class="coach-nick">{{detail.coach.sex}}   99岁</div>
                </div>
                <div class="coach-txt">
                    <wxParse :content="describe"></wxParse>
                </div>
            </div>
        </div>
        <div class="fixed-btn">
            <div class="btn-left">
                <div class="item-btn" @click="jumpHome" :class="retColor.home?'activebtn':''">
                    <div class="iconfont icon-home"></div>
                    <div class="txt">首页</div>
                </div>
                <div class="item-btn" @click="collect" :class="retColor.collect?'activebtn':''">
                    <div class="iconfont icon-Group86"></div>
                    <div class="txt">收藏</div>
                </div>
                <div class="item-btn" @click="share">
                    <div class="iconfont icon-Group67"></div>
                    <div class="txt">分享</div>
                </div>
            </div>
            <div class="btn-right">
                <button type="warn">立即报名</button>
            </div>
        </div>
    </div>
</template>

<script>
    import wxParse from 'mpvue-wxparse'
    export default{
        components: {
            wxParse
        },
        data(){
            return {
                detail: {
                    payments: [],
                    coach:{}
                },
                info: getApp().textStatus,
                article: "",
                describe:'',
                time: '',
                tabList:[{
                    title:"活动详情",
                },{
                    title:"活动领队"
                }],
                activeIndex:0,
                retColor:{
                    home:false,
                    collect:false,
                    share:false
                }
            }
        },
        mounted(){
            this.getDetail()
        },
        methods: {
            changeTab(index){
                this.activeIndex = index
            },
            //点击收藏
            collect(){
                this.retColor.collect = ! this.retColor.collect;
            },
            //回到首页
            jumpHome(){
                this.retColor.home = ! this.retColor.home;
                wx.navigateTo({
                    url:'/pages/index/main'
                })
            },
            //分享
            share(){

            },
              /* preview(src, e){

            },
            navigate(href, e){

            },*/
            //请求活动详情页活动的数据
            getDetail(){
                this.$http
                    .get(this.$config.GLOBAL.baseUrl + 'api/activity/show/15', {}).then(res => {
                    res = res.data;
                    console.log(res);
                    if (res.status) {
                        this.detail = res.data;
                        this.article = res.data.content;
                        this.describe = res.data.coach.describe;
                        this.time = getApp().timefiter(res.data.starts_at,res.data.ends_at);
                    } else {
                        wx.showModal({
                            content: res.messages || "请求失败",
                            showCancel: false
                        })
                    }
                }, err => {
                    wx.showModal({
                        content: '请求失败，请重试',
                        showCancel: false,
                    })
                })
            },
            // 跳到地图
            jumpMap(){
                
            }
        }
    }
</script>

<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";

    page {
        height: 100%;
        background-color: #F3F3F3;
    }

    #detailIndex {
        .activity-content {
            background-color: #ffffff;
            margin-bottom: 5px;
            image {
                width: 100%;
            }
            .introduce {
                padding: 10px 0 0 0px;
                .name {
                    color: #000000;
                    font-size: 16px;
                    line-height: 25px;
                    padding: 0 15px 0 15px;
                }
                .money {
                    padding: 7px 15px 11px 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .txt {
                        color: @globalColor;
                        font-size: 20px;
                        span {
                            font-size: 14px;
                        }
                    }
                    .subtitle {
                        color: #959595;
                    }
                    .btn {
                        font-size: 12px;
                        padding: 4px 8px;
                        border: 1px solid #959595;
                        border-radius: 2px;
                        line-height: 16px;
                        color: #959595;
                    }
                    .red {
                        border: 1px solid @globalColor;
                        color: @globalColor;
                    }
                }
                .concrete {
                    padding-left: 16px;
                    .padd {
                        padding: 8px 16px 8px 0;
                        font-size: 12px;
                        color: #000000;
                        line-height: 16px;
                        overflow: hidden;
                        .text {
                            display: inline-block;
                            padding-left: 6px;
                        }
                        .iconfont {
                            font-size: 11px;
                            color: #9B9B9B;
                        }
                        .icon-Group104 {
                            float: right;
                        }
                    }
                }
            }
        }
        .activity-tab {
            margin-bottom:100px;
            .tab-header {
                position: relative;
                background-color: #FFFFFF;
                margin-bottom: 5px;
            }
            .tab-title {
                padding: 10px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #9B9B9B;
                font-size: 14px;
                text-align: center;
                .item {
                    flex: 1;
                    span{
                        display: inline-block;
                        padding-bottom: 12px;
                    }
                }
                .active {
                    color: @globalColor;
                    span{
                        border-bottom: 2px solid @globalColor;
                    }
                }
            }
            /*.slideBar{
                position: absolute;
                bottom: 0;
                height: 2px;
                transition: transform .2s ease-out;
                background-color:@globalColor;
                width: 75px;
            }*/
            .content{
                background-color: #FFFFFF;
                .coach-intro{
                    text-align: center;
                    .avatar{
                        margin-bottom:15px;
                        padding-top: 27px;
                        image{
                            width: 60px;
                            height: 60px;
                            border-radius: 50%;
                        }
                    }
                    .coach-name{
                        color: #000000;
                        font-size: 16px;
                        line-height: 22px;
                        padding-bottom: 3px;
                    }
                    .coach-nick{
                        color:#9B9B9B;
                        font-size:12px;
                        line-height: 16px;
                    }
                }
            }
        }
        .fixed-btn{
            background-color: #FFFFFF;
            z-index: 3;
            position: fixed;
            bottom: 0;
            width: 100%;
            height:50px;
            display: flex;
            align-items: center;
            justify-content: center;
            .btn-left{
                flex: 1;
                display: flex;
                .item-btn{
                    flex: 1;
                    color:#9B9B9B;
                    text-align: center;
                    .iconfont{
                        font-size: 20px;
                    }
                    .txt{
                        font-size:10px;
                        padding-top:3px;
                    }
                }
                .activebtn{
                    color: @globalColor;
                }
            }
            .btn-right{
                flex: 1;
                button{
                    border-radius: 0px;
                    height: 50px;
                    color: #FFFFFF;
                    font-size: 16px;
                    line-height: 50px;
                }
                button::after{
                    border: none;
                }
            }
        }
    }

</style>