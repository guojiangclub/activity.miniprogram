<template>
    <div id="address-list">
        <div class="list-box">
            <div class="list-item mx-1px-bottom" v-for="item in list" @click="setInfo(item)">
                <div class="user">
                    <div class="name">
                        <text>{{item.accept_name}}</text>
                        <text class="phone">{{item.mobile}}</text>
                    </div>
                    <div class="default" v-if="item.is_default">
                        默认
                    </div>
                </div>
                <div class="address">{{item.address_name}} {{item.address}}</div>
            </div>
            <div class="list-item add-address" @click="add">
                <div class="icon iconfont icon-juxing">

                </div>
                <div>
                    新增收货地址
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                list: [],
                order_no: '',
                url:''
            }
        },
        mounted(){
            this.url = '';
            this.order_no = '';
            var url = this.$root.$mp.query.url;
            var order_no = this.$root.$mp.query.order_no;
            if (url) {
                this.url = url;
                this.order_no = order_no
            }
        },
        onShow() {
            this.queryAddressList();
        },
        methods: {
            setInfo(info) {
                var data = this.$storage.get('activeOrder');
                if (!data) {
                    return this.view(info.id);
                }

                var order_no = this.order_no;
                if (order_no && data.order.order_no === order_no) {
                    data.address = info;
                    this.$storage.set('activeOrder', data);
                    wx.navigateBack({
                        url:'/'+this.url
                    });
                } else {
                    return this.view(info.id);
                }
            },
            view(id) {
                wx.navigateTo({
                    url: '/pages/addressAdd/main?id=' + id
                })
            },
            add() {
                wx.navigateTo({
                    url: '/pages/addressAdd/main'
                })
            },
            // 查询收货地址列表
            queryAddressList() {
                var token = this.$storage.get('user_token');
                this.$http.get(this.$config.GLOBAL.baseUrl + 'api/address', {

                }, {
                    headers: {
                        Authorization: token
                    }
                }).then(res => {
                    res = res.data;
                    if (res.status) {
                        this.list = res.data;
                    } else {
                        wx.showModal({
                            content: res.message || '获取信息失败',
                            showCancel: false,
                        })
                    }
                }, err => {
                    wx.showModal({
                        content: '获取信息失败',
                        showCancel: false,
                    })
                })
            }
        }
    }
</script>
<style rel="stylesheet/less" lang="less" type="text/less">
    #address-list{
        .list-box{
            .list-item{
                font-size:14px;
                background:#FFFFFF;
                padding:15px 40px 15px 15px;
                background-image:url("https://uto.ibrand.cc/m/static/img/ic_forward.png");
                background-repeat:no-repeat;
                background-position:100%;
                background-size:20px;

                .user{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .name{
                        .phone{
                            margin-left: 10px;
                        }
                    }
                    .default{
                        color: #099fff;
                    }
                }
                .address{
                    display: flex;
                    -webkit-box-pack: justify;
                    justify-content: space-between;
                }
            }
            .add-address{
                display: flex;
                align-items: center;
                background-image: none;
                .icon{
                    color: #c7c7cc;
                    margin-right: 15px;
                }
            }
        }
    }
</style>