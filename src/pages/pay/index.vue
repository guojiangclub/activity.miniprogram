<template>
    <div id="pay">

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
                time: ''
            }
        },
        mounted(){
            this.id = this.$root.$mp.query.id
            this.getLoginDetail(this.id);
        },
        methods: {
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

    #pay {

    }
</style>