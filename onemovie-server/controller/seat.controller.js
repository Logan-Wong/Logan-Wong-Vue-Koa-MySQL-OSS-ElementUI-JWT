const Seat = require('../model/seat.model')
const {handleSuccess, handleError} = require("../middlewears/handle")

const SeatController = {
  // 添加座位信息
  addSeat: async ctx => {
    console.log('ctx.request: ', ctx.request)
    let { seat_startTime, seat_selectedSeat, selling_id } = ctx.request.body
    await Seat.addSeat([seat_startTime, seat_selectedSeat, selling_id]).then( res => {
      handleSuccess({ctx, result: res, message: '添加座位信息成功'})
    }).catch( err => {
      handleError({ctx, message: '添加座位信息失败', err})
    })
  },
  // 修改座位信息
  editSeat: async ctx => {
    let { seat_selectedSeat, seat_id } = ctx.request.body
    await Seat.editSeat([seat_selectedSeat, seat_id]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '修改座位信息成功', message: '修改座位信息成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '修改座位信息失败', err})
    })
  },
  // 获取座位信息
  getSeatInfo: async ctx => {
    let { selling_id, seat_startTime } = ctx.request.query
    await Seat.getSeatInfo([selling_id, seat_startTime]).then( res => {
      handleSuccess({ctx, result: res, message: '获取座位信息成功'})
    }).catch( err => {
      handleError({ctx, message: '获取座位信息失败', err})
    })
  }
}

module.exports = SeatController
