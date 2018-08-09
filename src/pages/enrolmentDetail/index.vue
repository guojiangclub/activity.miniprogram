<template>
    <div id="enrol_index">
        <div class="ac-status">
            <div class="status-title">
                <span class="txt">活动状态：</span>
                <span class="btn">已报名</span>
            </div>
            <div class="item mx-1px-bottom">
                <div class="info-left">
                    <image :src="enrolData.img_list" mode="aspectFill"></image>
                </div>
                <div class="info-rigth">
                    <div class="name">{{enrolData.title}}</div>
                    <div class="time">{{enrolData.time_section}} </div>
                    <div class="address">{{enrolData.address}}</div>
                    <div class="money">
                        <span class="text subtitle" v-if="enrolData.fee_type != 'OFFLINE_CHARGES' && enrolData.fee_type != 'CHARGING'">{{enrolData.subtitle}}</span>
                        <span class="text" v-if="enrolData.payments && enrolData.payments.type == 0">{{enrolData.payments.point}}积分</span>
                        <span class="text" v-if="enrolData.payments && enrolData.payments.type == 1"><span>￥</span>{{enrolData.payments.price}}</span>
                        <span class="text" v-if="enrolData.payments && enrolData.payments.type == 2"><span>￥</span>{{enrolData.payments.price}}+{{enrolData.payments.point}}积分</span>
                        <span class="text" v-if="enrolData.payments && enrolData.payments.type == 4"><span>￥</span>{{enrolData.payments.price}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="ac-intro">
            <div class="title mx-1px-bottom">活动信息：</div>
            <div class="intro-content">
                <div class="info">
                    <div class="info.tit">活动时间</div>
                    <div class="info.detail">2018/04/30</div>
                </div>
                <div class="info">
                    <div class="info.tit">活动地点</div>
                    <div class="info.detail">湖南省长沙市岳麓区橘子洲景区前门口前50米处</div>
                </div>
                <div class="info">
                    <div class="info.tit">活动领队</div>
                    <div class="info.detail">黔在在</div>
                </div>
                <div class="info">
                    <div class="info.tit">领队电话</div>
                    <div class="info.detail">15700742947</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                enrolData:{
                    payments:[],
                    coach:{}
                },
                enrolMeta:{}

            }
        },
        mounted(){
            this.getMineEnrol()

        },
        methods:{
//            请求报名详情页数据
            getMineEnrol(){
                var token = this.$storage.get('user_token');
                wx.showLoading({
                    title:"加载中",
                    mask:true
                })
                this.$http
                    .get(this.$config.GLOBAL.baseUrl + 'api/activity/myActivity/26',{},{
                        headers: {
                            Authorization:token
                        }
                    })
                    .then(res =>{
                        res = res.data;
                        if (res.status){
                            this.enrolData = res.data;
                            this.enrolMeta = res.meta;
                        } else {
                            wx.showModal({
                                content: res.message || "请求失败",
                                showCancel: false
                            })
                        }
                        wx.hideLoading();
                    },err =>{
                        wx.showModal({
                            content: '请求失败，请重试',
                            showCancel: false,
                        })
                        wx.hideLoading()
                })
            }
        }

    }
</script>
<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";
    page{
        height: 100%;
        background-color:#F3F3F3;
    }
    #enrol_index{
        .ac-status{
            margin:5px 0;
            background-color: #FFFFFF;
            .status-title{
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding:0 15px;
                height:44px;
                color:#4A4A4A;
                font-size:14px;
                .btn{
                    padding:4px 6px;
                    border-radius: 2px;
                    border: 1px solid #9B9B9B;
                    color:#9B9B9B;
                }
            }
            .item{
                background-color: #ffffff;
                padding: 10px 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                .info-left{
                    width: 95px;
                    height: 95px;
                    image{
                        width: 100%;
                        height: 100%;
                    }
                }
                .info-rigth{
                    flex: 1;
                    padding-left:10px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow:ellipsis;
                    .name{
                        color: #000000;
                        font-size: 16px;
                        line-height: 22px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        padding-bottom: 4px;
                    }
                    .subtitle{
                        color: #9c9c9c;
                        font-size: 12px;
                    }
                    .time,.address{
                        font-size: 12px;
                        color: #9B9B9B;
                        line-height: 16px;
                        padding-bottom: 4px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow:ellipsis;
                    }
                    .money{
                        /*text-align: justify;*/
                        display: flex;
                        align-items: center;
                        justify-content:space-between ;
                        margin-top:10px;
                        .text{
                            color: #4A4A4A;
                            font-size: 16px;
                            line-height: 16px;
                            span{
                                font-size: 12px;
                            }
                        }
                        .subtitle{
                            color: #9c9c9c;
                            font-size: 12px;
                        }
                        .enroll-btn{
                            padding: 4px 8px;
                            font-size:12px;
                            color: #ffffff;
                            line-height: 16px;
                            background-color: #d8d8d8;
                        }
                        .red{
                            background-color: @globalColor;
                        }
                    }
                }
            }
        }
        .ac-intro{
            background-color:#FFFFFF;
            .title{
                color: #4A4A4A;
                font-size: 14px;
                padding:0 0 0 15px;
                height: 44px;
                line-height: 44px;
            }
        }
    }
</style>