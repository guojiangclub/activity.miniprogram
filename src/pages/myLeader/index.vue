<template>
    <div id="myactivity">
        <div class="navbar">
            <div class="vlc-slideBar-wrapper vlc-slideBar-flex normal" style="width: auto">
                <div class="vlc-slideBar-child" v-for="(item,index) in tabList" style="text-align: center; height: 30px; line-height: 30px;" @click="changeTab($event,index)" :key="index">
                    <span :class="activeIndex == index ? 'active':''">{{item.name}}</span>
                </div>
            </div>
            <div class="navar-slider" :style="{width: width +'px', transform: 'translateX' + '(' + sliderOffset + 'px' + ')'}"></div>
        </div>
        <div class="content">
            <div class="bo-m">
                <div class="noMore" v-if="dataList.length == 0&& init">暂无数据</div>
                <div  v-for="(t,key) in dataList"  class="mar-bottom" @click="jumpEnrol(t.id)" :key="key">
                    <div class="item mx-1px-bottom">
                        <div class="info-left">
                            <image :src="t.img_list" mode="aspectFill"></image>
                        </div>
                        <div class="info-rigth">
                            <div class="name">{{t.title}}</div>
                            <div class="time">{{t.time_section}} </div>
                            <div class="address">{{t.address}}</div>
                            <div class="money">
                                <span class="text subtitle" v-if="t.fee_type != 'OFFLINE_CHARGES' && t.fee_type != 'CHARGING'">{{t.subtitle}}</span>
                                <span class="text" v-if="t.payments && t.payments.type == 0">{{t.payments.point}}积分</span>
                                <span class="text" v-if="t.payments && t.payments.type == 1"><span>￥</span>{{t.payments.price}}</span>
                                <span class="text" v-if="t.payments && t.payments.type == 2"><span>￥</span>{{t.payments.price}}+{{t.payments.point}}积分</span>
                                <span class="text" v-if="t.payments && t.payments.type == 4"><span>￥</span>{{t.payments.price}}</span>
                                <!-- <span class="enroll-btn" :class="{'red' : t.status==1}">{{info[t.status]}}</span>-->
                            </div>
                        </div>
                    </div>
                    <div class="btn-status">
                        <span class="reward" v-if="t.status==3 && t.can_reward>=0" :class="{'red':t.can_reward>0}">{{t.rewardtxt}}</span>
                        <span :class="t.usercolor">{{t.usertxt}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data () {
            return{
                activeIndex: 0,
                sliderOffset: 0,
                width: 0,
                tabList:[
                    {
                        id:0,
                        name:"全部",
                        status:0
                    },
                    {
                        id:1,
                        name:"进行中",
                        status:2
                    },
                    {
                        id:2,
                        name:"已结束",
                        status:3
                    }
                ],
                dataList:[],
                page: 0,
                hasMore: true,
                init: false,
            }
        },
        mounted(){

            /* console.log(getApp().user_status_class(1, 1));*/
            this.getMyList(1,0,true);
            wx.getSystemInfo({
                success: res =>{
                    this.width = res.windowWidth /this.tabList.length,
                        this.sliderOffset = res.windowWidth / this.tabList.length * this.activeIndex
                }
            });
        },
        //小程序触底事件,加载更多
        onReachBottom() {
//                我的列表页加载更多
            wx.showLoading({
                title:"加载中",
                mask:true
            });
            var page = this.page + 1;
            this.page = page;
            if(this.hasMore){
                this.getMyList(page,this.tabList[this.activeIndex].status,false)
            } else{
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none'
                });
                wx.hideLoading();
            }
        },
        methods:{
            //教练 活动列表  奖励积分或者积分已发
            isRewarded(v){
                switch (true) {
                    case v==0:
                        return '积分已发';
                    case v>0:
                        return '奖励积分';
                }
            },
            //点击item跳到报名详情页
            jumpEnrol(id){
                wx.navigateTo({
                    url:'/pages/leaderDetail/main?id='+id
                })
            },
            changeTab(e,index){
                this.activeIndex = index;
                this.sliderOffset = e.currentTarget.offsetLeft;
                this.getMyList(1,this.tabList[index].status,true);
            },
            //请求我的活动列表
            getMyList(page,status,isfresh){
                var token = this.$storage.get('user_token')
                wx.showLoading({
                    title:"加载中",
                    mask:true
                });
                this.$http
                    .get(this.$config.GLOBAL.baseUrl + 'api/activity/coachActList/',{
                        page:page,
                        status:status || ''
                    },{
                        headers: {
                            Authorization: token
                        }
                    }).then(res=>{
                    res = res.data;
                    if (res.status){
                        /*this.dataList = res.data;*/
                        //拿到数据后需要分页
                        if(isfresh){
                            this.dataList = [];
                            var myList;
                            var page = res.meta.pagination;//拿到后台的分页数据
                            var current_page = page.current_page;//获取后台数据当前页面
                            var total_page = page.total_pages;// 获取后台数据总共页数
                            myList = this.dataList.concat(res.data);
                            this.dataList  = myList;
                            this.page = current_page;
                            this.hasMore = current_page < total_page;
                            this.dataList.forEach( val=> {
                                val['usertxt'] = getApp().ac_status_txt(val.status);
                                val['usercolor'] = getApp().ac_status(val.status);
                                val['rewardtxt'] = this.isRewarded(val.can_reward);
                            })
                            /*this.dataList.forEach(function (val,index) {

                             })*/
                        } else {
                            var myList;
                            var page = res.meta.pagination;//拿到后台的分页数据
                            var current_page = page.current_page;//获取后台数据当前页面
                            var total_page = page.total_pages;// 获取后台数据总共页数
                            myList = this.dataList.concat(res.data);
                            this.dataList = myList;
                            this.page = current_page;
                            this.hasMore = current_page < total_page;
                            this.dataList.forEach(function (val,index) {
                                val['usertxt'] = getApp().user_status_txt(val.status,val.member_status);
                                val['usercolor'] = getApp().user_status_class(val.status,val.member_status);
                            })
                        }
                        this.init = true;
                    } else{
                        wx.showModal({
                            content:res.message || "请求失败",
                            showCancel:false
                        })
                    }
                    wx.hideLoading()
                },err =>{
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
    page{
        height: 100%;
        background-color:#F3F3F3;
    }
    #myactivity{
        .navbar{
            background-color: #ffffff;
            overflow-x: scroll;
            overflow-y: hidden;
            width: 100%;
            position: relative;
            .vlc-slideBar-wrapper{
                /*border-bottom: 1px solid #cccccc;*/
                padding: 8px 0;
            }
            .vlc-slideBar-flex{
                display: flex;
                align-items: center;
                .vlc-slideBar-child{
                    flex: 1;
                    span{
                        color:#9B9B9B;
                        font-size: 15px;
                    }
                    .active{
                        color:@globalColor;
                    }
                }
            }
            .normal{
                flex-direction: row;
            }
            .navar-slider{
                position: absolute;
                content: " ";
                left: 0;
                bottom: 0;
                width: 4em;
                height: 3px;
                background-color: @globalColor;
                transition: transform .3s;
            }
        }
        .content{
            .mar-bottom{
                margin: 5px 0 10px 0;
            }
            .bo-m{
                margin-bottom: 18px;
            }
            .noMore{
                text-align: center;
                font-size:14px;
                line-height: 40px;
            }
            .item{
                background-color: #ffffff;
                padding: 10px 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                .info-left{
                    width: 95px;
                    height: 95px;
                    image{
                        width: 100%;
                        height: 100%;
                    }
                }
                .info-rigth{
                    flex: 1;
                    padding-left:10px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow:ellipsis;
                    .name{
                        color: #000000;
                        font-size: 16px;
                        line-height: 22px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        padding-bottom: 4px;
                    }
                    .subtitle{
                        color: #9c9c9c;
                        font-size: 12px;
                    }
                    .time,.address{
                        font-size: 12px;
                        color: #9B9B9B;
                        line-height: 16px;
                        padding-bottom: 4px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow:ellipsis;
                    }
                    .money{
                        /*text-align: justify;*/
                        display: flex;
                        align-items: center;
                        justify-content:space-between ;
                        margin-top:10px;
                        .text{
                            color: @globalColor;
                            font-size: 16px;
                            line-height: 16px;
                            span{
                                font-size: 12px;
                            }
                        }
                        .subtitle{
                            color: #9c9c9c;
                            font-size: 12px;
                        }
                        .enroll-btn{
                            padding: 4px 8px;
                            font-size:12px;
                            color: #ffffff;
                            line-height: 16px;
                            background-color: #d8d8d8;
                        }
                        .red{
                            background-color: @globalColor;
                        }
                    }
                }
            }
        }
        .btn-status{
            background-color: #ffffff;
            padding: 10px 15px 10px 0;
            overflow: hidden;
            text-align: right;
            span{
                display: inline-block;
                height: 25px;
                line-height: 25px;
                width: 80px;
                text-align: center;
                font-size:14px;
                color:#9B9B9B;
                border: 1px solid #9B9B9B;
                border-radius: 2px;
                &.red{
                    color: @globalColor;
                    border: 1px solid @globalColor;
                }
                &.grey{
                    color: #cbcbcb;
                    border: 1px solid  #cbcbcb;
                }
                &.blue{
                    color: #036eb8;
                    border: 1px solid  #036eb8;
                }
                &.reward{
                    float:left;
                    margin-left: 15px;
                }
            }
        }
    }
</style>
