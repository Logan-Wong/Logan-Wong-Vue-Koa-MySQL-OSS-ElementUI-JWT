import store from '../store'

// 检查当前是否登录 或者 登录信息是否有效
const isLogin = () => {
  const curTime = new Date().getTime()
  const tokenIssTime = store.state.user.tokenIssTime
  if (curTime - tokenIssTime < 60 * 60 * 1000) return true
  return false
}

export default isLogin
