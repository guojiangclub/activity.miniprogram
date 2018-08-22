<template>
    <div id="rewards">
        <div class="content">
            <checkbox-group @change="checkboxChange">
                <div class="item mx-1px-bottom" v-for="i in list.signed">
                    <checkbox type="checkbox" color="#fff" :disabled="i.rewarded==1" :id="i.id" :value="i.user_id"/>
                    <label :for="i.id">
                           <div class="liIn">
                               <div class="portrait" :style="{backgroundImage:'url('+i.avatar+')'}"></div>
                               <div class="name"><span class="vlc-nowrap" :class="{ 'female': i.sex=='女', 'male': i.sex=='男' }">{{ i.name }}</span></div>
                               <span class="mark"><i v-if="i.rewarded==1">奖励待审核</i></span>
                           </div>
                       </label>
                </div>
            </checkbox-group>
        </div>
        <div class="bottomBar">
            <button @click="reward" :disabled="isReward">奖励积分</button>
        </div>
        <div class="pop" v-show="ispop">
            <div class="modal">
                <div class="title">消息提示</div>
                <div class="body">
                    <div class="number">奖励人数:{{listChecked.length}}</div>
                    <input type="text" placeholder="请输入奖励积分值" v-model="point"/>
                </div>
                <div class="footer mx-1px-top">
                    <div class="sure mx-1px-right" @click="sure">确定</div>
                    <div class="cancel" @click="cancel">取消</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                list:{
                    signed:[],
                    unsigned:[]
                },
                listChecked:[],
                ispop:false,
                myid:'',
                point:'',
                isReward:false
            }
        },
        mounted(){
            var id = this.$root.$mp.query.id;
            this.myid = id;
            this.memberList(id);
        },
        methods:{
            //判断奖励积分按钮是否能点击
            isreward(){
                if( !this.list.signed ) return false;

                let len_unrewarded = 0;
                this.list.signed.forEach( v => {
                    if( v.rewarded==0 ){
                        len_unrewarded +=1;
                    }
                });
                if( len_unrewarded==0 ) return true;
            },
            //点击确定按钮
            sure(){
                var v  =this.point;
                if (/^[1-9]$|^[1-9]\d$|^1\d{2}$|^200$/.test(v)) {
                    this. submitReward(this.myid,this.listChecked,this.point)
                } else {
                    return `[${v}]不满足输入条件`;
                }
            },
            //请求奖励积分接口
            submitReward(id,user_ids,value){
                var token = this.$storage.get('user_token');
                this.$http
                    .post(this.$config.GLOBAL.baseUrl+'api/activity/rewards/'+id,{
                        user_ids:user_ids,
                        value:value
                    },{
                        headers:{
                            Authorization:token
                        }
                    })
                    .then(res=>{
                        res= res.data;
                        if (res.status){
                            wx.showModal({
                                title:'消息提示',
                                content:'积分奖励申请已经提交',
                                showCancel:false,
                                success:rej=>{
                                    if (res.confirm){
                                        this. memberList(id);
                                    }
                                }
                            })
                        } else {
                            wx.showModal({
                                content:res.message || "操作失败",
                                showCancel:false
                            })
                        }
                    },err=>{
                        wx.showModal({
                            content: '请求失败，请重试',
                            showCancel: false,
                        })
                    })
            },
            //点击取消按钮
            cancel(){
                this.ispop = !this.ispop
            },
            // 点击奖励积分按钮
            reward(){
                if (this.listChecked.length==0){
                  wx.showModal({
                      content:'请先选择要奖励积分的会员！',
                      showCancel:false,
                  })
                } else {
                    this.ispop = !this.ispop
                }
            },
            //多选box
            checkboxChange(e) {
                /*console.log('checkbox发生change事件，携带value值为：', e.target.value)*/
                this.listChecked = e.target.value
            },
            // 请求签到列表
            memberList(id){
                var token = this.$storage.get('user_token');
                wx.showLoading({
                    title:"加载中",
                    mask:true
                });
                this.$http
                    .get(this.$config.GLOBAL.baseUrl+'api/activity/memberList/'+ id,{},{
                        headers:{
                            Authorization:token
                        }
                    })
                    .then(res=>{
                        res = res.data;
                        if (res.status){
                            var data = res.data;
                            data.signed.forEach(val=>{
                                val['showTel'] = false
                            })
                            this.list=data;
                            this.isReward = this.isreward();

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
    body{
        height: 100%;
    }
    #rewards{
        .content{
            margin-bottom: 50px;
            background-color: #FFFFFF;
            height: 100%;
            .item{
                font-size: 14px;
                color: #243441;
                overflow: hidden;
                checkbox{
                    border: none;
                    background: 0 0;
                   position: absolute;
                    top: 25%;
                    left: 12px;
                }
                //重置按钮样式
                checkbox .wx-checkbox-input{
                    background-color: #fff;
                    border: 1px solid #c1caca;
                    box-shadow: 0 1px 2px rgba(0,0,0,.05), inset 0 -15px 10px -12px rgba(0,0,0,.05);
                    height: 14px;
                    width: 14px;
                }
                checkbox .wx-checkbox-input.wx-checkbox-input-checked{
                    background-color: @globalColor;
                    border: 1px solid @globalColor;
                }

                label{
                    display: block;
                    height: auto;
                    line-height: normal;
                    padding: 0;
                    .liIn{
                        padding: 12px 12px 12px 42px;
                        overflow: hidden;
                        .portrait{
                            width: 60px;
                            height: 60px;
                            border-radius: 50%;
                            background-repeat: no-repeat;
                            background-size: 100% 100%;
                            float: left;
                        }
                        .name{
                            overflow: hidden;
                            font-size: 0;
                            margin-right: 0;
                            float: left;
                            span{
                                display: inline-block;
                                box-sizing: border-box;
                                max-width: 100%;
                                font-size: 16px;
                                padding: 0 22px 0 10px;
                                background-repeat: no-repeat;
                                background-size: auto 15px;
                                background-position: right center;
                                &.vlc-nowrap{
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                }
                            }
                        }
                        .mark{
                            float: right;
                            text-align: right;
                            width: 80px;
                            font-size: 14px;
                            color: #959595;
                            padding-left: 22px;
                        }
                    }
                }
            }
        }
        .pop{
            background-color:rgba(0,0,0,.4);
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            z-index: 2;
            .modal{
                position: fixed;
                top: 50%;
                left: 50%;
                margin-left: -35%;
                margin-top: -25%;
                background-color: #FFFFFF;
                width: 70%;
                border-radius:5px;
                color: #8e8e8e;
                .title{
                    text-align: center;
                    padding: 20px 10px 0 10px;
                    font-weight: 700;
                    font-size: 20px;
                }
                .body{
                    line-height: 25px;
                    padding: 30px 20px;
                    word-wrap: break-word;
                   .number{
                       line-height: 25px;
                       text-indent: 5px;
                       color: #555;
                       font-size: 13px;
                   }
                    input{
                        font-size: 14px;
                    }
                }
                .footer{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height:40px;
                    line-height: 40px;
                    text-align: center;
                    div{
                        flex: 1;
                        font-size: 16px;
                        &.sure{
                            color: @globalColor;
                        }
                    }
                }
            }
        }
        .bottomBar{
            position: fixed;
            bottom: 0;
            width: 100%;
            button{
                background-color: @globalColor;
                color: #FFFFFF;
                border-radius: 0;
                &.orange{
                    background-color: #ffbf7d;
                }
            }
            button::after{
                border: none;
            }
        }
    }
</style>