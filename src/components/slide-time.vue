<!--
<template>
    &lt;!&ndash;<transition name="vlc-ani-slide-left">&ndash;&gt;
   &lt;!&ndash; <div class="vlc-slide" ref="parentBox">
        <div class="activeBox" ref="activeBox"></div>
        <div id="ball" class="slide-ball" @touchstart="start"></div>
    </div>&ndash;&gt;
    <div id="slide">

    </div>
    &lt;!&ndash;</transition>&ndash;&gt;
</template>
<style rel="stylesheet/less" lang="less">
    .vlc-slide{
        position: relative;
        margin-top: 20px;
        width: 100%;
        height: 4px;
        background: #e0e0e0;
        .slide-ball{
            position: absolute;
            left: 0;
            top:-15px;
            width: 30px;
            height: 30px;
            background: #b1b1b1;
            border-radius:100% ;
        }
        .activeBox{
            position: absolute;
            left: 0;
            width: 0;
            background: #1aad19;
            height: 4px;
        }
    }
</style>
<script>
    export default{
        props:{
            minTime:{
                type:[String, Number],
            },
            maxTime:{
                type:[String, Number],
            },
            selectTime:{
                type:Function
            }
        },
        data(){
            return{

            }
        },
        mounted(){

        },
        methods:{

        },
    }
</script>-->
