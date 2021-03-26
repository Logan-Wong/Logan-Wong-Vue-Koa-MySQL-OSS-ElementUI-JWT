import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入 elementui 无限滚动
import infiniteScroll from 'vue-infinite-scroll'
// 引入地址级联选择器
import VueAreaLinkage from 'vue-area-linkage'
import './plugins/element.js'
// 引入 element ui 自定义主题色
import './theme/element/index.css'
// 引入 css 全局样式
import './assets/css/global.css'
// 引入 js 全局配置
import './assets/js/settings'
// 引入第三方字体图标 css 样式
import './assets/icon/iconfont.css'
// 引入地址级联选择器样式
import 'vue-area-linkage/dist/index.css'

Vue.use(infiniteScroll)
Vue.use(VueAreaLinkage)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
