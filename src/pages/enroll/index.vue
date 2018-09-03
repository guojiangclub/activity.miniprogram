<template>
    <div id="enroll">
        <div class="title mx-1px-bottom">
            活动场次
        </div>
        <div class="info-box">
            <div class="active-type">
                {{ sign.activity.title }}
            </div>
            <div class="time">
                {{time}}
            </div>
        </div>
        <div class="user-info">
            <div class="info-title info-item mx-1px-bottom">
                <div class="titles">
                    报名人信息
                </div>
                <div class="edit" @click="edit">
                    编辑
                </div>
            </div>
            <div class="info-item mx-1px-bottom">
                <div class="name">
                    昵称
                </div>
                <div class="text">
                    {{ sign.user.nick_name }}
                </div>
            </div>
            <div class="info-item mx-1px-bottom">
                <div class="name">
                    手机号码
                </div>
                <div class="text">
                    {{ sign.user.mobile }}
                </div>
            </div>
            <div class="info-item mx-1px-bottom">
                <div class="name">
                    上衣尺码
                </div>
                <div class="text">
                    {{ sign.size ? sign.size.upper : "" }}
                </div>
            </div>
            <div class="info-item mx-1px-bottom">
                <div class="name">
                    裤子尺码
                </div>
                <div class="text">
                    {{ sign.size ? sign.size.lower : "" }}
                </div>
            </div>
            <div class="info-item">
                <div class="name">
                    鞋子尺码
                </div>
                <div class="text">
                    {{ sign.size ? sign.size.shoes : "" }}
                </div>
            </div>
        </div>
        <div class="pay-type">
            <div class="title mx-1px-bottom">
                支付方式
            </div>
            <div class="text">
                线下审核支付
            </div>
        </div>
        <div class="buttom" @click="submit">
            提交订单
        </div>
    </div>
</template>

<script>
    import { getUrl } from '../../utils'
    export default{
        data(){
            return {
                id: '',
                sign: {
                    activity: {},
                    user: {}
                },
                time: ''
            }
        },
        onShow(){
            this.id = this.$root.$mp.query.id
            this.getLoginDetail(this.id);
//            将旧数据清空
        },
        methods: {
//            提交报名信息
            submit() {
               wx.showLoading({
                   title: '正在提交',
                   mask: true
               });

                if (this.sign.size != null && this.sign.size.upper && this.sign.size.lower && this.sign.size.shoes) {
                    var data = {
                        activity_id: this.id,
                        payment_id: this.sign.activity.payments[0].id
                    }
                    this.submitInfo(data);
                } else {
                    wx.hideLoading();
                    wx.showModal({
                        content: '请先完善报名资料中的服装尺码信息！',
                        showCancel: false
                    })
                }
            },
//            获取报名信息
            getLoginDetail(id) {
                var token = this.$storage.get('user_token')
                this.$http
                    .get(this.$config.GLOBAL.baseUrl + 'api/activity/checkout/' + id, {}, {
                        headers: {
                            Authorization: token
                        }
                    })
                    .then(res => {
                    res = res.data;
                    if (res.status) {
                        this.sign = res.data;

                        this.time = getApp().timefiter(res.data.activity.starts_at, res.data.activity.ends_at)
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
//            报名
            submitInfo(data) {
                let token = this.$storage.get('user_token');
                let payment_id = data.payment_id ? data.payment_id : '';
                let actvityForm = data.actvityForm ? data.actvityForm : {};
                this.$http
                    .post(this.$config.GLOBAL.baseUrl + 'api/activity/checkout/' + data.activity_id, {
                        payment_id,
                        activityForm: actvityForm
                    }, {
                        headers: {
                            Authorization: token
                        }
                    }).then(res => {
                        res = res.data;
                        if (res.status) {
                            if (res.data.activity.fee_type == "CHARGING") {
                                wx.redirectTo({
                                    url: '/pages/pay/main?order_no=' + res.data.order_no
                                });
                            } else if (res.data.activity.fee_type == "OFFLINE_CHARGES") {
                                wx.redirectTo({
                                    url: '/pages/success/main?order_no=' + res.data.order_no
                                });
                            }
                        } else {
                            wx.showModal({
                                content: res.message || "请求失败",
                                showCancel: false
                            })
                        }
                    wx.hideLoading();
                }, err => {
                    wx.showModal({
                        content: '请求失败，请重试',
                        showCancel: false,
                    })
                    wx.hideLoading();
                })
            },
//            填写个人资料
            edit() {
                var url = getUrl();
                wx.navigateTo({
                    url: '/pages/usersetting/main?url=' + url
                })
            }
        }
    }
</script>

<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";
    #enroll {
        .title {
            padding: 0 12px;
            font-size: 16px;
            color: #000;
            font-weight: bold;
            height: 44px;
            line-height: 44px;
            background: #ffffff;
        }
        .info-box {
            padding: 12px;
            background: #ffffff;
            .active-type {
                font-size: 16px;
            }
            .time {
                font-size: 14px;
                color: #959595;
            }
        }
        .user-info {
            background: #ffffff;
           margin: 10px 0;
            .info-item {
                display: flex;
                align-items: center;
                padding: 12px;

                .name {
                    font-size: 15px;
                    width: 80px;
                    color: #959595;
                }
                .text {
                    font-size: 15px;
                    color: #000;
                }
                &.info-title {
                    .titles {
                        flex: 1;
                        font-size: 16px;
                    }
                    .edit {
                        font-size: 15px;
                        color: #0479ff;
                    }
                }
            }
        }
        .pay-type {
            background: #ffffff;
            .text {
                font-size: 16px;
                padding: 12px;
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