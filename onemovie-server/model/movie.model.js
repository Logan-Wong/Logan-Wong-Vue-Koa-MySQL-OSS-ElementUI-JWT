// const { getMovieList } = require('../controller/movie.controller')
let query = require('../db/mysql')
const Movie =  {
  // 添加电影
  addMovie(params) {
    let _sql = "insert into movie set movie_name = ?, movie_year = ?, movie_director = ?, movie_screenwriter = ?, movie_actor = ?, movie_roleName = ?,  movie_type = ?, movie_country = ?, movie_language = ?, movie_releaseDate = ?, movie_duration = ?, movie_alias = ?, movie_IMDb = ?, movie_synopsis = ?, movie_score = ?, movie_isSelling = ?;"
    return query(_sql, params)
  },
  // 删除电影
  deleteMovie(params) {
    let _sql = "delete from movie where movie_id = ?;"
    return query(_sql, params)
  },
  // 修改电影
  editMovie(params) {
    let _sql = "update movie set movie_name = ?, movie_year = ?, movie_director = ?, movie_screenwriter = ?, movie_actor = ?, movie_roleName = ?, movie_type = ?, movie_country = ?, movie_language = ?, movie_releaseDate = ?, movie_duration = ?, movie_alias = ?, movie_IMDb = ?, movie_synopsis = ?, movie_score = ?, movie_isSelling = ? where movie_id = ?;"
    return query(_sql, params)
  },
  // 获取电影列表（未按照评分降序排）- 详细信息
  getMovieList(params) {
    let _sql = `select SQL_CALC_FOUND_ROWS movie_id, movie_name, movie_year, movie_director, movie_screenwriter, movie_actor, movie_roleName, movie_type, movie_country, movie_language, movie_releaseDate, movie_duration, movie_alias, movie_IMDb, movie_synopsis, movie_score, movie_isSelling, createTime, updateTime from movie where movie_name like '%${params[2]}%' limit ${params[1]} offset ${params[1] * (params[0] - 1)};` + `select FOUND_ROWS() as total;`
    // let _sql = `select SQL_CALC_FOUND_ROWS movie_id, movie_name, movie_year, movie_director, movie_screenwriter, movie_actor, movie_roleName, movie_type, movie_country, movie_language, movie_releaseDate, movie_duration, movie_alias, movie_IMDb, movie_synopsis, movie_score, movie_isSelling, createTime, updateTime from movie where movie_name like '%${params[2]}%' order by movie_score desc limit ${params[1]} offset ${params[1] * (params[0] - 1)};` + `select FOUND_ROWS() as total;`
    return query(_sql, params)
  },
  // 获取电影列表（未按照评分降序排）- 简要信息
  getMovListSimple(params) {
    let _sql = `select SQL_CALC_FOUND_ROWS m.movie_id, m.movie_name, m.movie_year, m.movie_actor, i.movieImg_url from movie m join movieimg i on m.movie_name = i.movie_name and m.movie_name like '%${params[2]}%' and i.movieImg_isSmallCover = 1 limit ${params[1]} offset ${params[1] * (params[0] - 1)};` + `select FOUND_ROWS() as total;`
    return query(_sql, params)
  },
  // 获取正在热映电影（未按照评分降序排）
  getSallMovieList(params) {
    let _sql = `select SQL_CALC_FOUND_ROWS m.movie_id, m.movie_name, m.movie_actor, i.movieImg_url, m.movie_duration from movie m join movieimg i on m.movie_name = i.movie_name and m.movie_name like '%${params[2]}%' and m.movie_isSelling = 1 and i.movieImg_isSmallCover = 1 limit ${params[1]} offset ${params[1] * (params[0] - 1)};` + `select FOUND_ROWS() as total;`
    // let _sql = `select SQL_CALC_FOUND_ROWS movie_id, movie_name, movie_actor from movie where movie_isSelling = 1 and movie_name like '%${params[2]}%' limit ${params[1]} offset ${params[1] * (params[0] - 1)};` + `select FOUND_ROWS() as total;` + `select movie_name, movieImg_url from movieImg where movie_name = movie_name and movieImg_isSmallCover = 1;`
    // let _sql = `select movie_id, movie_name, movie_actor from movie where movie_isSelling = 1 and movie_name like '%${params[2]}%' limit ${params[1]} offset ${params[1] * (params[0] - 1)} order by movie_score desc;` + `select FOUND_ROWS() as total;`
    return query(_sql, params)
  },
  // 获取分类电影列表 - 简要信息
  getCatMovList(params) {
    let _sql = `select m.movie_id, m.movie_name, m.movie_year, m.movie_actor, i.movieImg_url from movie m join category c join movieimg i on c.cat_id = ${params} and m.movie_name = i.movie_name and m.movie_type like concat("%",c.cat_name,"%") and i.movieImg_isSmallCover = 1;`
    return query(_sql, params)
  },
  // 获取分类电影列表 - 详细信息
  getCatMovListDetail(params) {
    let _sql = `select SQL_CALC_FOUND_ROWS m.movie_id, m.movie_name, m.movie_year, m.movie_director, m.movie_screenwriter, m.movie_actor, m.movie_roleName, m.movie_type, m.movie_country, m.movie_language, m.movie_releaseDate, m.movie_duration, m.movie_alias, m.movie_IMDb, m.movie_synopsis, m.movie_score, m.movie_isSelling, m.createTime, m.updateTime, i.movieImg_url, c.cat_name from movie m join category c join movieimg i on c.cat_id = ${params[3]} and m.movie_name = i.movie_name and m.movie_type like concat("%",c.cat_name,"%") and i.movieImg_isSmallCover = 1 and m.movie_name like '%${params[2]}%' limit ${params[1]} offset ${params[1] * (params[0] - 1)};` + `select FOUND_ROWS() as total;`
    return query(_sql, params)
  },
  // 根据 movie_id 获取电影
  getMovieInfo(params) {
    let _sql = `select movie_name, movie_year, movie_director, movie_screenwriter, movie_actor, movie_roleName, movie_type, movie_country, movie_language, movie_releaseDate, movie_duration, movie_alias, movie_IMDb, movie_synopsis, movie_score, movie_isSelling from movie where movie_id = ${params};`
    return query(_sql, params)
  },
  // 通过 movie_name 查找
  findByMovieName(params) {
    let _sql = `select movie_id, movie_name from movie where movie_name = "${params}";`
    return query(_sql, params)
  }
}

module.exports = Movie
