<template>
    <div id="detailIndex">
        <div class="activity-content">
            <image :src="detail.img" mode="widthFix"></image>
            <div class="introduce">
                <div class="name">
                    {{ detail.title }}
                </div>
                <div class="money mx-1px-bottom">
                    <span class="txt subtitle" v-if="detail.fee_type != 'OFFLINE_CHARGES' && detail.fee_type != 'CHARGING'">{{ detail.subtitle}}</span>
                    <span class="txt" v-if="detail.payments[0] &&detail.payments[0].type == 0">{{detail.payments[0].point}}积分</span>
                    <span class="txt" v-if="detail.payments[0] &&detail.payments[0].type == 1"> <span>￥</span>{{detail.payments[0].price}}</span>
                    <span class="txt" v-if="detail.payments[0] &&detail.payments[0].type == 2"> <span>￥</span>{{detail.payments[0].price}}+{{detail.payments[0].point}}积分</span>
                    <span class="txt" v-if="detail.payments[0] &&detail.payments[0].type == 4"> <span>￥</span>{{detail.payments[0].price}}</span>
                    <span class="btn" :class="ac_status">{{info[detail.status]}}</span>
                </div>
                <div class="concrete">
                    <div class="date padd mx-1px-bottom">
                        <span class="iconfont icon-carryout"></span>
                        <span class="text">{{time}}</span>
                    </div>
                    <div class="addr padd mx-1px-bottom" @click="jumpMap">
                        <span class="iconfont icon-Group113"></span>
                        <span class="text">{{detail.address}}</span>
                        <span class="iconfont icon-Group104"></span>
                    </div>
                    <div class="num padd">
                        <span class="iconfont icon-Group64"></span>
                        <span class="text">已报名 {{ detail.member_count }}人</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="activity-tab">
            <div class="tab-header">
                <div class="tab-title">
                    <!--<div class="item active">活动详情</div>
                    <div class="item">活动领队</div>-->
                    <div class="item" v-for="(i,k) in tabList" :key="k" :class="activeIndex == k ? 'active':''">
                        <span  @click="changeTab($event,k)">{{i.title}}</span>
                    </div>
                    <div class="navar-slider" :style="{transform: 'translateX' + '(' + sliderOffset + 'px' + ')'}"></div>
                </div>
            </div>
            <div class="content" v-if="activeIndex == 0" v-show="detail.content">
                <wxParse :content="article" @preview="preview" @navigate="navigate"></wxParse>
            </div>
            <div class="content" v-if="activeIndex == 1">
                <div class="coach-intro" v-show="detail.coach">
                    <div class="avatar">
                        <image :src="detail.coach.avatar"></image>
                    </div>
                    <div class='coach-name'>{{detail.coach.nick_name}}</div>
                    <div class="coach-nick">{{detail.coach.title}}</div>
                </div>
                <div class="coach-txt" v-show="detail.coach">
                    <wxParse :content="describe"></wxParse>
                </div>
            </div>
        </div>
        <div class="fixed-btn">
            <div class="btn-left">
                <div class="item-btn" @click="jumpHome">
                    <div class="iconfont icon-home"></div>
                    <div class="txt">首页</div>
                </div>
                <div class="item-btn" @click="collect(id)" :class="loginDetail.liked?'activebtn':''">
                    <div class="iconfont icon-Group86"></div>
                    <div class="txt">收藏</div>
                </div>
                <div class="item-btn" @click="changeShare">
                    <div class="iconfont icon-Group67"></div>
                    <div class="txt">分享</div>
                </div>
            </div>
            <div class="btn-right">
                <button :class="statusClass" :disabled="statusdisabled" @click="submit">{{statusTxt}}</button>
            </div>
        </div>
        <!--弹出分享部分-->
        <div class="maks" :class="show_share ? 'cur':''">

        </div>
        <div class="share-box" :class="show_share ? 'cur':''">
            <button class="shaer-item" open-type="share">
                分享给好友
            </button>
            <div class="shaer-item mx-1px-top" @click="jumpImg(id,'pages/detail/main')">
                分享到朋友圈
            </div>
            <div class="shaer-item clear" @click="changeShare">
                取消
            </div>
        </div>

        <!--分享到朋友圈弹出-->
        <!--<view class="share-img-box" :class="share_img ? 'cur' : ''" >
            <view class="imgs-box">
                <view class="img">
                    <image mode="widthFix" src="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1533781747&di=4c8242fb96e43f3ca7561074b1e6f980&src=http://pic10.photophoto.cn/20090112/0034034441685806_b.jpg"></image>
                </view>
                <view class="text">
                    保存图片后，可分享到朋友圈
                </view>
                <view class="save" @click="downImg">
                    保存图片
                </view>
                <i class="iconfont icon-Group100" @click="changeImg"></i>
            </view>
        </view>-->


        <!--选择票种弹出-->
        <div class="maks" :class="show_ticket ? 'cur':''">

        </div>
        <div class="ticket-box" :class="show_ticket ? 'cur':''">
            <div class="shaer-item title mx-1px-bottom">
                <span class="iconfont icon-Group100" @click="changeTicket"></span>
                <span>请选择票种</span>
            </div>
            <div class="shaer-item mx-1px-bottom" :class="{ active:item.id==selectPayment }" v-for="item in detail.payments" @click="selectTickets(item)">
               <div class="ticket-name">
                   {{item.title}}
               </div>
                <div class="ticket-value">
                    <span v-if="item.type == 0">{{item.point}}积分</span>
                    <span v-if="item.type == 1">￥{{item.price}}</span>
                    <span v-if="item.type == 2">￥{{item.price}} + {{item.point}}积分</span>
                </div>
            </div>

            <div class="bottom" @click="submitTicket">
                确定
            </div>
        </div>
    </div>
</template>

<script>
    import wxParse from 'mpvue-wxparse';
    import { getUrl } from '../../utils';
    export default{
        components: {
            wxParse
        },
        data(){
            return {
                detail: {
                    payments: [],
                    coach:{}
                },
                loginDetail: {

                },
                info: getApp().textStatus,
                ac_status:"",
                article: "",
                describe:'',
                time: '',
                tabList:[{
                    title:"活动详情",
                },{
                    title:"活动领队"
                }],
                activeIndex:0,
                retColor:{
                    home:false,
                    collect:false,
                    share:false
                },
                id:'',
                show_share: false,           // 弹出分享
                share_img: false,             // 弹出到分享到朋友圈
                statusTxt: '',
                statusClass: '',
                show_ticket: false,
                selectPayment: '',
                paymentIndex: '',
                sliderOffset:'',
                statusdisabled:''
            }
        },
        onShow() {
            this.id = this.$root.$mp.query.id;
            var scene = this.$root.$mp.query.scene;
            if (scene) {
                var scene = decodeURIComponent(this.$root.$mp.query.scene);
                var sceneArr = scene.split('_');
                if (sceneArr.length > 0) {
                    this.id = sceneArr[0];
                }
            }
            var token = this.$storage.get('user_token');
            if (token) {
                this.getLoginDetail(this.id);
            }
            this.getDetail(this.id);
        },
        onLoad(e){
            wx.getSystemInfo({
                success: res =>{
                    /*this.width = res.windowWidth /this.tabList.length*2,*/
                    this.sliderOffset = res.windowWidth / this.tabList.length/2.8
                }
            });
//            将旧数据清空
            this.detail = {
                payments: [],
                coach:{}
            };
            this.article = '';
            this.describe = '';
            this.activeIndex = 0;
            this.show_share = false;
        },
        onShareAppMessage() {
            return {
                title: this.detail.title,
                path: '/pages/detail/main?id=' + this.id
            }
        },
        methods: {
            // 弹出图片
            /*changeImg() {
                   this.share_img = !this.share_img
            },*/
            // 弹出分享
            jumpImg(id,path){
                wx.navigateTo({
                    url:'/pages/shareImg/main?id='+id+'&path='+path
                })
                this.show_share = !this.show_share

            },
            changeShare() {
                   this.show_share = !this.show_share;
            },
            changeTab(e,index){
                this.activeIndex = index;
                this.sliderOffset =  e.currentTarget.offsetLeft;
            },
            changeTicket() {
                this.show_ticket = !this.show_ticket;
            },
            //点击收藏
            collect(id){
               /* this.retColor.collect = ! this.retColor.collect;*/
                var token = this.$storage.get('user_token');
                wx.showLoading({
                    title: '加载中',
                    mask:true
                })
                if(token){
                    this.$http
                        .post(this.$config.GLOBAL.baseUrl + 'api/activity/like/'+id,{},{
                            headers:{
                                Authorization:token
                            }
                        })
                        .then(res=>{
                            res=res.data;
                            if(res.status){
                                var liked = res.data.liked;
                                if(liked==1){
                                    this.getLoginDetail(id)
                                }
                                if(liked==0){
                                    this.getLoginDetail(id)
                                }
                                wx.hideLoading();
                            } else{
                                wx.showModal({
                                    content: res.message || "失败",
                                    showCancel: false
                                })
                            }
                        },err=>{
                            wx.showModal({
                                content:"请求失败",
                                showCancel: false
                            })
                        })
                } else {
                    var url = getUrl();
                    wx.showModal({
                        content: '请先登录',
                        success: res => {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: '/pages/register/main?url=' + url
                                })
                            }
                        }
                    })
                }
            },
            //回到首页
            jumpHome(){
                this.retColor.home = ! this.retColor.home;
                wx.reLaunch({
                    url:'/pages/index/main'
                })
            },
              /* preview(src, e){

            },
            navigate(href, e){

            },*/
            //请求活动详情页活动的数据
            getDetail(id){
                this.$http
                    .get(this.$config.GLOBAL.baseUrl + 'api/activity/show/' + id).then(res => {
                    res = res.data;
                    console.log(res);
                    if (res.status) {
                        this.detail = res.data;
                        this.article = res.data.content;
                        this.describe = res.data.coach.describe;
                        this.time = getApp().timefiter(res.data.starts_at,res.data.ends_at);
                        this.ac_status = getApp().ac_status(this.detail.status);
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
//            登录状态请求这个接口
            getLoginDetail(id) {
                var token = this.$storage.get('user_token')
                this.$http
                    .get(this.$config.GLOBAL.baseUrl + 'api/activity/show/check/' + id, {}, {
                        headers: {
                            Authorization: token
                        }
                    })
                    .then(res => {
                    res = res.data;
                    if (res.status) {
                        this.loginDetail = res.data;
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
            // 跳到地图
            jumpMap(){
                var  point = this.detail.address_point.split(',');
                var latitude = Number(point[0]);
                var longitude = Number(point[1]);
                var name = this.detail.address_name;
                 var address = this.detail.address;
                wx.getSetting({
                    success :ret =>{
                        // 如果之前没有授权
                        if(!ret.authSetting['scope.userLocation']){
                            wx.authorize({
                                scope:'scope.userLocation',
                                success: rej =>{
                                    wx.openLocation({
                                        latitude: latitude,
                                        longitude: longitude,
                                        scale: 18,
                                        name:name,
                                        address:address

                                    })
                                },
                                //用户拒绝授权
                                fail:ret =>{
                                  wx.openSetting({
                                      success:res =>{
                                          if(!res.authSetting['scope.userLocation']){
                                              wx.openSetting({
                                                  success:res =>{

                                                  }
                                              })
                                          }
                                      }
                                  })
                                }
                            })
                        } else{
                            wx.openLocation({
                                latitude: latitude,
                                longitude: longitude,
                                scale: 18,
                                name:name,
                                address:address
                            })
                        }
                    }
                })
            },
//            报名
            submit() {
                //                如果未登陆跳转到登陆页面
                var token = this.$storage.get('user_token');
                if (!token) {
                    var url = getUrl();
                    wx.showModal({
                        content: '请先登录',
                        success: res => {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: '/pages/register/main?url=' + url
                                })
                            }
                        }
                    })
                    return
                }

                console.log(1);
//                线上活动
                if (this.detail.fee_type == 'CHARGING') {
                    console.log(2);
                    if (this.loginDetail.order) {
                        console.log(3);
//                        let payment_id = this.loginDetail.order.payment_id;
                        let pay_status = this.loginDetail.order.pay_status;
                        /*let index = this.detail.payments.findIndex(function (val) {
                            return val.id == payment_id;
                        });*/
//                        订单支付状态
                        if (pay_status == 0) {
//                            跳转到线上支付
                            wx.navigateTo({
                                url: '/pages/pay/main?order_no=' + this.loginDetail.order.order_no
                            })

                        } else {
                            // 弹出票种选择
                            this.changeTicket();
                        }
                    } else {
                        // 弹出票种选择
                        this.changeTicket()
                    }
                } else {
//                    线下预约活动跳转到填写尺码页面
                    wx.navigateTo({
                        url: '/pages/enroll/main?id=' + this.id
                    })
                }
            },
//            选择电子票
            selectTickets(item) {
                if (!item.is_limit || item.limit > 0) {this.selectPayment = item.id;
                    this.paymentIndex = this.detail.payments.findIndex((val) => {
                        return val.id == this.selectPayment;
                    });
                    return
                }
                wx.showModal({
                    content: '电子票不足',
                    showCancel: false
                })
            },
//            提交电子票不同活动类型跳转到不同页面
            submitTicket() {
                if (!this.selectPayment) {
                    wx.showModal({
                        content: '请选择电子票',
                        showCancel: false
                    })
                } else {
                    // 需要填写表单的活动
                    if (this.detail.has_form) {

                        // 跳转到填写表单页面
                        wx.navigateTo({
                            url:'/pages/form/main?id='+this.id+'&payment_id='+this.selectPayment
                        })
                        this.changeTicket();
                    } else {
//                        不需要填写表单的活动
                        var data = {
                            activity_id: this.id,
                            payment_id: this.selectPayment,
                            paymentIndex: this.paymentIndex
                        }
                        wx.showLoading({
                            title: '正在提交',
                            mask: true
                        });

                        this.submitInfo(data);
                        this.changeTicket();
                    }
                }
            },
//            报名
            submitInfo(data) {
                let token = this.$storage.get('user_token');
                let payment_id = data.payment_id ? data.payment_id : '';
                this.$http
                    .post(this.$config.GLOBAL.baseUrl + 'api/activity/checkout/' + data.activity_id, {
                        payment_id
                    }, {
                        headers: {
                            Authorization: token
                        }
                    }).then(res => {
                    res = res.data;
                    if (res.status) {
//                        如果pay_status等于0，就跳转到支付页面
                        if (res.data.pay_status == 0) {
                            if (res.data.activity.fee_type == "CHARGING") {
                                wx.redirectTo({
                                    url: '/pages/pay/main?order_no=' + res.data.order_no
                                });
                            }
                        } else {
//                            直接跳转到报名成功页面
                            wx.redirectTo({
                                url: '/pages/success/main?order_no=' + res.data.order_no
                            });
                        }

                    } else {
                        wx.showModal({
                            content: res.message || "请求失败",
                            showCancel: false
                        })
                    }
                    wx.hideLoading();
                }, err => {
                    wx.showModal({
                        content: '请求失败，请重试',
                        showCancel: false,
                    })
                    wx.hideLoading();
                })
            }
        },
        computed: {
            statusClassF() {
                const s1 = this.detail.status,
                    s2 = this.loginDetail.member_status;
                console.log(s2);
                switch (s1) {
                    case 1:
                        switch (s2) {
                            default:
                                this.statusClass = 'bgred';
                                break;
                            case 1:
                                this.statusClass =  'bgblack';
                                break;
                            case 4:
                                this.statusClass =  'bggrey';
                                break;
                        }
                        break;
                    case 2:
                        switch (s2) {
                            default:
                                this.statusClass =  'bggrey';
                                break;
                            case 1:
                                this.statusClass =  'bgblack';
                                break;
                            case  2:
                                this.statusClass =  'bgblue';
                                break;
                        }
                        break;
                    case 4:
                    case 5:
                        switch (s2) {
                            case 1:
                                this.statusClass =  'bgblack';
                                break;
                        }
                        break;
                }
            },
            statusTxtsF() {
                const s1 = this.detail.status,
                    s2 = this.loginDetail.member_status,
                    s3 = this.loginDetail.order;
                switch (s1) {
                    case 0:
                        this.statusTxt = '即将开始报名'
                        break;
                    case 1:
                        switch (s2) {
                            default:
                                this.statusTxt =  '立即报名';
                                break;
                            case 0:
                                if (s3) {
                                    const pay_status = s3.pay_status;
                                    if (pay_status == 0) {
                                        this.statusTxt = '在线活动待支付';
                                    }
                                    else {
                                        this.statusTxt = '立即报名';
                                    }

                                }
                                else {
                                    this.statusTxt = '立即报名';
                                }
                                break;
                            case 1:
                                this.statusTxt =  '活动已报名';
                                break;
                            case 4:
                                this.statusTxt = '线下活动待审核';
                                break;
                        }
                        break;
                    case 2:
                        switch (s2) {
                            default:
                                this.statusTxt =  '报名已截止';
                                break;
                            case 1:
                                this.statusTxt =  '未签到';
                                break;
                            case 2:
                                this.statusTxt =  '签到成功';
                                break;
                        }
                        break;
                    case 3:
                        this.statusTxt =  '活动已结束';
                        break;
                    case 4:
                        switch (s2) {
                            default:
                                this.statusTxt =  '报名已截止';
                            case 1:
                                this.statusTxt =  '活动已报名';
                                break;
                        }
                        break;
                    case 5:
                        switch (s2) {
                            default:
                                this.statusTxt =  '活动已满额';
                            case 1:
                                this.statusTxt =  '活动已报名';
                                break;
                        }
                        break;
                }
            },
            statusDisabled() {
                var token = this.$storage.get('user_token')
                const s1 = this.detail.status,
                    s2 = this.loginDetail.member_status;
                if (token) {
                    if (s1 == 1) {
                        switch (s2) {
                            default:
                                /*return true;*/
                                this.statusdisabled = true;
                                break;
                            case 0:
                            case 3:
                                /*return false;*/
                                this.statusdisabled = false;
                                break;
                        }
                    } else {
                       /* return true;*/
                        this.statusdisabled = true;
                    }
                } else {
                    if (s1 == 1) {
                        /*return false;*/
                        this.statusdisabled = false;
                    } else {
                       /* return true;*/
                        this.statusdisabled = true;
                    }
                }
            }
        }
    }
</script>

<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";

    page {
        height: 100%;
        background-color: #F3F3F3;
    }

    #detailIndex {
        .activity-content {
            background-color: #ffffff;
            margin-bottom: 5px;
            image {
                width: 100%;
            }
            .introduce {
                padding: 10px 0 0 0px;
                .name {
                    color: #000000;
                    font-size: 16px;
                    line-height: 25px;
                    padding: 0 15px 0 15px;
                }
                .money {
                    padding: 7px 15px 11px 15px;
                    /*display: flex;*/
                    /*align-items: center;*/
                    /*justify-content: space-between;*/
                    overflow: hidden;

                    .txt {
                        color: @globalColor;
                        font-size: 20px;
                        span {
                            font-size: 14px;
                        }
                    }
                    .subtitle {
                        color: #959595;
                    }
                    .btn {
                        font-size: 12px;
                        padding: 4px 8px;
                        border: 1px solid #959595;
                        border-radius: 2px;
                        line-height: 16px;
                        color: #959595;
                        float: right;
                    }
                    .red {
                        border: 1px solid @globalColor;
                        color: @globalColor;
                    }
                    .grey{
                        color: #cbcbcb;
                        border: 1px solid  #cbcbcb;
                    }
                    .green{
                        color: #62aa12;
                        border: 1px solid #62aa12;
                    }
                }
                .concrete {
                    padding-left: 16px;
                   /* button{
                        text-align: left;
                        background-color: #FFFFFF;
                        border-radius: 0px;
                        padding: 0;
                    }
                    button::after{
                        border: none;
                    }*/
                    .padd {
                        padding: 8px 16px 8px 0;
                        font-size: 12px;
                        color: #000000;
                        line-height: 16px;
                        overflow: hidden;
                        .text {
                            display: inline-block;
                            padding-left: 6px;
                        }
                        .iconfont {
                            font-size: 11px;
                            color: #9B9B9B;
                        }
                        .icon-Group104 {
                            float: right;
                        }
                    }
                }
            }
        }
        .activity-tab {
            padding-bottom:100px;
            .tab-header {
                position: relative;
                background-color: #FFFFFF;
                margin-bottom: 5px;
            }
            .tab-title {
                position: relative;
                padding: 10px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #9B9B9B;
                font-size: 14px;
                text-align: center;
                .item {
                    flex: 1;
                    span{
                        display: inline-block;
                    }
                }
                .active {
                    color: @globalColor;
                }
                .navar-slider{
                    position: absolute;
                    content: " ";
                    left: 0;
                    bottom: 0;
                    width: 4em;
                    height: 3px;
                    background-color: @globalColor;
                    transition: transform .3s;
                }
            }
            /*.slideBar{
                position: absolute;
                bottom: 0;
                height: 2px;
                transition: transform .2s ease-out;
                background-color:@globalColor;
                width: 75px;
            }*/
            .content{
                background-color: #FFFFFF;
                min-height:200px;
                padding: 0 12px;
                .coach-intro{
                    text-align: center;
                    .avatar{
                        margin-bottom:15px;
                        padding-top: 27px;
                        image{
                            width: 60px;
                            height: 60px;
                            border-radius: 50%;
                        }
                    }
                    .coach-name{
                        color: #000000;
                        font-size: 16px;
                        line-height: 22px;
                        padding-bottom: 3px;
                    }
                    .coach-nick{
                        color:#9B9B9B;
                        font-size:12px;
                        line-height: 16px;
                    }
                }
                .coach-txt{
                    font-size: 14px;
                    line-height: 24px;
                    margin: 10px 0 15px;
                }
            }
        }
        .fixed-btn{
            background-color: #FFFFFF;
            z-index: 3;
            position: fixed;
            bottom: 0;
            width: 100%;
            height:50px;
            display: flex;
            align-items: center;
            justify-content: center;
            .btn-left{
                flex: 1;
                display: flex;
                .item-btn{
                    flex: 1;
                    color:#9B9B9B;
                    text-align: center;
                    .iconfont{
                        font-size: 20px;
                    }
                    .txt{
                        font-size:10px;
                        padding-top:3px;
                    }
                }
                .activebtn{
                    color: @globalColor;
                }
            }
            .btn-right{
                flex: 1;
                button{
                    border-radius: 0px;
                    height: 50px;
                    color: #FFFFFF;
                    font-size: 16px;
                    line-height: 50px;
                }
                button::after{
                    border: none;
                }
            }
        }
        .maks{
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 100%;
            z-index: 40;
            background: rgba(0,0,0,.4);
            opacity: 1;
            transition: opacity .3s ease;
            display: none;

            &.cur{
                display: block;
            }
        }
        //弹出分享部分
        .share-box {
            background: #CDCDD1;
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 0;
            z-index: 50;
            transition:all .3s linear;

            .shaer-item {
                text-align: center;
                font-size: 18px;
                color: #2E2D2D;
                background: #ffffff;
                border-radius: 0;
                padding: 13px 0;
                line-height: inherit;
                &:after {
                    border: none;
                }
                &.clear {
                    margin-top: 5px;
                    color: #9B9B9B;
                }
            }


            &.cur{
                height: 155px;

            }


        }
        /*弹出票种选择*/
        .ticket-box {
            background: #F3F3F3;
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 0;
            z-index: 50;
            transition:all .3s linear;
            .shaer-item {
                padding: 10px 15px;
                text-align: center;
                font-size: 16px;
                color: #2E2D2D;
                background: #ffffff;
                border-radius: 0;

                &.active {
                    color: @globalColor;
                }

                .ticket-value {
                    font-size: 12px;
                }
                &:after {
                    border: none;
                }
                &.title {
                    .iconfont {
                        float: left;
                    }
                    font-size: 14px;
                }
                &.clear {
                    margin-top: 5px;
                    color: #9B9B9B;
                }
            }


            &.cur{
                height: auto;

            }
            .bottom {
                height: 50px;
                line-height: 50px;
                text-align: center;
                background: @globalColor;
                font-size: 16px;
                color: #ffffff;
                margin-top: 5px;
            }


        }
        //分享到朋友圈弹出
        .share-img-box {
            background:rgba(0,0,0,.8);
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 0;
            z-index: 50;
            transition:all .3s linear;

            .imgs-box {
                background: #F3F3F3;
                border-radius: 10px;
                margin:20px;
                overflow: hidden;
                .img{
                    box-shadow:0px 4px 8px 0px rgba(155,155,155,0.5);
                    border-radius: 6px;
                    margin: 30px;
                    box-sizing: border-box;

                    image{
                        display: block;
                        width: 100%;
                    }
                }
                .text {
                    text-align: center;
                    margin-top: 22px;
                    font-size: 12px;
                    color: #9B9B9B;
                }
                .save {
                    background: @globalColor;
                    height: 44px;
                    line-height: 44px;
                    color: #ffffff;
                    text-align: center;
                    border-radius: 10px;
                    margin: 10px 20px;
                }
                i{
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    color: #CCCCCC;
                    font-size: 25px;
                }
            }
            &.cur{
                height: 100%;
            }
        }
    }

</style>