<template>
    <div id="bindPhone">
        <div class="tips" v-show="message">{{message}}</div>
        <div class="phone__warning">
            <div class="phone__num">
                <input type="text" placeholder="手机号码" @input="changeCode"/>
            </div>
            <div class="phone__code">
                <div class="input">
                    <input type="text" placeholder="验证码" @input="changeIdentifyCode"/>
                </div>
                <div class="code__get code-send" @click="getCode">
                    {{code.codeText}}
                </div>
            </div>
        </div>

        <div class="phone__box">
            <div class="phone__btn phone-confirm phone-binding" @click="submit">
                确定绑定
            </div>
            <div class="phone__btn phone-cancel" @click="back">
                取消
            </div>
        </div>
    </div>
</template>
<script>
    import { getUrl, is } from '../../utils';
    export default{
        data(){
            return{
                tellphone:'',//电话
                identifyingcode:'',//验证码
                code:{
                    total:60,
                    access_token:null,
                    codeText:'获取验证码'
                },
                sending:false,
                url:'',
                message:'',
                timer:''

            }
        },
        mounted(){
            this.initData();
            var url =this.$root.$mp.query.url;
            if(url){
                this.url = url;
            }
        },
        methods:{
            //初始话数据
            initData(){
                this.tellphone ='';
                this.identifyingcode ='';
                this.code = {
                    total:60,
                    access_token:null,
                    codeText:'获取验证码'
                };
                this.sending = false;
                this.url = '';
                this.message = '';
                clearInterval(this.timer);
            },
            //获取手机号
            changeCode(e){
                this.tellphone =  e.target.value
            },
            //获取验证码
            changeIdentifyCode(e){
                this.identifyingcode = e.target.value
            },
            //点击获取验证码
            getCode(){
                if (this.sending) return;
                var message = '';
                if(!is.has(this.tellphone)){
                    message = "请输入您的手机号";
                } else if(!is.mobile(this.tellphone)){
                    message = '手机号格式不正确，请重新输入';
                }
                if (message){
                    this.message = message;
                    this.sending = false;
                    this.code.codeText = "获取验证码";
                    setTimeout(()=>{
                        this.message = '';
                    },3000)

                } else {
                    var access_token = Math.random().toString(36).substr(2,24);
                    this.code.access_token = access_token;
                    var tellphone = this.tellphone;
                    this.sending = true;
                    this.code.codeText = "短信发送中";
                    this.postVerifyCode(tellphone,access_token);
                }
            },
            //需要请求获取验证码接口
            postVerifyCode(tellphone,access_token){
                this.$http.post(this.$config.GLOBAL.baseUrl+'api/sms/verify-code',{
                    mobile:tellphone,
                    access_token:access_token
                }).then(res=>{
                    res = res.data;
                    if (res.success){
                        var total = this.code.total;
                        this.code.codeText = total + '秒后发送';
                        this.timer = setInterval(()=>{
                            total--;
                            this.code.codeText = total +'秒后发送';
                            if(total<1){
                                this.sending = false;
                                this.code.codeText = "获取验证码";
                                clearInterval(this.timer);
                            }
                        },1000);
                    } else {
                        this.sending = false;
                        this.code.codeText = "获取验证码"
                    }
                },err=>{
                    wx.showModal({
                        content: '服务器有点小拥挤，请重试！',
                        showCancel: false
                    })
                })
            },
            //确认绑定
            submit(){
                var message = '';
                if(!is.has(this.tellphone)){
                    message = "请输入您的手机号";
                } else if(!is.mobile(this.tellphone)){
                    message = '手机号格式不正确，请重新输入';
                } else if(!is.has(this.identifyingcode)){
                    message="请填写验证码";
                }
                if(message){
                    this.message = message;
                    setTimeout(()=>{
                        this.message = ""
                    },3000)
                } else {
                    //请求绑定号码接口
                    this.postMobile()
                }
            },
            //请求绑定号码接口
            postMobile(){
                var token = this.$storage.get('user_token');
                wx.showLoading({
                    content:'绑定中',
                    mask:true
                })
                this.$http.post(this.$config.GLOBAL.baseUrl+'api/users/update/mobile',{
                    mobile:this.tellphone,
                    code:this.identifyingcode,
                    access_token:this.code.access_token
                },{
                    headers:{
                        Authorization:token
                    }
                }).then(res=>{
                    res = res.data;
                    if (res.status){
                        wx.showModal({
                            content:'绑定成功',
                            showCancel:false,
                            success:res=>{
                                if(res.confirm || (!res.cancel && !res.confirm)){
                                    if(this.url){
                                        wx.redirectTo({
                                            url:'/'+decodeURIComponent(this.url)
                                        })
                                    } else {
                                        wx.redirectTo({
                                            url: '/pages/user/main'
                                        })
                                    }

                                }
                            }
                        })
                    } else {
                        wx.showModal({
                            content: res.message || '绑定失败',
                            showCancel: false,
                        })
                    }
                    wx.hideLoading()
                },err=>{
                    wx.showModal({
                        content: '请求失败，请重试',
                        showCancel: false
                    })
                    wx.hideLoading()
                })
            },
            //取消绑定
            back(){
                if (this.url) {
                    wx.redirectTo({
                        url: '/' + decodeURIComponent(this.url)
                    })
                } else {
                    wx.navigateBack();
                }
            }
        }
    }
</script>
<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";
    #bindPhone{

        .tips{
            position: fixed;
            top: 0;
            width: 100%;
            text-align: center;
            line-height: 35px;
            background-color: #e64340;
            height: 35px;
            color: #FFFFFF;
        }

        .phone__warning{
            padding: 35px 15px 70px 15px;
            .phone__num{
                background: rgba(155,155,155,.2);
                font-size: 14px;
                padding: 15px;
                border-radius: 3px;
                input{
                    width: 100%;
                    color: #000;
                }
            }
            .phone__code{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 20px;

                .input{
                    border-radius: 3px;
                    background: rgba(155,155,155,.2);
                    font-size: 14px;
                    padding: 15px;
                    color: #000;
                    flex: 1;
                }
                .code__get{
                    border-radius: 3px;
                    color: #ffffff;
                    background: @globalColor;

                    padding:15px 10px;
                    margin-left:17px;
                    font-size:14px;
                    /*&.code-send{
                      background: rgba(44,171,43,.5);
                    }*/
                }
            }
        }
        .phone__box{
            padding: 0 15px;

            .phone__btn{
                width: 100%;
                padding: 12px 0;
                font-size: 17px;
                text-align: center;
                border-radius: 4px;
                &.phone-binding{
                    color: #ffffff;
                    background: @globalColor;
                    margin-bottom:15px;
                    &.phone-confirm{
                        background:  @globalColor;
                    }
                }
                &.phone-cancel{
                    color: #4A4A4A;
                    background: #ffffff;
                    border: 1px solid #DCDCDC;
                }
            }
        }
    }
</style>