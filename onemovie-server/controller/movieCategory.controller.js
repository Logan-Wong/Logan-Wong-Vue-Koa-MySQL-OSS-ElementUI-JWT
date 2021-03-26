const MovieCategory = require('../model/movieCategory.model')
const {handleSuccess, handleError} = require("../middlewears/handle")

const MovieCategoryController = {
  // 添加电影分类关系
  addMovieCategory: async (ctx) => {
    let {movie_id, cat_id} = ctx.request.body
    // 先查看电影分类关系是否已经存在
    await MovieCategory.findByMovieIdAndCatId([movie_id, cat_id]).then(async res => {
      if (res.length > 0) {
        handleError({ctx, message: '电影分类关系已存在，添加失败'})
      } else {
        // 如果电影分类关系不存在，再添加
        await MovieCategory.addMovieCategory([movie_id, cat_id]).then(res => {
          if (res.affectedRows > 0) {
            handleSuccess({ctx, result: '添加成功', message: '添加成功'})
          } else {
            handleError({ctx, message: '添加失败'})
          }
        }).catch(err => {
          handleError({ctx, message: '添加失败', err})
        })
      }
    }).catch(err => {
      handleError({ctx, message: '添加失败', err})
    })
  }
}

module.exports = MovieCategoryController
