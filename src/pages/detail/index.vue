<template>
    <div id="detailIndex">
        <div class="activity-content">
            <image :src="detail.img" mode="widthFix"></image>
            <div class="introduce">
                <div class="name">
                    {{ detail.title }}
                </div>
                <div class="money mx-1px-bottom">
                    <span class="txt subtitle" v-if="detail.fee_type != 'OFFLINE_CHARGES' && detail.fee_type != 'CHARGING'">{{ detail.subtitle}}</span>
                    <span class="txt" v-if="detail.payments[0] &&detail.payments[0].type == 0">{{detail.payments[0].point}}积分</span>
                    <span class="txt" v-if="detail.payments[0] &&detail.payments[0].type == 1"> <span>￥</span>{{detail.payments[0].price}}</span>
                    <span class="txt" v-if="detail.payments[0] &&detail.payments[0].type == 2"> <span>￥</span>{{detail.payments[0].price}}+{{detail.payments[0].point}}积分</span>
                    <span class="txt" v-if="detail.payments[0] &&detail.payments[0].type == 4"> <span>￥</span>{{detail.payments[0].price}}</span>
                    <span class="btn" :class="{'red':detail.status==1}">{{info[detail.status]}}</span>
                </div>
                <div class="concrete">
                    <div class="date padd mx-1px-bottom">
                        <span></span>
                        <span class="text">2018.04.30 周一 10:00 - 2018.05.12 周三 12:22</span>
                    </div>
                    <div class="addr padd mx-1px-bottom">
                        <span></span>
                        <span class="text">{{detail.address}}</span>
                        <span></span>
                    </div>
                    <div class="num padd">
                        <span></span>
                        <span class="text">已报名 {{ detail.member_count }}人</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                detail:{
                    payments: []
                },
                info:getApp().textStatus
            }
        },
        mounted(){
           this.getDetail()
        },
        methods:{
            //请求活动详情页数据
            getDetail(){
                this.$http
                    .get(this.$config.GLOBAL.baseUrl+'api/activity/show/13',{
                    }).then(res =>{
                        res = res.data;
                        if (res.status){
                            this.detail = res.data;
                        } else{
                            wx.showModal({
                                content:res.messages || "请求失败",
                                showCancel:false
                            })
                        }
                },err =>{
                    wx.showModal({
                        content: '请求失败，请重试',
                        showCancel: false,
                    })
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
    #detailIndex{
        .activity-content{
            background-color: #ffffff;
            image{
                width: 100%;
            }
            .introduce{
                padding:10px 0 0 0px;
                .name{
                    color: #000000;
                    font-size: 16px;
                    line-height: 25px;
                    padding: 0 15px 0 15px;
                }
                .money{
                    padding: 7px 15px 11px 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .txt{
                        color: @globalColor;
                        font-size: 20px;
                        span{
                            font-size: 14px;
                        }
                    }
                    .subtitle{
                        color:#959595;
                    }
                    .btn{
                        font-size:12px;
                        padding:4px 8px;
                        border:1px solid #959595;
                        border-radius: 2px;
                        line-height: 16px;
                        color: #959595;
                    }
                    .red{
                        border:1px solid @globalColor;
                        color: @globalColor;
                    }
                }
                .concrete{
                    padding-left: 16px;
                    .padd{
                        padding:8px 16px 8px 0;
                        font-size:12px;
                        color: #000000;
                        line-height: 16px;
                        .text{
                            display: inline-block;
                            padding-left:6px;
                        }
                    }
                }
            }
        }
    }

</style>