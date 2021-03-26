import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      user_id: window.localStorage.getItem('user_id') || '',
      user_phone: window.localStorage.getItem('user_phone') || '',
      user_nickname: window.localStorage.getItem('user_nickname') || '',
      token: window.localStorage.getItem('token') || '',
      // token 签发时间
      tokenIssTime: window.localStorage.getItem('tokenIssTime') || ''
    },
    // 县(区、市)
    district: window.localStorage.getItem('district') || '',
    district_id: window.localStorage.getItem('district_id') || '',
    // 分类数据
    cat_id: window.localStorage.getItem('cat_id') || '',
    cat_name: window.localStorage.getItem('cat_name') || ''
  },
  mutations: {
    save (state, data) {
      state.user.user_id = data.user_id
      state.user.user_phone = data.user_phone
      state.user.user_nickname = data.user_nickname
      state.user.token = data.token
      state.user.tokenIssTime = data.tokenIssTime

      window.localStorage.setItem('user_id', data.user_id)
      window.localStorage.setItem('user_phone', data.user_phone)
      window.localStorage.setItem('user_nickname', data.user_nickname)
      window.localStorage.setItem('token', data.token)
      window.localStorage.setItem('tokenIssTime', data.tokenIssTime)
    },
    remove (state, data) {
      state.user.user_id = ''
      state.user.user_phone = ''
      state.user.user_nickname = ''
      state.user.token = ''
      state.user.tokenIssTime = ''

      window.localStorage.removeItem('user_id')
      window.localStorage.removeItem('user_phone')
      window.localStorage.removeItem('user_nickname')
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('tokenIssTime')
    },
    SET_DISTRICT(state, data) {
      state.district = data
      window.localStorage.setItem('district', data)
    },
    REMOVE_DISTRICT(state) {
      state.district = ''
      window.localStorage.removeItem('district')
    },
    SET_DISTRICT_ID(state, data) {
      state.district_id = data
      window.localStorage.setItem('district_id', data)
    },
    REMOVE_DISTRICT_ID(state) {
      state.district_id = ''
      window.localStorage.removeItem('district_id')
    },
    SET_CAT_NAME(state, data) {
      state.cat_name = data
      window.localStorage.setItem('cat_name', data)
    },
    REMOVE_CAT_NAME(state) {
      state.cat_name = ''
      window.localStorage.removeItem('cat_name')
    },
    SET_CAT_ID(state, data) {
      state.cat_id = data
      window.localStorage.setItem('cat_id', data)
    },
    REMOVE_CAT_ID(state) {
      state.cat_id = ''
      window.localStorage.removeItem('cat_id')
    }
  },
  actions: {},
  modules: {}
})
