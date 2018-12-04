<template>
    <div>

    </div>
</template>

<script type="text/ecmascript-6">
    import { getUrl } from '../../utils';
    export default {
        data() {
          return {
              id: '',
              code: ''
          }
        },
        mounted() {
            this.id = this.$root.$mp.query.id;
            this.code = this.$root.$mp.query.code;
            var scene = this.$root.$mp.query.scene;
            if (scene) {
                var scene = decodeURIComponent(this.$root.$mp.query.scene);
                var sceneArr = scene.split(',');
                if (sceneArr.length > 0) {
                    this.id = sceneArr[0];
                    this.code = sceneArr[1]
                }
            }
            var token = this.$storage.get('user_token');
            var url = getUrl();
            if (!token) {
                wx.navigateTo({
                    url: '/pages/register/main?url=' + url
                })
            } else {
                this.signIn();
            }
        },
        methods: {
            signIn() {
                wx.showLoading({
                    title:"正在签到",
                    mask:true
                });
                var id = this.id;
                var code = this.code;
                var token = this.$storage.get('user_token');
                this.$http.post(this.$config.GLOBAL.baseUrl + 'api/activity/sign/' + id, {
                    code: code
                }, {
                    headers:{
                        Authorization: token
                    }
                }).then(res => {
                    res = res.data;
                    if (res.status) {
                        wx.showModal({
                            content:res.message || "签到成功",
                            showCancel:false,
                            success: res => {
                                if (res.confirm) {
                                    wx.redirectTo({
                                        url: '/pages/index/main'
                                    })
                                }
                            }
                        })
                    } else {
                        wx.showModal({
                            content:res.message || "请求失败",
                            showCancel:false,
                            success: res => {
                                if (res.confirm) {
                                    wx.redirectTo({
                                        url: '/pages/index/main'
                                    })
                                }
                            }
                        })
                    }
                    wx.hideLoading();
                }, err => {
                    wx.hideLoading();
                    wx.showModal({
                        content: '请求失败，请重试',
                        showCancel: false,
                        success: res => {
                            if (res.confirm) {
                                wx.redirectTo({
                                    url: '/pages/index/main'
                                })
                            }
                        }
                    })
                })
            }
        }
    }
</script>