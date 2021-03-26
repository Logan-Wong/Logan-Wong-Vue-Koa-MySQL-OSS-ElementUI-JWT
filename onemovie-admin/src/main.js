import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

// 引入第三方字体图标 css 样式
import './assets/icon/iconfont.css'
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import axios from 'axios'

import 'vue-area-linkage/dist/index.css'
import VueAreaLinkage from 'vue-area-linkage'

Vue.use(VueAreaLinkage)

// 配置请求的根路径
axios.defaults.baseURL = process.env.VUE_APP_BASE_API

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.prototype.$http = axios

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 全局注册一个时间格式化过滤器
Vue.filter('dataFormat', function(originFormat) {
  return originFormat.replace('T', ' ').replace('.000Z', '')
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
