<template>
    <div id="form">
        <block v-if="init">
            <div class="item goods" v-if="order.order">
                <div class="title mx-1px-bottom">
                    <div>
                        商品清单
                    </div>
                </div>
                <div class="goods-item mx-1px-bottom" v-for="(item,index) in order.order.items" v-if="order.order.items.length == 1">
                    <div class="left">
                        <image :src="item.item_meta.image"></image>
                    </div>
                    <div class="right">
                        <div>
                            <div class="name">
                                {{item.item_name}}
                            </div>
                            <div class="price">
                                <div class="new">
                                    <span>￥</span>{{item.total_yuan}}
                                </div>
                                <div class="old">
                                    ￥{{item.product.market_price}}
                                </div>
                            </div>
                        </div>
                        <div class="btn-box">
                            {{item.item_meta.specs_text}}, {{item.quantity}}件
                        </div>
                    </div>
                </div>
                <div class="line all-goods" v-if="order.order.items.length > 1" @click="jumpGoods">
                    <div class="good-box">
                        <div class="good-img" v-for="(item,index) in order.order.items" v-show="index < 4">
                            <img :src="item.item_meta.image" alt="">
                        </div>
                    </div>
                    <div class="num">
                       <div> 共{{order.order.count}}件</div>
                        <div class="iconfont icon-Group104"></div>
                    </div>
                </div>
                <div class="comm-account mx-1px-top">
                    {{order.order.count}}件商品，合计￥{{order.order.total_yuan}}
                </div>
            </div>
            <div class="item address" @click="selectAddress" v-if="order.order">
                <div class="title mx-1px-bottom">
                    <div>
                        收货地址
                    </div>
                    <div class="iconfont icon-Group104">

                    </div>
                </div>
                <block v-if="order.address">
                    <div class="add-info">
                        <div class="name">
                            <span>{{order.address.accept_name}}</span>
                            <span>{{order.address.mobile}}</span>
                        </div>
                        <div class="info">
                            <div>{{order.address.address_name}} {{order.address.address}}</div>
                        </div>
                    </div>
                </block>
                <block v-if="!order.address">
                    <div class="no-address">
                        添加收货地址
                    </div>
                </block>

                <div class="line">
                    <!--<img src="https://ibrand-miniprogram.oss-cn-hangzhou.aliyuncs.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F/%E5%88%86%E7%BB%84.png" alt="">-->
                </div>

            </div>
            <div class="item activity">
                <div class="act-item mx-1px-bottom">
                    <div class="info-left">
                        <image :src="order.activity.img_list" mode="aspectFill"></image>
                    </div>
                    <div class="info-rigth">
                        <div class="name">{{order.activity.title}}</div>
                        <div class="time">{{time}}</div>
                        <div class="address">{{order.activity.address}}</div>
                        <div class="money">
                            <!--<span class="text">
                                999
                            </span>-->
                            <span class="text subtitle" v-if="order.activity.fee_type != 'OFFLINE_CHARGES' && order.activity.fee_type != 'CHARGING'">{{order.activity.subtitle}}</span>
                            <span class="text" v-if="order.payment && order.payment.type == 0">{{order.payment.point}}积分</span>
                            <span class="text" v-if="order.payment && order.payment.type == 1">￥{{order.payment.price}}</span>
                            <span class="text" v-if="order.payment && order.payment.type == 2">￥{{order.payment.price}}+{{order.payment.point}}积分</span>
                            <span class="text" v-if="order.payment && order.payment.type == 4">￥{{order.payment.price}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!--只有线下活动才显示这个-->
            <div class="item enroll" v-if="order.activity.fee_type == 'OFFLINE_CHARGES'">
                <div class="user-info">
                    <div class="info-title info-item mx-1px-bottom">
                        <div class="titles">
                            报名人信息
                        </div>
                        <div class="edit" @click="edit">
                            编辑
                        </div>
                    </div>
                    <div class="info-item mx-1px-bottom">
                        <div class="name">
                            昵称
                        </div>
                        <div class="text">
                            {{ order.user.nick_name }}
                        </div>
                    </div>
                    <div class="info-item mx-1px-bottom">
                        <div class="name">
                            手机号码
                        </div>
                        <div class="text">
                            {{ order.user.mobile }}
                        </div>
                    </div>
                    <div class="info-item mx-1px-bottom">
                        <div class="name">
                            上衣尺码
                        </div>
                        <div class="text">
                            {{ order.size ? order.size.upper : "" }}
                        </div>
                    </div>
                    <div class="info-item mx-1px-bottom">
                        <div class="name">
                            裤子尺码
                        </div>
                        <div class="text">
                            {{ order.size ? order.size.lower : "" }}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="name">
                            鞋子尺码
                        </div>
                        <div class="text">
                            {{ order.size ? order.size.shoes : "" }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="top-content">
                <div class="input_item" v-if="item.status==1" v-for="(item, idx) in list">
                    <!--title-->
                    <p class="title mx-1px-bottom" v-if="item.type!='range' && item.name!='id_card' && item.type!='statement' && item.name != 'other_certificate'">
                        <span v-if="item.is_necessary==1" style="color: red">*</span>
                        {{item.title}}
                        <span v-if="item.is_necessary==0">(选填)</span>
                    </p>

                    <!--单独的身份证类型-->
                    <p class='title mx-1px-bottom' v-if="(item.type!='range' && item.name == 'id_card' && user.certificate_type == 'id_card' && item.type!='statement') || (item.type!='range' && item.name == 'id_card' && !user.certificate_type && item.type!='statement')"><span v-if="item.is_necessary==1" style="color: red">*</span> {{item.title}} <span v-if="item.is_necessary==0">(选填)</span></p>
                    <input class="hhaha" type="text" :name="item.name" v-if="(item.type == 'text' && item.name == 'id_card' && user.certificate_type == 'id_card') || (item.type == 'text' && item.name == 'id_card' && !user.certificate_type)" v-model="user[item.name]">

                    <!--单独的其他证件-->
                    <p  class='title mx-1px-bottom' v-if="(item.type!='range' && item.name == 'other_certificate' && user.certificate_type == 'other_certificate' && item.type!='statement') || (item.type!='range' && item.name == 'other_certificate' && !user.certificate_type && item.type!='statement')"><span v-if="item.is_necessary==1" style="color: red">*</span> {{item.title}} <span v-if="item.is_necessary==0">(选填)</span></p>
                    <input class="hhaha" type="text" :name="item.name" v-if="(item.type == 'text' && item.name == 'other_certificate' && user.certificate_type == 'other_certificate') || (item.type == 'text' && item.name == 'other_certificate' && !user.certificate_type)" v-model="user[item.name]">

                    <!--文本输入框-->
                    <input type="text" :name="item.name" v-if="item.type=='text'&& item.name!='province' && item.name!='id_card' && item.name!='other_certificate'"  v-model="user[item.name]">

                    <!--图片上传-->
                    <div class="img" v-if="item.type=='file'">
                        <div class="img_item" v-if="user[item.name].length" v-for="(val,index) in user[item.name]" @click="deleteX(item.name,index)">
                            <img :src="val" alt="">
                        </div>
                        <p class="upload" v-if="user[item.name].length<3">
                            <span :id="item.name"  :name="item.name"  class="img_file" @click="fileChange(item.name)"></span>
                        </p>
                    </div>
                    <!--下拉框-->
                    <!--从底部弹起的滚动选择器-->
                    <picker style="height: 38px" v-if="item.type=='select'" value='0' range-key="name" :range='item.options' @change="pickerStatus($event, item.name, idx)">
                    <span class="box" v-if="item.type=='select'">
                        {{user[item.name]}}
                    </span>
                    </picker>
                    <!--多文本输入框-->
                    <textarea  v-if="item.type=='textarea'" v-model="user[item.name]"></textarea>

                    <!--滑动条-->
                    <div class="slide-time"  v-if="item.type=='range'" >
                        <div class="title mx-1px-bottom">
                            <span v-if="item.is_necessary==1" style="color: red">*</span>
                            {{item.title}} <span>:{{timeObj.key}}</span></div>
                        <div class="slide-bar" style="position: relative">
                            <movable-area style="height: 2px;width:100%;background:#DDDDDD;border-radius: 2px">
                                <movable-view direction="horizontal" style="height: 22px; width: 22px; background-color: #FFFFFF;border-radius: 50%;border:2px solid #EA4448; top: 50%;margin-top: -12px;z-index:1" @change="change($event, item.name)" animation:false>
                                </movable-view>
                            </movable-area>
                            <div style="position: absolute; top:48%; background:#EA4448;height: 2px;" :style="'width:'+x+'px'">

                            </div>
                        </div>
                    </div>

                    <!--地址-->
                    <span class="box" v-if="item.name=='province'" @click="show_city">{{user[item.name]}}</span>

                    <!--单选按钮-->
                    <div class="input_radio" v-if="item.type=='radio'">
                        <radio-group @change="changeRadio($event, item.name)">
                            <radio  :value="i.value || i.name" color="#fff" :label="i.value || i.name" v-for="i in item.options" :key="index">{{i.name}}</radio>
                        </radio-group>
                    </div>

                    <!--多选按钮-->
                    <div class="input_radio" v-if="item.type=='checkbox'">
                        <checkbox-group @change="changeBox($event,item.name)">
                            <checkbox :value="i.name" color="#fff" :label="i.name" v-for="i in item.options" :key="index">{{i.name}}</checkbox>
                        </checkbox-group>
                    </div>

                    <!--免责声明-->
                    <div class="input_radio mx-1px-top" style="padding-top: 10px;margin-top: 10px" v-if="item.type=='statement'">
                        <div class="inline">
                            <checkbox-group style="display: inline-block" @change="changeCheck($event,item.name)">
                                <checkbox color="#fff" :value="item.name" class="statement" :label="item.title">

                                </checkbox>
                            </checkbox-group>
                        </div>
                        <div class="look" @click="lookDetail" style="text-decoration: underline">点击查看声明详情</div>

                    </div>
                    <select-city v-if="item.name=='province'" :show=showCity @on-cancel="show_city" @on-select="select(item.name,$event)"></select-city>
                    <div class="statement_content" v-if="statement && item.type=='statement'">
                        <div class="statement_content_title mx-1px-bottom" v-if="statement">
                            <h3>声明详情</h3>
                        </div>
                        <div class="statement_content_body">
                            <wxParse :content="item.value"></wxParse>
                        </div>
                        <div class="statement_content_footer" @click="lookDetail">
                            我知道了
                        </div>
                    </div>
                    <!-- <slide-time v-if="item.type=='range'" :minTime="ActivityStartTime" :maxTime="ActivityEndTime" @select-time="passTime(item.name,$event)"></slide-time>-->

                </div>
            </div>
            <div class="bottom-bar" @click="submitStep">
                <div class="money">
                    ￥{{order.total}}
                </div>
                <div class="pay">去付款</div>
            </div>
        </block>

    </div>

</template>

<script type="text/ecmascript-6">
    import { is, cityArr, getUrl } from '../../utils';
    import SelectCity from '../../components/city-select.vue';
    import slideTime from '../../components/slide-time.vue';
    import wxParse from 'mpvue-wxparse';
    class Validates {
        constructor() {
            this.validateObj = {}
        }

        addRules(obj) {
            this.validateObj[obj.name] = obj.options;
        }

        checkRulues(that,obj) {
            var message = "";
            var val = obj.val;
            if ((obj.name == "id_card" && that.user.certificate_type == 'id_card') || (obj.name == "id_card" && !that.user.certificate_type)) {
                if (!this['text'](val)) {
                    message = `${obj.title}不能为空`;
                } else if (!this[obj.name](val)) {
                    message = `您输入的${obj.title}不符合规范`;
                }
            } else if ((obj.name == 'other_certificate' && that.user.certificate_type == 'other_certificate') || (obj.name == 'other_certificate' && !that.user.certificate_type)) {
                if (!this['text'](val)) {
                    message = `${obj.title}不能为空`;
                }
            } else if (obj.name == "mobile") {
                if (!this['text'](val)) {
                    message = `${obj.title}不能为空`;
                }
                else if (!this[obj.name](val)) {
                    message = `您输入的${obj.title}不符合规范`;
                }
            }
            else if (obj.type == "checkbox" || obj.type == "file") {
                if (!val.length) {
                    message = `${obj.title}不能为空`
                }
            }
            else if (obj.type == "statement") {
                if (!this['text'](val)) {
                    message = `您必须同意${obj.title}`;
                }
            }
            else if (obj.name == 'user_name') {
                if (!is.name(val)){
                    message = `您输入的${obj.title}不符合规范`
                }
            }
            else if (obj.name != 'id_card' && obj.name != "other_certificate"){
                if (!this['text'](val)) {
                    message = `${obj.title}不能为空`;
                }
            }
            return message

        }

        id_card(val) {
            return is.identity_no(val);
        }

        mobile(val) {
            return is.mobile(val);
        }

        text(val) {
            return is.has(val);
        }
    }
    export default {
        components:{
            SelectCity,
            slideTime,
            wxParse
        },
        data () {
            return {
                id: '',
                list: [
                ],
                validate: new Validates(),
                user: {},
                picker: {},
                showCity: false,
                isRequired: {},
                statement: false,
                x:'',
                areaWidth:'',
                finish_max_hours:0,
                finish_max_minutes:0,
                finish_min_hours:0,
                finish_min_minutes:0,
                percent:0,
                timeObj:{},
                init: false,
                order: {
                    order: {},
                    address: {},
                    activity: {},
                    size: {},
                    payment: {}
                },
                time: '',
                statusUpdate: false,
                nameobj:''
            }
        },
        onLoad() {
            var id = this.$root.$mp.query.id
            this.init = false;
            this.timeObj = {};
            this.x = "";
            this.percent = 0;

            this.statement = false;
            this.time = '';

            this.id = this.$root.$mp.query.id;
            this.payment_id = this.$root.$mp.query.payment_id;
            this.checkOrder();
            // this.getFormList(this.id);
            // this.getDetail(id);
        },
        methods: {
            // 验证缓存
            checkOrder() {
                var order = this.$storage.get('activeOrder');
                if (!order || order.activity.id != this.id) {
                    wx.showModal({
                        content: '数据缓存错误，请重新提交',
                        showCancel: false
                    });
                    this.$storage.clear('activeOrder');
                    return
                }
                this.order = order;
                console.log(order);
                // 处理表单
                if (order.formData && order.formData.length) {
                    this.list = this.adapter(order.formData);
                    this.list.forEach(val=>{
                        if (val.type=='range' && val.status == 1){
                            setTimeout( res=> {
                                this.getDomInfo('.slide-bar');
                            },1000)
                        }
                    })
                }
                // 处理时间
                this.time = getApp().timefiter(order.activity.starts_at, order.activity.ends_at);

                // 处理选择条
                this.finish_min_minutes = order.activity.finish_min_minutes;
                this.finish_min_hours = order.activity.finish_min_hours;
                this.finish_max_minutes = order.activity.finish_max_minutes;
                this.finish_max_hours = order.activity.finish_max_hours;
                this.init = true;
            },
            // 选择收货地址
            selectAddress () {
                wx.navigateTo({
                    url:`/pages/addressList/main?order_no=${this.order.order.order_no}&url=${getCurrentPages()[getCurrentPages().length - 1].route}`,
                })
            },
            jumpGoods() {
                wx.navigateTo({
                    url:`/pages/orderGoods/main?order_no=${this.order.order.order_no}`,
                })
            },
            //            填写个人资料
            edit() {
                var url = getUrl();
                wx.navigateTo({
                    url: '/pages/usersetting/main?url=' + url
                })
            },
            //下一步提交表单信息
            submitStep(){
                // 如果有商品就需要选择地址
                if (this.order.order && !this.order.address) {
                    wx.showModal({
                        content: '请选择收货地址',
                        showCancel: false
                    })
                    return
                } else if (this.order.activity.fee_type == 'OFFLINE_CHARGES') {
                    // 线下需要填写尺码信息
                    if (this.order.size == null || !this.order.size.upper || !this.order.size.lower || !this.order.size.shoes) {
                        wx.showModal({
                            content: '请先完善报名资料中的服装尺码信息！',
                            showCancel: false
                        })
                        return
                    }
                } else if (this.list && this.list.length) {
                    // 表单校验
                    let keyList = Object.keys(this.user);
                    var that = this;
                    var message = "";
                    for (var i = 0; i < keyList.length; i++) {
                        if (this.validate.validateObj[keyList[i]].status == 1 && this.validate.validateObj[keyList[i]].necessary == 1) {
                            message = this.validate.checkRulues(this,{
                                name: keyList[i],
                                val: that.user[keyList[i]],
                                title: that.validate.validateObj[keyList[i]].title,
                                type: that.validate.validateObj[keyList[i]].type
                            });
                        }
                        else if (this.validate.validateObj[keyList[i]].status == 1 && this.validate.validateObj[keyList[i]].necessary == 0 && keyList[i] == "id_card" && this.user[keyList[i]] != "") {
                            message = this.validate.checkRulues(this,{
                                name: keyList[i],
                                val: that.user[keyList[i]],
                                title: that.validate.validateObj[keyList[i]].title,
                                type: that.validate.validateObj[keyList[i]].type
                            });
                        }
                        if (message) {
                            break;
                        }
                    }
                    if(message){
                        wx.showModal({
                            content:message,
                            showCancel: false
                        })
                        return;
                    }
                }

                this.confirm();
                // this.submitPay(this.id,this.payment_id,this.user);
            },
            // 提交订单
            confirm() {
                var token = this.$storage.get('user_token');
                wx.showLoading({
                    title: '正在提交',
                    mask: true
                })
                this.$http
                    .post(this.$config.GLOBAL.baseUrl + 'api/activity/mini/order/confirm', {
                        activity_id: this.id,
                        payment_id: this.payment_id,
                        activityForm: this.user,
                        order_no: this.order.order ? this.order.order.order_no : '',
                        address_id: this.order.address ? this.order.address.id : ''
                    }, {
                        headers:{
                            Authorization:token
                        }
                    }).then(res => {
                        res = res.data;
                        if (res.status) {
                            console.log(res);
                            // 如果状态为1,说明报名成功
                            if (res.data.pay_status) {
                                wx.redirectTo({
                                    url:'/pages/success/main?order_no='+res.data.order_no
                                })
                            } else {
                                wx.redirectTo({
                                    url:'/pages/pay/main?order_no='+res.data.order_no
                                })
                            }
                        } else {
                            wx.showModal({
                                content: res.message || "报名失败",
                                showCancel: false
                            })
                        }
                    wx.hideLoading();
                }, err => {
                        wx.hideLoading();
                    wx.showModal({
                        content:"请求失败",
                        showCancel: false
                    })
                })
            },
            //请求核对接口
            submitPay(activity_id,payment_id,activityForm){
                var token = this.$storage.get('user_token');
                this.$http
                    .post(this.$config.GLOBAL.baseUrl+'api/activity/checkout/'+activity_id,{
                        payment_id:payment_id || '',
                        activityForm:activityForm || {}
                    },{
                        headers:{
                            Authorization:token
                        }
                    })
                    .then(res=>{
                        res = res.data;
                        if(res.status){
                            switch (res.data.pay_status){
                                case 0:
                                    if (res.data.activity.fee_type == "CHARGING") {
                                        /*this.$router.push({name: "activity_pay", params: {id: res.data.order_no}, query: {price: res.data.activity.payments[payment_index].price}});*/
                                        wx.redirectTo({
                                            url:'/pages/pay/main?order_no='+res.data.order_no
                                        })
                                    }
                                    break;
                                case 1:
                                    /*this.$router.push({name: "register_postSuccess", query: {activityId: this.myID}});*/
                                    wx.redirectTo({
                                        url:'/pages/success/main?order_no='+res.data.order_no
                                    })
                                    break;
                            }
                        } else {
                            wx.showModal({
                                content: res.message || "报名失败",
                                showCancel: false
                            })
                        }
                    },err=>{
                        wx.showModal({
                            content:"请求失败",
                            showCancel: false
                        })
                    })
            },
            pickerStatus(e, name, index){
                this.user[name] = this.list[index].options[e.target.value].name
            },
            //请求活动详情 时间跟价钱的接口
            getDetail(id){
                this.$http
                    .get(this.$config.GLOBAL.baseUrl + 'api/activity/show/' + id).then(res => {
                    res = res.data;
                    if (res.status) {
                        var detail = res.data;
                        this.finish_min_minutes = detail.finish_min_minutes;
                        this.finish_min_hours = detail.finish_min_hours;
                        this.finish_max_minutes = detail.finish_max_minutes;
                        this.finish_max_hours = detail.finish_max_hours;
                       /* this.article = res.data.content;
                        this.describe = res.data.coach.describe;
                        this.time = getApp().timefiter(res.data.starts_at,res.data.ends_at);
                        this.ac_status = getApp().ac_status(this.detail.status);*/
                    } else {
                        wx.showModal({
                            content: res.message || "请求失败",
                            showCancel: false
                        })
                    }
                }, err => {
                    wx.showModal({
                        content: '请求失败，请重试',
                        showCancel: false,
                    })
                })
            },
            //获取slidebar 的宽度
            getDomInfo(name) {
                var query = wx.createSelectorQuery();
                var barWidth;
                query.select(name).boundingClientRect(res => {
                    barWidth = res.width;
                    this.areaWidth = barWidth - 30;
                }).exec();
            },

            //设置时间
            setTime(name){
                var maxTime = this.finish_max_hours*60+this.finish_max_minutes;
                var minTime = this.finish_min_hours*60+this.finish_min_minutes;
                var distanceTime = maxTime - minTime;
                var percent = Math.floor(distanceTime/this.areaWidth*this.x);
                this.percent = percent;
                percent+=minTime;
                var obj = {};
                var hour = parseInt(percent/60);
                var minute = percent%60;
                obj.key = hour+'小时'+minute+'分钟';
                obj.val = hour+'-'+minute;
                this.timeObj = obj;
                console.log(name);
                this.$set(this.user, name, obj.val)
            },
            //滑动条
            change(e,name){
                this.x = e.x;
                if (e.x==0){
                    this.x = e.x
                } else if(e.x>0){
                    this.x = e.x+22
                }
                this.setTime(name);
            },
            showPicker(key){
                this.picker[key] = true;
            },
            show_city(){
                this.showCity = !this.showCity;
            },
            select(name, val) {
                this.user[name] = val;
            },
            getFormList(id) {
                wx.showLoading({
                    title:"加载中",
                    mask:true
                });
                var token = this.$storage.get('user_token');
                this.$http
                    .get(this.$config.GLOBAL.baseUrl + 'api/activity/form/fields/' + id,{}, {
                        headers: {
                            Authorization: token
                        }
                    })
                    .then(res => {
                        res = res.data;
                        if (res.status) {
                            this.list = this.adapter(res.data);
                            this.list.forEach(val=>{
                                if (val.type=='range' && val.status == 1){
                                    setTimeout( res=> {
                                        this.getDomInfo('.slide-bar');
                                    },1000)
                                }
                            })
                        } else {
                            wx.showModal({
                                content:res.message || "请求失败",
                                showCancel:false
                            })
                        }
                        wx.hideLoading();
                    }, err => {
                        wx.showModal({
                            content: '请求失败，请重试',
                            showCancel: false,
                        })
                        wx.hideLoading()
                    })
            },
            //单选按钮
            changeRadio(e, name){
                this.$set(this.user, name, e.target.value)
            },
            //多选按钮
            changeBox(e,name){
                this.$set(this.user, name, e.target.value)
            },
            //处理免责声明
            changeCheck(e,name){
                this.$set(this.user, name, e.target.value)
            },
//            处理数据
            adapter(data) {
                if (!data) {
                    return
                }
                let arrList = [];
                let caseValidate = this.validate;
                data.forEach(item => {
                    if (item.type == "checkbox" || item.type == "file") {
                        if (item.value) {
                            this.$set(this.user, item.name, item.value);
                        } else {
                            this.$set(this.user, item.name, []);
                        }
                    } else if (item.type == 'range') {
                        this.$set(this.user, item.name, '');
                    } else if (item.type == 'statement') {
                        this.$set(this.user, item.name, false);
                    } else if (item.type == 'radio' && item.name == 'certificate_type' && item.status == 1) {
                        this.$set(this.user, item.name, 'id_card');
                    } else {
                        this.$set(this.user, item.name, item.value);
                    }
                    caseValidate.addRules({
                        name: item.name,
                        options: {
                            status: item.status,
                            necessary: item.is_necessary,
                            title: item.title,
                            type: item.type
                        }
                    });
                    if (item.type == "select") {
//                        this.$set(this.picker, item.name, false);
                        /*var obj = {};
                        obj.target = item.name;
                        obj.list = [];
                        item.options.forEach((val) => {
                            obj.list.push({
                                id: val.name,
                                name: val.name
                            })
                        });
                        item.options = [];
                        item.options.push(obj);

                        console.log(item);*/
                    }

                    arrList.push(item)
                });
                return arrList
            },
            // 添加图片
            fileChange(name){
                var token = this.$storage.get('user_token');
                wx.chooseImage({ //从本地相册选择图片图片或者使用相机拍照
                    count:1,//最多可以选择的图片张数
                    success:res => {
                        //返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                        var tempFilePaths = res.tempFilePaths; //图片的本地文件路径列表
                        var tempFiles = res.tempFiles;//图片的本地文件列表，每一项是一个 File 对象
                        wx.showLoading({
                            title: '上传中'
                        })
                 wx.uploadFile({//将本地资源上传到开发者服务器，客户端发起一个HTTP post请求，其中content-type为multipart/form-data
                        header:{
                            'content-type': 'multipart/form-data',
                            Authorization: token
                        },
                        url:this.$config.GLOBAL.baseUrl + 'api/activity/image/upload',
                        filePath: tempFilePaths[0],
                        name:'image', //与后台商定的名字，文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
                        success:rej=>{
                        var result = JSON.parse(rej.data);
                        this.user[name].push(result.data.url);
                        this.statusUpdate = !this.statusUpdate;
            },
                     complete: err => {
                            wx.hideLoading();
                     }

            })
                    }

                })
            },
            //删除图片
            deleteX(item,index){
                this.user[item].splice(index,1);
                this.statusUpdate = !this.statusUpdate;
            },
            //查看声明详情
            lookDetail(){
                this.statement = !this.statement;
            },
        }
    }
</script>

<style rel="stylesheet/less" lang="less" type="text/less">
    @import "../../../static/global.less";

    page {
        background-color: #F3F3F3;
        width: 100%;
        height: 100%;
    }
    .item {
        margin-top: 10px;
        background: #FFFFFF;
        .title {
            font-size: 14px;
            padding: 10px 15px;
            color: #2E2D2D;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .iconfont {
                font-size: 12px;
                color: #2E2D2D;
            }
        }
        &.goods {
            .goods-item {
                display: flex;
                padding: 5px 15px;
                background: #FFFFFF;
                .left {
                    position: relative;
                    width: 95px;
                    height: 95px;

                    image {
                        width: 100%;
                        height: 100%;
                    }
                    .required {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        height: 22px;
                        line-height: 22px;
                        font-size: 12px;
                        color: #FFFFFF;
                        background: @globalColor;
                        text-align: center;
                        opacity: .8;
                    }
                }
                .right {
                    flex: 1;
                    overflow: hidden;
                    padding-left: 10px;
                    .name {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .price {
                        display: flex;
                        align-items: center;
                        margin-top: 10px;
                        .new {
                            color: @globalColor;
                            span {
                                font-size: 12px;
                            }
                        }
                        .old {
                            padding-top: 6px;
                            font-size: 12px;
                            color: #9B9B9B;
                            text-decoration: line-through;
                            margin-left: 5px;
                        }
                    }
                    .btn-box {
                        color: #9B9B9B;
                        font-size: 13px;
                        margin-top: 10px;
                    }
                }
            }
            .line {
                padding: 10px 15px;
                font-size: 12px;
                line-height: 18px;
               /* background-image: url('https://uto.ibrand.cc/m/static/img/ic_forward.png');
                background-repeat: no-repeat;
                background-position: 100%;
                background-size: 15px;*/
            }
            .all-goods{
                display: flex;
                align-items: center;
                justify-content: space-between;
                .good-box{
                    display: flex;
                    align-items: center;
                    flex: 1;
                    overflow: hidden;
                    .good-img{
                        display: inline-block;
                        width: 60px;
                        height: 60px;
                        margin-right: 10px;
                        img{
                            width: 100%;
                            height: 100%;
                            overflow: auto;
                        }
                    }
                }
                .num{
                    display: flex;
                    align-items: center;
                    color:#9b9b9b;
                    font-size: 12px;

                    .iconfont {
                        font-size: 12px;
                        margin-left: 10px;
                    }
                }

            }
            .comm-account {
                height: 40px;
                line-height: 40px;
                background: #fff;
                text-align: right;
                font-size: 12px;
                padding: 0 12px;
            }
        }
        &.address {

            .add-info {
                padding: 10px 15px 20px;
                .name {
                    color: #2E2D2D;
                    span {
                        margin-right: 10px;
                    }
                    margin-bottom: 10px;
                }
                .info {
                    font-size: 12px;
                    color: #4A4A4A;
                }
            }
            .line {
                width: 100%;
                height: 6px;
                background: url("https://ibrand-miniprogram.oss-cn-hangzhou.aliyuncs.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F/%E5%88%86%E7%BB%84.png") no-repeat;
                background-size: 100% 100%;
            }
            .no-address {
                padding: 10px 15px 20px;
                font-size: 14px;
                color: #2E2D2D;
            }
        }
        &.activity {
            .act-item{
                background-color: #ffffff;
                padding: 10px 15px;
                display: flex;
                /*align-items: center;*/
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
                        /*display: flex;*/
                        /*align-items: center;*/
                        /*justify-content:space-between ;*/
                        overflow: hidden;
                        /*margin-top:10px;*/
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
                            float: right;
                        }
                        .red{
                            background-color: @globalColor;
                        }
                    }
                }
            }
        }
        &.enroll {
            .user-info {
                background: #ffffff;
                margin: 10px 0;
                .info-item {
                    display: flex;
                    align-items: center;
                    padding: 12px;

                    .name {
                        font-size: 15px;
                        width: 80px;
                        color: #959595;
                    }
                    .text {
                        font-size: 15px;
                        color: #000;
                    }
                    &.info-title {
                        .titles {
                            flex: 1;
                            font-size: 16px;
                        }
                        .edit {
                            font-size: 15px;
                            color: #0479ff;
                        }
                    }
                }
            }
            .pay-type {
                background: #ffffff;
                .text {
                    font-size: 16px;
                    padding: 12px;
                }
            }
            .buttom {
                position: fixed;
                bottom: 0;
                height: 50px;
                line-height: 50px;
                width: 100%;
                text-align: center;
                background: @globalColor;
                color: #ffffff;
            }
        }

    }
    .input_item{
        margin-top: 10px;
        background-color: #FFFFFF;

        .title{
            font-size: 16px;
            color: #4A4A4A;
            line-height: 20px;
            padding: 12px 15px;
        }
        textarea{
            width: 100%;
            box-sizing: border-box;
            height: 125px;
            border: 0;
            padding: 10px 15px;
            font-size: 14px;
            line-height: 20px;
        }
        /*overflow：hidden*/
        .img{
            .img_item{
                position: relative;
                display: inline-block;
                margin-left:15px;
                background-color: #FFFFFF;
                img{
                    position: relative;
                    width: 79px;
                    height: 79px;

                }
                &::after{
                    content: 'X';
                    position: absolute;
                    right: -6px;
                    top: -5px;
                    text-align: center;
                    line-height: 15px;
                    color: #FFFFFF;
                    width: 15px;
                    height: 15px;
                    font-size: 12px;
                    background: black;
                    border-radius: 100%;
                }
            }
            /*img{*/
            /*position: relative;*/
            /*width: 60px;*/
            /*height: 60px;*/
            /*&:after{*/
            /*content: '';*/

            /*position: absolute;*/
            /*right: 0;*/
            /*top: 0;*/
            /*width: 15px;*/
            /*height: 15px;*/
            /*background: url("../../../../static/img/X.png") no-repeat;*/
            /*background-size: 100% 100%;*/
            /*}*/
            /*}*/
            margin-top:15px;
            .upload{
                position: relative;
                display: inline-block;
                width: 79px;
                height: 79px;
                margin-left: 10px;
                border: 1px solid #DDDDDD;
                .img_file{
                    position: absolute;
                    z-index: 1;
                    left: 0;
                    top: 0;
                    width: 79px;
                    height: 79px;
                    opacity: 0;
                }
                &::after{
                    content: '+';
                    font-size: 50px;
                    text-align: center;
                    line-height: 70px;
                    position: absolute;
                    display: block;
                    width: 79px;
                    height: 79px;
                    left: 0;
                    top: 0;
                    color:#CCCCCC;
                }
            }
        }
        p{

        }
        input[type=text]{
            padding:0px 15px;
            height: 38px;
            line-height: 38px;
            border: 0;
           font-size: 14px;
        }
        /*input[type=radio]{
            border: 1px solid #eeeeee;
        }*/
        span{
            &.box{
                position: relative;
                display: inline-block;
                box-sizing: border-box;
                padding-left: 15px;
                width: 100%;
                padding-right: 20px;
                height: 38px;
                line-height: 38px;
                border:0;
                font-size: 14px;
                &:after{
                    content: '';
                    position: absolute;
                    top: 50%;
                    right: 15px;
                    transform-origin:center 30%;
                    transform: translate(0,-30%);
                    vertical-align: middle;
                    width: 0;
                    height: 0;
                    border-width: 8px;
                    border-color: #C7C7CC transparent transparent transparent;
                    border-style: solid dashed dashed dashed;
                }
            }
        }
        .input_radio{
            padding: 10px 15px;
            color: #000000;
            font-size: 16px;
            .inline{
                display: inline-block;
                checkbox-group{
                    display: inline-block;
                }
            }
            .look{
                display: inline-block;
                color: @globalColor;
            }
            checkbox{
                margin-right: 20px;
            }
            //重置多选按钮样式
            checkbox .wx-checkbox-input{
                margin-right: 15px;
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
                border-radius: 100%;
            }

            //重置单选按钮样式
            radio{
                margin-right: 20px;
            }
            radio .wx-radio-input{
                border-radius: 100%;
                background-color: #fff;
                border: 1px solid #c1caca;
                box-shadow: 0 1px 2px rgba(0,0,0,.05), inset 0 -15px 10px -12px rgba(0,0,0,.05);
                height: 14px;
                width: 14px;
                margin-right:15px;
            }
            radio .wx-radio-input.wx-radio-input-checked::before{
                background-color: @globalColor;
                border: 1px solid @globalColor;
                border-radius: 100%;
            }

        }
        .statement_content{
            position: fixed;
            z-index: 100;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background-color: #FFFFFF;
            .statement_content_title{
                h3{
                    padding-top: 10px;
                    padding-bottom: 10px;
                    text-align: center;
                }
            }
            .statement_content_body{
                box-sizing: border-box;
                padding:0 10px 100px 10px;
                margin-bottom: 20px;
                height: 100%;
                overflow: auto;
            }
            .statement_content_footer{
                position: absolute;
                width: 100%;
                left: 0;
                bottom: 0;
                text-align: center;
                color: #FFFFFF;
                background-color: #1aad19;
                padding-top: 10px;
                padding-bottom: 10px;
            }
        }
    }
    .bottom-bar{
        z-index: 3;
        position: fixed;
        width: 100%;
        left: 0;
        bottom: 0;
        height: 50px;
        line-height: 50px;
        background-color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        .money {
            padding-left: 15px;
            color: @globalColor;
            flex: 2;
        }
        .pay {
            text-align: center;
            flex: 1;
            background-color: @globalColor;
            color: #FFFFFF;
        }
    }
    .top-content{
        padding-bottom:80px;
    }
    //滑动条
    .slide-time{
        background-color: #FFFFFF;

        .title{
            font-size: 16px;
            color: #4A4A4A;
            line-height: 20px;
            padding: 12px 15px;

        }
        .slide-bar{
            padding:20px 15px;
        }
    }
</style>
