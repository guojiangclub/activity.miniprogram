<template>
    <div id="signUpForm">
        <div class="ticket-box" v-if="ticketList && ticketList.length">
            <div class="title-box">
                <div>票种设置</div>
            </div>

            <div class="ticket-item mx-1px-bottom" v-for="item in ticketList">
                <div class="delete-icon iconfont icon-minus-circle">

                </div>
                <div class="name">
                    {{item.title}}
                </div>
                <div class="value">
                    ￥ {{item.price}} + {{item.point}} 积分
                </div>
                <div class="right-icon iconfont icon-Group104">

                </div>
            </div>
        </div>



        <div class="title-box">
            <i class="iconfont icon-Group99"></i>
            <div>添加票种</div>
        </div>
        <div class="btn">
            完成
        </div>
    </div>
</template>

<script>
    import {getUrl} from '../../utils';

    export default {
        data() {
            return {
                ticketList: []
            }
        },
        onLoad() {
            this.ticketList = [];
            this.ticketList = this.$storage.get('ticketList') || [];
        },
        methods: {

        },
        mounted() {
            var token = this.$storage.get('user_token');
            this.token = token;
        }
    }
</script>

<style rel="stylesheet/less" lang="less" type="text/less">
    @import "../../../static/global.less";
    #signUpForm {

        .title-box {
            display: flex;
            align-items: center;
            padding: 15px;
            color: #4B8AF2;
            font-size: 14px;
            .iconfont {
                font-size: 13px;
                margin-right: 5px;
            }
        }

        .ticket-box {
            font-size: 14px;
            .title-box {
                color: #666666;
            }

            .ticket-item {
                display: flex;
                align-items: center;
                padding: 15px;
                background: #FFFFFF;
                margin-bottom: 10px;

                .delete-icon {
                    color: #999999;
                    margin-right: 10px;
                }
                .value {
                    flex: 1;
                    text-align: right;
                    padding-right: 10px;
                }
                .right-icon {
                    color: #111111;
                }
            }
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
