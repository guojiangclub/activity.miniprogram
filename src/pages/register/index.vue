<template>
    <div id="register">
        <div class="phone__warning">
            <image :src="logo"></image>
            <!--<i class="iconfont icon-anquanjinggao"></i>-->
        </div>
        <button class="wechat-phoneBtn phone__btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
            <i class="iconfont icon-hudong"></i>
            <div class="btn__text">微信登录</div>
        </button>
        <div class="again-phoneBtn phone__btn" @click="jumpLogin">
            <i class="iconfont icon--dianhua"></i>
            <div class="btn__text">手机号登录</div>
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

        },
        methods:{

        }
    }
</script>

<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";
    #register{
        //margin-top: 100px;
        padding: 0 15px;
        .phone__warning{
            text-align:center;
            width:80px;
            height:80px;
            margin:80px auto 180px auto;
            border-radius:100%;
            overflow:hidden;

            image{
                width: 100%;
                height: 100%;
            }
            i{

                color: #FFBE00;
                font-size: 50px;
            }
        }
        .phone__text{
            font-size: 14px;
            color: #888888;
            line-height: 20px;
            margin-bottom: 32px;
        }
        .phone__btn{
            width: 100%;
            padding:15px 0;
            line-height: 1;
            font-size: 17px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
            &.wechat-phoneBtn{
                color:#FFFFFF;
                background: @globalColor;
                border: @globalColor;
                margin-bottom:20px;
            }
            &.again-phoneBtn{
                color: @globalColor;
                background: #ffffff;
                border: 1px solid @globalColor;
            }
            i{
                padding-right:10px;
            }
        }
    }

</style>