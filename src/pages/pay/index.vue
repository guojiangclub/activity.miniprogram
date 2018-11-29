<template>
    <div id="pay">
        <block v-if="init">
            <div class="block-item goods" v-if="info.shopOrder">
                <div class="title mx-1px-bottom">
                    <div>
                        商品清单
                    </div>
                </div>
                <div class="goods-item mx-1px-bottom" v-for="(item,index) in info.shopOrder.items" v-if="info.shopOrder.items.length == 1">
                    <div class="left">
                        <image :src="item.item_meta.image"></image>
                    </div>
                    <div class="right">
                        <div>
                            <div class="name">
                                {{item.item_name}}
                            </div>
                            <div class="price">
                                <div class="new">
                                    <span>￥</span>{{item.total_yuan}}
                                </div>
                                <div class="old">
                                    ￥{{item.product.market_price}}
                                </div>
                            </div>
                        </div>
                        <div class="btn-box">
                            {{item.item_meta.specs_text}}, {{item.quantity}}件
                        </div>
                    </div>
                </div>
                <div class="line all-goods" v-if="info.shopOrder.items.length > 1" @click="jumpGoods">
                    <div class="good-box">
                        <div class="good-img" v-for="(item,index) in info.shopOrder.items" v-show="index < 4">
                            <img :src="item.item_meta.image" alt="">
                        </div>
                    </div>
                    <div class="num">
                        <div> 共{{info.shopOrder.count}}件</div>
                        <div class="iconfont icon-Group104"></div>
                    </div>
                </div>
                <div class="comm-account mx-1px-top">
                    {{info.shopOrder.count}}件商品，合计￥{{info.shopOrder.total_yuan}}
                </div>
            </div>
            <div class="active-box">
                <div class="item">
                    <div class="info-left">
                        <image :src="info.activity.img" mode="aspectFill"></image>
                    </div>
                    <div class="info-rigth">
                        <div class="name">{{info.activity.title}}</div>
                        <div class="time"><span class="iconfont icon-carryout"></span> {{time}}</div>
                        <div class="address"><span class="iconfont icon-Group113"></span> {{info.activity.address}}</div>
                        <div class="money">
                            <span class="text" v-if="info.payment.type == 0">{{info.payment.point}}积分</span>
                            <span class="text" v-if="info.payment.type == 1">￥{{info.payment.price}}</span>
                            <span class="text" v-if="info.payment.type == 2">￥{{info.payment.price}}+{{info.payment.point}}积分</span>
                            <span class="text" v-if="info.payment.type == 4">￥{{info.payment.price}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="point-box" v-if="info.payment.type == 0 || info.payment.type == 2">
                <div class="point mx-1px-bottom">
                    <div class="name">
                        积分
                    </div>
                    <div class="value">
                        可用{{info.point}}
                    </div>
                </div>
                <div class="user-point">
                    {{info.payment.point}} 积分
                </div>
            </div>

            <div class="point-box">
                <div class="point mx-1px-bottom">
                    <div class="name">
                        支付方式
                    </div>
                </div>
                <div class="user-point">
                    <radio-group class="radio-group">
                        <label class="radio">
                            <text>微信支付</text>
                            <radio checked="true" />
                        </label>
                    </radio-group>
                </div>
            </div>

            <div class="pay-info">
                <div class="item" v-if="info.payment.type == 0 || info.payment.type == 2">
                    <div class="name">
                        积分支付
                    </div>
                    <div>
                        {{info.payment.point}}积分
                    </div>
                </div>
                <div class="item" v-if="info.payment.type != 0">
                    <div class="name">
                        金额支付
                    </div>
                    <div>
                        ￥{{info.activityOrder.total / 100}}
                    </div>
                </div>

                <div class="bottom" @click="pay">
                    立即支付
                </div>
            </div>
        </block>
    </div>
</template>

<script>
    import pingpp from 'pingpp-js';
    export default{
        data(){
            return{
                info: {
                    activity: {
                        coach: {}
                    },
                    payment: {
                        type: ''
                    },
                    point: ''
                },
                time: '',
                order_no: '',
                init: false
            }
        },
        mounted(){
            this.order_no = this.$root.$mp.query.order_no;
            this.getPayInfo(this.order_no);
        },
        methods: {
//            获取支付信息
            getPayInfo(order_no) {
                var token = this.$storage.get('user_token')
                this.$http
                    .get(this.$config.GLOBAL.baseUrl + 'api/activity/order/info/' + order_no, {}, {
                        headers: {
                            Authorization: token
                        }
                    })
                    .then(res => {
                        res = res.data;
                        if (res.status) {
                            this.info = res.data;

                            this.time = getApp().timefiter(res.data.activity.starts_at, res.data.activity.ends_at);
                            this.init = true;

                            if (res.data.shopOrder) {
                                var data = {
                                    order: res.data.shopOrder
                                }
                                this.$storage.set('orderGoods', data);
                            }
                        } else {
                            wx.showModal({
                                content: res.message || "请求失败",
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
            jumpGoods() {
                wx.navigateTo({
                    url:`/pages/orderGoods/main?order_no=${this.info.shopOrder.order_no}`,
                })
            },
            getOPenID() {
                return new Promise((resolve, reject) => {
                    wx.login({
                        success: res => {
                            this.$http
                                .get(this.$config.GLOBAL.baseUrl + 'api/wx_lite/open_id', {
                                    code: res.code,
                                    type: 'activity'
                                }).then(res => {
                                    res = res.data;
                                    if (res.status) {
                                        resolve(res.data.openid)
                                    } else {
                                        reject(res.messages);
                                    }

                            }, err => {
                                    reject('获取openid失败');
                            })
                        },
                        fail: (err) => {

                            console.log(err);
                            wx.hideLoading();
                            wx.showModal({
                                content: "获取openid失败",
                                showCancel: false
                            })
                        }
                    })
                })
            },
            pay() {
                wx.showLoading({
                    title: '正在支付',
                    mask: true
                })

                var token = this.$storage.get('user_token');
                console.log(token);
                this.getOPenID().then(res => {

                    var data = {
                        openid: res,
                        order_no: this.order_no,
                        channel: 'wx_lite'
                    };

                    this.$http
                        .post(this.$config.GLOBAL.baseUrl + 'api/activity/mini/create/charge',data, {
                            headers: {
                                Authorization: token
                            }
                        })
                        .then(res => {
                            res = res.data;
                            if (res.status) {

                                // 不需要判断支付方式
                                /*if (res.data.name == 'pingxx') {
                                    this.pingCharge(true, res.data.charge)
                                } else {
                                    this.charge(true, res.data.charge)
                                }*/

                                this.charge(true, res.data.charge)
                            } else {
                                this.charge(false, res.message)
                            }
                        }, err => {
                            this.charge(false)
                        })
                }).catch(() => {
                    wx.hideLoading();
                    wx.showModal({
                        content: '支付失败',
                        showCancel: false
                    })
                })
            },
            pingCharge(success, charge) {
                if (success) {
                    pingpp.createPayment(charge, (res, err) => {
                        if (res == 'success') {
//                            支付成功
                            wx.hideLoading();
                            console.log(this.info.activity.id);
                            wx.redirectTo({
                                url: '/pages/success/main?order_no=' + this.order_no
                            })

                        } else if (res == 'fail') {
//                            支付失败
                            wx.hideLoading();
                            wx.redirectTo({
                                url: '/pages/enrolmentDetail/main?id=' + this.info.activity.id
                            })
                        } else if (res == 'cancel') {
//                            取消支付
                            wx.hideLoading();
                            wx.redirectTo({
                                url: '/pages/enrolmentDetail/main?id=' + this.info.activity.id
                            })
                        }
                    })
                } else {
                    wx.hideLoading();
                    wx.showModal({
                        content: '请求支付失败，请重试！',
                        showCancel: false
                    })
                }
            },
            charge(success, charge) {
                if (success) {
                    if (charge.pay_scene == 'test') {
                        wx.hideLoading();
                        wx.showModal({
                            content: '不支持模拟支付',
                            showCancel: false
                        });

                    } else {
                        wx.requestPayment({
                            "timeStamp": charge.wechat.timeStamp,
                            "nonceStr": charge.wechat.nonceStr,
                            "package": charge.wechat.package,
                            "signType": charge.wechat.signType,
                            "paySign": charge.wechat.paySign,
                            success: res => {
                                if (res.errMsg == 'requestPayment:ok') {
                                    // 支付成功
                                    wx.hideLoading();
                                    wx.redirectTo({
                                        url: '/pages/success/main?order_no=' + this.order_no
                                    })

                                } else {
                                    wx.showModal({
                                        content: '调用支付失败！',
                                        showCancel: false
                                    })
                                }
                            },
                            fail: err => {
                                wx.hideLoading();
                                if (err.errMsg == 'requestPayment:fail cancel') {
//                                    取消支付
                                    wx.redirectTo({
                                        url: '/pages/enrolmentDetail/main?id=' + this.info.activity.id
                                    })
                                } else {
                                    wx.showModal({
                                        content: '调用支付失败！',
                                        showCancel: false
                                    })
                                }
                            }
                        })

                    }
                } else {
                    wx.hideLoading();
                    wx.showModal({
                        content: charge || '请求支付失败，请重试！',
                        showCancel: false
                    })
                }
            },
            jump(path) {
                wx.redirectTo({
                    url: path
                });
            }
        }
    }
</script>
<style rel="stylesheet/less" lang="less" type="text/less">
    @import "../../../static/global.less";

    #pay {
        .block-item {
            margin-top: 10px;
            background: #FFFFFF;
            .title {
                font-size: 14px;
                padding: 10px 15px;
                color: #2E2D2D;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .iconfont {
                    font-size: 12px;
                    color: #2E2D2D;
                }
            }
            &.goods {
                .goods-item {
                    display: flex;
                    padding: 5px 15px;
                    background: #FFFFFF;
                    .left {
                        position: relative;
                        width: 95px;
                        height: 95px;

                        image {
                            width: 100%;
                            height: 100%;
                        }
                        .required {
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            height: 22px;
                            line-height: 22px;
                            font-size: 12px;
                            color: #FFFFFF;
                            background: @globalColor;
                            text-align: center;
                            opacity: .8;
                        }
                    }
                    .right {
                        flex: 1;
                        overflow: hidden;
                        padding-left: 10px;
                        .name {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .price {
                            display: flex;
                            align-items: center;
                            margin-top: 10px;
                            .new {
                                color: @globalColor;
                                span {
                                    font-size: 12px;
                                }
                            }
                            .old {
                                padding-top: 6px;
                                font-size: 12px;
                                color: #9B9B9B;
                                text-decoration: line-through;
                                margin-left: 5px;
                            }
                        }
                        .btn-box {
                            color: #9B9B9B;
                            font-size: 13px;
                            margin-top: 10px;
                        }
                    }
                }
                .line {
                    padding: 10px 15px;
                    font-size: 12px;
                    line-height: 18px;
                    /* background-image: url('https://uto.ibrand.cc/m/static/img/ic_forward.png');
                     background-repeat: no-repeat;
                     background-position: 100%;
                     background-size: 15px;*/
                }
                .all-goods{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .good-box{
                        display: flex;
                        align-items: center;
                        flex: 1;
                        overflow: hidden;
                        .good-img{
                            display: inline-block;
                            width: 60px;
                            height: 60px;
                            margin-right: 10px;
                            img{
                                width: 100%;
                                height: 100%;
                                overflow: auto;
                            }
                        }
                    }
                    .num{
                        display: flex;
                        align-items: center;
                        color:#9b9b9b;
                        font-size: 12px;

                        .iconfont {
                            font-size: 12px;
                            margin-left: 10px;
                        }
                    }

                }
                .comm-account {
                    height: 40px;
                    line-height: 40px;
                    background: #fff;
                    text-align: right;
                    font-size: 12px;
                    padding: 0 12px;
                }
            }
        }
        .active-box {
            margin: 10px 0;
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
                    span {
                        font-size: 12px;
                    }
                    .subtitle{
                        color: #9c9c9c;
                        font-size: 12px;
                    }
                    .time,.address{
                        font-size: 12px;
                        color: #9B9B9B;
                        line-height: 16px;
                        padding-bottom: 5px;
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
                            font-size: 12px;
                            line-height: 16px;
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
        .point-box {
            margin-bottom: 10px;
            background: #ffffff;

            .point {
                display: flex;
                align-items: center;
                padding: 10px 15px;
                color: #4A4A4A;
                font-size: 14px;

                .value {
                    flex: 1;
                    text-align: right;
                    font-size: 12px;
                    color: #9B9B9B;
                }
            }
            .user-point {
                padding: 10px 15px;
                font-size: 16px;
                color: #2E2D2D;
                .radio-group {
                    .radio {
                        display: flex;
                        align-items: center;
                        display: inline-block;
                        width: 100%;

                        radio {
                            float: right;
                        }
                    }
                }
            }
        }
        .pay-info {
            font-size: 12px;
            padding: 0 15px;
            margin-top: 20px;
            color: @globalColor;

            .item {
                display: flex;
                align-items: center;
                margin: 2px 0;
                .name {
                    flex: 1;
                    color: #888888;
                }
            }
            .bottom {
                width: 100%;
                height: 40px;
                line-height: 40px;
                text-align: center;
                color: #ffffff;
                font-size: 16px;
                margin-top: 30px;
                background: @globalColor;
                border-radius: 6px;
            }
        }

        radio .wx-radio-input{
            border-radius: 100%;
            background-color: #fff;
            border: 1px solid #c1caca;
            box-shadow: 0 1px 2px rgba(0,0,0,.05), inset 0 -15px 10px -12px rgba(0,0,0,.05);
            height: 14px;
            width: 14px;
        }
        radio .wx-radio-input.wx-radio-input-checked::before{
            border-radius: 100%;
            background-color: @globalColor;
            border: 3px solid @globalColor;
        }

    }
</style>