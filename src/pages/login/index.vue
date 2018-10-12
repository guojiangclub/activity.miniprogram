<template>
    <view id="login">
        <div class="tips" v-show="message">{{message}}</div>
        <!--<view class="register_header iconfont icon-youhuiquan"></view>-->
        <div class="register_input">
            <div class="tellphone">
                <input type="text" placeholder="手机号码" v-model="tellphone" placeholder-class="input-placeholder"/>
            </div>
            <div class="code">
                <div class="writecode">
                    <input type="text" placeholder="验证码" v-model="identifyingcode" placeholder-class="input-placeholder"/>
                </div>

                <div class="getCode" @click="getCode">{{codes.codeText}}</div>
            </div>
        </div>
        <div class="submit">
            <button type="default" :class="checked ? 'check' : ''" @click="submit" :disabled="showLoading" :loading="showLoading">快速登录/注册</button>
        </div>
        <div class="select">
            <checkbox @click="changeChecked" color="#fff" :checked="checked"/>
            <text> 同意《{{brand}}》用户协议</text>
        </div>
    </view>
</template>

<script>

    import {is} from '@/utils/index'
    export default{
        data(){
            return {
                codes: {
                    total: 60,
                    access_token: null,
                    codeText: "获取验证码"
                },
                tellphone: "",
                identifyingcode: "",
                sending: false,
                checked: false,
                showLoading: false,
                message: "",
                open_id: '',
                brand: this.$config.BRAND.name,

                url: '',
                code: '',
                shop_id: '',
                unionInFo: '',
                openInFo: ''
            }
        },
        mounted(){
            var url = this.$root.$mp.query.url;
            var open_id = this.$root.$mp.query.open_id
            if (url) {
                this.url = decodeURIComponent(url);
            };
            if (open_id) {
                this.open_id = open_id;
            }
            var token = this.$storage.get('user_token');
            this.token = token;

            if (token) {
                wx.redirectTo({
                    url: '/pages/index/main'
                })
            }
        },
        methods: {
//            登录按钮切换
            changeChecked(e){
                // console.log(e);
                this.checked = !this.checked
            },
            getCode() {
                if (this.sending) return;
                var randoms = this.random();
                this.sending = true;
                this.codes.codeText = "短信发送中";
                this.codes.access_token = randoms;
                var fn;
                fn = this.getLoginCode;
                fn(() => {
                    var total = this.codes.total;
                    this.codes.codeText = total + "秒后再发送"
                    var timer = setInterval(() => {
                        total--;
                        this.codes.codeText = total + "秒后再发送"
                        if (total < 1) {
                            this.sending = false;
                            this.codes.codeText = '获取验证码';
                            clearInterval(timer);
                        }
                    }, 1000);
                }, () => {
                    this.sending = false;
                    this.codes.codeText = '获取验证码';
                });

            },
            getLoginCode(resolve, reject) {
                var message = null;
                if (!is.has(this.tellphone)) {
                    message = "请输入您的手机号";
                } else if (!is.mobile(this.tellphone)) {
                    message = '手机号格式不正确，请重新输入';
                }

                if (message) {
                    this.message = message;
                    reject();
                    setTimeout(() => {
                        this.message = ''
                    }, 3000)
                    return
                }

                this.$http
                    .post(this.$config.GLOBAL.baseUrl + 'api/sms/verify-code', {
                        mobile: this.tellphone,
                        access_token: this.codes.access_token
                    }).then(res => {
                    res = res.data;
                    if (res.success) {
                        resolve();
                    } else {
                        wx.showModal({
                            content: res.message || '请求失败，请重试',
                            showCancel: false,
                        })
                        reject();
                    }
                })
            },
            random(){
                return Math.random().toString(36).substr(2, 24);
            },
//            登录
            submit() {
                var message = null;
                if (!is.has(this.tellphone)) {
                    message = "请输入您的手机号";
                } else if (!is.mobile(this.tellphone)) {
                    message = '手机号格式不正确，请重新输入';
                } else if (!is.has(this.identifyingcode)) {
                    message = "请填写验证码";
                } else if (!is.has(this.checked)) {
                    message = "请同意此协议";
                }

                if (message) {
                    this.message = message;

                    setTimeout(() => {
                        this.message = ''
                    }, 3000)
                    return
                }

                this.showLoading = true;
                this.quickLogin();
            },
            quickLogin() {
                var that = this;
                var data = {
                    grant_type: 'sms_token',
                    access_token: that.codes.access_token,
                    mobile: that.tellphone,
                    code: that.identifyingcode,
                    open_type: 'miniprogram',
                    open_id: that.open_id,
                }

                this.$http
                    .post(this.$config.GLOBAL.baseUrl + 'api/oauth/sms', data)
                    .then(res => {
                        res = res.data;
                        if (res.access_token) {
                            var result = res;
                            if (result.access_token) {
                                result.access_token = result.token_type + ' ' + result.access_token;
                                var expires_in = result.expires_in || 315360000;
                                this.$storage.set("user_token", result.access_token, expires_in);
                                if (this.url) {
                                    var path = [
                                        'pages/entity/store/store',
                                        'pages/index/index/index',
                                        'pages/index/classification/classification',
                                        'pages/store/tabCart/tabCart',
                                        'pages/user/personal/personal'
                                    ];
                                    var pathIndex = path.indexOf(this.url);
                                    if (pathIndex == -1) {
                                        wx.redirectTo({
                                            url: "/" + this.url
                                        })
                                    } else {
                                        wx.switchTab({
                                            url: "/" + this.url
                                        })
                                    }
                                } else {
                                    wx.redirectTo({
                                        url: '/pages/index/main'
                                    })
                                }
                            }
                        } else {
                            wx.showModal({
                                content: res.message || "验证码不正确",
                                showCancel: false
                            });
                        }
                        this.showLoading = false;
                    }, err => {
                        wx.showModal({
                            content: "请求失败",
                            showCancel: false
                        });
                        this.showLoading = false;
                    })
            }

        }
    }
</script>

<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";

    body {
        background: #ffffff;
    }

    #login {
        font-size: 16px;
        background-color: #ffffff;
        padding: 0 15px;
        margin-top: 50px;

        .tips {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            text-align: center;
            line-height: 35px;
            background-color: #e64340;
            height: 35px;
            color: #FFFFFF;
        }
        .register_header {
            padding: 36px 0 56px 0;
            text-align: center;
            color: @globalColor;
            font-size: 30px;
        }
        .register_input {
            margin-bottom: 60px;
            .tellphone {
                background: rgba(155, 155, 155, .3);
                margin-bottom: 20px;
                border-radius: 4px;
                input {
                    padding: 15px 0 15px 15px;
                    border-radius: 4px;
                }
                .input-placeholder {
                    color: #9B9B9B;
                    font-size: 14px;
                }

            }
            .code {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .writecode {
                    width: 60%;
                    background: rgba(155, 155, 155, .3);
                    border-radius: 4px;
                    input {
                        padding: 15px 0 15px 15px;
                    }
                    .input-placeholder {
                        color: #9B9B9B;
                        font-size: 14px;
                    }
                }
                .getCode {
                    padding: 15px 0;
                    flex: 1;
                    margin-left: 17px;
                    background-color: #EB7073;
                    text-align: center;
                    color: #FFFFFF;
                    border-radius: 4px;
                    font-size: 14px;
                }
            }
        }
        .select {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 15px;
            color: #4A4A4A;
            font-size: 12px;

            //重置按钮样式
            checkbox .wx-checkbox-input {
                background-color: #fff;
                border: 1px solid #c1caca;
                box-shadow: 0 1px 2px rgba(0, 0, 0, .05), inset 0 -15px 10px -12px rgba(0, 0, 0, .05);
                height: 14px;
                width: 14px;
            }
            checkbox .wx-checkbox-input.wx-checkbox-input-checked {
                background-color: @globalColor;
                border: 1px solid @globalColor;
            }
        }
        .submit {

            button {
                //position: static;
                color: #ffffff;
                padding: 10px 0;
                border: none;
                border-radius: 4px;
                background-color: #C9C8C8;
                font-size: 16px;
                &.check {
                    background: @globalColor;
                }
            }
        }

    }

</style>