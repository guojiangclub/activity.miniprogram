<template>
    <div id="signList">
        <div class="navbar">
            <div class="vlc-slideBar-wrapper vlc-slideBar-flex normal" style="width: auto">
                <div class="vlc-slideBar-child" v-for="(item,index) in tabList" style="text-align: center; height: 30px; line-height: 30px;" @click="changeTab($event,index)" :key="$index">
                    <span :class="activeIndex == index ? 'active':''">{{item.name}}</span>
                </div>
            </div>
            <div class="navar-slider" :style="{width: width +'px', transform: 'translateX' + '(' + sliderOffset + 'px' + ')'}"></div>
        </div>
        <div class="content" v-if="activeIndex==0">
            <div class="item" v-for="item in dataList.signed" :key="$index" @click="jumpmember(item.user_id)">
                <div class="avatar">
                    <image :src="item.avatar"></image>
                </div>
                <!--<div class="name"><span class="nick_name" :class="{ 'female': i.sex=='女', 'male': i.sex=='男' }">{{ i.name }}</span></div>-->
                <div class="txt">已签到</div>
            </div>
        </div>
        <div class="content" v-if="activeIndex==1">
            <div class="item" v-for="item in dataList.unsigned" :key="$index" @click="jumpmember(item.user_id)">
                <div class="avatar">
                    <image :src="item.avatar"></image>
                </div>
                <div class="txt">未签到</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                activeIndex: 0,
                sliderOffset: 0,
                width: 0,
                tabList:[
                    {
                        id:0,
                        name:"已签到",
                        init: false
                    },
                    {
                        id:1,
                        name:"未签到",
                        init: false
                    }
                ],
                dataList:{
                    signed:[],
                    unsigned:[]
                }
            }
        },
        mounted(){
            wx.getSystemInfo({
                success: res =>{
                    this.width = res.windowWidth /this.tabList.length,
                        this.sliderOffset = res.windowWidth / this.tabList.length * this.activeIndex
                }
            });
            var id = this.$root.$mp.query.id;
            this.memberList(id);
        },
        methods:{
            //跳到会员资料页
            jumpmember(user_id){
                wx.navigateTo({
                    url:'/pages/member/main?user_id='+user_id
                })
            },
            // 切换tab
            changeTab(e,index){
                this.activeIndex = index;
                this.sliderOffset = e.currentTarget.offsetLeft;
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
                           this.dataList = res.data;
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
    page{
        height: 100%;
        background-color:#F3F3F3;
    }
    #signList{
        .navbar{
            background-color: #ffffff;
            overflow-x: scroll;
            overflow-y: hidden;
            width: 100%;
            position: relative;
            .vlc-slideBar-wrapper{
                /*border-bottom: 1px solid #cccccc;*/
                padding: 8px 0;
            }
            .vlc-slideBar-flex{
                display: flex;
                align-items: center;
                .vlc-slideBar-child{
                    flex: 1;
                    span{
                        color:#9B9B9B;
                        font-size: 15px;
                    }
                    .active{
                        color:@globalColor;
                    }
                }
            }
            .normal{
                flex-direction: row;
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
        .content{
            margin-bottom: 50px;
            .item{
                padding: 12px;
                background: #fff;
                margin-top: 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .avatar{
                    width:60px;
                    height: 60px;
                    image{
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
                .txt{
                    font-size: 14px;
                    color: #959595;
                    padding-left: 22px;
                }
            }
        }
    }
</style>