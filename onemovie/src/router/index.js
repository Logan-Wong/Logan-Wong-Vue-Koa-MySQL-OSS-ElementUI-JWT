import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    component: Home/* ,
    meta: {
      requiresAuth: true
    } */
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue')
  },
  {
    path: '/subject/:id',
    name: 'subject',
    component: () => import(/* webpackChunkName: "subject" */ '../views/Subject.vue')
  },
  {
    path: '/comment',
    name: 'comment',
    component: () => import(/* webpackChunkName: "comment" */ '../views/Comment.vue')
  },
  {
    path: '/category',
    name: 'category',
    component: () => import(/* webpackChunkName: "category" */ '../views/Category.vue')
  },
  {
    path: '/account',
    name: 'account',
    component: () => import(/* webpackChunkName: "account" */ '../views/Account.vue')
  },
  {
    path: '/buyticket',
    name: 'buyticket',
    component: () => import(/* webpackChunkName: "buyticket" */ '../views/BuyTicket.vue')
  },
  {
    path: '/order',
    name: 'order',
    component: () => import(/* webpackChunkName: "order" */ '../views/UserOrder.vue')
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 挂载路由导航守卫
// to: 将要访问的路径
// from: 代表从哪个路径跳转而来
// next: 是一个函数，表示放行（加参数表示强制跳转）
router.beforeEach((to, from, next) => {
  let token = store.state.user.token
  // 判断要去的路由有没有 requiresAuth
  if (to.meta.requiresAuth) {
    if (token) {  // 如果有 token
      if (from.query.redirect) {
        if (to.path === from.query.redirect) {
          next()
        } else {
          next({
            path: from.query.redirect
          })
        }
      } else {
        next()
      }
    } else {      // 没有 token 则跳转到登陆页
      next({
        path: '/login',
        // 将刚刚要去的路由（无权限）path 作为参数，方便登录成功后直接跳转到该路由
        query: { redirect: to.fullPath }
      })
    }
  } else {  // 没有 requiresAuth 则放行
    next()
  }
})

// 重置滚动条的位置
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})

export default router
