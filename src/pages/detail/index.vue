<template>
    <div id="detailIndex">
        <div class="activity-content">
            <image src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533635241199&di=9eb4367dfe084e906b39d80f228170d1&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fphotoblog%2F1611%2F02%2Fc14%2F29324329_1478094146549.jpg" mode="widthFix"></image>
            <div class="introduce">
                <div class="name">
                    五一特惠 长沙一日游橘子洲岳麓山爱晚亭 自定义规划行程路线
                </div>
                <div class="money mx-1px-bottom">
                    <span class="txt">￥290.00</span>
                    <span class="btn">活动报名中</span>
                </div>
                <div class="concrete">
                    <div class="date padd mx-1px-bottom">
                        <span></span>
                        <span class="text">2018.04.30 周一 10:00 - 2018.05.12 周三 12:22</span>
                    </div>
                    <div class="addr padd mx-1px-bottom">
                        <span></span>
                        <span class="text">湖南省长沙市岳麓区</span>
                        <span></span>
                    </div>
                    <div class="num padd">
                        <span></span>
                        <span class="text">已报名 10人</span>
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

            }
        },
        mounted(){
            console.log(this.$root);
        },
        methods:{

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
                    }
                    .btn{
                        font-size:12px;
                        padding:4px 8px;
                        border:1px solid @globalColor;
                        border-radius: 2px;
                        line-height: 16px;
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