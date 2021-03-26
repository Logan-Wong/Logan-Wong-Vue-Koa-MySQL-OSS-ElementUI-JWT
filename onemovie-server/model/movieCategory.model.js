let query = require('../db/mysql')
const MovieCategory =  {
  // 添加电影分类关系
  addMovieCategory(params) {
    let _sql = "insert into movieCategory set movie_id = ?, cat_id = ?;"
    return query(_sql, params)
  },
  // 通过 movie_id, cat_id 查找
  findByMovieIdAndCatId(params) {
    let _sql = `select movie_id, cat_id from movieCategory where movie_id = ${params[0]} and cat_id = ${params[1]};`
    return query(_sql, params)
  }
}

module.exports = MovieCategory
