<template>
    <div id="success">
        <block v-if="init">
            <div class="wrap mx-1px-bottom">
                <div class="title">
                    <span v-if="sign.activity.fee_type == 'OFFLINE_CHARGES'">预约成功</span>
                    <span v-else>{{text}}</span>
                </div>
                <div class="desc" v-if="sign.activity.fee_type == 'OFFLINE_CHARGES'">
                    您已成功预约该活动，请尽快联系教练进行线下支付。
                </div>
            </div>
            <div class="wrap active-info">
                <div class="info-title">
                    {{sign.activity.title}}
                </div>
                <div class="info-item">
                    <div class="name">
                        时间:
                    </div>
                    <div class="text">
                        {{time}}
                    </div>
                </div>
                <div class="info-item">
                    <div class="name">
                        地址:
                    </div>
                    <div class="text">
                        {{sign.activity.address}}
                    </div>
                </div>
                <div class="info-item" v-if="sign.activity.coach">
                    <div class="name">
                        教练:
                    </div>
                    <div class="text">
                        {{sign.activity.coach.nick_name}}
                    </div>
                </div>
                <div class="info-item" v-if="sign.activity.coach">
                    <div class="name">
                        手机号:
                    </div>
                    <div class="text">
                        {{sign.activity.coach.mobile}}
                    </div>
                </div>
            </div>

            <div class="wrap active-info mx-1px-top" v-if="sign.formData && sign.formData.length">
                <div class="info-title">
                    报名表单信息
                </div>
                <div class="info-item" v-for="item in sign.formData">
                    <div class="name">
                        {{item.key}}:
                    </div>
                    <div class="text">
                        {{item.value}}
                    </div>
                </div>
            </div>
            <div class="buttom" @click="jump('/pages/myActivity/main')">
                查看我的报名
            </div>
        </block>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                sign: {
                    activity: {
                        coach: {}
                    },
                },
                time: '',
                init: false,
                order_no: '',
                text: '报名成功'
            }
        },
        mounted(){
            this.order_no = this.$root.$mp.query.order_no;
            this.init = false;
            this.sign = {
                activity: {
                    coach: {}
                }
            };
            wx.showLoading({
                title: '验证中'
            });
           setTimeout(() => {
               this.getLoginDetail(this.order_no);
           }, 500)
        },
        methods: {
//           验证支付状态
            getLoginDetail(order_no) {
                var token = this.$storage.get('user_token')
                this.$http
                    .post(this.$config.GLOBAL.baseUrl + 'api/activity/mini/order/paid', {
                        order_no: order_no
                    }, {
                        headers: {
                            Authorization: token
                        }
                    })
                    .then(res => {
                        console.log(res);
                        res = res.data;
                        if (res.status) {
                            this.sign = res.data;
                            this.time = getApp().timefiter(res.data.activity.starts_at, res.data.activity.ends_at);
                            this.init = true;

                            if (!res.data.pay_status) {
                                this.text = '支付失败'
                            }
                        } else {
                            wx.showModal({
                                content: res.message || "请求失败",
                                showCancel: false
                            })
                        }
                        wx.hideLoading()
                    }, err => {
                        wx.showModal({
                            content: '请求失败，请重试',
                            showCancel: false,
                        })
                        wx.hideLoading()
                    })
            },
            jump(path) {
                wx.redirectTo({
                    url: path
                });
            }
        }
    }
</script>
<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";

    #success {
        .wrap {
            padding: 12px;
            background: #ffffff;
            font-size: 14px;
            line-height: 25px;
            text-align: center;
            .title {
                font-weight: bold;
                line-height: 70px;
                font-size: 30px;
                color: #fe7f15;
            }
            .desc {
                color: #959595;
            }

            &.active-info {
                color: #959595;
                text-align: left;
                .info-title {
                    font-size: 16px;
                    color: #000;
                    padding-bottom: 5px;
                }
                .info-item {
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    .name{
                        margin-right: 5px;
                    }
                    .text {
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        flex: 1;
                    }
                }
            }
        }
        .buttom {
            position: fixed;
            bottom: 0;
            height: 50px;
            line-height: 50px;
            width: 100%;
            text-align: center;
            background: @globalColor;
            color: #ffffff;
        }
    }
</style>