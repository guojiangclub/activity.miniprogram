<template>
  <div id="activity-index">
    <div class="pagetop">
     <!-- <div class="search">
        <span class="iconfont icon-sousuo"></span>
        <input type="text" placeholder="想要参与的活动" placeholder-class="input-placeholder"/>
      </div>-->
      <div class="tab">
        <div class="tab-title">
          <div class="city" v-for="(item,index) in tabTitleList" :key="index" @click="toggle(index)" :class="[item.active ? 'tabactive':'',index==0 ? 'px-b':'']">
            <span class="name">{{item.title}}</span>
            <span class="iconfont icon-Group16"></span>
            <!--<scroll-view scroll-y @scrolltolower="lower">-->
            <div class="type-content">
              <div :class="" v-for="(k,i) in item.content" :key="i" @click="change(i,index)" :class="[k.active ? 'active' :'']">{{k.title}}</div>
            </div>
            <!--</scroll-view>-->
          </div>
        </div>
        <div class="tab-pop" v-if="isPop"></div>
      </div>
    </div>
    <div class="tab-content">
      <div class="no-more" v-if="activityData.length==0&&init">没有更多了</div>
      <div class="item mx-1px-bottom" v-for="(t,j) in activityData" :key="j" @click="jumpDetail(t.id)">
        <div class="info-left">
          <image :src="t.img_list" mode="aspectFill"></image>
        </div>
        <div class="info-rigth">
          <div class="name">{{t.title}}</div>
          <div class="time">{{t.time_section}}</div>
          <div class="address">{{t.address}}</div>
          <div class="money">
            <span class="text subtitle" v-if="t.fee_type != 'OFFLINE_CHARGES' && t.fee_type != 'CHARGING'">{{t.subtitle}}</span>
            <span class="text" v-if="t.payments[0] && t.payments[0].type == 0">{{t.payments[0].point}}积分</span>
            <span class="text" v-if="t.payments[0] && t.payments[0].type == 1">￥{{t.payments[0].price}}</span>
            <span class="text" v-if="t.payments[0] && t.payments[0].type == 2">￥{{t.payments[0].price}}+{{t.payments[0].point}}积分</span>
            <span class="text" v-if="t.payments[0] && t.payments[0].type == 4">￥{{t.payments[0].price}}</span>
            <span class="enroll-btn" :class="{'red' : t.status==1}">{{info[t.status]}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="my-activity" @click="jumpMine(1)">
      我的活动
    </div>
    <!--<div class="tabbar">
      <div class="mx-1px-right active">活动列表</div>
      <div @click="jumpMine(2)">个人中心</div>
    </div>-->
    <tab-bar index="0">

    </tab-bar>
  </div>
</template>

<script>
    import { getUrl } from '../../utils';
    import tabBar from '../../components/tabbar';
export default {
    components: {
        tabBar
    },
  data () {
    return {
        tabTitleList:[{
            title:"选择城市",
            name:"city",
            content:[{
                title:"所有城市",
                active:true,
                id:'all'
            }],
            active:false
        }, {
            title:"活动类型",
            name:'time',
            content:[{
                title:'所有分类',
                active:true,
                id:'all'
            }],
            active:false
        }],
        isPop:false,
        submitDatas:{
            "city":"all",
            "time":"all"
        },
      cityList:[],//城市列表
      activityPage:{
          page:1,
          hasMore:true, //图片列表是否加载更多
          per_page:''//分页每页数量
      },
        activityData:[],
        init:false,
        time:'',
        info: getApp().textStatus,
        token:''
    }
  },
    //小程序触底事件
    onReachBottom() {
        //城市加载更多
            wx.showLoading({
                title:"加载中",
                mask:true
            });
            var page = this.activityPage.page + 1;
            this.activityPage.page = page;
            if(this.activityPage.hasMore){
                /*console.log(this.submitDatas);*/
                let id = this.submitDatas.city;
                let category_id = this.submitDatas.time;
                this.askActivity(id,page,category_id,false)
            } else{
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none'
                });
                wx.hideLoading();
            }
    },
    //城市加载更多
  methods:{
      //跳到我的活动去
      jumpMine(type){
          var token = this.$storage.get('user_token');
          if(token){
             if(type == 1){
                 wx.navigateTo({
                     url:'/pages/myActivity/main'
                 })
             } else {
                 wx.reLaunch({
                     url:'/pages/user/main'
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
      //跳转到详情页
      jumpDetail(id){
          wx.navigateTo({
              url:'/pages/detail/main?id='+ id
          })
      },
      //请求接口返回活动数据给我
     /* getList(id ='all') {
          this.$http
            .get(this.$config.GLOBAL.baseUrl + 'api/activity/list/' + id, {
              page: 1
            }).then(res => {

            console.log(res);
          })
      }*/
     //区分活动是在那个状态
      /*statusTxt(){
          var text = this.activityData;
          text.forEach(function (val,index) {
              if (val.status == 0){
                  val['txt'] = "报名未开始";
              } else if(val.status == 1){
                  val['txt'] = "活动报名中";
              } else if(val.status == 2){
                  val['txt'] = "报名已截止";
              } else if(val.status == 3){
                  val['txt'] = "活动已结束";
              } else if(val.status == 4){
                  val['txt'] = "报名已截止";
              } else if(val.status == 5){
                  val['txt'] = "活动已满额";
              }
          })

      },*/
     //  请求城市的数据
      getChooseCity(){
         /* wx.showLoading({
              title:"加载中",
              mask:true
          });*/
          this.$http
              .get(this.$config.GLOBAL.baseUrl + 'api/city',{
                  limit:50
              })
              .then(res =>{
                  res = res.data;
                  if(res.status){
                      var list;
                     /* var page = res.meta.pagination;//拿到后台的分页数据
                      var current_page = page.current_page;//获取后台数据当前页面
                      var total_page = page.total_page;// 获取后台数据总共页数
                      this.cityPage.per_page = page.per_page;*/
                          list = this.cityList.concat(res.data);
                      var that = this;
                      that.tabTitleList[0].content = [{
                          title:"所有城市",
                          active:true,
                          id:'all'
                      }];
                          list.forEach(function (val,index) {
                              let title = val.name;
                              let id = val.id;
                              let active = false;
                              console.log(that.tabTitleList[0].content);
                              that.tabTitleList[0].content.push({
                                  title,
                                  id,
                                  active
                              })
                          });
                     /* } else{
                          list = this.cityList.concat(res.data);
                          var that = this;
                          list.forEach(function (val,index) {
                              let title = val.name;
                              let id = val.id;
                              let active = false;
                              that.tabTitleList[0].content.push({
                                  title,
                                  id,
                                  active
                              })
                          })
                      }
                      this.cityList = list;
                      this.cityPage.page = current_page;
                      this.cityPage.hasMore = current_page < total_page;*/

                  } else {
                      wx.showModal({
                          content:res.message || "请求失败",
                          showCancel:false
                      })

                  }
              },err =>{
                  wx.showModal({
                      content: '请求失败，请重试',
                      showCancel: false,
                  })
              })
      },
      //请求活动类型数据
      getChooseCategory(){
          /*wx.showLoading({
              title:"加载中",
              mask:true
          });*/
        this.$http
            .get(this.$config.GLOBAL.baseUrl +'api/category',{})
            .then(res =>{
                res = res.data;
                if(res.status){
                    var category = [];
                    category = category.concat(res.data);
                    var that = this;
                    that.tabTitleList[1].content = [{
                        title:"所有分类",
                        active:true,
                        id:'all'
                    }];
                    category.forEach(function (val,index) {
                        let title = val.name;
                        let id = val.id;
                        let active = false;
                        that.tabTitleList[1].content.push({
                            title,
                            id,
                            active
                        })
                    });
                } else{
                    wx.showModal({
                        content:res.message || "请求失败",
                        showCancel:false
                    })
                }
            },err =>{
                wx.showModal({
                    content: '请求失败，请重试',
                    showCancel: false,
                })
          })
      },

      toggle(i){ //点击选择城市或者选择分类的事件函数
          if(this.tabTitleList[i].active){
              this.tabTitleList[i].active = false;
              this.popAlert();
              return;
          }
          this.tabTitleList.forEach((val,index) =>{
              val.active = false;
          });
          this.tabTitleList[i].active = true;
          this.popAlert();
      },
     popAlert(){
         for (var i = 0; i<this.tabTitleList.length;i++){ //循环数组
             if(this.tabTitleList[i].active){ // active是判断是否弹出遮罩层
                 this.isPop = true;
                 break;
             } else {
                 this.isPop = false;
             }
         }
     },
      change(i,index){
         let key = this.tabTitleList[index].name;
         let arr = this.tabTitleList[index].content;
         arr.forEach((val,index) =>{
             val.active = false;
         });
         arr[i].active = true;
         this.submitDatas[key] = arr[i].id;
          let id = this.submitDatas.city;
          let category_id = this.submitDatas.time;
          let page = 1;
          this.askActivity(id,page,category_id,true);
      },
     /* getData(datas){
          console.log(datas);
          this.submitDatas = datas;
        let id = datas.city;
        let time = datas.time;
        /!*this.askActivity(id,1,time) *!/
          console.log(id);
          console.log(time);
      },*/
      //请求活动页面数据
      askActivity(id,page,category_id,isfrshen){
          wx.showLoading({
              title:"加载中",
              mask:true
          });
          this.$http
              .get(this.$config.GLOBAL.baseUrl + 'api/activity/list/'+id,{
                  page:page,
                  category_id:category_id
              })
              .then(res =>{
                  res = res.data;
                  if(res.status){
                   if(isfrshen){
                       this.activityData = [];
                       var activityList;
                       var page = res.meta.pagination;//拿到后台的分页数据
                       var current_page = page.current_page;//获取后台数据当前页面
                       var total_page = page.total_pages;// 获取后台数据总共页数
                       this.activityPage.page = page.per_page;
                       activityList = this.activityData.concat(res.data);
                       this.activityData = activityList;
                       this.activityPage.page = current_page;
                       this.activityPage.hasMore = current_page < total_page;
                   } else {
                       var activityList;
                       var page = res.meta.pagination;//拿到后台的分页数据
                       var current_page = page.current_page;//获取后台数据当前页面
                       var total_page = page.total_pages;// 获取后台数据总共页数
                       this.activityPage.page = page.per_page;
                       activityList = this.activityData.concat(res.data);
                       this.activityData = activityList;
                       this.activityPage.page = current_page;
                       this.activityPage.hasMore = current_page < total_page;
                   }
                      this.init = true;
                  } else {
                      wx.showModal({
                          content:res.message || "请求失败",
                          showCancel:false
                      })
                  }
                  wx.hideLoading();
              },err =>{
                  wx.showModal({
                      content: '请求失败，请重试',
                      showCancel: false,
                  })
                  wx.hideLoading()
              })
      }
  },
    // 分享
    onShareAppMessage() {
        return {
            title: '活动',
            path: '/pages/index/main'
        }
    },
    mounted(){
      this.getChooseCity();
      this.getChooseCategory();
      this.askActivity("all",1,"all",true);
      var token = this.$storage.get('user_token');
      this.token = token;
    }
}
</script>

<style rel="stylesheet/less" lang="less" type="text/less">
  @import "../../../static/global.less";
  page{
    background-color: #F3F3F3;
    width: 100%;
    height: 100%;
  }
  #activity-index{
    .pagetop{
      width: 100%;
      height:55px;
      position: fixed;
      z-index: 2;
      background-color: #ffffff;
      top: 0;
    }
  .search{
    /*position: fixed;
    top:0px;
    width: 100%;*/
    /*height:42px;*/
    position: relative;
    background-color:#ffffff;
    padding: 10px 15px;
    span{
      &.iconfont{
        font-size: 15px;
        color: #9B9B9B;
        position: absolute;
        top: 26px;
        left: 24px;
      }
    }
    input{
      border: 1px solid rgba(0,0,0,.1354);
      padding:10px 0 10px 30px;
      border-radius: 4px;
    }
    .input-placeholder{
      color:#9B9B9B;
      font-size:12px;
      line-height: 16px;
    }
  }
  .tab{
    .tab-title{
      /*background-color: #ffffff;
      z-index: 2;
      position: fixed;
      width: 100%;*/
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
        position: relative;
      /*margin-bottom: 5px;*/
      .city{
        flex: 1;
        font-size: 15px;
        color:#9B9B9B;
        text-align: center;
        .name{
          padding-right:6px;
        }
        span{
          display: inline-block;
          &.iconfont{
            font-size: 10px;
            transform:rotate(90deg);
            transition: all .4s linear;
            transform-origin: center 30%;

          }
        }
        }
        .px-b{
            border-right: 1px solid #DBDBDB;
        }
      .classify{
        flex: 1;
        font-size: 15px;
        color:#9B9B9B;
        text-align: center;
      }
      .type-content{
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 360%;
        z-index: 2;
        text-align: left;
        font-size: 0;
        background-color: #ffffff;
        overflow: auto;
        div{
          font-size: 14px;
          box-sizing: border-box;
          line-height: 40px;
          text-align: center;
          width: 30.333%;
          height: 40px;
          display: inline-block;
          margin-left: 2%;
          margin-top: 25px;
          background-color: #f1f1f1;
          &.active{
            background-color: #ffffff;
            color: #000000;
            border: 1px solid #000000;
          }
        }
      }
        .tabactive{
            .name{
                color: #000;
            }
            span{
              display: inline-block;
              &.iconfont{
                color:#000;
                transform:rotate(-90deg);
              }
            }
            .type-content{
                display: block;
            }
        }
    }
    .tab-pop{
      position: fixed;
      width: 100%;
      height: 100%;
      background: rgba(1, 1, 1, 0.5);
      z-index: 1;
    }
  }
  .tab-content{
    margin-top:65px;
    padding-bottom: 80px;
    .no-more {
      text-align:center;
      font-size: 14px;
    }
    /**/
    .item{
      background-color: #ffffff;
      padding: 10px 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      .info-left{
        width: 95px;
        height: 95px;
        image{
          width: 100%;
          height: 100%;
        }
      }
      .info-rigth{
        flex: 1;
        padding-left:10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
        .name{
          color: #000000;
          font-size: 16px;
          line-height: 22px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow:ellipsis;
          padding-bottom: 4px;
      }
        .subtitle{
          color: #9c9c9c;
          font-size: 12px;
        }
        .time,.address{
          font-size: 12px;
          color: #9B9B9B;
          line-height: 16px;
          padding-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow:ellipsis;
        }
        .money{
          /*text-align: justify;*/
          /*display: flex;*/
          /*align-items: center;*/
          /*justify-content:space-between ;*/
          overflow: hidden;
          margin-top:10px;
          .text{
            color: @globalColor;
            font-size: 12px;
            line-height: 16px;
          }
          .enroll-btn{
            padding: 4px 8px;
            font-size:12px;
            color: #ffffff;
            line-height: 16px;
            background-color: #d8d8d8;
            float: right;
          }
          .red{
            background-color: @globalColor;
          }
        }
      }
    }
  }
    .my-activity{
      position: fixed;
      width:95px;
      height:44px;
      line-height: 44px;
      border-radius: 2px;
      background-color:#EA4448 ;
      color: #FFFFFF;
      box-shadow:0px 4px 8px 0px rgba(0,0,0,0.3);
      bottom: 18%;
      right: 5%;
      font-size: 16px;
      text-align: center;
    }
    .tabbar{
      display: flex;
      position: fixed;
      bottom: 0;
      width: 100%;
      padding:22px 0 12px 0;
      color: #909090;
      font-size: 16px;
      background-color: #FFFFFF;
      text-align: center;
      align-items: center;
      &::before{
        content: '';
        position: absolute;
        top:0;
        left: 0;
        right: 0;
        height: 10px;
        background:linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(0,0,0,0.13) 100%);
      }
      div{
        flex: 1;
        border-radius: 0px;
        font-size:16px;
        line-height: 25px;
      }
      .active{
        color:#FF2741;
      }
    }
}
</style>
