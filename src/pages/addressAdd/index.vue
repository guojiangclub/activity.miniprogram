<template>
    <div id="address-add">
        <div class="address-info">
            <div class="info-item mx-1px-bottom">
                <label for="name">姓名:</label>
                <div class="form-control">
                    <input type="text" id="name" v-model="detail.accept_name" />
                </div>
            </div>
            <div class="info-item mx-1px-bottom">
                <label for="phone">联系电话:</label>
                <div class="form-control">
                    <input type="number" id="phone" v-model="detail.mobile" />
                </div>
            </div>
            <div class="info-item mx-1px-bottom">
                <label>所在地:</label>
                <div class="form-control select">
                    <picker mode="region" @change="bindRegionChange" value="detail.address_name">
                        <div class="picker">
                            {{detail.address_name[0]}} {{detail.address_name[1]}} {{detail.address_name[2]}}
                        </div>
                    </picker>
                </div>
            </div>
            <div class="info-item mx-1px-bottom">
                <label for="address">详细地址:</label>
                <div class="form-control">
                    <input type="text" id="address" v-model="detail.address"  />
                </div>
            </div>
            <div class="info-item mx-1px-bottom">
                <label class="checkbox" @click="check">
                    <checkbox color="#fff" :checked="detail.is_default"/>
                    <text>设为默认地址</text>
                </label>
            </div>
        </div>
        <div class="button-box">
            <button type="primary"  class="submit" @click="submit" :loading="oading">保存</button>
            <button type="warn" class="delete" v-if="id" @click="deleteAdd" :loading="deleteLoading">删除</button>
        </div>
    </div>

</template>

<script>
    import { is } from '../../utils';
    export default{
        data(){
            return{
                detail: {
                    is_default: false,
                    address_name: [],
                    area: 430105,
                    city: 430100,
                    province: 430000
                },
                order_no: '',
                id: '',
                loading: false,
                deleteLoading: false,
            }
        },
        mounted(){
            this.detail = {
                is_default: false,
                address_name: [],
                area: 430105,
                city: 430100,
                province: 430000
            }
            this.id = '';
            this.deleteLoading = false;
            this.loading = true;
            var id = this.$root.$mp.query.id;
            if (id) {
                wx.setNavigationBarTitle({
                    title: '修改收货地址'
                })
                this.queryAddress(id);
                this.id = id;
            } else {
                wx.setNavigationBarTitle({
                    title: '新增收货地址'
                })
            }

        },
        methods: {
            bindRegionChange(e) {
                this.detail.address_name = e.mp.detail.value
            },
            check(e) {
                this.detail.is_default = !this.detail.is_default;
            },
            deleteAdd() {
                this.deleteLoading = true;
                this.removeAddress(this.id);
            },
            submit() {
                this.loading = true
                var message = null;
                if (!is.has(this.detail.accept_name)) {
                    message = '请输入姓名'
                } else if (!is.has(this.detail.mobile)) {
                    message = '请输入手机号码'
                } else if (!is.mobile(this.detail.mobile)) {
                    message = '请输入正确的手机号码'
                } else if (!is.has(this.detail.address_name)) {
                    message = '请选择地址'
                } else if (!is.has(this.detail.address)) {
                    message = '请输入详细地址';
                }
                if (message) {
                    this.loading = false
                    wx.showModal({
                        content: message,
                        showCancel: false
                    })
                } else {
                    if (this.id) {
                        this.updateAddress(this.detail);
                    } else {
                        this.createAddress(this.detail)
                    }
                }
            },
            // 获取收货地址详情
            queryAddress(id) {
                var token = this.$storage.get('user_token');
                this.$http.get(this.$config.GLOBAL.baseUrl + 'api/address/' + id, {}, {
                    headers: {
                        Authorization: token
                    }
                }).then(res => {
                    res = res.data;
                    if (res.status) {
                        var data = res.data;
                        data.is_default = !!data.is_default;
                        data.address_value = [data.province, data.city, data.area].join(' ');
                        data.address_name = data.address_name.split(' ');
                        this.detail = data;
                    } else {
                        wx.showModal({
                            content: res.message || '获取信息失败',
                            showCancel: false
                        })
                    }
                }, err => {
                    wx.showModal({
                        content: '获取信息失败',
                        showCancel: false
                    })
                })
            },
            // 新增收货地址
            createAddress(data) {
                var address = {
                    accept_name: data.accept_name,
                    mobile: data.mobile,
                    province: data.province,
                    city: data.city,
                    area: data.area,
                    address_name: data.address_name.join(" "),
                    address: data.address,
                    is_default: data.is_default ? 1 : 0
                };
                var token = this.$storage.get('user_token');
                this.$http.post(this.$config.GLOBAL.baseUrl + 'api/address/create', address, {
                    headers: {
                        Authorization: token
                    }
                }).then(res => {
                    res = res.data;
                    if (res.status) {
                        wx.showModal({
                            content: '新增收货地址成功',
                            showCancel: false,
                            success: res=>{
                                if (res.confirm) {
                                    wx.navigateBack();
                                }
                            }
                        })
                    } else {
                        wx.showModal({
                            content: res.message || '新增收货地址失败',
                            showCancel: false,
                            success: res=>{
                                if (res.confirm) {
                                    wx.navigateBack();
                                }
                            }
                        })
                    }
                    this.loading = false;
                }, err => {
                    this.loading = false;
                    wx.showModal({
                        content: '新增收货地址失败',
                        showCancel: false,
                        success: res=>{
                            if (res.confirm) {
                                wx.navigateBack();
                            }
                        }
                    })
                })
            },
            // 修改收货地址
            updateAddress(data) {
                var address = {
                    id: data.id,
                    accept_name: data.accept_name,
                    mobile: data.mobile,
                    province: data.province,
                    city: data.city,
                    area: data.area,
                    address_name: data.address_name.join(" "),
                    address: data.address,
                    is_default: data.is_default ? 1 : 0
                };
                var token = this.$storage.get('user_token');
                this.$http.put(this.$config.GLOBAL.baseUrl + 'api/address/update', address, {
                    headers: {
                        Authorization: token
                    }
                }).then(res => {
                    res = res.data;
                    if (res.status) {
                        wx.showModal({
                            content: '修改收货地址成功',
                            showCancel: false,
                            success: res=>{
                                if (res.confirm) {
                                    wx.navigateBack();
                                }
                            }
                        })
                    } else {
                        wx.showModal({
                            content: res.message || '修改收货地址失败',
                            showCancel: false,
                            success: res=>{
                                if (res.confirm) {
                                    wx.navigateBack();
                                }
                            }
                        })
                    }
                    this.loading = false;
                }, err => {
                    this.loading = false;
                    wx.showModal({
                        content: '修改收货地址失败',
                        showCancel: false,
                        success: res=>{
                            if (res.confirm) {
                                wx.navigateBack();
                            }
                        }
                    })
                })
            },
            // 删除收货地址
            removeAddress(id) {
                var token = this.$storage.get('user_token');
                this.$http.delete(this.$config.GLOBAL.baseUrl + 'api/address/' + id, {

                }, {
                    headers: {
                        Authorization: token
                    }
                }).then(res => {
                    res = res.data;
                    if (res.status) {
                        wx.showModal({
                            content: '删除收货地址成功',
                            showCancel: false,
                            success: res=>{
                                if (res.confirm) {
                                    wx.navigateBack();
                                }
                            }
                        })
                    } else {
                        wx.showModal({
                            content: res.message || '删除收货地址失败',
                            showCancel: false,
                            success: res=>{
                                if (res.confirm) {
                                    wx.navigateBack();
                                }
                            }
                        })
                    }
                    this.loading = false;
                }, err => {
                    this.loading = false;
                    wx.showModal({
                        content: '删除收货地址失败',
                        showCancel: false,
                        success: res=>{
                            if (res.confirm) {
                                wx.navigateBack();
                            }
                        }
                    })
                })
            }
        }
    }
</script>
<style rel="stylesheet/less" lang="less" type="text/less">
    @import "../../../static/global.less";

    #address-add{
        .address-info{
            background: #FFFFFF;

            .info-item{
                height: 40px;
                line-height: 40px;
                padding-left: 15px;
                display: flex;
                align-items: center;
                color: #000000;
                font-size: 16px;

                label{
                    width: 80px;
                    display: block;
                }

                .form-control{
                    flex: 1;
                    padding: 0 30px 0 10px;

                    input{
                        width: 100%;
                        font-size: 16px;
                        box-sizing: border-box;
                        outline: 0;
                        border: none;
                        height: 24px;
                        line-height: 24px;
                    }

                    &.select{
                        background-image:url("https://uto.ibrand.cc/m/static/img/ic_forward.png");
                        background-repeat:no-repeat;
                        background-position:100%;
                        background-size:20px;
                        overflow: hidden;
                        picker{
                            height: 100%;

                            .picker{
                                flex: 1;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                height: 40px;
                            }
                        }
                    }
                }
                .checkbox{
                    width: 100%;
                    display: flex;
                    align-items: center;
                }
            }
        }
        .button-box{
            margin-top: 30px;

            .submit{
                background: @globalColor;
            }
            .delete {
                background: #d4d5d5;
            }
            button{
                margin: 0 20px 15px 20px;
                &:after {
                    border: none;
                }
            }
        }

        //重置按钮样式
        checkbox .wx-checkbox-input{
            border-radius: 100%;
            background-color: #fff;
            border: 1px solid #c1caca;
            box-shadow: 0 1px 2px rgba(0,0,0,.05), inset 0 -15px 10px -12px rgba(0,0,0,.05);
            height: 14px;
            width: 14px;
        }
        checkbox .wx-checkbox-input.wx-checkbox-input-checked{
            background-color: @globalColor;
            border: 1px solid @globalColor;
        }
    }
</style>