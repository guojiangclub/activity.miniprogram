<template>
    <div>
        <div class="rict-box">
            <textarea v-show="isEdit" class='input_view' maxlength='-1' auto-height='true'   v-model.lazy="firstCon" placeholder='写点什么...' :focus='focusList[0].focus' @blur="_outBlur" :style="{width:width-20 + 'px'}"   data-index='0' />
            <div v-show="!isEdit" @click='_focusView' class='input_view2 text-gray' data-index='0'>{{firstCon||"写点什么..."}}</div>
            <div v-for="item in dataList" :key="index">
                <div class='img_view' :style="{height: width / 2 + 'px'}">
                    <image :src='item.img' mode='aspectFill' />
                    <i @click='_deletedImg' :data-index='index' class='iconfont icon-close-circle-o close_img'>
                    </i>
                </div>
                <textarea v-show="isEdit" class='input_view' maxlength='-1' auto-height='true'  v-model.lazy="item.info" placeholder='写点什么...' :focus='focusList[index+1].focus' @blur="_outBlur" :style="{width:width-20 + 'px'}" :data-index='index+1'  />
                <div  v-show="!isEdit" @click='_focusView' class='input_view2 text-gray' :data-index='index+1'>{{item.info||'写点什么...'}}</div>
            </div>
        </div>
        <div class='add-img'>
            <div class='circle_center_view add-imgs' @tap='_addImg'>
               <i class="iconfont icon-picture">

               </i>
            </div>
        </div>


        <cover-view class='save' @click='_saveRichText'>
            保存
        </cover-view>
    </div>
</template>


<script>
    export default {
        props: {
            firstCon:{
                type:String,
                default:''
            },
            initlist:{ // 用于初始化数据，例如，编辑富文本
                type:Array,
                default:[]
            },
            save: {
                type: String,
                default:'save'
            },
            max_length:{ // 传入图片上限，默认为4
                type:Number,
                default:4
            }
        },
        data() {
            return {
                dataList:[],
                focusList:[{
                    focus:true
                }],
                isEdit:true,
                addImgView:{},
                insertIndex:0,
                width:375
            }
        },
        mounted() { // 当组件挂载到页面时，才会执行初始化
            wx.getSystemInfo({
                success: res => {
                    this.width = res.windowWidth
                }
            })
            /*this.setData({
                width: app.globalData.systemInfo.windowWidth
            })*/
            this._initRichText();
        },
        methods: {
            _initRichText(){
                console.log(this.data);
                if (this.initlist && this.initlist.length>0){// 初始化数据不为空
                    for (let i = 0; i < this.initlist.length;i++){
                        if(i===0){
                            if (this.initlist[i].type===0){
                                this.firstCon = this.initlist[0].info;
                            }else{
                                this.dataList.push({
                                    img: this.initlist[i].info,
                                    info: ''
                                })
                            }
                        } else {
                            if (this.initlist[i].type === 0) { // 文字
                                this.dataList[this.dataList.length - 1].info = this.data.initlist[i].info;
                            } else {
                                this.dataList.push({
                                    img: this.initlist[i].info,
                                    info: ''
                                })
                            }
                        }
                    }

                }
            },
            /*_inputCon(e){
                console.log(e);
                let index = +e.mp.currentTarget.dataset.index;
                /!*if(index === 0){
                    this.firstCon = e.mp.detail.value;
                }else{
                    this.dataList[index - 1].info = e.mp.detail.value;
                }*!/
            },*/
            _focusView(e){
                let index = +e.mp.currentTarget.dataset.index;
                this.focusList = this.focusList.map(item => {
                    item.focus = false;
                    return item;
                });
                this.focusList[index].focus = true;
                this.isEdit = true;
            },
            _outBlur(e){
                this.insertIndex = +e.mp.currentTarget.dataset.index;
                this.isEdit = false;
            },
            _addImg(){
                if(this.dataList.length<this.max_length){
                    wx.chooseImage({
                        success: res => {
                            let tempFilePaths = res.tempFilePaths
                            let token = this.$storage.get('user_token');

                            wx.uploadFile({
                                header: {
                                    'content-type': 'multipart/form-data',
                                    Authorization: token
                                },
                                url: this.$config.GLOBAL.baseUrl + 'api/users/upload/avatar',
                                filePath: tempFilePaths[0],
                                name: 'avatar_file',
                                success: rej => {
                                    var result = JSON.parse(rej.data);
                                    this.dataList.splice(this.insertIndex, 0, {
                                        img: result.data.url,
                                        info: ''
                                    })
                                    this.focusList.splice(this.insertIndex + 1, 0, {
                                        focus: false
                                    })
                                }
                            })


                        }
                    })
                }else{
                    wx.showToast({
                        title: '最多只能添加'+this.max_length+'张图片哦',
                        mask:true,
                        duration:1000
                    })
                }
            },
            _deletedImg(e){
                let index = +e.currentTarget.dataset.index;
                if(this.dataList[index].info){
                    if(index === 0){ // 最后一个
                        this.firstCon = this.firstCon + this.dataList[index].info;
                    }else{
                        this.dataList[index - 1].info = this.dataList[index - 1].info + this.dataList[index].info;
                    }
                }
                this.dataList.splice(index,1);
            },
            _saveRichText(){
                setTimeout(() => {
                    let list = [];
                    if(this.firstCon){
                        list.push({
                            info: this.firstCon,
                            type: 0,
                            html: `<p>${this.firstCon}<p>`
                        })
                    }
                    this.dataList.forEach(item => {
                        if(item.img){
                            list.push({
                                info: item.img,
                                type: 1,
                                html: `<img src="${item.img}" />`
                            })
                        }
                        if(item.info){
                            list.push({
                                info: item.info,
                                type: 0,
                                html: `<p>${item.info}<p>`
                            })
                        }
                    })
                    console.log(list);
                    this.$emit('getDataList', list);

                    this.releaseActivity();

                }, 150)
            },
            releaseActivity() {
                const token = this.$storage.get('user_token');
                let data = {
                    title: '这个是活动名称', // 活动名称
                    img: 'https://admin-dev.ibrand.cc/storage/uploads/images/2019_04_18/knjMNWCGNpgGzuADuaY7hw3BI4Fsf7uZWUz7fvkR.jpeg', // 活动图片
                    img_list: 'https://admin-dev.ibrand.cc/storage/uploads/images/2019_04_18/knjMNWCGNpgGzuADuaY7hw3BI4Fsf7uZWUz7fvkR.jpeg', // 活动图片
                    content: '<p>活动那内容</p>', // 活动详情
                    starts_at: '2019-04-18 12:05:30', // 活动开始时间
                    ends_at: '2019-04-21 22:00:30', // 活动结束时间
                    entry_end_at: '2019-04-18 12:04:30', // 报名截止时间
                    city_id: '1', // 活动城市
                    address: '长沙', // 活动地址
                    address_point: '28.243908,113.092575', // 详细活动地址
                    member_limit: '10', // 报名人数
                    form_id: '1', // 活动报名表单
                    statement_id: '1', // 活动免责声明
                    payments: [
                        {
                            title: '测试', // 电子票名称
                            price: '1', // 电子票金额
                            point: '1', // 电子票积分
                            limit: '1' // 电子票数量限制
                        }
                    ]
                }
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


<style rel="stylesheet/less" lang="less">
    @import "../../static/global";
    .rict-box {
        padding-bottom: 100px;
    }
    .input_view{
        padding: 10px;
        width: 100%;
        font-size: 32rpx;
    }
    .input_view2{
        padding: 10px;
        width: 100%;
        font-size: 32rpx;
        white-space: pre-wrap;
        word-break: break-all;
        box-sizing: border-box;
        line-height: 20px;
    }
    .img_view{
        display: flex;
        position: relative;
        padding: 4px;
        background-color: white;
        align-items: flex-start;
    }
    .img_view image{
        width: 100%;
        height: 100%;
    }
    .close_img{
        position: absolute;
        right: 10px;
        top:10px;
        font-size: 25px;
    }
    .add-img {
        display: flex;
        background-size:cover;
        position:fixed;
        right:15px;
        bottom:100px;
    }
    .save{
        position:fixed;
        bottom:0px;
        left: 0;
        right: 0;
        background: @globalColor;
        text-align: center;
        height: 50px;
        line-height: 50px;
        color: #FFFFFF;
    }
    .circle_center_view{
        box-shadow:0px 2px 4px 0px rgba(0,0,0,0.2);
        border-radius:4px;
        border:1px solid rgba(243,243,243,1);
        width: 45px;
        height: 45px;
        text-align: center;
        line-height: 45px;
        background: #FFFFFF;
        .iconfont {
            color: #666666;
            font-size: 25px;
        }
    }
    .text-gray{color: #8a8a8a;}
</style>