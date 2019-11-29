/**
 * Created by penglei on 2018/5/14.
 */
export default {
    // https://wx.qlogo.cn/mmhead/Q3auHgzwzM6OM5hb6yiap47BtficrcdCy0qviaOvpeYALPVBIdRzsgLxQ/0  艾游logo
    // https://wx.qlogo.cn/mmhead/Q3auHgzwzM7oaTiaOG353b1LoGRF9w45gxSAL7KIEj34F06Y5Rz9pbw/0 米尔logo
    // https://nuscents.ibrand.cc/m/static/img/nu-bar-logo.png  优仙姿logo
    // https://land-river-admin.ibrand.cc/storage/DvNvj2N2mkg2fvY4Cx5LJLLYLMTmdhV1J3qfd593.png 511logo
    // https://wx.qlogo.cn/mmhead/Q3auHgzwzM6mtAOqRqibo9LokKQx5tSCcz3TZ3EbYbtDSoDXHHXglJw/0  utologo
    // https://wx.qlogo.cn/mmhead/Q3auHgzwzM7nj78UwGmvz8ft59Fhu5tQculuDibltEsmJ7obTtl9j9Q/0  悦户外logo
    // https://wx.qlogo.cn/mmhead/Q3auHgzwzM4X8VfglpKKTygW0D4OmsSHB9LGiczHHdYRhIzKPZtBs2A/0   狼爪logo
    // https://wx.qlogo.cn/mmhead/Q3auHgzwzM4Hr59sxBlnH4jfKMQJYACQOzibNe0xticCaP7RnuFlrvXQ/0  运运清货
    // https://wx.qlogo.cn/mmhead/Q3auHgzwzM6AJcJTnABAibZjGruHrHHmibmmj5Qd5e5HCFIYlMr1ofZw/0  万有logo
    // https://wx.qlogo.cn/mmhead/Q3auHgzwzM6m4icqPIzgMicWwZgP15IBiaZRBecdJkktbnTjY5V3eSvOw/0 UTO活动
    // https://mp.weixin.qq.com/wxopen/basicprofile?action=get_headimg&token=1959551758&t=20181218182052 撸球集结令
    // http://ibrand-miniprogram.oss-cn-hangzhou.aliyuncs.com/18-12-20/13874710.jpg 动咖秀

    // https://uto-admin.ibrand.cc/
    // https://admin-dev.ibrand.cc/
    // https://admin.wanyoujishi.com/
    // https://tennis-admin.ibrand.cc/
    // https://pinli-admin.ibrand.cc/
    // https://land-river-admin.ibrand.cc/

  BRAND: {
    name: '助力首百助手',
    logo: 'https://wx.qlogo.cn/mmhead/Q3auHgzwzM6m4icqPIzgMicWwZgP15IBiaZRBecdJkktbnTjY5V3eSvOw/0',
    title: '助力首百助手',
  },
   /* BRAND: {
        name: '撸球集结令',
        logo: 'https://mp.weixin.qq.com/wxopen/basicprofile?action=get_headimg&token=1959551758&t=20181218182052',
        title: '撸球集结令',
    },*/
    /*BRAND: {
        name: '动咖秀',
        logo: 'http://ibrand-miniprogram.oss-cn-hangzhou.aliyuncs.com/18-12-20/13874710.jpg',
        title: '动咖秀',
    },*/
    /*BRAND: {
        name: '岚川汇',
        logo: 'https://land-river-admin.ibrand.cc/storage/DvNvj2N2mkg2fvY4Cx5LJLLYLMTmdhV1J3qfd593.png',
        title: '岚川汇',
    },*/
    /*BRAND: {
        name: '万有邻里',
        logo: 'https://wx.qlogo.cn/mmhead/Q3auHgzwzM6AJcJTnABAibZjGruHrHHmibmmj5Qd5e5HCFIYlMr1ofZw/0',
        title: '万有邻里',
    },*/
    /*BRAND: {
        name: '平行镜界',
        logo: 'https://wx.qlogo.cn/mmhead/Q3auHgzwzM5VMF6socvxnJjvddQokYfiajsakS87iaGneyQADwnzibRZQ/0',
        title: '平行镜界',
    },*/
  //  https://uto-admin.ibrand.cc/  助力手百
  GLOBAL: {
    baseUrl: process.env.NODE_ENV === 'development' ? 'https://activity-admin-demo.guojiang.club/' : ' https://guojiang-activity-demo.ibrand.cc/', // 运行时自动替换变量
  },
  PACKAGES: {
    activity: false,
    autoLogin: false
  },
}
