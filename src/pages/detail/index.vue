<template>
    <div id="detailIndex">

        <block>
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
                <div class="content" v-show="activeIndex == 0">
                    <div class="content-info">
                        <div class="info">
                            {{detail.description}}
                        </div>
                        <div class="see-more" @click="seeMore">
                            <div>
                                点击查看更多
                            </div>
                             <!--<i class="iconfont icon-Group98"></i>-->
                        </div>
                        <!--<div class="arr" @click="seeMore">
                            <img src="http://ibrand-miniprogram.oss-cn-hangzhou.aliyuncs.com/18-12-6/12379848.jpg" alt="">
                        </div>-->

                    </div>
                    <!--<wxparser :rich-text="detail.content"></wxparser>-->
                    <!--<wxParse :content="detail.content" @preview="preview" @navigate="navigate"></wxParse>-->
                </div>
                <div class="content" v-show="activeIndex == 1">
                    <div class="coach-intro" v-show="detail.coach">
                        <div class="avatar">
                            <image :src="detail.coach.avatar"></image>
                        </div>
                        <div class='coach-name'>{{detail.coach.nick_name}}</div>
                        <div class="coach-nick">{{detail.coach.title}}</div>
                    </div>
                    <div class="coach-txt" v-show="detail.coach">
                        <wxparser :rich-text="describe"></wxparser>
                        <!--<wxParse :content="describe"></wxParse>-->
                    </div>
                </div>
                <!--<div class="content goods-box" v-show="activeIndex == 2">
                   &lt;!&ndash;<div class="goods-tips">
                       徒步鞋徒步袜，快干裤，短袖，皮肤风衣或软壳
                   </div>&ndash;&gt;
                    <div class="goods-list" v-if="meta && meta.goods">
                        <div class="goods-item" v-for="item in meta.goods">
                            <div class="goods">
                                <div class="left">
                                    <image :src="item.goods.img"></image>
                                    <div class="required" v-if="item.goods.required == 1">
                                        必选装备
                                    </div>
                                </div>
                                <div class="right">
                                    <div>
                                        <div class="name">
                                            {{item.goods.name}}
                                        </div>
                                        <div class="price">
                                            <div class="new">
                                                <span>￥</span>{{item.goods.sell_price}}
                                            </div>
                                            <div class="old">
                                                ￥{{item.goods.market_price}}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="btn-box">
                                        <div class="gift">
                                            活动价 {{item.goods.rate}}折
                                        </div>
                                        <div class="btn required" v-if="item.goods.required == 1" @click="showSelect(index, item.goods.id)">
                                            必选装备
                                        </div>
                                        <div class="btn"v-if="item.goods.required == 0 && !item.goods.isCheck" @click="showSelect(index, item.goods.id)">
                                            添加装备
                                        </div>
                                        <div class="btn active"v-if="item.goods.required == 0 && item.goods.isCheck" @click="removeGoods(index)">
                                            移除装备
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="select-info mx-1px-top" @click="showSelect(index, item.goods.id)">
                               <div class="text">
                                   <span v-if="goodsInfo[index]">
                                       <block v-if="goodsInfo[index].attributes.color">
                                            {{goodsInfo[index].attributes.color}},
                                       </block>
                                       <block v-if="goodsInfo[index].attributes.size">
                                            {{goodsInfo[index].attributes.size}},
                                       </block>
                                     {{goodsInfo[index].qty}}件
                                   </span>
                                   <span v-else>
                                       请选择尺码
                                   </span>

                               </div>
                                <div class="iconfont icon-Group104">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>-->
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
                    保存图片
                </div>
                <div class="shaer-item clear" @click="changeShare">
                    取消
                </div>
            </div>

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


            <div class="maks" :class="show_select ? 'cur':''" @click="closeSelect">

            </div>
            <!--sku弹出-->
            <!--<div class="sku-box" :class="show_select ? 'active':''">
                <div class="select_goods_container">
                    &lt;!&ndash;关闭按钮&ndash;&gt;
                    <div class="select_goods_cloese" @click="show_select = false"></div>
                    <div class="select_goods_header">

                        <div class="img_box">
                            <img v-if="select_product && select_product.img" :src="select_product.img">
                            <img v-if="(!select_product || !select_product.img) && meta.goods && meta.goods.length && meta.goods[currentIndex].goods.img" :src="meta.goods[currentIndex].goods.img" alt="">
                        </div>


                        <div class="price_item">
                        <span v-if="select_product">
                            <span>￥{{select_product.price}}</span>
                        </span>
                            <span v-else>￥{{meta.goods[currentIndex].goods.sell_price}}</span>
                            <span>库存{{store_count}}</span>
                        </div>
                    </div>

                    <div class="select_spec">
                        <div class="spec_line" v-for="(spec, idx) in specs" :key="idx-f">
                            <div class="spec_title">{{spec.label}}</div>
                            <div class="spec_value">
                                <div class="spec_block"
                                     :class="{active: item.active &&　!item.disabled, disabled: item.disabled && !item.active, no_store:item.active && item.disabled}"
                                     v-for="item in spec.values" @click="selectSpec(item)" :key="index-s">
                                  <span v-if="(item.alias || item.value) && item.spec_img !== undefined">
                                    {{item.alias || item.value}}
                                </span>
                                    <span v-if="!item.spec_img && !item.color">{{item.alias || item.value}}</span>
                                </div>
                            </div>
                        </div>

                        <div class="spec_line">
                            <div class="num_title">数量</div>
                            <div class="num_value">
                                <span @click="changeCount(0)">-</span>
                                <span class="none_border">
                                <input @input="modifyCount()" v-model="select_count">
                            </span>
                                <span @click="changeCount(1)">+</span>

                            </div>

                        </div>

                        <div class="button" :class="{disabled: disallow_cart}" @click="confirm">
                            确定
                        </div>
                    </div>
                </div>
            </div>-->
        </block>

    </div>
</template>

<script>
    // import wxParse from 'mpvue-wxparse';
    import { getUrl } from '../../utils';
    export default{
        components: {
            // wxParse
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
                statusdisabled:'',
                meta: {},

                // sku相关
                show_select: false,
                specs: [],
                skuTable: {},
                store_count: 0,  // 当前sku库存数量
                select_count: 1, // 选择的数量
                select_product: {},     // 选中商品
                currentIndex: 0,   // 当前选择商品的index
                goodsInfo: [],  // 选中的商品信息
                clearsData: false,  // 没用的,用来更新视图
            }
        },
        onShow() {
            console.log(111);
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
                    this.sliderOffset = res.windowWidth / this.tabList.length/ 3.8
                }
            });
//            将旧数据清空
            this.detail = {
                payments: [],
                coach:{}
            };
            this.tabList = [
                {
                    title:"活动详情",
                },{
                    title:"活动领队"
                }
            ]
            this.meta = {};
            this.loginDetail = {};
            this.article = '';
            this.describe = '';
            this.activeIndex = 0;
            this.show_share = false;
            this.show_ticket = false;
            this.show_select = false;
            this.spec = [];
            this.skuTable = {};
            this.store_count = 0;
            this.select_count = 1;
            this.select_product = {};
            this.currentIndex = 0;
            this.goodsInfo = [];

            // this.getGoods(176);
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
                if (this.activeIndex == index) return
                this.activeIndex = index;
                this.sliderOffset =  e.currentTarget.offsetLeft;
            },
            changeTicket() {
                this.show_ticket = !this.show_ticket;
            },
            // 跳转详情
            seeMore() {
                wx.navigateTo({
                    url: '/pages/detailInfo/main?id=' + this.id
                })
            },
            //点击收藏
            collect(id){
               /* this.retColor.collect = ! this.retColor.collect;*/
                var token = this.$storage.get('user_token');

                if(token){
                    wx.showLoading({
                        title: '加载中',
                        mask:true
                    })

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
            //请求活动详情页活动的数据
            getDetail(id){
                wx.showLoading({
                    title: '加载中,请耐心等待',
                    mask: true
                })
                console.log(new Date().toLocaleTimeString());
                this.$http
                    .get(this.$config.GLOBAL.baseUrl + 'api/activity/show/' + id).then(res => {
                    res = res.data;
                    console.log(res);
                    if (res.status) {


                       /* if (res.data && res.data.content) {
                            delete res.data.content;
                        }*/

                        this.detail = res.data;
                        this.meta = res.meta;
                        if (res.meta && res.meta.goods && res.meta.goods.length) {
                            if (this.tabList.length < 3) {
                                this.tabList.push({ title:"装备推荐"});
                            }
                            this.$storage.set('detailGoods', res.meta.goods);
                        }
                        this.describe = res.data.coach.describe;
                        this.time = getApp().timefiter(res.data.starts_at,res.data.ends_at);
                        this.ac_status = getApp().ac_status(this.detail.status);
                        // this.article = res.data.content;


                        this.statusClassF();
                        this.statusTxtsF();
                        this.statusDisabled();
                    } else {
                        wx.showModal({
                            content: res.message || "请求失败",
                            showCancel: false
                        })
                    }
                   setTimeout(() => {
                       // console.log(new Date().toLocaleTimeString());

                       // this.article = res.data.content;
                       wx.hideLoading();
                   }, 500)
                    // wx.hideLoading();
                }, err => {
                    wx.hideLoading();
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
                        if (res.data && res.data.activity && res.data.activity.content) {
                            delete res.data.activity.content;
                        }
                        this.loginDetail = res.data;

                        this.statusClassF();
                        this.statusTxtsF();
                        this.statusDisabled();
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
                let isReady = true;

//                线上活动
                if (this.detail.fee_type == 'CHARGING') {
                    if (this.loginDetail.order) {
                        let pay_status = this.loginDetail.order.pay_status;
//                        订单支付状态
                        if (pay_status == 0) {
//                            跳转到线上支付
                            wx.navigateTo({
                                url: '/pages/pay/main?order_no=' + this.loginDetail.order.order_no
                            })

                        } else {
                            if (this.meta && this.meta.goods) {
                                this.meta.goods.forEach(item => {
                                    if (item.goods.required && !item.goods.isCheck) {
                                        wx.showModal({
                                            content: '有必选装备未选择',
                                            showCancel: false
                                        })
                                        isReady = false
                                    }
                                })
                            }
                            if (!isReady) return;
                            // 弹出票种选择
                            this.changeTicket();
                        }
                    } else {
                        if (this.meta && this.meta.goods) {
                            this.meta.goods.forEach(item => {
                                if (item.goods.required && !item.goods.isCheck) {
                                    wx.showModal({
                                        content: '有必选装备未选择',
                                        showCancel: false
                                    })
                                    isReady = false
                                }
                            })
                        }
                        if (!isReady) return;
                        // 弹出票种选择
                        this.changeTicket()
                    }
                } else {
//                        订单支付状态
                    if (this.loginDetail.order) {
                        let pay_status = this.loginDetail.order.pay_status;
                        if (pay_status == 0) {
                            // 跳转到线上支付
                            wx.navigateTo({
                                url: '/pages/pay/main?order_no=' + this.loginDetail.order.order_no
                            })
                        }
                    } else {
                        if (this.meta && this.meta.goods) {
                            this.meta.goods.forEach(item => {
                                if (item.goods.required && !item.goods.isCheck) {
                                    wx.showModal({
                                        content: '有必选装备未选择',
                                        showCancel: false
                                    })
                                    isReady = false
                                }
                            })
                        }
                        if (!isReady) return;
                        // 当为线下活动的直接取第一种支付方式
                        this.selectPayment = this.detail.payments[0].id
                        this.submitActive();
                    }
//                    线下预约活动跳转到填写尺码页面
                   /* wx.navigateTo({
                        url: '/pages/enroll/main?id=' + this.id
                    })*/
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

                    this.submitActive();
                    this.changeTicket();
                   /* // 需要填写表单的活动
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
                    }*/
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
            },



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
                                break;
                            case 1:
                                this.statusTxt =  '活动已报名';
                                break;
                        }
                        break;
                    case 5:
                        switch (s2) {
                            default:
                                this.statusTxt =  '活动已满额';
                                break;
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
            },

            // 获取商品数据
            getGoods(index,id,key) {
                var goods = this.$storage.get('detailGoods');
                console.log(goods);
                var res = goods[index];
                // if (this.select_product && id == this.select_product.activeId) return

                this.specs = [];
                this.skuTable = {};
                this.select_count = 1;
                this.select_product = {};


                this.store_count = res.goods.store_nums
                this.select_product.price = Number(res.goods.sell_price).toFixed(2)
                // 规格
                if (res.specs  && typeof key === 'undefined') {
                    let specs = [];
                    Object.keys(res.specs)
                        .forEach((key, index) => {
                            let value = res.specs[key];
                            value.select = '';
                            value.values = value.list
                                .map(v => {
                                    return Object.assign({
                                        index: index,
                                        active: false,
                                        disabled: false
                                    }, v);
                                });
                            delete value.list;
                            specs.push(value);
                        });
                    this.specs = specs;
                }
                if (res.stores) {
                    let data = {};
                    Object.keys(res.stores)
                        .forEach(key => {
                            let value = res.stores[key];

                            value.ids.forEach(id => {
                                data[id] = data[id] || {count: 0, specs: {}};
                                data[id].count += parseInt(value.store);
                                value.ids.forEach(i => {
                                    if (i === id) return;
                                    data[id].specs[i] = {
                                        count: parseInt(value.store)
                                    };
                                })
                            });
                        });
                    var result = {data, table: res.stores};
                    this.specStore(result, key);
                }
            },


            // 关闭
            closeSelect() {
                this.show_select = !this.show_select;
            },
            clearss() {
               this.clearsData = !this.clearsData;
            },
            // 弹出sku框
            showSelect(index, id) {
                this.getGoods(index, id);
                this.currentIndex = index;
                this.show_select = true;
            },
            // 移除装备
            removeGoods(index) {
                this.meta.goods[index].goods.isCheck = false;
                this.goodsInfo[index] = null;
                this.clearss();
                // this.show_select = false;
            },
            // 点击
            selectSpec(spec) {
                if (!spec.active) {
                    for (let item of this.specs[spec.index].values) {
                        if (item.active) {
                            item.active = false;
                            break;
                        }
                    }
                }
                spec.active = !spec.active;
                this.specs[spec.index].select = spec.active ? spec.id : '';
                this.specStore(this.result,spec.index)

            },

            // 整理
            specStore(result, key) {
                this.result = result;

                let query = this.$root.$mp.query;
                let data = result.data;

                if (key === undefined) {
                    this.specs.forEach(spec => {
                        for (let v of spec.values) {
                            v.disabled = !data[v.id] || data[v.id].count == 0;
                        }
                    });

                    this.skuTable = result.table;


                    this.specs.forEach(spec => {
                        let name = 'spec[' + spec.id + ']';
                        if (query[name]) {
                            let id = query[name];

                            for (let v of spec.values) {
                                if (v.id == id && !v.disabled && data[v.id] && data[v.id].count) {
                                    v.active = true;
                                    spec.select = v.id;

                                    this.specStore(result, v.index);
                                    console.log(v.index);
                                    return;
                                }
                            }
                        }

                        if (!spec.select) {
                            for (let v of spec.values) {
                                if (!v.disabled && data[v.id] && data[v.id].count) {
                                    v.active = true;
                                    spec.select = v.id;

                                    this.specStore(result, v.index);
                                    console.log(v.index);

                                    return;
                                }
                            }
                        }
                    });

                    return;
                }

                let spec = this.specs[key];
                if (spec.select) {
                    this.store_count = data[spec.select].count;

                    for (let i = 0; i < this.specs.length; i++) {
                        if (i === key) continue;

                        let s = this.specs[i];
                        s.values.forEach(v => {
                            v.disabled = !data[spec.select].specs[v.id].count;
                        });

                        if (s.select) {
                            this.store_count = data[spec.select].specs[s.select].count;
                        }
                    }
                } else {
                    this.store_count = 0;

                    for (let i = 0; i < this.specs.length; i++) {
                        if (i === key) continue;

                        let s = this.specs[i];
                        s.values.forEach(v => {
                            v.disabled = !data[v.id] || !data[v.id].count;
                        });

                        if (s.select) this.store_count = data[s.select].count;
                    }
                }
                if (this.select_count > this.store_count) {
                    this.select_count = this.store_count;
                } else if (this.select_count === 0) {
                    this.select_count = 1;
                    if (this.store_count === 0) this.select_count = 0
                }


            },
            // 数量加减
            changeCount(add) {
                var val = this.select_count + (add ? 1 : -1);
                if (val > 0 && val <= this.store_count) {
                    this.select_count = val;
                } else {
                    if (val) {
                        wx.showToast({
                            title: '超过最大库存',
                            icon: 'none'
                        })
                    }

                }
            },

            // 直接输入数量
            modifyCount() {
                var val = this.select_count;
                if (!val) {
                    val = 1;
                } else if (!/^[1-9]\d*$/.test(val)) {
                    val = val.replace(/[^\d].*$/, '');
                    val = parseInt(val) || 1;
                }

                if (val < 0) {
                    val = 1;
                } else if (val > this.store_count) {
                    val = parseInt(this.store_count);
                }


                this.select_count = val;
            },

            // 确认sku
            confirm() {
                if (this.disallow_cart) return;

                let select_product = this.select_product;
                let goodsInfo = this.meta.goods[this.currentIndex].goods;
                let data = this.specs.length ? {
                    id: select_product.id,
                    name: goodsInfo.name,
                    qty: this.select_count,
                    store_count: this.store_count,
                    price: select_product.price,
                    market_price: goodsInfo.market_price,
                    attributes: {
                        img: select_product.img || goodsInfo.img,
                        size: select_product.size,
                        color: select_product.color,
                        com_id: goodsInfo.id,
                        sku: select_product.id
                    }
                } : {
                    id: goodsInfo.id,
                    name: goodsInfo.name,
                    qty: this.select_count,
                    store_count: this.store_count,
                    price: goodsInfo.sell_price,
                    market_price: goodsInfo.market_price,
                    attributes: {
                        img: goodsInfo.img ,
                        com_id: goodsInfo.id
                    }
                }
                this.meta.goods[this.currentIndex].goods.isCheck = true;
                this.goodsInfo[this.currentIndex] = data;
                this.closeSelect();

                console.log(data);
            },
            submitActive() {
                var token = this.$storage.get('user_token');
                var info = [];
                this.goodsInfo.forEach(item => {
                    if (item && item.id) {
                        info.push(item)
                    }
                })
                wx.showLoading({
                    title: '正在提交',
                    mask: true
                });
                this.$http.post(this.$config.GLOBAL.baseUrl + 'api/activity/mini/order/checkout', {
                    activity_id: this.id,
                    goods: info.length ? info : '',
                    payment_id: this.selectPayment || ''
                }, {
                    headers:{
                        Authorization:token
                    }
                }).then(res => {
                    res = res.data;
                    if (res.status) {
                        this.$storage.set('activeOrder', res.data);
                        this.goodsInfo = [];
                        // 跳转到填写表单页面
                        wx.navigateTo({
                            url:'/pages/form/main?id='+this.id+'&payment_id='+this.selectPayment
                        });

                    } else {
                        wx.showModal({
                            content: res.message || '请求失败',
                            showCancel: false,
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
            disallow_cart() {
                if (!this.specs.length) {
                    return !this.store_count;
                }

                var ids = [], select_product = {};
                for (let spec of this.specs) {
                    if (!spec.select) {
                        // this.price = 99;
                        this.select_product = null;
                        return true;
                    }

                    ids.push(spec.select);
                    for (let v of spec.values) {
                        if (v.id === spec.select) {
                            switch (spec.label_key) {
                                case 'color':
                                    select_product.img = v.img;
                                    select_product.color = v.alias || v.value;
                                    break;
                                default:
                                    select_product.size = v.alias || v.value;
                            }

                            break;
                        }
                    }
                }

                if (this.skuTable) {
                    ids = ids.sort((a, b) => a > b).join('-');
                    select_product = Object.assign(select_product, this.skuTable[ids]);
                }
                if (this.meta.goods && this.meta.goods.length) {
                    select_product.activeId = this.meta.goods[this.currentIndex].goods.id;
                }

                // this.price = select_product.price;
                this.select_product = select_product;


                if (this.select_product.store == 0 ) return true

                return false;
            },
        }
        /*computed: {

        }*/
    }
</script>

<style rel="stylesheet/less" lang="less" type="text/less">
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
            padding-bottom:70px;
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
                /*min-height:200px;*/
                padding: 0 12px;

                .content-info {
                    padding: 12px 0;
                    .info {
                        font-size: 12px;
                        color: #4A4A4A;
                    }
                    .see-more {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        text-align: center;
                        margin-top: 12px;
                    }
                    .arr {
                        margin-top: 10px;
                        text-align: center;

                        img {
                            width: 15px;
                            height: 15px;
                        }
                    }
                }
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

                &.goods-box {
                    padding: 0;
                    background: #F3F3F3;

                    .goods-tips {
                        background: #FFFFFF;
                        padding: 20px 12px;
                        font-size: 13px;
                        color: #4A4A4A;
                    }
                    .goods-list {

                        .goods-item {
                            background: #FFFFFF;
                            margin-top: 10px;
                            .goods {
                                display: flex;
                                padding: 5px 15px;
                                background: #FFFFFF;
                                .left {
                                    position: relative;
                                    width: 80px;
                                    height: 80px;

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
                                        display: flex;
                                        align-items: center;
                                        font-size: 13px;
                                        margin-top: 10px;
                                        .gift {
                                            color: @globalColor;
                                            flex: 1;
                                        }
                                        .btn {
                                            background: @globalColor;
                                            color: #FFFFFF;
                                            padding: 5px 20px;
                                            border-radius: 50px;
                                            border: 1px solid @globalColor;

                                            &.required {
                                                border: 1px solid #909090;
                                                color: #909090;
                                                background: #FFFFFF;
                                            }
                                            &.active {
                                                background: #FFFFFF;
                                                border: 1px solid @globalColor;
                                                color: @globalColor;
                                            }
                                        }
                                    }
                                }
                            }
                            .select-info {
                                font-size: 12px;
                                padding: 10px 15px;
                                display: flex;
                                align-items: center;
                                .text {
                                    flex: 1;
                                }
                                .iconfont {
                                    font-size:11px;
                                    color:#9B9B9B;

                                }
                            }
                        }
                    }
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
                button[disabled] {
                    background: #cbcbcb;
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


        .sku-box {
            position: fixed;
            left: 0;
            right: 0;
            bottom:0;
            z-index: 99;
            background: #FFFFFF;
            transition:transform 350ms linear 0ms;
            transform:translate3d(0px, 150%, 0px);
            transform-origin:50% 50% 0px;
            &.active {
                transition:transform 350ms linear 0ms;
                transform:translate3d(0px, 0px, 0px);
                transform-origin:50% 50% 0px;
            }
            .select_goods_container {

                position: relative;

                .select_goods_cloese {

                    position: absolute;
                    top: 12px;
                    right: 10px;
                    width: 20px;
                    height: 20px;
                    background: transparent;
                    z-index: 4;

                }

                .select_goods_cloese:before {
                    position: absolute;
                    top: 9px;
                    left: -1px;
                    content: '';
                    width: 28px;
                    height: 2px;
                    background: #2e2e2e;
                    transform: rotate(45deg);

                }

                .select_goods_cloese:after {
                    top: 9px;
                    left: -1px;
                    position: absolute;
                    content: '';
                    width: 28px;
                    height: 2px;
                    background: #2e2e2e;
                    transform: rotate(-45deg);

                }

                .select_goods_header {
                    position: relative;
                    height: 60px;

                    .img_box {
                        position: absolute;
                        left: 10px;
                        bottom: 10px;
                        width: 78px;
                        height: 78px;
                        border: 1px solid #e5e5e5;
                        background: #f9f9f9;

                        img {
                            object-fit: fill;
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .price_item {
                        font-size: 18px;
                        margin-left: 100px;
                        height: 100%;
                        display: -webkit-flex;
                        flex-direction: column;
                        justify-content: center;

                        span {
                            display: block;
                            text-align: left;
                        }

                        span:nth-child(1) {
                            font-weight: bold;
                            color: #ee2b1d;
                        }

                        span:nth-child(2) {
                            font-size: 14px;
                            color: #6c6c6c;
                            text-indent: 3px
                        }
                    }

                }

                .select_spec {
                    font-size: 12px;
                    padding: 12px 8px 50px 8px;

                    .spec_line {
                        display: flex;
                        /*align-items: center;*/
                        margin-bottom: 15px;

                        .spec_title {
                            padding-right: 11px;
                            color: #c4c4c4;
                            width: 40px;
                            line-height: 35px;
                        }

                        .spec_value {
                            flex: 1;
                            font-size: 0;
                            margin-top: -10px;
                        }

                        .spec_list {
                            display: block;
                            line-height: 35px;
                            color: #959595;
                            font-size: 15px;
                        }

                        .spec_block {
                            display: inline-block;
                            margin-top: 10px;
                            margin-right: 10px;

                            span {
                                display: block;
                                padding: 0 7px;
                                height: 33px;
                                line-height: 33px;
                                min-width: 20px;
                                border: 1px solid #DDDDDD;
                                text-align: center;
                                font-size: 12px;
                                position: relative;
                            }

                            img {
                                height: 100%;
                                width: 100%;
                            }

                            .spec_icon {
                                width: 33px;
                                height: 33px;
                                padding: 0;
                            }

                            &.active span {
                                &:before {
                                    content: '';
                                    position: absolute;
                                    border: 3px solid #ff0000;
                                    top: -1px;
                                    left: -1px;
                                    right: -1px;
                                    bottom: -1px;
                                }
                            }

                            &.disabled span {
                                border: none;
                                margin: 1px;

                                &:before {
                                    content: '';
                                    position: absolute;
                                    background-color: #eee;
                                    top: -1px;
                                    left: -1px;
                                    right: -1px;
                                    bottom: -1px;
                                    opacity: 0.6;
                                }

                                &:after {
                                    content: '';
                                    position: absolute;
                                    border: 3px dashed #cfcfcf;
                                    top: -1px;
                                    left: -1px;
                                    right: -1px;
                                    bottom: -1px;
                                }
                            }
                        }

                        .num_title {
                            padding-right: 11px;
                            color: #c4c4c4;
                            width: 40px;
                            line-height: 30px;
                        }

                        .num_value {
                            display: flex;
                            flex: inherit;
                            font-size: 0;

                            span {
                                display: block;
                                border: 1px solid #e8e8e8;
                                text-align: center;
                                min-width: 28px;
                                width: 28px;
                                height: 28px;
                                line-height: 28px;
                                font-size: 12px;

                                &.store {
                                    width: auto;
                                    border-color: #ffffff;
                                    margin-left: 10px;
                                }
                            }

                            input {
                                display: block;
                                border: none;
                                height: 100%;
                                width: 100%;
                                text-align: center;
                                outline: none;
                            }

                            .none_border {
                                border-left: none;
                                border-right: none;
                            }
                        }
                    }

                    .button {
                        height: 50px;
                        line-height: 50px;
                        text-align: center;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: #E40013;
                        color: #FFFFFF;

                        &.disabled {
                            background: #C2C2C2;
                        }
                    }
                }

            }

            /*选取规格部分*/
            .select_spec {
                font-size: 12px;
                padding: 12px 8px 50px 8px;
                .remind {
                    margin-bottom:8px;
                    height:25px;
                    color: #888;
                    font-size:14px;
                    strong {
                        font-size: 18px;
                    }

                    a {
                        color: #ff0000;
                    }
                }
                .spec_line {
                    display: flex;
                    /*margin-bottom: 15px;*/
                    /*align-items: center;*/

                    .spec_title {
                        padding-right: 11px;
                        color: #c4c4c4;
                        width: 30px;
                        line-height: 35px;
                    }

                    .spec_value {
                        flex: 1;
                        font-size: 0;
                        margin-top: -10px;
                    }

                    .spec_block {
                        display: inline-block;
                        margin-top: 10px;
                        margin-right: 10px;

                        span {
                            display: block;
                            padding: 0 7px;
                            height: 33px;
                            line-height: 33px;
                            min-width: 20px;
                            border: 1px solid #DDDDDD;
                            text-align: center;
                            font-size: 12px;
                            position: relative;
                        }

                        img {
                            height: 100%;
                            width: 100%;
                        }

                        .spec_icon {
                            width: 33px;
                            height: 33px;
                            padding: 0;
                        }

                        &.no_store span {
                            border: none;
                            margin: 1px;

                            &:before {
                                content: '';
                                position: absolute;
                                background-color: #eee;
                                top: -1px;
                                left: -1px;
                                right: -1px;
                                bottom: -1px;
                                opacity: 0.6;
                            }

                            &:after {
                                content: '';
                                position: absolute;
                                border: 3px dashed #ff0000;
                                top: -1px;
                                left: -1px;
                                right: -1px;
                                bottom: -1px;
                            }
                        }

                        &.active span {
                            &:before {
                                content: '';
                                position: absolute;
                                border: 3px solid #ff0000;
                                top: -1px;
                                left: -1px;
                                right: -1px;
                                bottom: -1px;
                            }
                        }

                        &.disabled span {
                            border: none;
                            margin: 1px;

                            &:before {
                                content: '';
                                position: absolute;
                                background-color: #eee;
                                top: -1px;
                                left: -1px;
                                right: -1px;
                                bottom: -1px;
                                opacity: 0.6;
                            }

                            &:after {
                                content: '';
                                position: absolute;
                                border: 3px dashed #cfcfcf;
                                top: -1px;
                                left: -1px;
                                right: -1px;
                                bottom: -1px;
                            }
                        }
                    }

                    .num_title {
                        padding-right: 11px;
                        color: #c4c4c4;
                        width: 30px;
                        line-height: 30px;
                    }

                    .num_value {
                        display: flex;
                        flex: inherit;
                        font-size: 0;

                        span {
                            display: block;
                            border: 1px solid #e8e8e8;
                            text-align: center;
                            min-width: 28px;
                            width: 28px;
                            height: 28px;
                            line-height: 28px;
                            font-size: 12px;

                            &.store {
                                width: auto;
                                border-color: #ffffff;
                                margin-left: 10px;
                            }
                        }

                        input {
                            display: block;
                            border: none;
                            height: 100%;
                            width: 100%;
                            text-align: center;
                            outline: none;
                        }

                        .none_border {
                            border-left: none;
                            border-right: none;
                        }
                    }

                    .purchase{
                        color:#aaaaaa;
                        margin-left: 10px;
                    }
                }

                .button {
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: #E40013;
                    color: #FFFFFF;

                    &.disabled {
                        background: #C2C2C2;
                    }
                }
            }
        }
    }

</style>