/**
 * Created by penglei on 2018/5/14.
 */
export default {
  BRAND: {
    name: 'DMP',
    logo: 'https://land-river-admin.ibrand.cc/storage/DvNvj2N2mkg2fvY4Cx5LJLLYLMTmdhV1J3qfd593.png',
    title: 'DMP © 移动商城',
  },
  GLOBAL: {
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://admin.dev.tnf.ibrand.cc/' : 'https://ibrand-admin.beta.ibrand.cc/', // 运行时自动替换变量
  },
  PACKAGES: {
    activity: false,
    autoLogin: false
  },
}
