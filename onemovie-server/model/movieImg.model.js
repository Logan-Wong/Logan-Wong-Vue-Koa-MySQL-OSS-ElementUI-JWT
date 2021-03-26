let query = require('../db/mysql')
const MovieImg =  {
  // 添加电影小封面
  addMovSmallCov(params) {
    // let _sql = `insert into movieImg set movieImg_isBigCover = 0, movieImg_isSmallCover = 1, movieImg_description = "${params}-小封面", movie_name = ${params};`
    let _sql = `insert into movieImg set movieImg_isBigCover = ?, movieImg_isSmallCover = ?, movieImg_description = ?, movie_name = ?;`
    return query(_sql, params)
  },
  // 修改电影小封面
  editMovieSmallCov(params) {
    let _sql = `update movieImg set movieImg_url = "${params[1]}" where movie_name = "${params[0]}";`
    return query(_sql, params)
  },
  // 获取电影小封面
  getMovieSmallCov(params) {
    let _sql = `select movieImg_url from movieImg where movie_name = "${params}" and movieImg_isSmallCover = 1;`
    return query(_sql, params)
  },
  // 获取电影大封面
  getMovieBigCov(params) {
    let _sql = `select movieImg_url from movieImg where movie_name = "${params}" and movieImg_isBigCover = 1;`
    return query(_sql, params)
  }
}

module.exports = MovieImg
