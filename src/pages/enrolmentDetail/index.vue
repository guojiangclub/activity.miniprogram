<template>
    <div id="enrol_index">
        <div class="ac-status">
            <div class="status-title">
                <span class="txt">活动状态：</span>
                <span class="btn" :class="{'fade':enrolData.status==3 || enrolData.member_status==3}">{{register_txt}}</span>
            </div>
            <div class="item mx-1px-bottom" @click="jumpDetail(enrolData.id)">
                <div class="info-left">
                    <image :src="enrolData.img_list" mode="aspectFill"></image>
                </div>
                <div class="info-rigth">
                    <div class="name">{{enrolData.title}}</div>
                    <div class="time">{{enrolData.time_section}} </div>
                    <div class="address">{{enrolData.address}}</div>
                    <div class="money">
                        <span class="text subtitle" v-if="enrolData.fee_type != 'OFFLINE_CHARGES' && enrolData.fee_type != 'CHARGING'">{{enrolData.subtitle}}</span>
                        <span class="text" v-if="enrolData.payments && enrolData.payments.type == 0">{{enrolData.payments.point}}积分</span>
                        <span class="text" v-if="enrolData.payments && enrolData.payments.type == 1"><span>￥</span>{{enrolData.payments.price}}</span>
                        <span class="text" v-if="enrolData.payments && enrolData.payments.type == 2"><span>￥</span>{{enrolData.payments.price}}+{{enrolData.payments.point}}积分</span>
                        <span class="text" v-if="enrolData.payments && enrolData.payments.type == 4"><span>￥</span>{{enrolData.payments.price}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="ac-intro">
            <div class="title mx-1px-bottom">活动信息：</div>
            <div class="intro-content">
                <div class="info mx-1px-bottom">
                    <div class="info-tit">活动时间</div>
                    <div class="info-detail">{{enrolData.time_section}}</div>
                </div>
                <div class="info mx-1px-bottom">
                    <div class="info-tit">活动地点</div>
                    <div class="info-detail">{{enrolData.address}}</div>
                </div>
                <div class="info mx-1px-bottom">
                    <div class="info-tit">活动领队</div>
                    <div class="info-detail">{{enrolData.coach.nick_name}}</div>
                </div>
                <div class="info mx-1px-bottom" v-if="enrolData.coach.mobile" @click="makeCall(enrolData.coach.mobile)">
                    <div class="info-tit">领队电话</div>
                    <div class="info-detail blue">{{enrolData.coach.mobile}}</div>
                </div>
            </div>
        </div>
        <!--<div class="total-price">
            <div class="ac-total">
                <span>活动总价</span>
                <span class="txt">¥ 290.00</span>
            </div>
            &lt;!&ndash;<div class="disbursements">
                <span>实付款</span>
                <span class="txt">¥295.80</span>
            </div>&ndash;&gt;
        </div>-->
        <div class="block-item goods" v-if="enrolMeta.shopOrder">
            <div class="title mx-1px-bottom">
                <div>
                    商品清单:
                </div>
            </div>
            <div class="goods-item mx-1px-bottom" v-for="(item,index) in enrolMeta.shopOrder.items" v-if="enrolMeta.shopOrder.items.length == 1">
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
            <div class="line all-goods" v-if="enrolMeta.shopOrder.items.length > 1" @click="jumpGoods">
                <div class="good-box">
                    <div class="good-img" v-for="(item,index) in enrolMeta.shopOrder.items" v-show="index < 4">
                        <img :src="item.item_meta.image" alt="">
                    </div>
                </div>
                <div class="num">
                    <div> 共{{enrolMeta.shopOrder.count}}件</div>
                    <div class="iconfont icon-Group104"></div>
                </div>
            </div>
            <div class="comm-account mx-1px-top">
                {{enrolMeta.shopOrder.count}}件商品，合计￥{{enrolMeta.shopOrder.total_yuan}}
            </div>
        </div>
        <div class="bottomBar">
            <div class="item-left" v-if="isCancel || isSign">
                <button class="bgWhite" @click="cancelConfirm" v-if="isCancel">取消报名</button>
                <button class="bgRed"   v-if="isSign" @click="showInfo">扫码签到</button>
            </div>
            <div class="item-rigth" v-if="enrolData.status==1 && state.member_status==0 && state.order && state.order.pay_status==0" @click="jumpPay(state.order.order_no)">
                <div class="money">
                    <span class="text subtitle" v-if="enrolData.fee_type != 'OFFLINE_CHARGES' && enrolData.fee_type != 'CHARGING'">{{enrolData.subtitle}}</span>
                    <span class="text" v-if="enrolData.payments && enrolData.payments.type == 0">{{enrolData.payments.point}}积分</span>
                    <span class="text" v-if="enrolData.payments && enrolData.payments.type == 1"><span>￥</span>{{enrolMeta.activityOrder.total / 100}}</span>
                    <span class="text" v-if="enrolData.payments && enrolData.payments.type == 2"><span>￥</span>{{enrolMeta.activityOrder.total / 100}}+{{enrolData.payments.point}}积分</span>
                    <span class="text" v-if="enrolData.payments && enrolData.payments.type == 4"><span>￥</span>{{enrolMeta.activityOrder.total / 100}}</span>
                </div>
                <div class="go-pay">去付款</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                enrolData:{
                    payments:[],
                    coach:{}
                },
                enrolMeta:{},
                register_txt:'',
                isCancel:'',
                isSign:'',
                myId:'',
                message:'',
                init:'',
                state:{},
                status_txt:''

            }
        },
        mounted(){
            var id = this.$root.$mp.query.id;
            this.myId = id;
            this.getMineEnrol(id);
            this.getCheck(id);
        },
        methods:{
            //拨打电话
            makeCall(phoneNumber){
                wx.makePhoneCall({
                    phoneNumber:phoneNumber
                })
            },
            jumpGoods() {
                wx.navigateTo({
                    url:`/pages/orderGoods/main?order_no=${this.enrolMeta.shopOrder.order_no}`,
                })
            },
//            跳到支付页面
            jumpPay(order_no){
                wx.navigateTo({
                    url:'/pages/pay/main?order_no='+order_no
                })
            },
            showInfo() {
              wx.showModal({
                  content: '请使用微信扫码进行签到',
                  showCancel: false
              })
            },
            jumpDetail(id) {
                wx.navigateTo({
                    url:'/pages/detail/main?id='+id
                })
            },
            //请求去付款的的按钮的接口
            getCheck(myId){
                var token = this.$storage.get('user_token');
                wx.showLoading({
                    title:"加载中",
                    mask:true
                })
                this.$http
                    .get(this.$config.GLOBAL.baseUrl +'api/activity/show/check/'+ myId,{},{
                        headers: {
                            Authorization:token
                        }
                    })
                    .then(res=>{
                        res = res.data;
                        if(res.status){
                            /*console.log(res.data);*/
                            this.state = res.data;
                           /* this.status_txt = this. statusText();*/
                        } else {
                            wx.showModal({
                                content: res.message || "请求失败",
                                showCancel: false
                            })
                        }
                        wx.hideLoading();
                    },err=>{
                        wx.showModal({
                            content: '请求失败，请重试',
                            showCancel: false,
                        })
                        wx.hideLoading()
                    })
            },
            //去付款的按钮是否显示
        /*    statusText(){
                var s1 = this.enrolData.status;
                var s2 = this.state.member_status;
                var s3 = this.state.order;
                switch (s1) {
                    case 1:
                        switch (s2) {
                            case 0:
                                if (s3) {
                                    const pay_status = s3.pay_status;
                                    if (pay_status == 0) {
                                        return '在线活动待支付';
                                    }
                                    else {
                                        return '立即报名';
                                    }

                                }
                                else {
                                    return '立即报名';
                                }
                            case 1:
                                return '活动已报名';
                            case 4:
                                return '线下活动待审核';
                        }
                        break;
                }
            },*/
        //点击取消报名成功的接口
        getCancel(myId){
            var token = this.$storage.get('user_token');
            wx.showLoading({
                title:"加载中",
                mask:true
            })
            this.$http
                .post(this.$config.GLOBAL.baseUrl +'api/activity/cancel/'+ myId,{},{
                    headers: {
                        Authorization:token
                    }
                })
                .then(res=>{
                    res = res.data;
                    if(res.status){
                        this.message = res.message;
                        wx.showModal({
                            title:this.message,
                            content:"您已成功取消了“"+this.enrolData.title+"”的报名",
                            showCancel: false,
                                success: res => {
                                if (res.confirm || (!res.cancel && !res.confirm)) {
                            this.getMineEnrol(this.myId);
                            this.getCheck(this.myId);
                        }
                    }

                        })
                    } else {
                        wx.showModal({
                            content: res.message || "请求失败",
                            showCancel: false
                        })
                    }
                    wx.hideLoading();

                },err=>{
                    wx.showModal({
                        content: '请求失败，请重试',
                        showCancel: false,
                    })
                    wx.hideLoading()
                })
        },
            //点击取消报名事假
            cancelConfirm(){
                if (this.enrolData.refund_status==0){
                    wx.showModal({
                        content:'本活动不支持退款，是否仍然取消报名？',
                        success: res => {
                            if (res.confirm){
                                this.getCancel(this.myId);
                            } else if(res.cancel){
                                console.log("取消");
                            }
                        }
                    })
                } else {
                    wx.showModal({
                        content:'是否取消报名？',
                        success:res =>{
                            if (res.confirm){
                                this.getCancel(this.myId);
                               /* debugger*/
                            } else if(res.cancel){
                                console.log("取消");
                            }
                        }
                    })
                }
            },

            //是否可以签到的判断
            isCanSign: function () {
                var mStatus = this.enrolData.member_status;
                var isCan = this.enrolData.can_sign;
                if ( mStatus==1 && isCan===true ) {
                    return true;
                }else{
                    return false;
                }
            },
                //是否取消报名的判断
            isCanCancel(){
                var status = this.enrolData.status;
                var mStatus = this.enrolData.member_status;
                var start = this.enrolData.starts_at;
                var cancel = this.enrolData.refund_term;
                var fee_type = this.enrolData.fee_type;
                var  refund_status = this.enrolData.refund_status;
                var  time = new Date(start.replace(/-/g,"/")).getTime() - cancel*60*1000 - new Date().getTime();
                var order = this.enrolMeta.shopOrder;
                if(refund_status == 0){
                    return false
                }

                if ( mStatus==1 || (mStatus == 0 && fee_type == 'CHARGING') || (mStatus == 0 && fee_type == 'OFFLINE_CHARGES' && order)) {
                    switch (true) {
                        case status==1: case status==4: case status==5: case status==2 && time>0:
                        return true;
                        default:
                            return false;
                    }
                }else{
                    return false;
                }
            },
//            请求报名详情页数据
            getMineEnrol(id){
                var token = this.$storage.get('user_token');
                wx.showLoading({
                    title:"加载中",
                    mask:true
                })
                this.$http
                    .get(this.$config.GLOBAL.baseUrl + 'api/activity/myActivity/'+id,{},{
                        headers: {
                            Authorization:token
                        }
                    })
                    .then(res =>{
                        res = res.data;
                        if (res.status){
                            this.enrolData = res.data;
                            this.enrolMeta = res.meta;
                            this.register_txt = getApp().register_status_txt(res.data.status,res.data.member_status);
                            this.isCancel = this.isCanCancel();
                            this.isSign = this.isCanSign();

                            if (res.meta.shopOrder) {
                                var data = {
                                    order: res.meta.shopOrder
                                }
                                this.$storage.set('orderGoods', data);
                            }
                        } else {
                            wx.showModal({
                                content: res.message || "请求失败",
                                showCancel: false
                            })
                        }
                        wx.hideLoading();
                    },err =>{
                        wx.showModal({
                            content: '请求失败，请重试',
                            showCancel: false,
                        })
                        wx.hideLoading()
                })
            }
        }

    }
</script>
<style rel="stylesheet/less" lang="less" type="text/less">
    @import "../../../static/global.less";
    page{
        /*height: 100%;*/
        background-color:#F3F3F3;
    }
    #enrol_index{
        margin-bottom: 60px;
        .block-item {
            /*margin-top: 10px;*/
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
        }
        .ac-status{
            margin:5px 0;
            background-color: #FFFFFF;
            .status-title{
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding:0 15px;
                height:44px;
                color:#4A4A4A;
                font-size:14px;
                .btn{
                    padding:4px 6px;
                    border-radius: 2px;
                    /*border: 1px solid #9B9B9B;*/
                    color: #FFFFFF;
                    background-color:#fd8500;
                }
                .fade{
                    color: #ffbf7d;
                }
            }
            .item{
                background-color: #ffffff;
                padding: 10px 15px;
                display: flex;
                align-items: center;
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
                        display: flex;
                        align-items: center;
                        justify-content:space-between ;
                        margin-top:10px;
                        .text{
                            color: #4A4A4A;
                            font-size: 16px;
                            line-height: 16px;
                            span{
                                font-size: 12px;
                            }
                        }
                        .subtitle{
                            color: #9c9c9c;
                            font-size: 12px;
                        }
                        .enroll-btn{
                            padding: 4px 8px;
                            font-size:12px;
                            color: #ffffff;
                            line-height: 16px;
                            background-color: #d8d8d8;
                        }
                        .red{
                            background-color: @globalColor;
                        }
                    }
                }
            }
        }
        .ac-intro{
            background-color:#FFFFFF;
            margin-bottom: 10px;
            .title{
                color: #4A4A4A;
                font-size: 14px;
                padding:0 0 0 15px;
                height: 44px;
                line-height: 44px;
            }
            .intro-content{
                padding:0 0 0 15px;
                .info{
                    padding:10px 0 8px 0;
                    display: flex;
                    .info-tit{
                        width: 60px;
                        margin-right:7px;
                        font-size: 14px;
                        color:#4A4A4A;
                    }
                    .info-detail{
                        /*overflow: hidden;*/
                        flex: 1;
                        font-size:16px;
                        color:#000;
                        padding:0 15px 0 0px;
                        line-height: 22px;
                    }
                    .blue{
                        color: #4990e2;
                    }
                }
            }
        }
        .total-price{
            padding: 0 15px 18px 15px;
            .ac-total{
                color:#888888;
                font-size: 12px;
                line-height: 20px;
                display: flex;
                justify-content: space-between;
                .txt{
                    color:#4A4A4A;
                }
            }
            .disbursements{
                color:#2E2D2D;
                font-size: 14px;
                line-height: 20px;
                margin-top: 4px;
                display: flex;
                justify-content: space-between;
                .txt{
                    color: @globalColor;
                }
            }
        }
        .bottomBar{
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 50px;
            line-height: 50px;
            display: flex;
            .item-left{
                flex: 1;
                button{
                    font-size:16px;
                    border-radius: 0px;
                    height: 50px;
                    line-height: 50px;
                    &.bgWhite {
                        background-color: #FFFFFF;
                        color:#959595;
                    }
                    &.bgRed{
                        background-color:#ed0000;
                        color: #FFFFFF;
                    }

                }
                button::after{
                    border: none;
                }
            }
            .item-rigth{
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                /*border-left:1px solid #DBDBDB;*/
                background-color:@globalColor;
                color: #FFFFFF;
                .money{
                    flex: 1;
                    .text{
                        font-size: 20px;
                        span{
                            font-size: 12px;
                        }
                    }
                }
                .go-pay{
                    flex: 1;
                    font-size:16px;
                }
            }
        }
    }
</style>