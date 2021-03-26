import instance from '../request/axios'

// 获取热门电影列表
const getHotMovieList = (data) => {
  return instance.get('/getmovlistsim', { params: data })
}

// 获取正在热映电影列表
const getSallMovieList = (data) => {
  return instance.get('/getsallmovlist', { params: data })
}

// 获取电影详情
const getMovieInfo = (data) => {
  return instance.get('/getmovinfo', { params: data })
}

export default {
  getHotMovieList,
  getSallMovieList,
  getMovieInfo
}
