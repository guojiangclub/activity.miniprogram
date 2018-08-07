<template>
    <div id="myactivity">
        <div class="navbar">
            <div class="vlc-slideBar-wrapper vlc-slideBar-flex normal" style="width: auto">
                <div class="vlc-slideBar-child" v-for="(item,index) in tabList" style="text-align: center; width: 75px; height: 30px; line-height: 30px;">
                    <span>{{item.name}}</span>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="mar-bottom">
                <div class="item mx-1px-bottom">
                    <div class="info-left">
                        <image src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533635241199&di=9eb4367dfe084e906b39d80f228170d1&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fphotoblog%2F1611%2F02%2Fc14%2F29324329_1478094146549.jpg"></image>
                    </div>
                    <div class="info-rigth">
                        <div class="name">五一特惠 长沙一日游橘子洲岳…</div>
                        <div class="time">2018.04.30 周一 10:00 - 2018.05.12 </div>
                        <div class="address">湖南省长沙市岳麓区</div>
                        <div class="money">
                            <!-- <span class="text subtitle" v-if="t.fee_type != 'OFFLINE_CHARGES' && t.fee_type != 'CHARGING'">{{t.subtitle}}</span>
                             <span class="text" v-if="t.payments[0] && t.payments[0].type == 0">{{t.payments[0].point}}积分</span>
                             <span class="text" v-if="t.payments[0] && t.payments[0].type == 1">￥{{t.payments[0].price}}</span>
                             <span class="text" v-if="t.payments[0] && t.payments[0].type == 2">￥{{t.payments[0].price}}+{{t.payments[0].point}}积分</span>
                             <span class="text" v-if="t.payments[0] && t.payments[0].type == 4">￥{{t.payments[0].price}}</span>-->
                        </div>
                    </div>
                </div>
                <div class="btn-status">
                    <span>已取消</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data () {
            return{
                tabList:[
                    {
                        id:0,
                        name:"全部",
                        page: 0,
                        hasMore: true,
                        init: false,
                        isList:false
                    },
                    {
                        id:1,
                        name:"未开始",
                        page: 0,
                        hasMore: true,
                        init: false,
                        isList:false
                    },
                    {
                        id:2,
                        name:"进行中",
                        page: 0,
                        hasMore: true,
                        init: false,
                        isList:false
                    },
                    {
                        id:3,
                        name:"已结束",
                        page: 0,
                        hasMore: true,
                        init: false,
                        isList:false
                    },
                    {
                        id:4,
                        name:"已取消",
                        page: 0,
                        hasMore: true,
                        init: false,
                        isList:false
                    }
                ],
                dataList:{},
            }
        },
        created () {
        },
        mounted(){
            this.getMyList(1)
        },
        methods:{
            getMyList(page){
                wx.showLoading({
                    title:"加载中",
                    mask:true
                });
                this.$http
                    .get(this.$config.GLOBAL.baseUrl + 'api/activity/myList',{
                        page:page
                    }).then(res=>{
                        res = res.data;
                        if (res.status){
                            this.dataList = res.data;
                        } else{
                            wx.showModal({
                                content:res.messages || "请求失败",
                                showCancel:false
                            })
                        }
                    wx.hideLoading()
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
    #myactivity{
        .navbar{
            background-color: #ffffff;
            overflow-x: scroll;
            overflow-y: hidden;
            width: 100%;
            position: relative;
            .vlc-slideBar-wrapper{
                /*border-bottom: 1px solid #cccccc;*/
                padding: 8px 0;
            }
            .vlc-slideBar-flex{
                display: flex;
                align-items: center;
                .vlc-slideBar-child{
                    flex: 1;
                    span{
                        color:#9B9B9B;
                        font-size: 15px;
                    }
                }
                .active{
                    span{
                        color:@globalColor;
                    }
                }
            }
            .normal{
                flex-direction: row;
            }
        }
        .content{
            .mar-bottom{
                margin-bottom:10px;
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
                            color: @globalColor;
                            font-size: 12px;
                            line-height: 16px;
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
        .btn-status{
            background-color: #ffffff;
            padding: 10px 15px 10px 0;
            text-align: right;
            span{
                display: inline-block;
                height: 25px;
                line-height: 25px;
                width: 60px;
                text-align: center;
                font-size:14px;
                color:#9B9B9B;
                border: 1px solid #9B9B9B;
                border-radius: 2px;
            }
        }
    }
</style>
