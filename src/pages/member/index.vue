<template>
    <div id="member">
        <div class="header">
            <div class="avatar">
                <image :src="memberInfo.meta.user.avatar"></image>
            </div>
            <div class="nick-name">{{memberInfo.meta.user.nick_name}}</div>
        </div>
        <div>
            <div class="navbar mx-1px-bottom">
                <div class="vlc-slideBar-wrapper vlc-slideBar-flex normal" style="width: auto">
                    <div class="vlc-slideBar-child" v-for="(item,index) in tabList" style="text-align: center; height: 30px; line-height: 30px;" @click="changeTab($event,index)" :key="$index">
                        <span :class="activeIndex == index ? 'active':''">{{item.name}}</span>
                    </div>
                </div>
                <div class="navar-slider" :style="{width: width +'px', transform: 'translateX' + '(' + sliderOffset + 'px' + ')'}"></div>
            </div>
            <div class="content" v-if="activeIndex==0">
                <div class="item mx-1px-bottom">
                    <div class="sex"><span>性别</span>{{memberInfo.meta.user.sex}}</div>
                </div>
                <div class="item">
                    <div class="phone"><span>手机号码</span>{{memberInfo.meta.user.mobile}}</div>
                </div>
            </div>
            <div class="content" v-if="activeIndex==1">
                <div class="list mx-1px-bottom" v-for="item in listData" :key="index">
                    <div class="title">{{item.title}}</div>
                    <div class="info"><span class="iconfont icon-Group113"></span>{{item.timetxt}}</div>
                    <div class="info"><span class="iconfont icon-Group113"></span>{{item.address}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                memberInfo:{
                    meta:{
                        user:{}
                    }
                },
                listData:[],
                page:0,
                hasMore:false,
                user_id:'',
                activeIndex: 0,
                sliderOffset: 0,
                width: 0,
                tabList:[
                    {
                        id:0,
                        name:"基本资料",
                        init: false
                    },
                    {
                        id:1,
                        name:"参加过的活动",
                        init: false
                    }
                ],

            }
        },
        mounted(){
            var user_id = this.$root.$mp.query.user_id;
            this.user_id = user_id;
            wx.getSystemInfo({
                success: res =>{
                    this.width = res.windowWidth /this.tabList.length,
                        this.sliderOffset = res.windowWidth / this.tabList.length * this.activeIndex
                }
            });
            this. getMerberInfo(user_id,1)
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
                this.getMerberInfo(this.user_id,page)
            } else{
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none'
                });
                wx.hideLoading();
            }
        },
        methods:{
            // 切换tab
            changeTab(e,index){
                this.activeIndex = index;
                this.sliderOffset = e.currentTarget.offsetLeft;
            },
            //请求会员资料页的数据
            getMerberInfo(user_id,page){
                var token = this.$storage.get('user_token');
                wx.showLoading({
                    title:"加载中",
                    mask:true
                });
                this.$http
                    .get(this.$config.GLOBAL.baseUrl+'api/activity/memberInfo/'+ user_id,{
                        page:page
                    },{
                        headers:{
                            Authorization:token
                        }
                    })
                    .then(res=>{
                        res = res.data;
                        if (res.status){
                            this.memberInfo = res;
                            var myList;
                            var page = res.meta.pagination;//拿到后台的分页数据
                            var current_page = page.current_page;//获取后台数据当前页面
                            var total_page = page.total_pages;// 获取后台数据总共页数
                            myList = this.listData.concat(res.data);
                            this.listData = myList;
                            this.page = current_page;
                            this.hasMore = current_page < total_page;
                            this.listData.forEach(function (val,index) {
                                val['timetxt'] = getApp().timefiter(val.starts_at,val.ends_at)
                            })
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
    #member{
        .header{
            height: 195px;
            background: url(http://ovef29y3v.bkt.clouddn.com/member_bg.a76310345f7b884882404830b95256d4.png) top center no-repeat;
            background-size: 100% 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            .avatar{
                width: 82px;
                height: 82px;
                border: 2px solid #737373;
                border-radius: 50%;
                image{
                    border-radius: 50%;
                    width: 100%;
                    height: 100%;
                }
            }
            .nick-name{
                font-size: 20px;
                color: #fff;
            }
        }
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
            background-color: #FFFFFF;
            scroll-view{
                height: 100%;
            }
            .item{
                padding: 12px;
                font-size: 15px;
                span{
                    display: inline-block;
                    width:80px;
                    color: #959595;
                }
                .sex{
                    color: #000000;
                }
                .phone{
                    color: #4990e2;

                }
            }
            .list{
                padding:15px 12px;
                .title{
                    font-size: 18px;
                    color: #000;
                    padding-bottom: 2px;
                }
                .info{
                    font-size: 14px;
                    color: #9c9c9c;
                    line-height: 22px;
                    span{
                        display: inline-block;
                        margin-right: 5px;
                        &.iconfont{
                            font-size: 14px;
                        }
                    }
                }
            }
        }
    }
</style>