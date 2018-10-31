<template>
    <div id="coupon-over">
        <div class="no-list" v-if="!dataList[0].length && tabList[0].init">
            <i class="iconfont icon-youhuiquanss-copy"></i>
            <div>报告主人，您暂无优惠券~</div>
        </div>
        <div v-for="item in dataList[0]">
            <div class="coupon">
                <div class="coupon-left" :class="is_coupon != 1 ? 'discount' : ''">
                    <div class="text-wrap">
                        <div class="text-box">
                            <div class="text">
                                <text class="money" v-if="item.discount.action_type.type == 'cash'">￥</text>
                                <sapn>{{ item.discount.action_type.value }}</sapn>

                                <text class="money" v-if="item.discount.action_type.type == 'discount'">折</text>
                            </div>
                            <text class="label text">{{ item.discount.label }}</text>
                        </div>

                    </div>
                    <div class="dot-wrap">
                        <div class="dot-item">

                        </div>
                        <div class="dot-item">

                        </div>
                        <div class="dot-item">

                        </div>
                        <div class="dot-item">

                        </div>
                        <div class="dot-item">

                        </div>
                        <div class="dot-item">

                        </div>
                    </div>
                </div>
                <div class="coupon-right">
                    <div class="top">
                                <span class="type">
                                    <span v-if="item.discount.channel == 'ec'">商城</span>
                                    <span v-else>门店</span>
                                </span>
                        <text class="info">{{item.discount.title}}</text>
                    </div>
                    <div class="bottom">
                        <div class="bottom-use">
                            <div class="tiem-box">
                                <text>{{item.discount.use_start_time}}至{{item.discount.use_end_time}}</text>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cover">
                    <div class="big-circle">
                        <div class="small-circle">
                            <div  v-if="item.used_at">已使用</div>
                            <div  v-else>已过期</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                activeIndex: 0,
                sliderOffset: 0,
                width: 0,
                tabList: [
                    {
                        title: '线上',
                        init: false,
                        page: 0,
                        more: true
                    },
                    {
                        title: '线下',
                        init: false,
                        page: 0,
                        more: true
                    }
                ],
                dataList: {
                    0: [],
                    1: []
                },
                is_coupon: 1, // 用于判断是否为优惠券 1：优惠券 0：促销折扣
            }
        },
        onReachBottom(e) {
            var status = this.activeIndex
            var page = this.tabList[status].page + 1;
            if (this.tabList[status].more) {
                this.queryCouponList(status,page);
            } else {
                wx.showToast({
                    icon: 'none',
                    title: '再拉也没有啦'
                });
            }
        },
        mounted(){
            this.init();
            wx.getSystemInfo({
                success: res => {
                    this.width = res.windowWidth / this.tabList.length,
                    this.sliderOffset = res.windowWidth / this.tabList.length * this.activeIndex
                }
            })
            this.activeIndex = this.$mp.query.type || 0;
            this.queryCouponList();
        },
        methods:{
            tabClick(e) {
                var status = e.mp.currentTarget.id;
                this.sliderOffset = e.mp.currentTarget.offsetLeft;
                this.activeIndex = status;
                if (!this.tabList[status].init) {
                    this.queryCouponList(status);
                }
            },
            jumpDetail(id) {
                wx.navigateTo({
                    url: '/pages/couponDetail/main?id=' + id
                })
            },
            toast() {
                wx.navigateTo({
                    url:'/pages/couponOver/main'
                })
            },
            init() {
                this.activeIndex = 0;
                this.sliderOffset = 0;
                this.width = 0;
                this.tabList = [
                    {
                        title: '线上',
                        init: false,
                        page: 0,
                        more: true
                    },
                    {
                        title: '线下',
                        init: false,
                        page: 0,
                        more: true
                    }
                ]
                this.dataList = {
                    0: [],
                    1: []
                }
            },
            queryCouponList(type = 0, page = 1) {
                wx.showLoading({
                    title: "加载中",
                    mask: true
                });
                var token = this.$storage.get('user_token') || '';

                this.$http
                    .get(this.$config.GLOBAL.baseUrl + 'api/coupon', {
                        page,
                        is_active: 0
                    }, {
                        headers: {
                            Authorization: token
                        },
                    }).then(res => {
                        res = res.data;
                        if (res.status) {
                            var dataList;
                            var pages = res.meta.pagination;
                            var current_page = pages.current_page;
                            var total_pages = pages.total_pages;
                            if (current_page == 1) {
                                dataList = res.data
                            } else {
                                dataList = this.dataList[type].concat(res.data);
                            }
                            this.dataList[type] = dataList;
                            this.tabList[type].init = true;
                            this.tabList[type].page = current_page;
                            this.tabList[type].more = current_page < total_pages;

                        } else {
                            wx.showModal({
                                content: res.message || '请求失败',
                                showCancel: false
                            })
                        }
                    wx.hideLoading()
                }, err => {
                    wx.hideLoading()
                    wx.showModal({
                        content: '请求失败',
                        showCancel: false
                    })
                })
            }
        }

    }
</script>

<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";
    #coupon-over{
        .coupon {
            display: flex;
            margin:10px 15px 0 15px ;
            position: relative;
            &.shasow {
                box-shadow: 0px 7px 10px 0px rgba(6, 0, 0, 0.2);
            }

            .coupon-left {
                width: 110px;
                height: 80px;
                color: #ffffff;
                background-size: cover;
                background: rgba(74, 74, 74, 1);
                position: relative;
                &.discount {
                    background: rgba(74, 74, 74, 1);
                }

                .text-wrap {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    font-size: 12px;
                    .text-box {
                        text-align: center;
                        width: 100%;
                        .text{
                            display: block;
                            padding: 0 10px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            font-size: 20px;
                            font-weight: 600;
                            &.label{
                                font-size: 12px;
                                font-weight: 100;
                            }
                            .money{
                                font-size: 14px;
                                font-weight: 100;
                            }
                        }

                        .money-num {
                            font-size: 25px;
                            font-weight: bold;
                        }
                    }
                }
                .dot-wrap {
                    position: absolute;
                    top: -12px;
                    .dot-item {
                        width: 5px;
                        height: 5px;
                        background: #F3F3F3;
                        border-radius: 50%;
                        margin: 11px 0 9px -2px;

                        &:last-child {
                            margin-top: 10px;
                        }
                    }
                }
            }
            .coupon-right {
                flex: 1;
                background: #fff;
                padding: 0px 15px;
                font-size: 12px;
                overflow: hidden;

                .top {
                    font-size: 12px;
                    display: -webkit-box;
                    color: #333;
                    height: 40px;
                    line-height: 20px;
                    padding-top: 8px;
                    box-sizing: border-box;
                    text-overflow: ellipsis;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    .type {
                        color: #333333;
                        border: 1px solid #333333;
                        padding: 2px 5px;
                        border-radius: 3px;
                        line-height: 20px;
                        margin-right: 5px;
                    }
                }

                .bottom {
                    .bottom-use {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        font-size: 12px;
                        margin: 7px 0;
                        .tiem-box {
                            color: #9E9E9F;
                            flex: 1;
                            font-size: 9px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            margin-top: 5px;
                        }
                        .btn {
                            text-align: center;
                            border-radius: 3px;
                            padding: 3px 12px;
                        }
                        .use {
                            color: #fff;
                            border: 1px solid @globalColor;
                            background: @globalColor;
                        }
                        .already {
                            color: @globalColor;
                            background: #fff;
                            border: 1px solid @globalColor;

                        }
                    }
                }
            }
            .cover{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color:rgba(74,74,74,.4) ;
                .big-circle{
                    width: 57px;
                    height: 57px;
                    border: 1px solid #FFFFFF;
                    border-radius: 50%;
                    position: absolute;
                    right: 10px;
                    bottom: 10px;

                }
                .small-circle{
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    border: 1px solid #ffffff;
                    position: relative;
                    top:5px;
                    left: 5px;
                    line-height: 45px;
                    text-align: center;
                    div{
                        transition:transform 1000ms ease 0ms;
                        transform:rotate(-30deg);
                        transform-origin:50% 50% 0px;
                        font-size:22rpx ;
                        color: #ffffff;
                    }
                }
            }
        }

        .no-list{
            text-align: center;
            font-size: 14px;
            color: #888888;
            margin-top: 10px;
            i{
                font-size: 80px;
                margin-bottom: 15px;
            }
        }
    }
</style>
