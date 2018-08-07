<template>
    <div id="detailIndex">
        <div class="activity-content">
            <image src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533635241199&di=9eb4367dfe084e906b39d80f228170d1&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fphotoblog%2F1611%2F02%2Fc14%2F29324329_1478094146549.jpg" mode="widthFix"></image>
            <div class="introduce">
                <div class="name">
                    五一特惠 长沙一日游橘子洲岳麓山爱晚亭 自定义规划行程路线
                </div>
                <div class="money">
                    <span>￥290.00</span>
                    <span>活动报名中</span>
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
            console.log(getApp());
        },
        methods:{

        }
    }
</script>

<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";
    #detailIndex{
        page{
            height: 100%;
            background-color:#F3F3F3;
        }
        .activity-content{
            background-color: #ffffff;
            image{
                width: 100%;
            }
            .introduce{
                padding:10px 15px 0 15px;
                .name{
                    color: #000000;
                    font-size: 16px;
                    line-height: 25px;
                }
            }
        }
    }

</style>