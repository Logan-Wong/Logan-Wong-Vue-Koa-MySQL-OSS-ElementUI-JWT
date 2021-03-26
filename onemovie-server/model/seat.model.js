let query = require('../db/mysql')

const Seat = {
  // 添加座位信息
  addSeat(params){
    let _sql = "insert into seat set seat_startTime = ?, seat_selectedSeat = ?, selling_id = ?;"
    return query( _sql, params )
  },
  // 修改座位信息
  editSeat(params) {
    let _sql = `update seat set seat_selectedSeat = "${params[0]}" where seat_id = ${params[1]};`
    return query(_sql, params)
  },
  // 获取座位信息
  getSeatInfo(params) {
    let _sql = `select seat_id, seat_selectedSeat from seat where selling_id = ${params[0]} and seat_startTime = '${params[1]}';`
    return query(_sql, params)
  }
}

module.exports = Seat