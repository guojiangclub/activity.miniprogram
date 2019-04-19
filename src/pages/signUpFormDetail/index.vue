<template>
    <div id="signUpFormDetail">

        <div class="item mx-1px-bottom">
            <div class="name">
                电子票名称：
            </div>
            <input type="text" v-model="ticket.title" placeholder="请填写名称">
        </div>
        <div class="item mx-1px-bottom">
            <div class="name">
                金额：
            </div>
            <input type="number" v-model="ticket.price" placeholder="请填写金额">
        </div>
        <div class="item mx-1px-bottom">
            <div class="name">
                积分：
            </div>
            <input type="number" v-model="ticket.point" placeholder="请填写积分">
        </div>
        <div class="item mx-1px-bottom">
            <div class="name">
                名额限制：
            </div>
            <input type="number" v-model="ticket.limit" placeholder="请填写限制">
        </div>

        <div class="tips">
            *金额填0为纯积分支付，名额限制填0为不限制
        </div>

        <div class="btn" @click="submit">
            完成
        </div>
    </div>
</template>

<script>
    import {getUrl} from '../../utils';

    export default {
        data() {
            return {
                index: '',
                ticket: {
                    title: '',
                    price: '',
                    point: '',
                    limit: '',
                },
                ticketList: []
            }
        },
        onLoad() {
            this.ticket = {
                title: '',
                price: '',
                point: '',
                limit: '',
            }
            this.index = '';
            this.ticketList = [];


            this.ticketList = this.$storage.get('ticketList') || [];
            this.index = this.$root.$mp.query.index;

            if (this.index != undefined && this.ticketList && this.ticketList.length && this.ticketList[this.index]) {
                let item = this.ticketList[this.index];
                this.ticket = item;
            }
        },
        methods: {
            submit() {

                let message = '';
                if (!this.ticket.title) {
                    message = '请输入电子票名称'
                } else if (!this.ticket.price) {
                    message = '请输入金额'
                } else if (!this.ticket.point) {
                    message = '请输入积分'
                } else if (!this.ticket.limit) {
                    message = '请输入限制'
                }
                if (message) {
                    wx.showToast({
                        title: message,
                        icon: 'none',
                        mask: true
                    })
                    return
                }
                if (this.index != undefined && this.ticketList && this.ticketList.length && this.ticketList[this.index]) {
                    let item = this.ticket;
                    this.ticketList[this.index] = item;
                } else {
                    this.ticketList.push(this.ticket);
                }
                this.$storage.set('ticketList', this.ticketList);
                wx.redirectTo({
                    url: '/pages/signUpForm/main'
                })
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
