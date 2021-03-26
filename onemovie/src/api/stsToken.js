import instance from '../request/axios'

// 注册
const getStsToken = (data) => {
  return instance.get('/ststoken', data)
}

export default {
  getStsToken
}
