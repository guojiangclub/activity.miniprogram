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
  BRAND: {
    name: '万有邻里',
    logo: 'https://wx.qlogo.cn/mmhead/Q3auHgzwzM6AJcJTnABAibZjGruHrHHmibmmj5Qd5e5HCFIYlMr1ofZw/0',
    title: '万有邻里',
  },
  GLOBAL: {
    baseUrl: process.env.NODE_ENV === 'development' ? 'https://ibrand-admin.beta.ibrand.cc/' : 'https://admin.wanyoujishi.com/', // 运行时自动替换变量
  },
  PACKAGES: {
    activity: false,
    autoLogin: false
  },
}
