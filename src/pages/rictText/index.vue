<template>
    <div id="rictText">
        <rict-text @getDataList="getDataList">

        </rict-text>
    </div>
</template>

<script>
    import {getUrl} from '../../utils';

    import rictText from '../../components/rict-text';
    export default {
        components: {
            rictText
        },
        data() {
            return {

            }
        },
        onLoad() {

        },
        methods: {
            getDataList(e) {
                wx.redirectTo({
                    url: '/pages/releaseActivity/main'
                })
            }
        },
        mounted() {

        }
    }
</script>

<style rel="stylesheet/less" lang="less" type="text/less">
    @import "../../../static/global.less";
    #signUpFormDetail {

        margin-top: 10px;

        .item {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #333333;
            padding: 15px;
            background: #FFFFFF;
            .name {
                width: 100px;
            }
            input {
                flex: 1;
                text-align: right;
            }
        }
        .tips {
            color: #999999;
            font-size: 11px;
            padding: 0 15px;
            margin-top: 35px;
        }
        .btn {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            line-height: 50px;
            color: #FFFFFF;
            background: @globalColor;
        }

    }
</style>
