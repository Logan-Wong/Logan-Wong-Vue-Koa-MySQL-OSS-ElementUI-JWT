import instance from '../request/axios'

// 获取电影小封面
const getMovieSmallCov = (data) => {
  return instance.get('/getmovsmallcov', { params: data })
}

// 获取电影大封面
const getMovieBigCov = (data) => {
  return instance.get('/getmovbigcov', { params: data })
}

export default {
  getMovieSmallCov,
  getMovieBigCov
}
