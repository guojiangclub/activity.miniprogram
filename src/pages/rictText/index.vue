<template>
    <div id="rictText">
        <!--<rict-text @getDataList="getDataList" :initlist="initlist">

        </rict-text>-->
        <div class="rict-box">
            <textarea v-if="isEdit" class='input_view' maxlength='-1' auto-height='true'   v-model.lazy="firstCon" placeholder='写点什么...' :focus='focusList[0].focus' @blur="_outBlur" :style="{width:width-20 + 'px'}"   data-index='0' />
            <div v-if="!isEdit" @click='_focusView' class='input_view2 text-gray' data-index='0'>{{firstCon||"写点什么..."}}</div>
            <div v-for="item in dataList" :key="index">
                <div class='img_view' :style="{height: width / 2 + 'px'}">
                    <image :src='item.img' mode='aspectFill' />
                    <i @click='_deletedImg' :data-index='index' class='iconfont icon-close-circle-o close_img'>
                    </i>
                </div>
                <textarea v-if="isEdit" class='input_view' maxlength='-1' auto-height='true'  v-model.lazy="item.info" placeholder='写点什么...' :focus='focusList[index+1] ? focusList[index+1].focus : false' @blur="_outBlur" :style="{width:width-20 + 'px'}" :data-index='index+1'  />
                <div v-if="!isEdit" @click='_focusView' class='input_view2 text-gray' :data-index='index+1'>{{item.info||'写点什么...'}}</div>
            </div>
        </div>
        <div class='add-img'>
            <div class='circle_center_view add-imgs' @tap='_addImg'>
                <i class="iconfont icon-picture">

                </i>
            </div>
        </div>


        <div class='save' @click='_saveRichText'>
            保存
        </div>
    </div>
</template>

<script>
    import {getUrl} from '../../utils';

    import rictText from '../../components/rict-text';
    export default {
        components: {
            rictText
        },
        data() {
            return {
                initlist:[],
                save: 'save',
                max_length: 100,
                dataList:[],
                focusList:[{
                    focus:true
                }],
                isEdit:true,
                addImgView:{},
                insertIndex:0,
                width:375,
                firstCon: ''
            }
        },
        onLoad() {
            Object.assign(this.$data, this.$options.data());
            // this.initlist = '';
            console.log('重新跑了这个1', this.initlist);
            let list = this.$storage.get('rictText');
            console.log('应该没有了', list);
            this.initlist = list;
            console.log('重新跑了这个2', this.initlist);
            wx.getSystemInfo({
                success: res => {
                    this.width = res.windowWidth
                }
            })
            this._initRichText();
        },
        methods: {
            _initRichText(){
                console.log(this.initlist);
                let list = [];
                if (this.initlist && this.initlist.length>0){// 初始化数据不为空
                    this.initlist.forEach((item, index) => {
                        list.push({
                            focus: false
                        })
                    })
                    this.focusList = list;
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
                                this.dataList[this.dataList.length - 1].info = this.initlist[i].info;
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
                        count: 1,
                        success: res => {
                            let tempFilePaths = res.tempFilePaths
                            let token = this.$storage.get('user_token');
                            wx.showLoading({
                                title: '正在上传',
                                mask: true
                            })
                            wx.uploadFile({
                                header: {
                                    'content-type': 'multipart/form-data',
                                    Authorization: token
                                },
                                url: this.$config.GLOBAL.baseUrl + 'api/image/upload',
                                filePath: tempFilePaths[0],
                                name: 'image',
                                success: rej => {
                                    if (rej.statusCode ==200) {
                                        var result = JSON.parse(rej.data);
                                        if (result.status) {
                                            this.dataList.splice(this.insertIndex, 0, {
                                                img: result.data.url,
                                                info: ''
                                            })
                                            this.focusList.splice(this.insertIndex + 1, 0, {
                                                focus: false
                                            })
                                        } else {
                                            wx.showModal({
                                                content: result.message || '请求失败，请重试',
                                                showCancel: false,
                                            })
                                        }
                                        wx.hideLoading();
                                    } else {
                                        wx.showModal({
                                            content: '请求失败，请重试',
                                            showCancel: false,
                                        })
                                        wx.hideLoading();
                                    }


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
                    /*console.log(list);*/
                    // this.$emit('getDataList', list);
                    wx.redirectTo({
                        url: '/pages/releaseActivity/main'
                    })
                    this.$storage.set('rictText', list, '30n');
                    /*this.releaseActivity();*/

                }, 150)
            },
            getDataList(e) {
                wx.redirectTo({
                    url: '/pages/releaseActivity/main'
                })
            }
        },
        mounted() {

        }
    }
</script>

<style rel="stylesheet/less" lang="less" type="text/less">
    @import "../../../static/global.less";
    #signUpFormDetail {

        margin-top: 10px;

        .item {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #333333;
            padding: 15px;
            background: #FFFFFF;
            .name {
                width: 100px;
            }
            input {
                flex: 1;
                text-align: right;
            }
        }
        .tips {
            color: #999999;
            font-size: 11px;
            padding: 0 15px;
            margin-top: 35px;
        }
        .btn {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            line-height: 50px;
            color: #FFFFFF;
            background: @globalColor;
        }

    }
</style>
