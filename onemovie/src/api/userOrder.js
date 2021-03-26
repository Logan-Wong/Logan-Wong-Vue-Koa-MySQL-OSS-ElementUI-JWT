import instance from '../request/axios'

// 添加订单
const addOrder = (data) => {
  return instance.post('/addorder', data)
}

// 删除订单
const delOrder = (data) => {
  return instance.delete('/delorder', data)
}

// 修改订单
const editOrder = (data) => {
  return instance.put('/editorder', data)
}

// 获取订单列表
const getOrderList = (data) => {
  return instance.get('/getordlist', { params: data })
}

export default {
  addOrder,
  delOrder,
  editOrder,
  getOrderList
}
