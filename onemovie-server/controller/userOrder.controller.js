const Order = require('../model/userOrder.model')
const {handleSuccess, handleError} = require("../middlewears/handle")

const OrderControllers = {
  // 添加订单
  addOrder: async ctx => {
    let { order_code, order_phone, order_status, order_movCovUrl, order_movName, order_cinName, order_cinHall, order_seat, order_session, order_price, order_lanVer, order_priceTotal, user_id } = ctx.request.body
    await Order.addOrder([order_code, order_phone, order_status, order_movCovUrl, order_movName, order_cinName, order_cinHall, order_seat, order_session, order_price, order_lanVer, order_priceTotal, user_id]).then( res => {
      handleSuccess({ctx, result: res, message: '添加订单成功'})
    }).catch( err => {
      handleError({ctx, message: '添加订单失败', err})
    })
  },
  // 删除订单
  delOrder: async ctx => {
    let {order_id} = ctx.request.body
    await Order.delOrder([order_id]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '删除订单成功', message: '删除订单成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '删除订单失败', err})
    })
  },
  // 修改订单信息
  editOrder: async ctx => {
    let { order_status, order_code } = ctx.request.body
    await Order.editOrder([order_status, order_code]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '修改订单信息成功', message: '修改订单信息成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '修改订单信息失败', err})
    })
  },
  // 获取订单列表
  getOrderList: async ctx => {
    let { user_id } = ctx.request.query
    await Order.getOrderList([user_id]).then( res => {
      handleSuccess({ctx, result: res, message: '获取订单列表成功'})
    }).catch( err => {
      handleError({ctx, message: '获取订单列表失败', err})
    })
  }
}

module.exports = OrderControllers