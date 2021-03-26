import instance from '../request/axios'

// 获取影院列表
const getCinemaList = (data) => {
  return instance.get('/getcinlist', { params: data })
}

// 获取影院信息
const getCinemaInfo = (data) => {
  return instance.get('/getcininfo', { params: data })
}

export default {
  getCinemaList,
  getCinemaInfo
}
