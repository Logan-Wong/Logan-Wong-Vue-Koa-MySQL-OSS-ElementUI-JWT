import axios from 'axios'
import store from '../store'
import router from '../router'
import { Message } from 'element-ui'
let $message = Message

const instance = axios.create({
  'Content-Type': 'application/json;charset=UTF-8',
  timeout: 20000
})

// 配置请求的根路径
instance.defaults.baseURL = 'http://localhost:3500/api/'

// 请求拦截器，每次发送请求的时候拦截下来
instance.interceptors.request.use(
  config => {
    // 每次发送请求，检查 vuex 中是否有 token, 如果有放在 headers 中
    if (store.state.user.token) {
      config.headers.Authorization = `Bearer ${store.state.user.token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
// 响应拦截器
instance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data
    }
  },
  err => {
    let { response } = err
    if (response !== null) {
      // 401 错误，权限过期，重新登录
      if (response.status === 401) {
        let msg = response.data || '请重新登录!'
        $message({
          message: msg,
          type: 'error',
          onClose () {
            store.commit('remove')  // token 过期，清除
            router.replace({        // 跳转到登录页面
              path: '/login',
              // 添加一个重定向后缀，等登录以后再到这里来
              query: { redirect: router.currentRoute.fullPath }
            })
          }
        })
        return Promise.reject(err.response)
      } else {
        console.log('response: ', response)
        $message({
          message: '出错了，请重新登陆',
          type: 'error',
          onClose () {
            store.commit('remove')  // token 过期，清除
            router.replace({        // 跳转到登录页面
              path: '/login',
              // 添加一个重定向后缀，等登录以后再到这里来
              query: { redirect: router.currentRoute.fullPath }
            })
          }
        })
        return Promise.reject(err.response)
      }
    } else {
      console.log(err)
    }
  }
)

export default instance
