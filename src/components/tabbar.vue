<template>
    <cover-view class="tabbars">
        <cover-view class="item" @click="jumpPath(0, '/pages/index/main')"  :class="index == 0 ? 'active' : ''">
            活动列表
        </cover-view>
        <cover-view class="item mx-1px-left-right" @click="jumpPath(1, '/pages/releaseActivity/main')" :class="index == 1 ? 'active' : ''">
            发布活动
        </cover-view>
        <cover-view class="item" @click="jumpPath(2, '/pages/user/main')" :class="index == 2 ? 'active' : ''">
            个人中心
        </cover-view>
    </cover-view>
</template>

<script>
    import { getUrl } from '../utils';

    export default {
        props: {
            index: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {

            }
        },
        methods: {
            jumpPath(index, url) {
                var token = this.$storage.get('user_token');
                if (this.index == index) return;
                if (index == 2) {
                    if (token) {
                        wx.reLaunch({
                            url: url
                        })
                    } else {
                        var url = getUrl();
                        wx.showModal({
                            content: '请先登录',
                            success: res => {
                                if (res.confirm) {
                                    wx.navigateTo({
                                        url: '/pages/register/main?url=' + url
                                    })
                                }
                            }
                        })
                    }
                } else {
                    wx.reLaunch({
                        url: url
                    })
                }
            }
        }
    }
</script>

<style rel="stylesheet/less" lang="less">
    .tabbars{
        display: flex;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: #909090;
        font-size: 16px;
        background-color: #FFFFFF;
        text-align: center;
        align-items: center;
        /*&::before{
            content: '';
            position: absolute;
            top:0;
            left: 0;
            right: 0;
            height: 10px;
            background:linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(0,0,0,0.13) 100%);
        }*/
        .item{
            flex: 1;
            border-radius: 0px;
            font-size:16px;
            line-height: 25px;
        }
        .active{
            color:#FF2741;
        }
    }
</style>