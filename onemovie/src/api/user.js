import instance from '../request/axios'
import store from '../store'

// 注册
const register = (data) => {
  return instance.post('/register', data)
}

// 登陆
const login = (data) => {
  return instance.post('/login', data)
}

// 注销
const logout = () => {
  store.commit('remove')
}

// 修改密码
const editPwd = (data) => {
  return instance.put('/editpwd', data)
}

// 修改用户信息
const editUser = (data) => {
  return instance.put('/edituser', data)
}

// 获取用户密码
const checkPwd = (data) => {
  return instance.get('/checkpwd', { params: data })
}

// 获取用户信息
const getUserInfo = (data) => {
  return instance.get('/getuserinfo', { params: data })
}

export default {
  register,
  login,
  logout,
  editPwd,
  editUser,
  checkPwd,
  getUserInfo
}
