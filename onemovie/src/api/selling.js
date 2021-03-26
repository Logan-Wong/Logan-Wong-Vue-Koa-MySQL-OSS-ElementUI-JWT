import instance from '../request/axios'

// 获取上映列表
const getSellingList = (data) => {
  return instance.get('/getsellist', { params: data })
}

export default {
  getSellingList
}
