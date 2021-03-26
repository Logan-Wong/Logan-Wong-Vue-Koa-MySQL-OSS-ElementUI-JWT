import instance from '../request/axios'

// 获取演职员信息
const getActorInfo = (data) => {
  return instance.get('/getactinfo', { params: data })
}

export default {
  getActorInfo
}
