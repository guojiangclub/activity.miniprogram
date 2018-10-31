<template>
    <div id="point_index">
        <!--point-top开始-->
        <div class="point-top" :style="{background:config.mainColor}">
            <div class="point-current">
                <div>当前可用积分</div>
                <div class="point-num">{{point.pointValid}}</div>
            </div>
            <div class="point-frozen">
                <div>冻结积分 {{point.pointFrozen}}</div>
                <div class="point-mall" @click="jump">积分商城</div>
            </div>
        </div>

        <!--point-top结束-->

        <!--point-content开始-->
        <div class="point-content">
            <div class="navbar mx-1px-bottom">
                <block v-for="(item,index) in tabList" :key="index">
                    <div :id="index" class="navbar-item activity" v-if="activeIndex == index" :style="{color:config.mainColor}" @click="tabClick">
                        <div class="navbar-title">{{item.title}}</div>
                    </div>

                    <div :id="index" v-if="activeIndex != index" class="navbar-item" @click="tabClick">
                        <div class="navbar-title">{{item.title}}</div>
                    </div>
                </block>
                <div class="navbar-slider" :style="{width: width + 'px', transform: 'translateX(' + sliderOffset + 'px)'}"></div>
            </div>
            <div class="tab-panel">
                <div class="tab-content" v-if="activeIndex == 0">
                    <div class="point-item mx-1px-top">
                            <div class="point-info mx-1px-bottom" v-for="(point,idx) in dataList[0]" :key="idx">
                                <div class="info-left">
                                    <div class="store-title">{{point.note}}</div>
                                    <div class="up-time">{{point.updated_at}}</div>
                                </div>

                                <div class="info-right">
                                    <div class="up-money">{{point.value}}</div>
                                    <div class="point-status">{{point.status_text}}</div>
                                </div>
                            </div>

                    </div>
                </div>

                <div class="tab-content" v-if="activeIndex == 1">
                    <div class="point-item mx-1px-top">
                            <div class="point-info mx-1px-bottom" v-for="(point,idx) in dataList[1]" :key="idx">
                                <div class="info-left">
                                    <div class="store-title">{{point.note}}</div>
                                    <div class="up-time">{{point.updated_at}}</div>
                                </div>
                                <div class="slow-money">{{point.value}}</div>
                            </div>

                    </div>
                </div>
            </div>
        </div>
        <!--point-content结束-->
    </div>
</template>

<script>
    export default {
        data(){
            return{
                activeIndex: 0,
                sliderOffset: 0,
                sliderLeft: 0,
                width: 0,
                tabList: [
                    {
                        title: "收入",
                        init: false,
                        page: 0,
                        more: true,
                    },
                    {

                        title: "支出",
                        init: false,
                        page: 0,
                        more: true,
                    }
                ],
                dataList:{
                    0:[],
                    1:[]
                },
                point: {

                },
                config: ''

            }
        },
        onLoad(){
            // 第三方平台配置颜色
            var config = this.$storage.get('globalConfig') || '';
            this.config = config;
            if (this.$root.$mp.query.type) {
                    this.activeIndex = this.$root.$mp.query.type
            }
            this.queryPointListBalance(this.activeIndex);
            this.queryUserPoint('default');

        },
        mounted(){
            wx.getSystemInfo({
                success: res => {
                       this.width = res.windowWidth / this.tabList.length,
                        this.sliderOffset= res.windowWidth / this.tabList.length * this.activeIndex
                }
            });

        },
        onReachBottom() {
            var status = this.activeIndex
            var page = this.tabList[status].page + 1;
            /*var tabList = tabList[${status}]`;*/
            if (this.tabList[status].more) {
                this.queryPointListBalance(status,page);
            } else {
                wx.showToast({
                    icon:'none',
                    title: '再拉也没有啦'
                });
            }
        },
        methods:{
            // 点击切换
            tabClick(e) {
                var status = e.currentTarget.id;
                    this.sliderOffset= e.currentTarget.offsetLeft;
                    this.activeIndex= status
                if (!this.tabList[status].init) {
                    // wx.showLoading({
                    //     title: "加载中",
                    //     mask: true
                    // });

                    this.queryPointListBalance(status);
                }

            },
            // 查询积分列表
            queryPointListBalance(status = 0, page = 1) {
                var token = this.$storage.get('user_token');
                wx.showLoading({
                    title: "加载中",
                    mask: true
                });

                var balance = status == 1 ? 'out' : 'in';
                var params = balance ? { balance } : {};

                params.page = page;
                params.type = 'default';
                this.$http.get(this.$config.GLOBAL.baseUrl+'api/users/point/list',params,{
                    headers: {
                        Authorization: token
                    }
                }).then(res => {
                        res = res.data;
                        if (res.status) {
                            var myList;
                            var pages = res.meta.pagination;
                            var current_page = pages.current_page;
                            var total_pages = pages.total_pages;
                            myList = this.dataList[status].concat(res.data);
                            this.dataList[status]= myList;
                            this.tabList[status].page = current_page;
                            this.tabList[status].more = current_page < total_pages;
                            this.tabList[status].init = true
                        } else {
                            wx.showModal({
                                content: res.message || '请求失败',
                                showCancel: false
                            })
                        }
                    wx.hideLoading()
                },err=>{
                    wx.hideLoading();
                    wx.showModal({
                        content: '请求失败',
                        showCancel: false
                    })
                })

            },
            // 查询用户积分
            queryUserPoint(type) {
                var token = this.$storage.get('user_token');
                this.$http.get(this.$config.GLOBAL.baseUrl+'api/users/point',{
                    type:type
                },{
                    headers:{
                        Authorization:token
                    },
                })
                    .then(res =>{
                         res = res.data;
                        this.point = res;
                },err=>{
                        wx.showModal({
                            content: '服务器有点小拥挤，请重试！',
                            showCancel: false
                        })
                    })

            },
            jump() {
                wx.navigateTo({
                    url: '/pages/pointStore/index/index'
                })
            }

        }


    }
</script>

<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";
    #point_index{
        .point-top{
            background-color: @globalColor;
            color: #ffffff;
            padding: 19px 15px 15px 35px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            .point-current{
                text-align: center;
                .point-num{
                    font-size:35px;
                    line-height: 49px;
                }
            }
            .point-frozen{
                .point-mall{
                    text-align: center;
                    width: 63px;
                    line-height: 20px;
                    margin: auto;
                    font-size: 12px;
                    margin-top:15px ;
                    border:1px solid #ffffff ;
                    border-radius: 2px;
                }
            }
        }
        .point-content{
            margin-top: 15px;

            .navbar {
                width: 100%;
                display: flex;
                z-index: 20;
                height: 50px;
                line-height: 50px;
                background: #FFFFFF;
                font-size: 14px;
                color: #9B9B9B;
                .navbar-item {
                    flex: 1;
                    width: 0%;
                    text-align: center;

                    &.activity {
                        color: @globalColor;
                    }
                }
                .navbar-slider {
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
            .tab-panel{
                padding-top: 15px;
            }

            .point-list{
                background-color: #ffffff;
                display: flex;
                align-items: center;
                margin-bottom:10px ;
                view{
                    width: 50%;
                    text-align: center;
                    padding: 10px 0;
                }
            }
            .point-item{
                .point-info{
                    background-color: #ffffff;
                    color: #888888;
                    font-size: 12px;
                    padding: 10px 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .info-left{
                        flex: 1;
                    }
                    .info-right{
                        display: flex;
                        flex-direction: column;
                        text-align: right;

                    }
                    .store-title{
                        font-size: 16px;
                        color: #666666;
                        line-height: 25px;
                    }
                    .up-time{
                        line-height:16px ;
                    }
                    .up-money{
                        color:#14C532;
                        font-size: 15px;
                    }
                    .slow-money{
                        color:#E73237 ;
                        font-size: 15px;
                    }
                }
            }
        }
    }
</style>
