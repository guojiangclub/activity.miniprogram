<template>
  <div id="activity-index">
    <div class="search">
      <input type="text" placeholder="想要参与的活动" placeholder-class="input-placeholder"/>
    </div>
    <div class="tab">
      <div class="tab-title">
        <div class="city" :class="activeIndex == 0 ? 'tabactive':''" @click="choosecity(0)">
          <span class="name">选择城市</span>
          <span class="iconfont icon-gouwuche"></span>
          <scroll-view scroll-y @scrolltolower="lower" :class="maskcity ? 'cur':''">
            <div class="type-content">
              <div data-id="all">所有城市</div>
              <div v-for="item in cityList">{{item.name}}</div>
            </div>
          </scroll-view>
        </div>
        <div class="classify" :class="activeIndex == 1 ? 'tabactive':''" @click="choosefy(1)">
          <span class="name">活动类型</span>
          <span class="iconfont icon-gouwuche"></span>
          <scroll-view scroll-y :class="maskfy ? 'cur':''">
            <div class="type-content">
              <div class="active">所有分类</div>
              <div>赛事报名</div>
              <div>志愿者报名</div>
            </div>
          </scroll-view>
        </div>
      </div>
      <div class="tab-pop" :class="mask ? 'cur':''"></div>
    </div>
    <div class="tab-content">
      <div class="item">
        <div class="info-left">
          <image src="http://img4.imgtn.bdimg.com/it/u=3589159941,155458327&fm=27&gp=0.jpg"></image>
        </div>
        <div class="info-rigth">
          <div class="name">五一特惠 长沙一日游洲橘子岳麓三岳麓三岳麓三</div>
          <div class="time">2018.04.30 周一 10:00 - 2018.05.122018.05.122018.05.12</div>
          <div class="address">湖南省长沙市岳麓区</div>
          <div class="money">
            <span class="text">￥290.00</span>
            <span class="enroll-btn">活动报名中</span>
          </div>
        </div>
      </div>
    </div>
    <div class="my-activity">
      <button type="warn">我的活动</button>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
        tabtitle:[{
            name:"选择城市",
            type:0
        }, {
            name:"活动类型",
            type:1
        }],
        activeIndex:2,
        maskcity:false,
        maskfy:false,
      cityList:[],//城市列表
      cityPage:{
          page:1,
          hasMore:true, //图片列表是否加载更多
          per_page:''//分页每页数量
      }
    }
  },

  methods:{
      //请求接口返回活动数据给我
     /* getList(id ='all') {
          this.$http
            .get(this.$config.GLOBAL.baseUrl + 'api/activity/list/' + id, {
              page: 1
            }).then(res => {

            console.log(res);
          })
      }*/
     //  请求城市的数据
      getChooseCity(page = 1){
          this.$http
              .get(this.$config.GLOBAL.baseUrl + 'api/city',{
                  limit:50,
                  page:page
              })
              .then(res =>{
                  res = res.data;
                  if(res.status){
                      var list;
                      var page = res.meta.pagination;//拿到后台的分页数据
                      var current_page = page.current_page;//获取后台数据当前页面
                      var total_page = page.total_page;// 获取后台数据总共页数
                      this.cityPage.per_page = page.per_page;
                      if(current_page === 1){
                          list = this.cityList.concat(res.data);
                      } else{
                          list = this.cityList.concat(res.data);
                      }
                      this.cityList = list;
                      this.cityPage.page = current_page;
                      this.cityPage.hasMore = current_page < total_page;

                  } else {
                      wx.showModal({
                          content:res.messages || "请求失败",
                          showCancel:false
                      })

                  }
                  wx.hideLoading()
              },err =>{
                  wx.showModal({
                      content: '请求失败，请重试',
                      showCancel: false,
                  })
                  wx.hideLoading()
              })
      },
      //城市加载更多
      lower(){
          wx.showLoading({
              title:"加载中",
              mask:true
          });
          var page = this.cityPage.page + 1;
           if(this.cityPage.hasMore){
               this.getChooseCity(page);
           } else{
               wx.showToast({
                   title: '没有更多了',
                   icon: 'none'
               });
               wx.hideLoading()
           }
      },
      choosecity(index){
          this.activeIndex = index;
          this.maskcity = !this.maskcity;
      },
      choosefy(index){
          this.activeIndex = index
          this.maskfy = !this.maskfy;
      }
  },

  created () {
  },
    mounted(){
      this.getChooseCity();
    }
}
</script>

<style rel="stylesheet/less" lang="less">
  @import "../../../static/global.less";
  page{
    background-color: #F3F3F3;
    width: 100%;
    height: 100%;
  }
  #activity-index{
  .search{
    background-color:#ffffff;
    padding: 10px 15px;
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
      background-color: #ffffff;
      z-index: 2;
      position: fixed;
      height: 50px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 5px;
      .city{
        border-right: 1px solid #DBDBDB;
        flex: 1;
        font-size: 15px;
        color:#9B9B9B;
        text-align: center;
        }
      .classify{
        flex: 1;
        font-size: 15px;
        color:#9B9B9B;
        text-align: center;
      }
      .tabactive{
        .name{
          color: #000;
        }
      }
      scroll-view{
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
        &.cur{
          display:block;
        }
      }
      .type-content{
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
    }
    .tab-pop{
      display: none;
      position: fixed;
      width: 100%;
      height: 100%;
      background: rgba(1, 1, 1, 0.5);
      z-index: 1;
      &.cur{
        display: block;
      }
    }
  }
  .tab-content{
    margin-top: 55px;
    margin-bottom: 30px;
    background-color: #ffffff;
    .item{
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
          display: flex;
          align-items: center;
          justify-content:space-between ;
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
            background-color: @globalColor;
          }
        }
      }
    }
  }
    .my-activity{
      position: fixed;
      bottom: 0;
      width: 100%;
      button{
        border-radius: 0px;
        font-size:16px;
      }
    }
}
</style>
