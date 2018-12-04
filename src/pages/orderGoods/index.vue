<template>
    <div id="order-goods">
        <div class="contents">
            <div class="block">
                <div class="title">
                    商品清单
                </div>
                <div class="line mx-1px-top line-comm" v-for="item in info.order.items">
                    <div class="left">
                        <img :src="item.item_meta.image" alt="">
                    </div>
                    <div class="right">
                        <div class="right-top">
                            <div class="text-over">{{item.item_name}}</div>
                            <div class="text-grey">{{item.quantity}}件</div>
                        </div>
                        <div class="right-bottom">
                            <div class="text-grey">{{item.item_meta.specs_text}}</div>
                            <div class="text-grey">￥{{item.total / 100}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                no: '',
                info: {
                    order: {
                        items: ''
                    }
                }
            }
        },
        mounted(){
            var order_no = this.$root.$mp.query.order_no;
            var block = this.$storage.get('activeOrder') || this.$storage.get('orderGoods');
            if (block && block.order.order_no == order_no) {
                this.info = block
            } else {
                wx.showModal({
                    content: '没有找到商品数据',
                    showCancel: false
                })
            }
        },
        methods: {

        }
    }
</script>
<style rel="stylesheet/less" lang="less" type="text/less">
    #order-goods{
        .contents{
            height: 100%;
            overflow: auto;
            box-sizing: border-box;
            .block {
                background-color: #ffffff;
                margin-bottom: 10px;

                .title {
                    height: 40px;
                    line-height: 40px;
                    font-size: 14px;
                    padding: 0 12px;
                }

                .line {
                    padding: 10px 25px 10px 12px;
                    font-size: 12px;
                    line-height: 18px;
                }

                /*快递*/
                .line-expr {
                    display: flex;

                    .express {
                        flex: 1;
                    }
                }

                /*收货地址*/
                .line-addr {

                    i{
                        display: block;
                        color: #9b9b9b;
                        margin-right: 8px;
                    }

                    .user {
                        display: flex;
                        align-items: center;
                        .name-box {
                            display: flex;
                            align-items: center;
                            flex: 1;
                            .name{
                                flex: 1;
                            }
                            span{
                                font-size: 14px;
                                display: block;
                                font-weight: bold;
                            }
                        }
                    }
                    .address {
                        display: flex;
                        align-items: center;
                        margin-top: 4px;
                        font-size: 12px;
                        color:#9b9b9b;
                    }
                }

                // 备注信息
                .line-remark {
                    padding-top: 0;
                    padding-bottom: 0;

                    input {
                        outline: none;
                        border: none;
                        width: 100%;
                        height: 40px;
                    }
                }

                // 商品清单
                .line-comm {
                    display: flex;
                    font-size: 12px;
                    line-height: 25px;
                    background: none;

                    .left img {
                        width: 50px;
                        height: 50px;
                        border: 1px solid #e5e5e5;
                        display: block;
                    }

                    .right {
                        flex: 1;
                        padding-left: 5px;
                        padding-right: 7px;
                        overflow: hidden;

                        .right-top {
                            display: flex;
                            justify-content: space-between;
                        }

                        .right-bottom {
                            display: flex;
                            justify-content: space-between;
                        }
                    }
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
                        color:#9b9b9b;
                        font-size: 13px;
                    }

                }
                .comm-account {
                    height: 40px;
                    line-height: 40px;
                    background: #FFFFFF;
                    text-align: right;
                    font-size: 12px;
                    padding: 0 12px;
                }

                // 优惠券
                .coupons {
                    display: flex;

                    .coupon-info {
                        flex: 1;
                    }
                }

                /*新优惠券*/
                .coupon-box{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 25px 0 12px;
                    height: 40px;
                    line-height: 40px;
                    background-image: url('/static/img/ic_forward.png');
                    background-repeat: no-repeat;
                    background-position: right center;
                    background-size: 15px;
                    .left{
                        font-size: 14px;
                    }
                    .right{
                        font-size: 13px;

                        .coupon-num{
                            color: #FFFFFF;
                            background:#ea4448;
                            border-radius:4px;
                            padding: 3px 7px;
                        }

                        .coupon-info{
                            color:#ea4448;
                        }
                    }
                }

                // 积分
                .title-point {
                    display: flex;
                    justify-content: space-between;

                    .view-point {
                        color: #01A2FF;
                        padding: 0 3px;
                    }
                }

                /*积分抵扣*/
                .no-point{
                    color: #838383;
                    height: 35px;
                    line-height: 35px;
                    padding: 0 12px;
                }
                .point-box{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 15px 12px;
                    .point-text{
                        overflow: hidden;
                        margin-right: 10px;
                    }
                    .point-num{
                        font-size: 12px;
                        color: #aaaaaa;
                    }
                }

                .new-point-box{
                    .titles{
                        display: flex;
                        align-items: center;
                        height: 45px;
                        line-height: 45px;
                        padding: 0 12px;
                        justify-content: space-between;
                    }
                    .point-text{
                        padding: 0 12px;
                        height: 40px;
                        line-height: 40px;
                        font-size:12px;
                        color:#9b9b9b;
                    }
                }
                /*优惠折扣*/
                .no-discounts{
                    color: #838383;
                    height: 40px;
                    line-height: 40px;
                    padding: 0 12px;
                    font-size: 12px;
                }
                .discounts{

                    .discounts-item{
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 12px;
                        height: 50px;

                    }
                }


                .line-point {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    font-size: 12px;
                    color: #838383;
                    background: none;

                    .use {
                        display: flex;
                        align-items: center;

                        .use-all {
                            flex: 1;
                            margin-right: 12px;
                        }

                        input {
                            width: 80px;
                            height: 30px;
                            border: 1px solid #e5e5e5;
                            outline: none;
                            appearance: none;
                            border-radius: 0;
                            text-align: center;
                        }
                    }

                    .result {
                        padding-top: 12px;
                    }
                }
            }
        }
    }
</style>