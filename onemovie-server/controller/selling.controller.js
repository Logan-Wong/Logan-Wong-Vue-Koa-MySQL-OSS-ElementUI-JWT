const Selling = require('../model/selling.model')
const Seat = require('../model/seat.model')
const {handleSuccess, handleError} = require("../middlewears/handle")

const SellingController = {
  // 添加上映信息
  addSelling: async ctx => {
    let { selling_date, selling_startTime, selling_price, movie_id, country_id, cinema_id, cinema_hallNum } = ctx.request.body
    await Selling.addSelling([selling_date, selling_startTime, selling_price, movie_id, country_id, cinema_id, cinema_hallNum]).then(async res => {
      // console.log('res: ', res)
      // 同时添加座位信息到座位表
      let startTimeArr = selling_startTime.split(',')
      let seat_selectedSeat = ''
      if (!res.insertId) return
      let selling_id = res.insertId
      for (const item of startTimeArr) {
        let seat_startTime = item
        const seatRes = await Seat.addSeat([seat_startTime, seat_selectedSeat, selling_id])
        if (seatRes.affectedRows < 0) return 
        // console.log('seatRes: ', seatRes)
      }
      handleSuccess({ctx, result: res, message: '添加上映信息成功'})
    }).catch( err => {
      handleError({ctx, message: '添加上映信息失败', err})
    })
  },
  // 删除上映信息
  deleteSelling: async (ctx) => {
    let {selling_id} = ctx.request.body
    await Selling.deleteSelling([selling_id]).then(async res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '删除上映信息成功', message: '删除上映信息成功'})
      }
    }).catch(err => {
      handleError({ctx, message: '删除上映信息失败', err})
    })
  },
  // 修改上映信息
  editSelling: async ctx => {
    let {selling_date, selling_startTime, selling_price, movie_id, country_id, cinema_id, cinema_hallNum, selling_id } = ctx.request.body
    await Selling.editSelling([selling_date, selling_startTime, selling_price, movie_id, country_id, cinema_id, cinema_hallNum, selling_id]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '修改上映信息成功', message: '修改上映信息成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '修改上映信息失败', err})
    })
  },
  // 前 - 获取上映列表（根据放映日期、电影 ID 和区域 ID）
  getSelListFro: async ctx => {
    let { selling_date, movie_id, country_id } = ctx.request.query
    await Selling.getSelListFro([selling_date, movie_id, country_id]).then( res => {
      handleSuccess({ctx, result: res, message: '获取上映列表成功'})
    }).catch( err => {
      handleError({ctx, message: '获取上映列表失败', err})
    })
  },
  // 后 - 获取上映列表（根据区域 ID）
  getSelListBack: async ctx => {
    let { pagenum, pagesize, country_id } = ctx.request.query
    await Selling.getSelListBack([pagenum, pagesize, country_id]).then( res => {
      handleSuccess({ctx, result: res, message: '获取上映列表成功'})
    }).catch( err => {
      handleError({ctx, message: '获取上映列表失败', err})
    })
  }
}

module.exports = SellingController
