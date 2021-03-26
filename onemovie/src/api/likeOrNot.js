import instance from '../request/axios'

// 添加点赞或踩
const addLike = (data) => {
  return instance.post('/addlike', data)
}

// 删除点赞或踩
const delLike = (data) => {
  return instance.delete('/dellike', data)
}

// 修改点赞或踩
const editLike = (data) => {
  return instance.put('/editlike', data)
}

// 获取评论点赞列表
const getLikeList = (data) => {
  return instance.get('/getlikelist', { params: data })
}

export default {
  addLike,
  delLike,
  editLike,
  getLikeList
}
