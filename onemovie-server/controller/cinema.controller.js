const Cinema = require('../model/cinema.model')
const {handleSuccess, handleError} = require("../middlewears/handle")

const CinemaController = {
  // 添加影院
  addCinema: async ctx => {
    let {cinema_name, cinema_hallNums, cinema_address, cinema_phone, country_id} = ctx.request.body
    await Cinema.addCinema([cinema_name, cinema_hallNums, cinema_address, cinema_phone, country_id]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '新增影院成功', message: '新增影院成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '新增影院失败', err})
    })
  },
  // 删除影院
  deleteCinema: async ctx => {
    let {cinema_id} = ctx.request.body
    await Cinema.deleteCinema([cinema_id]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '删除影院成功', message: '删除影院成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '删除影院失败', err})
    })
  },
  // 修改影院
  editCinema: async ctx => {
    let {cinema_name, cinema_hallNums, cinema_address, cinema_phone, country_id, cinema_id} = ctx.request.body
    await Cinema.editCinema([cinema_name, cinema_hallNums, cinema_address, cinema_phone, country_id, cinema_id]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '修改影院成功', message: '修改影院成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '修改影院失败', err})
    })
  },
  // 获取影院列表 - 详细信息
  getCinemaList: async ctx => {
    let { pagenum, pagesize, query, country_id } = ctx.request.query
    await Cinema.getCinemaList([pagenum, pagesize, query, country_id]).then( res => {
      handleSuccess({ctx, result: res, message: '获取影院列表成功'})
    }).catch( err => {
      handleError({ctx, message: '获取影院列表失败', err})
    })
  },
  // 获取影院列表 - 简要信息
  getCinemaListSim: async ctx => {
    let { country_id } = ctx.request.query
    await Cinema.getCinemaListSim([country_id]).then( res => {
      handleSuccess({ctx, result: res, message: '获取影院列表成功'})
    }).catch( err => {
      handleError({ctx, message: '获取影院列表失败', err})
    })
  },
  // 获取影院信息
  getCinemaInfo: async ctx => {
    let { cinema_id } = ctx.request.query
    await Cinema.getCinemaInfo([cinema_id]).then( res => {
      handleSuccess({ctx, result: res, message: '获取影院成功'})
    }).catch( err => {
      handleError({ctx, message: '获取影院失败', err})
    })
  }
}

module.exports = CinemaController
