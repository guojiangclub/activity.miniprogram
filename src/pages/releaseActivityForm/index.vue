<template>
    <div id="release-activity">
        <!--下面的tabbar-->
        <div class="tabbar">
            <div class="mx-1px-right" @click="jumpMine(1)">活动列表</div>
            <div class="mx-1px-right active">发布活动</div>
            <div @click="jumpMine(2)">个人中心</div>
        </div>
        <!--内容开始-->
        <div class="content-top">
            <!--选择活动图片-->
            <div class="choose-img">
                <image mode="widthFix" src="../../static/image/choose-img.png"></image>
            </div>
            <!--活動名稱  活動詳情描述-->
            <div class="name-describle">
                <div class="name mx-1px-bottom">
                    <div class="topic">活动名称:</div>
                    <input type="text" placeholder="请输入活动名称" placeholder-class="input-placeholder"/>
                </div>
                <div class="describle">
                    <textarea name="" id="" cols="30" rows="10" placeholder="活动详情描述" placeholder-class="textarea-placeholder"></textarea>
                </div>
            </div>
            <!--報名細節-->
            <div class="attention-detail">
                <div class="tui-picker-content mar-b">
                    <div class="topic">报名截止时间：</div>
                    <div class="picker-info">
                        <PickerDate :placeholder="placeholder" :date = "entry_end_at" :disabled = "disabled" @onPickerChange="onPickerChange" :startDate="startDate" :endDate="endDate"></PickerDate>
                    </div>
                </div>
                <div class="time-picker">
                    <div class="tui-picker-content mx-1px-bottom pa-none">
                        <div class="topic">活动开始时间：</div>
                        <div class="picker-info">
                            <PickerDate :placeholder="start_placeholder" :date = "starts_at" :disabled = "start_show" @onPickerChange="onPickerStart" :startDate="startDate" :endDate="endDate"></PickerDate>
                        </div>
                    </div>
                    <div class="tui-picker-content pa-none">
                        <div class="topic">活动结束时间：</div>
                        <div class="picker-info">
                            <PickerDate :placeholder="end_placeholder" :date = "ends_at" :disabled = "end_show" @onPickerChange="onPickerEnd" :startDate="startDate" :endDate="endDate"></PickerDate>
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
                            <div class="picker" v-if="city_index != -1">
                                {{city_array[city_index]}}
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
                        <div class="picker" v-if="address_point">{{address}}</div>
                        <div class="picker choose-txt" v-else>
                            请选择 <span class="iconfont icon-Group104"></span>
                        </div>
                    </div>
                </div>
            </div>
            <!--活动规模-->
            <div class="detail-infomation">
                <div class="item">
                    <div class="topic">活动规模：</div>
                    <input type="text"  placeholder="请输入活动规模" placeholder-class="input-placeholder"/>
                </div>
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
                    <button  open-type="openSetting" @click="changeSave">确定</button>
                </div>
            </div>
        </div>



    </div>
</template>

<script>
    import {getUrl} from '../../utils';
    import PickerDate from '../../components/picker-date.vue';

    export default {
        components:{
            PickerDate
        },
        data() {
            return {
                token: '',
                entry_end_at:'2021-01-01 12:38',//报名截止时间
                starts_at:'2021-01-01 12:38',//活动开始时间
                ends_at:'2021-01-01 12:38',//活动结束时间
                disabled:false,//设置是否能点击 false可以 true不能点击
                start_show:false,
                end_show:false,
                startDate:2019,
                endDate:2023,
                placeholder:'请选择时间',
                start_placeholder:'请选择时间',
                end_placeholder:'请选择时间',
                city_index:-1,
                city_array:['美国', '中国', '巴西', '日本'],
                address:'',//活动地址
                address_point:'',//详细活动地址经纬度
                is_refused:'',
            }
        },
        methods: {
            changeSave(){
                    this.is_refused = false
            },
//            选择城市
            bindPickerChange(e) {
                    this.city_index =  e.mp.detail.value
            },
//           選擇 报名截止时间
            onPickerChange(e){
                this.entry_end_at = e.dateString
            },
            onPickerStart(e){
                this.starts_at = e.dateString
            },
            onPickerEnd(e){
                this.ends_at = e.dateString
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
                                        success:res=>{
                                            this.address_point = res.latitude + ',' + res.longitude;
                                            this.address = res.address
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
                                success:res=>{
                                    this.address_point = res.latitude + ',' + res.longitude;
                                    this.address = res.address
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
        },
        // 分享
        onShareAppMessage() {
            return {
                title: '活动',
                path: '/pages/index/main'
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

    page {
        background-color: #F3F3F3;
        width: 100%;
        height: 100%;
    }

    #release-activity {
        padding-bottom:80px;
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
        .choose-img{
            image{
                width: 100%;
                vertical-align: middle;
            }
        }
        .name-describle{
            background-color: #FFFFFF;
            padding:0 0 0 15px;
            margin-bottom: 10px;
            .name{
                display: flex;
                align-items: center;
                height: 50px;
                line-height: 50px;
                font-size: 14px;
                color:#333333;
                .topic{
                    flex: 1;
                    height: 100%;
                }
                input{
                    flex: 2;
                    height: 100%;
                }
                .input-placeholder{
                    color: #999999;
                }
            }
            .describle{
                padding:15px;
                textarea{
                    width: 100%;
                    height: 80px;
                    font-size: 14px;
                    line-height: 18px;
                }
                .textarea-placeholder{
                    color: #999999;
                    font-size: 14px;
                    line-height: 18px;
                }
            }
        }
        .attention-detail{
            .time-picker{
                padding: 0 0px 0 15px;
                background-color: #FFFFFF;
            }
            .tui-picker-content{
                display: flex;
                align-items: center;
                height: 50px;
                line-height: 50px;
                color:#333333;
                font-size: 14px;
                background-color: #FFFFFF;
                padding: 0 15px;
                .topic{
                    flex: 1;
                }
                .picker-info{
                    flex: 2;

                }
                &.mar-b{
                    margin-bottom: 10px;
                }
                &.pa-none{
                    padding: 0 15px 0 0;
                }

            }
        }
        .city-adress{
            padding-left: 15px;
            background-color: #FFFFFF;
            margin: 10px 0;
            .item{
                height: 50px;
                line-height: 50px;
                display: flex;
                align-items: center;
                padding-right: 15px;
                color: #333333;
                font-size: 14px;
                .topic{
                    flex: 1;
                }
                .picker-info{
                    flex: 2;
                    text-align: right;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    .picker{
                        &.choose-txt{
                            color:#909090 ;
                        }
                        span{
                            display: inline-block;
                            color: #909090;
                            font-size: 12px;
                           padding-left: 5px;
                        }
                    }
                }

            }
        }
        .detail-infomation{
            background-color: #FFFFFF;
            padding: 0 15px;
            margin-bottom: 10px;
            .item{
                display: flex;
                align-items: center;
                line-height: 50px;
                height: 50px;
                color:#333333;
                font-size: 14px;
                .topic{
                    flex: 1;
                }
                input{
                    flex: 2;
                    text-align: right;
                }
                .input-placeholder{
                    color: #909090;
                }
            }
        }
        .mask{
            position:fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0,0,0,.6);
            .share-img{
                width: 60%;
                margin: 20px auto;
                image{
                    width: 100%;
                    vertical-align: middle;
                }
            }
            .share-btn{
                padding:35px 0;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                align-items: center;
                background-color:#F8F6F7;
                z-index: 1;
                button{
                    background-color:transparent;
                    padding: 0;
                    line-height: normal;
                }
                button::after{
                    border:none;
                }
                .item-btn{
                    text-align: center;
                    flex: 1;
                    color:#B39879;
                    font-size:12px;
                    .info{
                        display: inline-block;
                        width:50px;
                        line-height: 50px;
                        height: 50px;
                        border-radius: 100%;
                        color: #ffffff;
                        background-color:#B39879;
                        margin-bottom: 10px;
                    }
                    span{
                        font-size: 28px;
                    }
                }
            }
            .paney{
                width: 80%;
                background-color: #ffffff;
                border-radius: 4px;
                margin: 40% auto 0 auto;
                .paney-body{
                    text-align: center;
                    height: 110px;
                    line-height: 110px;
                    padding:0 10px;
                }
                .paney-foot{
                    display: flex;
                    button{
                        font-size: 16px;
                        flex: 1;
                        padding: 0;
                        line-height: 50px;
                    }
                    button::after{
                        border:none;
                    }
                }
            }
        }
    }
</style>
