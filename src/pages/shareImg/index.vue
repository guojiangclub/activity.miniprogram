<template>
    <div id="shareImg">
        <div class="img-box">
            <img mode="widthFix" :src="img.url" alt="">
        </div>
        <div class="btn-box" v-if="img.url">
            <div class="btn" @click="downImg">保存图片</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                img: ''
            }
        },
        mounted(){
            this.img = '';
            this.getImg();
        },
        methods: {
            getImg() {
                var id = this.$root.$mp.query.id;
                var path = this.$root.$mp.query.path;
                var token = this.$storage.get('user_token');
                if (!token) {

                } else {
                    wx.showLoading({
                        title: "图片生成中",
                        mask: true
                    });
                    this.$http.post(this.$config.GLOBAL.baseUrl + 'api/activity/share', {
                        activity_id: id,
                        page: path
                    }, {
                        headers: {
                            Authorization: token
                        }
                    })
                        .then(res => {
                            res = res.data;
                            if (res.status) {
                                this.img = res.data;
                            } else {
                                wx.showModal({
                                    content: res.message || '生成图片失败',
                                    showCancel: false
                                })
                            }
                            wx.hideLoading();
                        }, err => {
                            wx.showModal({
                                content: '生成图片失败',
                                showCancel: false
                            })
                            wx.hideLoading();
                        })
                }

            },
            // 下载图片
            downImg() {
                if (this.img.url) {
                    wx.showLoading({
                        title: '正在下载',
                        mask: true
                    });
                    wx.downloadFile({
                        url: this.img.url,
                        success: res => {
                            if(res.statusCode == 200) {
                                wx.getSetting({
                                    success: ret => {
                                        // 如果之前没有授权
                                        if (!ret.authSetting['scope.writePhotosAlbum']) {
                                            wx.authorize({
                                                scope: 'scope.writePhotosAlbum',
                                                success: rej => {
                                                    this.saveImg(res.tempFilePath);
                                                },
                                                // 用户拒绝授权
                                                fail: ret => {
                                                    wx.openSetting({
                                                        success: res => {
                                                            if (!res.authSetting['scope.writePhotosAlbum']) {
                                                                wx.openSetting({
                                                                    success: res => {

                                                                    }
                                                                })
                                                            }
                                                        }
                                                    })
                                                }
                                            })
                                        } else {
                                            this.saveImg(res.tempFilePath);
                                        }
                                    }
                                })
                            } else {
                                wx.hideLoading();
                                wx.showToast({
                                    title: '下载图片失败',
                                    icon: 'none'
                                })
                            }

                        }
                    });
                }
            },
            // 保存图片
            saveImg(path) {
                wx.saveImageToPhotosAlbum({
                    filePath: path,
                    success: res => {
                        wx.hideLoading();
                    },
                    fail: rej => {
                        wx.hideLoading();
                        wx.showToast({
                            title: '保存图片失败',
                            icon: 'none'
                        })
                    }
                })
            },
        }

    }
</script>

<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";

    #shareImg {

        .img-box {
            padding: 10px 15px;
        }
        img {
            width: 100%;
            border-radius:6px;
            box-sizing: border-box;
            overflow: hidden;
            margin-bottom: 80px;
        }
        .btn-box {
            position: fixed;
            bottom: 0;
            width: 100%;
            background: #ffffff;
            padding: 10px 0;
            text-align: center;

            .btn {
                color: #ffffff;
                font-size: 16px;
                display: inline-block;
                text-align: center;
                height: 44px;
                line-height: 44px;
                background: @globalColor;
                padding: 2px 30px;
                margin: 0 auto;
                border-radius: 44px;
            }
        }
    }

</style>
