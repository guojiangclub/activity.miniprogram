<template>
    <div id="releaseActivitySuccess">
        <div class="title">
            活动已上传成功
        </div>
       <div class="text">
           管理员将尽快为您审核
       </div>
        <div class="text">
            人工审核时间：9:00 - 18:00
        </div>
        <div class="text">
            如有紧急需求，请联系微信号：UTO666888
        </div>
        <div class="btn" @click="jump">
            知道了
        </div>
    </div>
</template>

<script>
    import {getUrl} from '../../utils';
    import PickerDate from '../../components/picker-date.vue';
    import wxParse from 'mpvue-wxparse';
    import tabBar from '../../components/tabbar';
    export default {
        components: {
            PickerDate,
            wxParse,
            tabBar
        },
        methods: {
            jump() {
                wx.reLaunch({
                    url: '/pages/index/main'
                })
            }
        }
    }
</script>

<style rel="stylesheet/less" lang="less" type="text/less">
    @import "../../../static/global.less";

    page {
        background-color: #F3F3F3;
        width: 100%;
        height: 100%;
    }
    #releaseActivitySuccess {
        background: #FFFFFF;
        padding: 10px 15px;
        .title {
            text-align: center;
            padding-bottom: 10px;
            color: @globalColor;
        }
        .text {
            font-size: 14px;
            color: #666666;
            margin-top: 5px;
        }
        .btn {
            height: 44px;
            line-height: 44px;
            text-align: center;
            color: #FFFFFF;
            background: @globalColor;
            margin: 20px 0;
        }
    }
</style>
