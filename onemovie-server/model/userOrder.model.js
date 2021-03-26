let query = require('../db/mysql')

const Order = {
  // 添加订单
  addOrder(params){
    let _sql = "insert into userOrder set order_code = ?, order_phone = ?, order_status = ?, order_movCovUrl = ?, order_movName = ?, order_cinName = ?, order_cinHall = ?, order_seat = ?, order_session = ?, order_price = ?, order_lanVer = ?, order_priceTotal = ?, user_id = ?;"
    return query( _sql, params )
  },
  // 删除订单
  delOrder(params) {
    let _sql = "delete from userOrder where order_id = ?;"
    return query(_sql, params)
  },
  // 修改订单信息
  editOrder(params) {
    let _sql = `update userOrder set order_status = "${params[0]}" where order_code = "${params[1]}";`
    return query(_sql, params)
  },
  // 获取订单列表
  getOrderList(params){
    let _sql = `select order_id, order_code, order_phone, order_status, order_movCovUrl, order_movName, order_cinName, order_cinHall, order_seat, order_session, order_price, order_lanVer, order_priceTotal, createTime, updateTime from userOrder where user_id = ${params} order by createTime desc;`
    return query(_sql, params)
  }
}

module.exports = Order
