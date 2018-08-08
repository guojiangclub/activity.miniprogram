<template>
    <div id="register">
        <div class="phone__warning">
            <image :src="logo"></image>
            <!--<i class="iconfont icon-anquanjinggao"></i>-->
        </div>
        <button class="wechat-phoneBtn phone__btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
            <i class="iconfont icon-hudong"></i>
            <div class="btn__text">微信登录</div>
        </button>
        <div class="again-phoneBtn phone__btn" @click="jumpLogin">
            <i class="iconfont icon--dianhua"></i>
            <div class="btn__text">手机号登录</div>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return {
                url: '',
                logo: this.$config.BRAND.logo,
                code: '',
                open_id: '',
                union_id: '',
                token: '',
                userInfo: {
                    userInfo: {}
                }
            }
        },
        mounted(){
            var url = this.$root.$mp.query.url;
            if (url) {
                this.url = decodeURIComponent(url);
            }
            ;

            var token = this.$storage.get('user_token');
            this.token = token;

            if (token) {
                wx.redirectTo({
                    url: '/pages/index/main'
                })
            } else {
                this.wxLogin();
            }
        },
        methods: {
//            获取到的code
            wxLogin() {
                wx.showLoading({
                    title: '正在自动登录',
                    mask: true
                })
                wx.login({
                    success: res => {
                        if (res.code) {
                            this.autoLogin(res.code);
                        } else {
                            wx.showToast({
                                title: '获取code失败',
                                image: '../../../assets/image/error.png'
                            })
                        }
                    }
                })
            },
//            利用获取到的code登录
            autoLogin(code) {
                this.$http
                    .post(this.$config.GLOBAL.baseUrl + 'api/oauth/MiniProgramLogin', {
                        code: code,
                        open_type: 'miniprogram'
                    }).then(res => {
                    res = res.data;
                    if (res.data && res.data.open_id) {
                        this.open_id = res.data.open_id
                        return
                    }

                    // 如果接口返回token就直接登录，如果没有则弹出授权
                    if (res.access_token) {
                        wx.hideLoading();
                        var access_token = res.token_type + ' ' + res.access_token;
                        var expires_in = res.expires_in || 315360000;
                        this.$storage.set("user_token", access_token, expires_in);
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
                    } else {
                        // 弹出授权
                        this.getUserAuthorize();
                    }
                }, err => {
                    wx.showModal({
                        content: '请求失败，请重试',
                        showCancel: false,
                        success: res => {
                            if (res.confirm || (!res.cancel && !res.confirm)) {
                                this.wxLogin();
                            }
                        }
                    })
                })

            },
//            获取用户授权
            getUserAuthorize() {
                wx.getSetting({
                    success: res => {
                        // 如果之前没有授权
                        if (!res.authSetting['scope.userInfo']) {
                            // 重新请求用户授权
                            wx.authorize({
                                scope: 'scope.userInfo',
                                success: res => {
                                    this.getUserInfo();
                                },
                                // 用户拒绝授权
                                fail: ret => {
                                    wx.hideLoading();
                                    wx.showModal({
                                        content: '需要授权才能登录',
                                        showCancel: false,
                                        success: res => {
                                            if (res.confirm || (!res.cancel && !res.confirm)) {
                                                wx.openSetting({
                                                    success: res => {
                                                        if (res.authSetting['scope.userInfo']) {
                                                            this.getUserInfo();
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        } else {
                            this.getUserInfo();
                        }
                    }
                })
            },
            // 封装获取用户信息
            getUserInfo() {
                wx.login({
                    success: res => {
                        wx.getUserInfo({
                            lang: 'zh_CN',
                            withCredentials: true,
                            success: res => {
                                this.login(res);
                                this.userInfo = res
                                this.$storage.set('login_user_info', res.userInfo)
                            }
                        })
                    }
                })
            },
            // 封装登录
            login(data) {
                this.$http
                    .post(this.$config.GLOBAL.baseUrl + 'api/oauth/MiniProgramUnionIdLogin', {
                        iv: data.iv,
                        encryptedData: data.encryptedData,
                        open_id: this.open_id,
                        userInfo: data.userInfo,
                        open_type: 'miniprogram',
                    }).then(res => {
                    res = res.data;
                    wx.hideLoading();

                    // 如果接口返回token就直接登录
                    if (res.access_token) {
                        var access_token = res.token_type + ' ' + res.access_token;
                        var expires_in = res.expires_in || 315360000;
                        this.$storage.set("user_token", access_token, expires_in);
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
                    } else {
                        var data = {
                            open_id: res.data.open_id,
                            union_id: res.data.union_id
                        }
                        this.$storage.set('user_login_idInfo', data);
                        this.open_id = res.data.open_id;
                        this.union_id = res.data.union_id
                    }


                    if (!res.status && !res.access_token) {
                        wx.showModal({
                            content: res.message || '请求失败，请重试',
                            showCancel: false,
                            success: res => {
                                if (res.confirm || (!res.cancel && !res.confirm)) {
                                    this.login(this.data.userInfo);
                                }
                            }
                        })
                    }
                }, err => {
                    wx.showModal({
                        content: res.message || '请求失败，请重试',
                        showCancel: false,
                        success: res => {
                            if (res.confirm || (!res.cancel && !res.confirm)) {
                                this.login(this.data.userInfo);
                            }
                        }
                    })
                })
            },
//            获取手机号
            getPhoneNumber(e) {
                console.log(e.mp.detail.encryptedData);
                if (e.mp.detail.encryptedData) {
                    wx.login({
                        success: res => {
                            if (res.code) {
                                this.code = res.code;
                                this.phone(e)
                                /*this.setData({
                                 code: res.code
                                 }, res => {
                                 this.phone(e);
                                 })*/
                            } else {
                                wx.showModal({
                                    content: " 获取code失败",
                                    showCancel: false
                                })
                            }
                        }
                    });
                    return
                } else {
                    this.jumpLogin();
                }
            },
//            利用手机号直接登录
            phone(e) {
                this.$http
                    .post(this.$config.GLOBAL.baseUrl + 'api/oauth/MiniProgramMobileLogin', {
                        open_type: 'miniprogram',
                        code: this.code,
                        encryptedData: e.mp.detail.encryptedData,
                        iv: e.mp.detail.iv,
                        open_id: this.open_id,
                        union_id: this.union_id,
                        userInfo: this.userInfo.userInfo,
                    }).then(res => {
                    res = res.data;
                    if (res.access_token) {
                        var access_token = res.token_type + ' ' + res.access_token;
                        var expires_in = res.expires_in || 315360000;
                        this.$storage.set("user_token", access_token, expires_in);
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
                    } else {
                        wx.showModal({
                            content: res.message || '请求失败，请重试',
                            showCancel: false
                        })
                    }
                }, err => {
                    wx.showModal({
                        content: '请求失败，请重试',
                        showCancel: false
                    })
                })
            }
        }
    }
</script>

<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";

    #register {
        //margin-top: 100px;
        padding: 0 15px;
        .phone__warning {
            text-align: center;
            width: 80px;
            height: 80px;
            margin: 80px auto 180px auto;
            border-radius: 100%;
            overflow: hidden;

            image {
                width: 100%;
                height: 100%;
            }
            i {

                color: #FFBE00;
                font-size: 50px;
            }
        }
        .phone__text {
            font-size: 14px;
            color: #888888;
            line-height: 20px;
            margin-bottom: 32px;
        }
        .phone__btn {
            width: 100%;
            padding: 15px 0;
            line-height: 1;
            font-size: 17px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
            &.wechat-phoneBtn {
                color: #FFFFFF;
                background: @globalColor;
                border: @globalColor;
                margin-bottom: 20px;
            }
            &.again-phoneBtn {
                color: @globalColor;
                background: #ffffff;
                border: 1px solid @globalColor;
            }
            i {
                padding-right: 10px;
            }
        }
    }

</style>