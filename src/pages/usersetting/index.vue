<template>
        <div id="user-setting">
            <div class="headImg" @click="changeImage">
                <image :src="detail.avatar" alt=""></image>
            </div>
            <div class="user_setting">
                <div class="code">
                    <div class="detail">昵称</div>
                    <input type="text" placeholder="填写您的昵称" @input="changeName" :value="detail.nick_name"/>
                </div>
                <div class="code">
                    <div class="detail">性别</div>
                    <picker :value=selectedIndex :range=list @change="change">
                        <!--<div class="picker">{{list[selectedIndex]}}</div>-->
                        <input type="text" placeholder="选择你的性别" disabled  :value=list[selectedIndex] />
                        <div class="iconfont icon-Group98 under"></div>
                    </picker>
                    <!--<input type="text" placeholder="选择你的性别"/>-->
                </div>
                <div class="code">
                    <div class="detail">出生日期</div>
                    <picker mode="date"  :end=end @change="changeDate">
                        <input type="text" placeholder="请输入出生日期" disabled :value=birthdaydate />
                        <view class="iconfont icon-Group98 under"></view>
                    </picker>
                </div>
                <div class="code">
                    <div class="detail">上衣尺寸</div>
                    <input type="text" placeholder="请输入上衣尺寸" :value=emailSet />
                </div>
                <div class="code">
                    <div class="detail">裤子尺寸</div>
                    <input type="text" placeholder="请输入裤子尺寸" :value=emailSet />
                </div>
                <div class="code">
                    <div class="detail">鞋子尺寸</div>
                    <input type="text" placeholder="请输入鞋子尺寸" :value=emailSet />
                </div>
            </div>

            <!--<div class="submit" @click="updateUserInfo">
                <button type="primary">确定</button>
            </div>-->
        </div>
</template>
<script>
    export default{
        data(){
            return{
                detail:{},
                list:[
                    '男',
                    '女',
                ],
                selectedIndex:"",
                birthdaydate:'',
                end:''
            }
        },
        mounted(){
            this.getMe();
            Date.prototype.format = function(fmt) {
                var o = {
                    "M+" : this.getMonth()+1,                 //月份
                    "d+" : this.getDate(),                    //日
                    "h+" : this.getHours(),                   //小时
                    "m+" : this.getMinutes(),                 //分
                    "s+" : this.getSeconds(),                 //秒
                    "q+" : Math.floor((this.getMonth()+3)/3), //季度
                    "S"  : this.getMilliseconds()             //毫秒
                };
                if(/(y+)/.test(fmt)) {
                    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
                }
                for(var k in o) {
                    if(new RegExp("("+ k +")").test(fmt)){
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                    }
                }
                return fmt;
            };
            var time = new Date().format("yyyy-MM-dd");
            this.end = time;
        },
        methods:{
            changeName(e){
                    this.detail.nick_name = e.target.value
            },
            change:function(e){
                // console.log(e);
                // 修改选中项文案
                   this.selectedIndex = e.target.value
            },
            changeDate(e){
                    this.birthdaydate = e.target.value
            },
            //请求我的数据
            getMe(){
                var token = this.$storage.get('user_token');
                wx.showLoading({
                    title:"加载中",
                    mask:true
                });
                this.$http
                    .get(this.$config.GLOBAL.baseUrl+'api/me',{},{
                        headers:{
                            Authorization:token
                        }
                    })
                    .then(res=>{
                        res=res.data;
                        if (res.status){
                            this.detail = res.data;
                        } else {
                            wx.showModal({
                                content:res.message || "请求失败",
                                showCancel:false
                            })
                        }
                        wx.hideLoading()
                    },err=>{
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
<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";
    #user-setting{
        .headImg{
            position: relative;
            width: 90px;
            height: 90px;
            border: 1px solid #8d8d8d;
            //background-color: red;
            border-radius: 100%;
            display: block;
            margin: 20px auto;
            &:after{
                position: absolute;
                content: "";
                background: url("http://ovef29y3v.bkt.clouddn.com/ic_camer.png") no-repeat;
                width: 23px;
                height: 23px;
                bottom: 0px;
                right: 0px;
                background-size:100% 100%;
            }
            image{
                //width: 100%;
                //height: 100%;
                width: 90px;
                height: 90px;
                border-radius: 50%;
            }
        }
        .user_setting{
            background-color: #ffffff;
            .code{
                border-bottom: 1px solid #e5e5e5;
                padding: 10px 0 10px 0;
                display: flex;
                align-items: center;
                font-size: 14px;
                .detail{
                    padding-left: 10px;
                    width: 80px;
                    color: #a4a3a3;

                }
                input{
                    flex: 1;
                    color: #000000;
                }
                picker{
                    flex: 1;
                    position: relative;
                }
                .under{
                    position: absolute;
                    right: 15px;
                    top: 5px;
                    font-size: 10px;
                    color: #a4a3a3;
                }
                span{
                    padding: 0 15px;
                    color: #00b4ff;
                }
            }
        }
        .submit{
            width: 100%;
            position: fixed;
            bottom: 0px;
            button[type=primary] {
                color:#FFFFFF;
                background-color:@globalColor;
                border-radius: 0;
            }
        }
    }
</style>