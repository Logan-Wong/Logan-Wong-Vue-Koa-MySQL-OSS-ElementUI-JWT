let query = require('../db/mysql')

const Selling = {
  // 添加上映信息
  addSelling(params){
    let _sql = "insert into selling set selling_date = ?, selling_startTime = ?, selling_price = ?, movie_id = ?, country_id = ?, cinema_id = ?, cinema_hallNum = ?;"
    return query( _sql, params )
  },
  // 删除上映信息
  deleteSelling(params) {
    let _sql = `delete from selling where selling_id = ${params};`
    return query(_sql, params)
  },
  // 修改上映信息
  editSelling(params) {
    let _sql = `update selling set selling_date = ?, selling_startTime = ?, selling_price = ?, movie_id = ?, country_id = ?, cinema_id = ?, cinema_hallNum = ? where selling_id = ?;`
    return query(_sql, params)
  },
  // 前 - 获取上映列表（根据放映日期、电影 ID 和区域 ID）
  getSelListFro(params) {
    let _sql = `select selling_id, selling_startTime, selling_price, cinema_id, cinema_hallNum, createTime, updateTime from selling where selling_date = '${params[0]}' and movie_id = '${params[1]}' and country_id = '${params[2]}';`
    return query(_sql, params)
  },
  // 后 - 获取上映列表（根据区域 ID）
  getSelListBack(params) {
    let _sql = `select SQL_CALC_FOUND_ROWS selling_id, selling_date, selling_startTime, selling_price, movie_id, cinema_id, cinema_hallNum, country_id, createTime, updateTime from selling where country_id like '%${params[2]}%' limit ${params[1]} offset ${params[1] * (params[0] - 1)};` + `select FOUND_ROWS() as total;`
    return query(_sql, params)
  }
}

module.exports = Selling