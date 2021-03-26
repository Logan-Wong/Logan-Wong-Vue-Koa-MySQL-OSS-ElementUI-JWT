import instance from '../request/axios'

// 添加座位信息
const addSeat = (data) => {
  return instance.post('/addseat', data)
}

// 修改座位信息
const editSeat = (data) => {
  return instance.put('/editseat', data)
}

// 获取座位信息
const getSeatInfo = (data) => {
  return instance.get('/getseatinfo', { params: data })
}

export default {
  addSeat,
  editSeat,
  getSeatInfo
}
