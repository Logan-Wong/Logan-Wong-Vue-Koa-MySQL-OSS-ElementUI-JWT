let query = require('../db/mysql')

const Cinema = {
  // 添加影院
  addCinema(params) {
    let _sql = "insert into cinema set cinema_name = ?, cinema_hallNums = ?, cinema_address = ?, cinema_phone = ?, country_id = ?;"
    return query(_sql, params)
  },
  // 删除影院
  deleteCinema(params) {
    let _sql = "delete from cinema where cinema_id = ?;"
    return query(_sql, params)
  },
  // 修改影院
  editCinema(params) {
    let _sql = `update cinema set cinema_name = ?, cinema_hallNums = ?, cinema_address = ?, cinema_phone = ?, country_id = ? where cinema_id = ?;`
    return query(_sql, params)
  },
  // 获取影院列表 - 详细信息
  getCinemaList(params) {
    let _sql = `select SQL_CALC_FOUND_ROWS cinema_id, cinema_name, cinema_hallNums, cinema_address, cinema_phone, createTime, updateTime from cinema where cinema_name like '%${params[2]}%' and country_id like '%${params[3]}%' limit ${params[1]} offset ${params[1] * (params[0] - 1)};` + `select FOUND_ROWS() as total;`
    return query(_sql, params)
  },
  // 获取影院列表 - 简要信息
  getCinemaListSim(params) {
    let _sql = `select cinema_id, cinema_name, cinema_hallNums from cinema where country_id = "${params}";`
    return query(_sql, params)
  },
  // 获取影院信息
  getCinemaInfo(params) {
    let _sql = `select cinema_id, cinema_name, cinema_hallNums, cinema_address, cinema_phone, country_id, createTime, updateTime from cinema where cinema_id = "${params}";`
    return query(_sql, params)
  }
}

module.exports = Cinema