import instance from '../request/axios'

// 获取分类列表
const getCatList = (data) => {
  return instance.get('/getcatlist', { params: data })
}

// 获取分类电影列表
const getCatMovList = (data) => {
  return instance.get('/getcatmovlist', { params: data })
}

export default {
  getCatList,
  getCatMovList
}
