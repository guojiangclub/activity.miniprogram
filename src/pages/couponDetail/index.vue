<template>
    <div id="off-detail" v-if="init">
        <div class="coupon">
            <div class="coupon-left" :class="is_coupon != 1 ? 'discount' : ''">
                <div class="text-wrap">
                    <div class="text-box">
                        <div class="text">
                            <text class="money" v-if="detail.action_type.type == 'cash'">￥</text>
                            <sapn>{{ detail.action_type.value }}</sapn>

                            <text class="money" v-if="detail.action_type.type == 'discount'">折</text>
                        </div>
                        <text class="label text">{{ detail.label }}</text>
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
                    <span v-if="detail.channel == 'ec'">商城</span>
                    <span wx:else>门店</span>
                </span>
                    <text class="info">{{detail.title}}</text>
                </div>
                <div class="bottom">
                    <div class="bottom-use">
                        <div class="tiem-box">
                            <text>{{detail.use_start_time}}至{{detail.use_end_time}}</text>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="detail-item user-info" v-if="detail.intro">
            <div class="title">
                使用说明
            </div>
            <div class="info mx-1px-top">
                {{detail.intro}}
            </div>
        </div>
        <div class="qr_code" v-if="detail.qr_code_img && detail.channel == 'shop'">
            <image :src="detail.qr_code_img"></image>
        </div>
    </div>
</template>


<script type="text/ecmascript-6">
    export  default {
        data() {
            return {
                detail: '',
                barcode: '',
                is_coupon: 1, // 用于判断是否为优惠券 1：优惠券 0：促销折扣
                init: false,
                id: '',
                coupon_id: ''
            }
        },
        mounted() {
            this.id = this.$mp.query.id;
            this.coupon_id = this.$mp.query.coupon_id;
            this.inits();
            this.queryCouponDetail(this.id, this.coupon_id);
        },
        methods: {
            inits() {
              this.detail = '';
              this.init = false
            },
            queryCouponDetail(id,coupon_id) {
                wx.showLoading({
                    title: "加载中",
                    mask: true
                });
                var coupon_ids = coupon_id ? coupon_id : ''

                var token = this.$storage.get('user_token') || '';
                this.$http.get(this.$config.GLOBAL.baseUrl + 'api/discount/' + id + '/detail', {
                    coupon_id: coupon_ids
                }, {
                    headers: {
                        Authorization: token
                    }
                }).then(res => {
                    res = res.data;
                    if (res.status) {
                        this.detail = res.data;
                        this.init = true
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
    #off-detail{
        .coupon {
            display: flex;
            padding: 10px 15px;
            &.shasow {
                box-shadow: 0px 7px 10px 0px rgba(6, 0, 0, 0.2);
            }

            .coupon-left {
                width: 110px;
                height: 80px;
                color: #ffffff;
                background-size: cover;
                background: @globalColor;
                position: relative;
                &.discount {
                    background: @globalColor !important;
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
                    color: #333333;
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
                    }
                }
            }
        }
        .detail-item{
            background: #FFFFFF;
            &.user-info{
                margin-top: 10px;
            }
            .title{
                font-size: 14px;
                padding: 10px 15px;
            }
            .shop-info{
                font-size: 12px;
                padding: 10px 15px;
                line-height: 25px;
                i{
                    font-size: 12px;
                    color: @globalColor;
                    margin-right: 5px;
                }

            }

            .info{

                font-size: 12px;
                padding: 10px 15px;
            }
        }
        .qr_code {
            padding: 10px 0;
            text-align: center;
            background: #fff;

            image{
                width: 150px;
                height: 150px;
            }
        }
        .button-box{
            position: fixed;
            bottom: 10px;
            left: 15px;
            right: 15px;
            height: 44px;
            line-height: 44px;
            text-align: center;
            background: @globalColor;
            color: #FFFFFF;
            border-radius: 3px;
            .btn{
                width: 100%;
                height: 100%;
            }
        }
    }
</style>