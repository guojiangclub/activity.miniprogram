<template>
    <div id="release-activity">
        <!--下面的tabbar-->
        <div class="tabbar">
            <div class="mx-1px-right" @click="jumpMine(1)">活动列表</div>
            <div class="mx-1px-right active">发布活动</div>
            <div @click="jumpMine(2)">个人中心</div>
        </div>
        <!--内容开始-->
        <div class="content-top">
            <!--选择活动图片-->
            <div class="choose-img">
                <image mode="widthFix" src="../../static/image/choose-img.png"></image>
            </div>
            <!--活動名稱  活動詳情描述-->
            <div class="name-describle">
                <div class="name mx-1px-bottom">
                    <div class="topic">活动名称:</div>
                    <input type="text" placeholder="请输入活动名称" placeholder-class="input-placeholder"/>
                </div>
                <div class="describle">
                    <textarea name="" id="" cols="30" rows="10" placeholder="活动详情描述" placeholder-class="textarea-placeholder"></textarea>
                </div>
            </div>
            <!--報名細節-->
            <div class="attention-detail">
                <view class="section">
                    <div class="section__title">多列选择器</div>
                    <picker
                            mode="multiSelector"
                            @change="bindMultiPickerChange"
                            @columnchange="bindMultiPickerColumnChange"
                            :value="multiIndex"
                            :range="multiArray"
                    >
                        <div class="picker">
                            当前选择：{{multiArray[0][multiIndex[0]]}}，{{multiArray[1][multiIndex[1]]}}，{{multiArray[2][multiIndex[2]]}}
                        </div>
                    </picker>
                </view>
            </div>
        </div>



    </div>
</template>

<script>
    import {getUrl} from '../../utils';

    export default {
        data() {
            return {
                token: '',
                multiIndex: [0, 0, 0],
                multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'], ['猪肉绦虫', '吸血虫']],
            }
        },
        methods: {
//            選擇日期
            bindDateChange(e){
                this.entry_end_at = e.mp.detail.value;
            },
            //跳到我的活动去
            jumpMine(type) {
                var token = this.$storage.get('user_token');
                if (token) {
                    if (type == 1) {
                        wx.navigateTo({
                            url: '/pages/myActivity/main'
                        })
                    } else {
                        wx.reLaunch({
                            url: '/pages/user/main'
                        })
                    }
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
            },
        },
        // 分享
        onShareAppMessage() {
            return {
                title: '活动',
                path: '/pages/index/main'
            }
        },
        mounted() {
            var token = this.$storage.get('user_token');
            this.token = token;
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

    #release-activity {
        .tabbar {
            display: flex;
            position: fixed;
            bottom: 0;
            width: 100%;
            padding: 22px 0 12px 0;
            color: #909090;
            font-size: 16px;
            background-color: #FFFFFF;
            text-align: center;
            align-items: center;
            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 10px;
                background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.13) 100%);
            }
            div {
                flex: 1;
                border-radius: 0px;
                font-size: 16px;
                line-height: 25px;
            }
            .active {
                color: #FF2741;
            }
        }
        .choose-img{
            image{
                width: 100%;
                vertical-align: middle;
            }
        }
        .name-describle{
            background-color: #FFFFFF;
            padding:0 0 0 15px;
            margin-bottom: 10px;
            .name{
                display: flex;
                align-items: center;
                height: 50px;
                line-height: 50px;
                font-size: 14px;
                color:#333333;
                .topic{
                    flex: 1;
                    height: 100%;
                }
                input{
                    flex: 2;
                    height: 100%;
                }
                .input-placeholder{
                    color: #999999;
                }
            }
            .describle{
                padding:15px;
                textarea{
                    width: 100%;
                    height: 80px;
                    font-size: 14px;
                    line-height: 18px;
                }
                .textarea-placeholder{
                    color: #999999;
                    font-size: 14px;
                    line-height: 18px;
                }
            }
        }
        .attention-detail{
            .section{

            }
        }
    }
</style>
