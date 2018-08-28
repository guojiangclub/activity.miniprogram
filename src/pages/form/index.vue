<template>
    <div id="form">
        <div class="input_item" v-if="item.status==1" v-for="(item, idx) in list">
            <p v-if="item.type!='range' && item.name!='id_card' && item.type!='statement' && item.name != 'other_certificate'"><span v-if="item.is_necessary==1" style="color: red">*</span> {{item.title}} <span v-if="item.is_necessary==0">(选填)</span></p>
            <p v-if="item.type=='range'"><span v-if="item.is_necessary==1" style="color: red">*</span> {{item.title}}:{{showGoalTime[item.name]}} <span v-if="item.is_necessary==0">(选填)</span></p>
            <!--单独的身份证类型-->
            <p v-if="(item.type!='range' && item.name == 'id_card' && user.certificate_type == 'id_card' && item.type!='statement') || (item.type!='range' && item.name == 'id_card' && user.certificate_type == '' && item.type!='statement')"><span v-if="item.is_necessary==1" style="color: red">*</span> {{item.title}} <span v-if="item.is_necessary==0">(选填)</span></p>
            <input class="hhaha" type="text" :name="item.name" v-if="(item.type == 'text' && item.name == 'id_card' && user.certificate_type == 'id_card') || (item.type == 'text' && item.name == 'id_card' && user.certificate_type == '')" v-model="user[item.name]">

            <!--单独的其他证件-->
            <p v-if="(item.type!='range' && item.name == 'other_certificate' && user.certificate_type == 'other_certificate' && item.type!='statement') || (item.type!='range' && item.name == 'other_certificate' && user.certificate_type == '' && item.type!='statement')"><span v-if="item.is_necessary==1" style="color: red">*</span> {{item.title}} <span v-if="item.is_necessary==0">(选填)</span></p>
            <input class="hhaha" type="text" :name="item.name" v-if="(item.type == 'text' && item.name == 'other_certificate' && user.certificate_type == 'other_certificate') || (item.type == 'text' && item.name == 'other_certificate' && user.certificate_type == '')" v-model="user[item.name]">

            <input type="text" :name="item.name" v-if="item.type=='text'&& item.name!='province' && item.name!='id_card' && item.name!='other_certificate'"  v-model="user[item.name]">
            <div class="img" v-if="item.type=='file'">
                <div class="img_item" v-if="user[item.name].length" v-for="(val,index) in user[item.name]" @click="deleteX(item.name,index)">
                    <img :src="val" alt="">
                </div>
                <p class="upload">
                    <input :id="item.name" type="file" :name="item.name" accept="image/*" class="img_file" @change="fileChange(item.name)">
                </p>
            </div>
            <span class="box" @click="showPicker(item.name)" v-if="item.type=='select'">{{user[item.name]}}</span>
            <textarea  v-if="item.type=='textarea'" v-model="user[item.name]"></textarea>
            <!--<slide-time v-if="item.type=='range'" :minTime="ActivityStartTime" :maxTime="ActivityEndTime" @select-time="passTime(item.name,$event)" style="margin-bottom: 15px"></slide-time>-->
            <span class="box" v-if="item.name=='province'" @click="show_city">{{user[item.name]}}</span>
            <div class="input_radio" v-if="item.type=='radio'">
                <radio-group v-model="user[item.value || item.name]" :vertical=false>
                    <radio :label="i.value || i.name" v-for="i in item.options" :key="index">{{i.name}}</radio>
                </radio-group>
            </div>
            <div class="input_radio" v-if="item.type=='checkbox'">
                <checkbox-group v-model="user[item.name]" :vertical=false>
                    <checkbox :label="i.name" v-for="i in item.options" :key="index">{{i.name}}</checkbox>
                </checkbox-group>
            </div>
            <div class="input_radio mx-1px-top" style="padding-top: 10px;margin-top: 10px" v-if="item.type=='statement'">
                <CheckBox v-model="user[item.name]" class="statement" :label="item.title"></CheckBox>
                <a @click="lookDetail" style="color: cornflowerblue;text-decoration: underline">点击查看声明详情</a>

            </div>
        </div>
    </div>
</template>

<script>
    import { is } from '../../utils'
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
        data () {
            return {
                id: '',
                list: [],
                validate: new Validates(),
                user: {}
            }
        },
        methods: {
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
                        this.$set(this.showGoalTime, item.name, '');
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
            }
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
        textarea{
            margin-top: 10px;
            width: 100%;
            height: 80px;
            border: 1px solid #1aad19;
            border-radius: 5px;
        }
        /*overflow：hidden*/
        .img{
            .img_item{
                position: relative;
                display: inline-block;
                margin-left:15px;
                img{
                    position: relative;
                    width: 60px;
                    height: 60px;

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
                width: 60px;
                height: 60px;
                margin-left: 10px;
                border: 1px solid #1aad19;
                .img_file{
                    position: absolute;
                    z-index: 1;
                    left: 0;
                    top: 0;
                    width: 60px;
                    height: 60px;
                    opacity: 0;
                }
                &::after{
                    content: '+';
                    font-size: 50px;
                    text-align: center;
                    line-height: 50px;
                    position: absolute;
                    display: block;
                    width: 60px;
                    height: 60px;
                    left: 0;
                    top: 0;
                }
            }
        }
        p{

        }
        input[type=text]{
            padding-left: 10px;
            width: 100%;
            margin-top: 10px;
            height: 38px;
            line-height: 38px;
            border: 1px solid #1aad19;
            border-radius: 5px;
        }
        input[type=radio]{
            border: 1px solid #eeeeee;
        }
        span{
            &.box{

                position: relative;
                display: inline-block;
                box-sizing: border-box;
                padding-left: 10px;
                width: 100%;
                padding-right: 20px;
                margin-top: 10px;
                height: 38px;
                line-height: 38px;
                border-radius: 5px;
                border: 1px solid #1aad19;
                &:after{
                    content: '';
                    position: absolute;
                    top: 50%;
                    right: 5px;
                    transform-origin:center 30%;
                    transform: translate(0,-30%);
                    vertical-align: middle;
                    width: 0;
                    height: 0;
                    border-width: 8px;
                    border-color: #1aad19 transparent transparent transparent;
                    border-style: solid dashed dashed dashed;
                }
            }
        }
    }
</style>
