import instance from '../request/axios'

// 添加评论
const addCom = (data) => {
  return instance.post('/addcom', data)
}

// 删除评论
const delCom = (data) => {
  return instance.delete('/delcom', data)
}

// 修改评论
const editCom = (data) => {
  return instance.put('/editcom', data)
}

// 获取电影评论列表
const getMovComList = (data) => {
  return instance.get('/getmovcomlist', { params: data })
}

// 获取用户评论列表
const getUserComList = (data) => {
  return instance.get('/getusercomlist', { params: data })
}

// 获取评论信息
const getComInfo = (data) => {
  return instance.get('/getcominfo', { params: data })
}

export default {
  addCom,
  delCom,
  editCom,
  getMovComList,
  getUserComList,
  getComInfo
}
