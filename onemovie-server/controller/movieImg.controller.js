const MovieImg = require('../model/movieImg.model')
const {handleSuccess, handleError} = require("../middlewears/handle")

const MovieImgController = {
  // 添加电影小封面
  addMovSmallCov: async ctx => {
    let {movieImg_isBigCover, movieImg_isSmallCover, movieImg_description, movie_name} = ctx.request.body
    await MovieImg.addMovSmallCov([movieImg_isBigCover, movieImg_isSmallCover, movieImg_description, movie_name]).then( res => {
      if (res.affectedRows > 0) {
        handleSuccess({ctx, result: '电影小封面添加成功', message: '电影小封面添加成功'})
      } else {
        handleSuccess({ctx, result: '电影小封面添加失败', message: '电影小封面添加失败'})
      }
    })
  },
  // 修改电影小封面
  editMovieSmallCov: async ctx => {
    let {movie_name, movieImg_url} = ctx.request.body
    await MovieImg.editMovieSmallCov([movie_name, movieImg_url]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '修改电影小封面成功', message: '修改电影小封面成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '修改电影小封面失败', err})
    })
  },
  // 获取电影小封面
  getMovieSmallCov: async ctx => {
    let { movie_name } = ctx.request.query
    await MovieImg.getMovieSmallCov([movie_name]).then( res => {
      handleSuccess({ctx, result: res, message: '获取电影小封面成功'})
    }).catch( err => {
      handleError({ctx, message: '获取电影小封面失败', err})
    })
  },
  // 获取电影大封面
  getMovieBigCov: async ctx => {
    let { movie_name } = ctx.request.query
    await MovieImg.getMovieBigCov([movie_name]).then( res => {
      handleSuccess({ctx, result: res, message: '获取电影大封面成功'})
    }).catch( err => {
      handleError({ctx, message: '获取电影大封面失败', err})
    })
  }
}

module.exports = MovieImgController
