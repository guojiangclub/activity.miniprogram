<template>
    <div id="release-activity">
        <div class="un-token" v-if="!token">
            <div class="avatar">
                <image mode="widthFix"  src="../../../static/image/defaultAvatar.png"></image>
            </div>
            <div class="txt">登录发布活动</div>
            <div class="btn" @click="jumpLogin">登录账号</div>
        </div>
        <div class="un-token" v-if="token && initData.can_publish == 0">
            <div class="avatar">
                <image mode="widthFix" src="../../../static/image/svip.png"></image>
            </div>
            <div class="txt">活动仅支持SVIP发布</div>
            <div class="btn svip-btn">
                <navigator target="miniProgram" hover-class="none" app-id="wx009e0be72cbf5e80" class="item">
                    升级为SVIP
                </navigator>
            </div>
        </div>
        <div v-if="token && initData.can_publish">
            <!--内容开始-->
            <div class="content-top">
                <!--选择活动图片-->
                <div class="choose-img" @click="uploadImg">
                    <div class="has-img" v-if="activity_data.img">
                        <image :src="activity_data.img"></image>
                        <div class="edit-img">
                            <span class="iconfont icon-edit"></span>
                            修改图片
                        </div>
                    </div>
                    <image v-else mode="widthFix" src="../../static/image/choose-img.png"></image>
                </div>
                <!--活動名稱  活動詳情描述-->
                <div class="name-describle">
                    <div class="name mx-1px-bottom">
                        <div class="topic">活动名称:</div>
                        <input type="text" placeholder="请输入活动名称" placeholder-class="input-placeholder" v-model="activity_data.title"/>
                    </div>
                    <div class="describle" @click="jumpRictText">
                        <div class="has-content" v-if="content && content.length">
                            <div class="item" v-for="(item,index) in content">
                                <div class="type-text" v-if="item.type == 0">{{item.info}}</div>
                                <image mode="widthFix" :src="item.info" v-if="item.type == 1"></image>
                            </div>
                        </div>
                        <textarea v-else disabled="true" name="" id="" cols="30" rows="10" placeholder="活动详情描述" placeholder-class="textarea-placeholder"></textarea>
                    </div>
                    <div class="continue-edit" v-if="content && content.length" @click="jumpRictText">
                        <span class="iconfont icon-edit"></span>
                        继续编辑
                    </div>
                </div>
                <!--報名細節-->
                <div class="attention-detail">
                    <div class="tui-picker-content mar-b">
                        <div class="topic">报名截止时间：</div>
                        <div class="picker-info">
                            <PickerDate :placeholder="placeholder" :date="activity_data.entry_end_at" :disabled="disabled" @onPickerChange="onPickerChange" :startDate="startDate" :endDate="endDate"></PickerDate>
                        </div>
                    </div>
                    <div class="time-picker">
                        <div class="tui-picker-content mx-1px-bottom pa-none">
                            <div class="topic">活动开始时间：</div>
                            <div class="picker-info">
                                <PickerDate :placeholder="start_placeholder" :date="activity_data.starts_at" :disabled="start_show" @onPickerChange="onPickerStart" :startDate="startDate" :endDate="endDate"></PickerDate>
                            </div>
                        </div>
                        <div class="tui-picker-content pa-none">
                            <div class="topic">活动结束时间：</div>
                            <div class="picker-info">
                                <PickerDate :placeholder="end_placeholder" :date="activity_data.ends_at" :disabled="end_show" @onPickerChange="onPickerEnd" :startDate="startDate" :endDate="endDate"></PickerDate>
                            </div>
                        </div>
                    </div>
                </div>
                <!--活动的城市地点-->
                <div class="city-adress">
                    <div class="city item mx-1px-bottom">
                        <div class="topic">活动城市：</div>
                        <div class="picker-info">
                            <picker @change="bindPickerChange" :value="city_index" :range="city_array">
                                <div class="picker" v-if="activity_data.city_id">
                                    {{city_array[city_index]}} <span class="iconfont icon-Group104 selected"></span>
                                </div>
                                <div class="picker choose-txt" v-else>
                                    请选择 <span class="iconfont icon-Group104"></span>
                                </div>
                            </picker>
                        </div>
                    </div>
                    <div class="adress item">
                        <div class="topic">活动地点：</div>
                        <div class="picker-info" @click="chooseLocation">
                            <div class="picker" v-if="activity_data.address_point">{{activity_data.address}}</div>
                            <div class="picker choose-txt" v-else>
                                请选择 <span class="iconfont icon-Group104"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <!--活动规模-->
                <div class="detail-infomation">
                    <div class="item mar-b">
                        <div class="topic">活动规模：</div>
                        <input type="number" placeholder="请输入活动规模" placeholder-class="input-placeholder" v-model="activity_data.member_limit"/>
                    </div>
                    <div class="item mar-b" @click="jumpSignUpForm">
                        <div class="topic">报名费用：</div>
                        <div class="picker-info">
                            <div class="picker" v-if="activity_data.payments[0].title">
                                ￥ {{activity_data.payments[0].price}} + {{activity_data.payments[0].point}} 积分
                                <span class="iconfont icon-Group104 selected"></span>
                            </div>
                            <div class="picker choose-txt" v-else>
                                请设置 <span class="iconfont icon-Group104"></span>
                            </div>
                        </div>
                    </div>
                    <div class="item mar-b" @click="jumpReleaseActivityForm">
                        <div class="topic">报名表单：</div>
                        <div class="picker-info">
                            <div class="picker choose-txt">
                                已设置 请点击查看 <span class="iconfont icon-Group104"></span>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="topic" @click="lookDetail">免责声明 <span class="iconfont icon-question-circle-o"></span></div>
                        <div class="picker-info">
                            <switch color="#FB5054" @change="switchChange"/>
                        </div>
                    </div>
                </div>
                <div class="commit-btn can" @click="confirmRelease">
                    确认发布
                </div>
            </div>
            <!--用户拒绝授权弹出-->
            <div class="mask" v-if="is_refused">
                <div class="paney">
                    <div class="paney-body">
                        重新授权，打开地图选择位置
                    </div>
                    <div class="paney-foot">
                        <button @click="changeSave" class="mx-1px-right">取消</button>
                        <button open-type="openSetting" @click="changeSave">确定</button>
                    </div>
                </div>
            </div>

            <div class="statement_content" v-if="statement">
                <div class="statement_content_title mx-1px-bottom">
                    <h3>声明详情</h3>
                </div>
                <div class="statement_content_body">
                    <wxParse :content="initData.statement.statement"></wxParse>
                </div>
                <div class="statement_content_footer" @click="lookDetail">
                    我知道了
                </div>
            </div>
        </div>

        <tab-bar index="1">

        </tab-bar>
    </div>
</template>

<script>
    import {getUrl} from '../../utils';
    import PickerDate from '../../components/picker-date.vue';
    import wxParse from 'mpvue-wxparse';
    import tabBar from '../../components/tabbar';
    export default {
        components: {
            PickerDate,
            wxParse,
            tabBar
        },
        data() {
            return {
                token: '',
                disabled: false,//设置是否能点击 false可以 true不能点击
                start_show: false,
                end_show: false,
                startDate: 2019,
                endDate: 2053,
                entry_end_at: '',//截止时间
                starts_at: '',
                ends_at: '',
                placeholder: '请选择时间',
                start_placeholder: '请选择时间',
                end_placeholder: '请选择时间',
                city_index: -1,
                content: [],
                city_array: ['美国', '中国', '巴西', '日本'],
                statement: false,
                address: '',//活动地址
                address_point: '',//详细活动地址经纬度
                is_refused: '',
                initData: '',//活动获得的数据
                activity_data: {
                    title: '',//活动名称
                    img: '',//这是前端上传的图片
                    img_list: '',//这是后台传给我的固定图片
                    content: '',//活动详情
                    starts_at: '',//活动开始时间
                    ends_at: '',//活动结束时间
                    entry_end_at: '',//报名截止时间
                    city_id: '',//活动城市
                    address: '',//活动地址
                    address_point: '',//详细活动地址经纬度
                    member_limit: '',//活动规模
                    form_id: '',//活动报名表单
                    statement_id: 0,//活动免责声明
                    payments: [
                        {
                            title: '', // 电子票名称
                            price: '', // 电子票金额
                            point: '', // 电子票积分
                            limit: '' // 电子票数量限制
                        }
                    ]
                },
                isSuccess:false,//是否发布成功
            }
        },
        onLoad() {
            var token = this.$storage.get('user_token');
            this.token = token;
            if(token){
                this.initPublish();
            }
        },
        onShow(){
            var token = this.$storage.get('user_token');
            this.token = token;
            var rictText = this.$storage.get('rictText');
            var ticketList = this.$storage.get('ticketList');
            var activityData = this.$storage.get('activityData');
            if (activityData) {
                this.activity_data = activityData;
                if (activityData.starts_at) {
                    this.start_placeholder = activityData.starts_at
                } else {
                    this.start_placeholder = '请选择时间'
                }
                if (activityData.ends_at) {
                    this.end_placeholder = activityData.ends_at
                } else {
                    this.end_placeholder = '请选择时间'
                }
                if (activityData.entry_end_at) {
                    this.placeholder = activityData.entry_end_at
                } else {
                    this.placeholder = '请选择时间'
                }
                if (activityData.city_id) {
                    var city_array = this.$storage.get('city_array');
                    var initData = this.$storage.get('initData');
                    var city_list = initData.city_list;
                    city_list.forEach((item, index) => {
                        if (item.id == activityData.city_id) {
                            this.city_index = index
                        }
                    })
                }

            }
            var content = [];
            if (rictText && rictText.length) {
                if (rictText.length == 1) {
                    content[0] = rictText[0]
                } else if (rictText.length > 1) {
                    content[0] = rictText[0];
                    content[1] = rictText[1];
                }
                this.content = content;
            }
            if (ticketList && ticketList.length) {
                this.activity_data.payments[0] = ticketList[0];

            }
        },
        onHide(){
            console.log(666);
            this.$storage.set('activityData', this.activity_data);
        },
        onUnload(){
            if(!this.isSuccess){
                this.$storage.set('activityData', this.activity_data);
            }
        },
        methods: {
            jumpLogin() {
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
            },
            changeSave(){
                this.is_refused = false
            },
//            选择城市
            bindPickerChange(e) {
                this.city_index = e.mp.detail.value;
                var city_list = this.initData.city_list;
                this.activity_data.city_id = city_list[e.mp.detail.value].id
            },
//            免责声明
            switchChange(e){
                if (e.mp.detail.value) {
                    this.activity_data.statement_id = this.initData.statement.id
                } else {
                    this.activity_data.statement_id = 0
                }
            },
//           選擇 报名截止时间
            onPickerChange(e){
                this.activity_data['entry_end_at'] = e.dateString
            },
            onPickerStart(e){
                this.activity_data['starts_at'] = e.dateString
            },
            onPickerEnd(e){
                this.activity_data['ends_at'] = e.dateString
            },
//            打开地图选择位置
            chooseLocation(){
//                判断是否授权
                wx.getSetting({
                    success: ret => {
                        // 如果之前没有授权
                        if (!ret.authSetting['scope.userLocation']) {
                            wx.authorize({
                                scope: 'scope.userLocation',
                                success: rej => {
                                    //打开地图
                                    wx.chooseLocation({
                                        success: res => {
                                            this.activity_data.address_point = res.latitude + ',' + res.longitude;
                                            this.activity_data.address = res.address;
                                            this.$storage.set('activityData', this.activity_data);
                                        }
                                    })
                                },
                                // 用户拒绝授权
                                fail: ret => {
                                    this.is_refused = true
                                }
                            })
                        } else {
                            //之前授权过
                            wx.chooseLocation({
                                success: res => {
                                    console.log(res);
                                    this.activity_data.address_point = res.latitude + ',' + res.longitude;
                                    this.activity_data.address = res.address;
                                    this.$storage.set('activityData', this.activity_data);
                                }
                            })
                        }
                    }
                })

            },

            //跳到我的活动去
            jumpMine(type) {
                var token = this.$storage.get('user_token');
                if (token) {
                    if (type == 1) {
                        wx.navigateTo({
                            url: '/pages/myActivity/main'
                        })
                    } else {
                        wx.reLaunch({
                            url: '/pages/user/main'
                        })
                    }
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
//           跳到活动详情描述页面去
            jumpRictText(){
                wx.navigateTo({
                    url: '/pages/rictText/main'
                })
            },
            jumpSignUpForm(){
                wx.navigateTo({
                    url: '/pages/signUpForm/main'
                })
            },
            jumpReleaseActivityForm(){
                wx.navigateTo({
                    url: '/pages/releaseActivityForm/main?id=' + this.initData.form_id
                })
            },
//            请求初始数据
            initPublish(){
                wx.showLoading({
                    title: "加载中",
                    mask: true
                });
                var token = this.$storage.get('user_token');
                this.$http
                    .get(this.$config.GLOBAL.baseUrl + 'api/activity/publish/init', {}, {
                        headers: {
                            Authorization: token
                        }
                    })
                    .then(res => {
                        res = res.data;
                        if (res.status) {
                            this.initData = res.data;
                            var city_arr = [];
                            res.data.city_list.forEach(val => {
                                city_arr.push(val.name)
                            })
                            this.city_array = city_arr;
                            this.$storage.set('city_array', city_arr);
                            this.$storage.set('initData', this.initData);

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
                        wx.hideLoading()
                    })
            },
//            上传图片
            uploadImg(){
                wx.chooseImage({
                    count: 1,
                    success: res => {
                        this.upload(res.tempFilePaths)
                    }
                })
            },
//            上传图片Api
            upload(path){
                wx.showLoading({
                    content: '上传中',
                    mask: true
                })
                let token = this.$storage.get('user_token');
                wx.uploadFile({
                    header: {
                        'content-type': 'multipart/form-data',
                        Authorization: token
                    },
                    url: this.$config.GLOBAL.baseUrl + 'api/image/upload',
                    filePath: path[0],
                    name: 'image',
                    success: res => {
                        var result = JSON.parse(res.data);
                        this.activity_data.img = result.data.url;
                    },
                    fail: rej => {
                        wx.showModal({
                            content: '上传失败',
                            showCancel: false
                        })
                    }
                })
                wx.hideLoading();
            },
            //查看声明详情
            lookDetail(){
                this.statement = !this.statement;
            },
//            确认发布的按钮的事件
            confirmRelease(){
                var data = this.activity_data;
                var entry_end_at = new Date(data.entry_end_at).getTime();
                var starts_at = new Date(data.starts_at).getTime();
                var ends_at = new Date(data.ends_at).getTime();
                var message = '';
                if (!data.img) {
                    message = "请选择活动图片"
                } else if (!data.title) {
                    message = "请输入活动名称"
                } else if (this.content.length == 0) {
                    message = "请输入活动详情描述"
                } else if (!data.entry_end_at) {
                    message = "请输入报名截止时间"
                } else if (!data.starts_at) {
                    message = "请输入活动开始时间"
                } else if (!data.ends_at) {
                    message = "请输入活动结束时间"
                } else if (!data.city_id) {
                    message = "请输入活动城市"
                } else if (!data.address_point) {
                    message = "请输入活动地点"
                } else if (!data.member_limit) {
                    message = "请输入活动规模"
                } else if (!data.payments[0].title) {
                    message = "请设置报名费用"
                } else if (entry_end_at > starts_at) {
                    message = '报名截止时间 不能晚于 活动开始时间'
                } else if (starts_at > ends_at) {
                    message = '活动结束时间 不能早于 活动开始时间'
                }
                if (message) {
                    wx.showModal({
                        content: message,
                        showCancel: false
                    })
                } else {
                    this.releaseActivity();

                }
            },

            releaseActivity() {
                const token = this.$storage.get('user_token');
                let data = this.activity_data;
                let content = '';
                let rich_text = this.$storage.get('rictText');
                let ticketList = this.$storage.get('ticketList');
                rich_text.forEach(val=>{
                    content += val.html
                })
                data.img_list = this.initData.img_list;
                data.content = content;
                data.payments = ticketList;
                data.starts_at = data.starts_at + ':00';
                data.ends_at = data.ends_at + ':00';
                data.entry_end_at = data.entry_end_at + ':00';
                data.form_id = this.initData.form_id;
                wx.showLoading({
                    title: '正在提交',
                    mask: true
                })
                this.$http
                    .post(this.$config.GLOBAL.baseUrl + 'api/activity/publish/store', data, {
                        headers: {
                            Authorization: token
                        }
                    }).then(res => {
                    res = res.data;
                    if (res.status) {
                        this.isSuccess = true;
                        this.$storage.clear('city_array');
                        this.$storage.clear('initData');
                        this.$storage.clear('activityData');
                        this.$storage.clear('rictText');
                        this.$storage.clear('ticketList');
                        wx.reLaunch({
                            url:'/pages/detail/main?id='+res.data.id
                        })

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

    #release-activity {
        padding-bottom: 40px;
        .un-token{
            padding:40px 15px 0 15px;
            .avatar{
                width: 80px;
                margin: 0 auto;
                image{
                    width: 100%;
                    vertical-align: middle;
                }
            }
            .txt{
                text-align: center;
               color: #999999;
                font-size: 14px;
                line-height: 18px;
                padding:18px 0 25px 0;
            }
            .btn{
                height: 50px;
                line-height: 50px;
                text-align: center;
                color: #FFFFFF;
                background-color: #FB5054;
                border-radius: 3px;
                font-size: 16px;
                &.svip-btn{
                    color: #E1CB9C;
                    font-size: 16px;
                    background-color:#424040;
                }
            }
        }
        .tabbar {
            display: flex;
            position: fixed;
            bottom: 0;
            width: 100%;
            padding: 22px 0 12px 0;
            color: #909090;
            font-size: 16px;
            background-color: #FFFFFF;
            text-align: center;
            align-items: center;
            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 10px;
                background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.13) 100%);
            }
            div {
                flex: 1;
                border-radius: 0px;
                font-size: 16px;
                line-height: 25px;
            }
            .active {
                color: #FF2741;
            }
        }
        .choose-img {
            image {
                width: 100%;
                vertical-align: middle;
            }
            .has-img {
                position: relative;
                .edit-img {
                    position: absolute;
                    right: 15px;
                    bottom: 15px;
                    color: #FFFFFF;
                    font-size: 14px;
                    span {
                        display: inline-block;
                        padding-right: 6px;
                        font-size: 14px;
                    }
                }
            }
        }
        .name-describle {
            background-color: #FFFFFF;
            padding: 0 0 0 15px;
            margin-bottom: 10px;
            .name {
                display: flex;
                align-items: center;
                height: 50px;
                line-height: 50px;
                font-size: 14px;
                color: #333333;
                .topic {
                    flex: 1;
                    height: 100%;
                }
                input {
                    flex: 2;
                    height: 100%;
                }
                .input-placeholder {
                    color: #999999;
                }
            }
            .describle {
                padding: 15px 15px 15px 0;
                height: 100px;
                overflow: hidden;
                .has-content {
                    .type-text {
                        font-size: 14px;
                        line-height: 18px;
                        color: #999999;
                    }
                    image {
                        width: 100%;
                        padding: 8px 0;
                    }
                }
                textarea {
                    width: 100%;
                    height: 80px;
                    font-size: 14px;
                    line-height: 18px;
                }
                .textarea-placeholder {
                    color: #999999;
                    font-size: 14px;
                    line-height: 18px;
                }
            }
        }
        .continue-edit {
            height: 44px;
            line-height: 44px;
            color: #4B8AF2;
            font-size: 14px;
            text-align: center;
            background-color: #FFFFFF;
            text-align: center;
        }
        .attention-detail {
            .time-picker {
                padding: 0 0px 0 15px;
                background-color: #FFFFFF;
            }
            .tui-picker-content {
                display: flex;
                align-items: center;
                height: 50px;
                line-height: 50px;
                color: #333333;
                font-size: 14px;
                background-color: #FFFFFF;
                padding: 0 15px;
                .topic {
                    flex: 1;
                }
                .picker-info {
                    flex: 2;

                }
                &.mar-b {
                    margin-bottom: 10px;
                }
                &.pa-none {
                    padding: 0 15px 0 0;
                }

            }
        }
        .city-adress {
            padding-left: 15px;
            background-color: #FFFFFF;
            margin: 10px 0;
            .item {
                height: 50px;
                line-height: 50px;
                display: flex;
                align-items: center;
                padding-right: 15px;
                color: #333333;
                font-size: 14px;
                .topic {
                    flex: 1;
                }
                .picker-info {
                    flex: 2;
                    text-align: right;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    .picker {
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        &.choose-txt {
                            color: #909090;
                        }
                        span {
                            display: inline-block;
                            color: #909090;
                            font-size: 12px;
                            padding-left: 5px;
                            &.selected {
                                color: #111111;
                            }
                        }
                    }
                }

            }
        }
        .detail-infomation {
            margin-bottom: 10px;
            .item {
                padding: 0 15px;
                background-color: #FFFFFF;
                display: flex;
                align-items: center;
                line-height: 50px;
                height: 50px;
                color: #333333;
                font-size: 14px;
                .topic {
                    flex: 1;
                    span {
                        display: inline-block;
                        padding-left: 6px;
                        color: #4B8AF2;
                    }
                }
                input {
                    flex: 2;
                    text-align: right;
                }
                .input-placeholder {
                    color: #909090;
                }
                .picker-info {
                    flex: 2;
                    text-align: right;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    .picker {
                        &.choose-txt {
                            color: #909090;
                        }
                        span {
                            display: inline-block;
                            color: #909090;
                            font-size: 12px;
                            padding-left: 5px;
                            &.selected {
                                color: #111111;

                            }
                        }
                    }
                }
                &.mar-b {
                    margin-bottom: 10px;
                }
            }
        }
        .commit-btn {
            background-color: rgba(251, 80, 84, .6);
            font-size: 16px;
            color: #FFFFFF;
            height: 45px;
            line-height: 45px;
            border-radius: 2px;
            margin: 20px 15px;
            text-align: center;
            &.can {
                background-color: #FB5054;
            }
        }
        .mask {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0, 0, 0, .6);
            .share-img {
                width: 60%;
                margin: 20px auto;
                image {
                    width: 100%;
                    vertical-align: middle;
                }
            }
            .share-btn {
                padding: 35px 0;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                align-items: center;
                background-color: #F8F6F7;
                z-index: 1;
                button {
                    background-color: transparent;
                    padding: 0;
                    line-height: normal;
                }
                button::after {
                    border: none;
                }
                .item-btn {
                    text-align: center;
                    flex: 1;
                    color: #B39879;
                    font-size: 12px;
                    .info {
                        display: inline-block;
                        width: 50px;
                        line-height: 50px;
                        height: 50px;
                        border-radius: 100%;
                        color: #ffffff;
                        background-color: #B39879;
                        margin-bottom: 10px;
                    }
                    span {
                        font-size: 28px;
                    }
                }
            }
            .paney {
                width: 80%;
                background-color: #ffffff;
                border-radius: 4px;
                margin: 40% auto 0 auto;
                .paney-body {
                    text-align: center;
                    height: 110px;
                    line-height: 110px;
                    padding: 0 10px;
                }
                .paney-foot {
                    display: flex;
                    button {
                        font-size: 16px;
                        flex: 1;
                        padding: 0;
                        line-height: 50px;
                    }
                    button::after {
                        border: none;
                    }
                }
            }
        }
        .statement_content {
            position: fixed;
            z-index: 100;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background-color: #FFFFFF;
            .statement_content_title {
                h3 {
                    padding-top: 10px;
                    padding-bottom: 10px;
                    text-align: center;
                }
            }
            .statement_content_body {
                box-sizing: border-box;
                padding: 0 10px 100px 10px;
                margin-bottom: 20px;
                height: 100%;
                overflow: auto;
            }
            .statement_content_footer {
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
</style>
