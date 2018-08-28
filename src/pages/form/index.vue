<template>
    <div id="form">
        <div class="top-content">
            <div class="input_item" v-if="item.status==1" v-for="(item, idx) in list">
                <!--title-->
                <p class="title mx-1px-bottom" v-if="item.type!='range' && item.name!='id_card' && item.type!='statement' && item.name != 'other_certificate'">
                    <span v-if="item.is_necessary==1" style="color: red">*</span>
                    {{item.title}}
                    <span v-if="item.is_necessary==0">(选填)</span>
                </p>
                <!--title-->
                <!-- <p v-if="item.type=='range'">
                     <span v-if="item.is_necessary==1" style="color: red">*</span>
                     {{item.title}}:{{showGoalTime[item.name]}}
                     <span v-if="item.is_necessary==0">(选填)</span>
                 </p>-->
                <!--单独的身份证类型-->
                <p class='title mx-1px-bottom' v-if="(item.type!='range' && item.name == 'id_card' && user.certificate_type == 'id_card' && item.type!='statement') || (item.type!='range' && item.name == 'id_card' && user.certificate_type == '' && item.type!='statement')"><span v-if="item.is_necessary==1" style="color: red">*</span> {{item.title}} <span v-if="item.is_necessary==0">(选填)</span></p>
                <input class="hhaha" type="text" :name="item.name" v-if="(item.type == 'text' && item.name == 'id_card' && user.certificate_type == 'id_card') || (item.type == 'text' && item.name == 'id_card' && user.certificate_type == '')" v-model="user[item.name]">

                <!--单独的其他证件-->
                <p  class='title mx-1px-bottom' v-if="(item.type!='range' && item.name == 'other_certificate' && user.certificate_type == 'other_certificate' && item.type!='statement') || (item.type!='range' && item.name == 'other_certificate' && user.certificate_type == '' && item.type!='statement')"><span v-if="item.is_necessary==1" style="color: red">*</span> {{item.title}} <span v-if="item.is_necessary==0">(选填)</span></p>
                <input class="hhaha" type="text" :name="item.name" v-if="(item.type == 'text' && item.name == 'other_certificate' && user.certificate_type == 'other_certificate') || (item.type == 'text' && item.name == 'other_certificate' && user.certificate_type == '')" v-model="user[item.name]">

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
                <span class="box" @click="showPicker(item.name)" v-if="item.type=='select'">{{user[item.name]}}</span>

                <!--多文本输入框-->
                <textarea  v-if="item.type=='textarea'" v-model="user[item.name]"></textarea>

                <!--滑动条-->
                <!--<slide-time v-if="item.type=='range'" :minTime="ActivityStartTime" :maxTime="ActivityEndTime" @select-time="passTime(item.name,$event)" style="margin-bottom: 15px"></slide-time>-->

                <!--地址-->
                <span class="box" v-if="item.name=='province'" @click="show_city">{{user[item.name]}}</span>

                <!--单选按钮-->
                <div class="input_radio" v-if="item.type=='radio'">
                    <radio-group v-model="user[item.value || item.name]" :vertical=false>
                        <radio color="#fff" :label="i.value || i.name" v-for="i in item.options" :key="index">{{i.name}}</radio>
                    </radio-group>
                </div>

                <!--多选按钮-->
                <div class="input_radio" v-if="item.type=='checkbox'">
                    <checkbox-group v-model="user[item.name]" :vertical=false>
                        <checkbox color="#fff" :label="i.name" v-for="i in item.options" :key="index">{{i.name}}</checkbox>
                    </checkbox-group>
                </div>

                <!--免责声明-->
                <div class="input_radio mx-1px-top" style="padding-top: 10px;margin-top: 10px" v-if="item.type=='statement'">
                    <checkbox color="#fff" v-model="user[item.name]" class="statement" :label="item.title"></checkbox>
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
                <slide-time v-if="item.type=='range'" :minTime="ActivityStartTime" :maxTime="ActivityEndTime" @select-time="passTime(item.name,$event)"></slide-time>
            </div>
        </div>
        <div class="bottom-bar">
            <div class="money">￥300</div>
            <div class="pay">去付款</div>
        </div>
    </div>

</template>

<script type="text/ecmascript-6">
    import { is, cityArr } from '../../utils';
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
            if ((obj.name == "id_card" && that.user.certificate_type == 'id_card') || (obj.name == "id_card" && that.user.certificate_type == '')) {
                if (!this['text'](val)) {
                    message = `${obj.title}不能为空`;
                } else if (!this[obj.name](val)) {
                    message = `您输入的${obj.title}不符合规范`;
                }
            } else if ((obj.name == 'other_certificate' && that.user.certificate_type == 'other_certificate') || (obj.name == 'other_certificate' && that.user.certificate_type == '')) {
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
                list: [],
                validate: new Validates(),
                user: {},
                picker: {},
                showCity: false,
                isRequired: {},
                statement: false,
                ActivityStartTime: "1h",
                ActivityEndTime: "2h",
            }
        },
        methods: {
            showPicker(key){
                debugger
                console.log(1);
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
                            this.isRequired = this.adapter(res.data);
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
//            处理数据
            adapter(data) {
                if (!data) {
                    return
                }
                let arrList = [];
                let caseValidate = this.validate;
                console.log(this.validate);
                data.forEach(item => {
                    if (item.type == "checkbox" || item.type == "file") {
                        if (item.value) {
                            this.$set(this.user, item.name, item.value);
                        } else {
                            this.$set(this.user, item.name, []);
                        }
                    } else if (item.type == 'range') {
//                        this.$set(this.showGoalTime, item.name, '');
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
                        this.$set(this.picker, item.name, false);
                        var obj = {};
                        obj.target = item.name;
                        obj.list = [];
                        item.options.forEach((val) => {
                            obj.list.push({
                                value: val.name,
                                code: val.name
                            })
                        });
                        item.options = [];
                        item.options.push(obj);
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
                 wx.uploadFile({//将本地资源上传到开发者服务器，客户端发起一个HTTP post请求，其中content-type为multipart/form-data
                        header:{
                            'content-type': 'multipart/form-data',
                            Authorization: token
                        },
                        url:this.$config.GLOBAL.baseUrl + 'api/users/upload/avatar',
                        filePath: tempFilePaths[0],
                        name:'avatar_file', //与后台商定的名字，文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
                        success:rej=>{
                        var result = JSON.parse(rej.data);
                        this.user[name].push(result.data.url);
            }

            })
                    }

                })
            },
            //删除图片
            deleteX(item,index){
                this.user[item].splice(index,1);
            },
            //查看声明详情
            lookDetail(){
                console.log(1);
                this.statement = !this.statement;
            },
        },
        mounted(){
            this.id = this.$root.$mp.query.id;
            this.getFormList(this.id);

        }
    }
</script>

<style rel="stylesheet/less" lang="less">
    @import "../../../static/global.less";

    page {
        background-color: #F3F3F3;
        width: 100%;
        height: 100%;
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
            .look{
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
                padding-left: 10px;
                margin-bottom: 20px;
                height: 100%;
                padding-bottom: 100px;
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
        position: fixed;
        width: 100%;
        left: 0;
        bottom: 0;
        height: 50px;
        background-color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        div{
            flex: 1;
            text-align: center;
            line-height: 50px;
            color: @globalColor;
            &.pay{
                background-color: @globalColor;
                color: #FFFFFF;
            }
        }
    }
    .top-content{
        margin-bottom: 80px;
    }
</style>
