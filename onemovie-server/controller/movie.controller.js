const Movie = require('../model/movie.model')
const Category = require('../model/category.model')
const MovieCategory = require('../model/movieCategory.model')
// const Actor = require('../model/actor.model')
const MovieImg = require('../model/movieImg.model')
const {handleSuccess, handleError} = require("../middlewears/handle")

const MovieController = {
  // 添加电影
  addMovie: async (ctx) => {
    let {
      movie_name,
      movie_year,
      movie_director,
      movie_screenwriter,
      movie_actor,
      movie_roleName,
      movie_type,
      movie_country,
      movie_language,
      movie_releaseDate,
      movie_duration,
      movie_alias,
      movie_IMDb,
      movie_synopsis,
      movie_score,
      movie_isSelling
    } = ctx.request.body
    // 先查看电影是否已经存在
    await Movie.findByMovieName([movie_name]).then(async res => {
      if (res.length > 0) {
        handleError({ctx, message: '电影已存在，添加失败'})
      } else {
        // 如果电影不存在，再添加
        await Movie.addMovie([movie_name, movie_year, movie_director, movie_screenwriter, movie_actor, movie_roleName, movie_type, movie_country, movie_language, movie_releaseDate, movie_duration, movie_alias, movie_IMDb, movie_synopsis, movie_score, movie_isSelling]).then(async res => {
          // console.log('123')
          if (res.affectedRows > 0) {
            handleSuccess({ctx, result: '电影添加成功', message: '电影添加成功'})
            // 电影图片集中添加一条记录，使用默认小封面
            // let movImgObj = {
            //   movieImg_isBigCover: 0,
            //   movieImg_isSmallCover: 1,
            //   movieImg_description: movie_name + '-小封面',
            //   movie_name
            // }
            let movieImg_isBigCover = 0, movieImg_isSmallCover = 1, movieImg_description = movie_name + '-小封面'
            const movImgRes = await MovieImg.addMovSmallCov([movieImg_isBigCover, movieImg_isSmallCover, movieImg_description, movie_name])
            // console.log('movImgRes: ', movImgRes)
            // 根据电影类型，在 movieCategory 表中添加记录
            // 1. 通过电影名称，找到电影 id
            let movRes = await Movie.findByMovieName([movie_name])
            // console.log('movie_id:' + movRes[0].movie_id)
            // 2. 切割电影类型
            let catIdArr = movie_type.split(',')
            // console.log('arr:' + catIdArr)
            for (const item of catIdArr) {
              // 3. 通过分类名称（可能有多个），找到分类 id
              let tmpCatRes = await Category.findByCatName([item])
              // console.log('cat_id:' + tmpCatRes[0].cat_id + ' cat_name:' + item)
              // 查看电影分类关系是否已经存在
              await MovieCategory.findByMovieIdAndCatId([movRes[0].movie_id, tmpCatRes[0].cat_id]).then(async res => {
                if (res.length > 0) {
                  handleError({ctx, message: '电影分类关系已存在，添加失败'})
                } else {
                  // 如果电影分类关系不存在，再添加
                  await MovieCategory.addMovieCategory([movRes[0].movie_id, tmpCatRes[0].cat_id]).then(res => {
                    if (res.affectedRows > 0) {
                      handleSuccess({ctx, result: '添加成功', message: '添加成功'})
                    } else {
                      handleError({ctx, message: '电影分类关系添加失败'})
                    }
                  }).catch(err => {
                    handleError({ctx, message: '电影分类关系添加失败', err})
                  })
                }
              }).catch(err => {
                handleError({ctx, message: '电影分类关系添加失败', err})
              })
            }
          } else {
            handleError({ctx, message: '电影添加失败1'})
          }
        }).catch(err => {
          handleError({ctx, message: '电影添加失败2', err})
        })
      }
    }).catch(err => {
      handleError({ctx, message: '电影添加失败3', err})
    })
  },
  // 删除电影
  deleteMovie: async (ctx) => {
    let {movie_id} = ctx.request.body
    await Movie.deleteMovie([movie_id]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '删除电影成功', message: '删除电影成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '删除电影失败', err})
    })
  },
  // 修改电影
  editMovie: async ctx => {
    let {movie_id, movie_name, movie_year, movie_director, movie_screenwriter, movie_actor, movie_roleName, movie_type, movie_country, movie_language, movie_releaseDate, movie_duration, movie_alias, movie_IMDb, movie_synopsis, movie_score, movie_isSelling} = ctx.request.body
    await Movie.editMovie([movie_name, movie_year, movie_director, movie_screenwriter, movie_actor, movie_roleName, movie_type, movie_country,movie_language, movie_releaseDate, movie_duration, movie_alias, movie_IMDb, movie_synopsis, movie_score, movie_isSelling, movie_id]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '修改电影成功', message: '修改电影成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '修改电影失败', err})
    })
  },
  // 获取所有电影（按照评分降序排）- 详细信息
  getMovieList: async ctx => {
    let { pagenum, pagesize, query } = ctx.request.query
    await Movie.getMovieList([pagenum, pagesize, query]).then(async res => {
      handleSuccess({ctx, result: res, message: '获取电影成功'})
      /**
       * 临时增加
       * 添加电影的演职员到演职员表
       * 演职员头像 Url 暂时先给一样的
       */
      // for (const item of res[0]) {
      //   // 统一用一个头像
      //   let actor_avatarUrl = 'https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210301204204.png'

      //   item.movie_director = item.movie_director.split(',')
      //   for (const item_dir of item.movie_director) {
      //     // console.log('item_dir: ', item_dir);
      //     const res_findDir = await Actor.findByActorName([item_dir])
      //     // console.log('res_findDir: ', res_findDir);
      //     if (res_findDir.length > 0) continue
      //     const res_addDir = await Actor.addActor([item_dir, actor_avatarUrl])
      //     // console.log('res_addDir: ', res_addDir);
      //   }

      //   item.movie_screenwriter = item.movie_screenwriter.split(',')
      //   for (const item_wri of item.movie_screenwriter) {
      //     const res_findWri = await Actor.findByActorName([item_wri])
      //     // console.log('res_findWri: ', res_findWri);
      //     if (res_findWri.length > 0) continue
      //     const res_addWri = await Actor.addActor([item_wri, actor_avatarUrl])
      //   }

      //   item.movie_actor = item.movie_actor.split(',')
      //   for (const item_act of item.movie_actor) {
      //     const res_findAct = await Actor.findByActorName([item_act])
      //     // console.log('res_findAct: ', res_findAct);
      //     if (res_findAct.length > 0) continue
      //     const res_addAct = await Actor.addActor([item_act, actor_avatarUrl])
      //   }
      // }
    }).catch( err => {
      handleError({ctx, message: '获取电影失败', err})
    })
  },
  // 获取所有电影（按照评分降序排）- 简要信息
  getMovListSimple: async ctx => {
    let { pagenum, pagesize, query } = ctx.request.query
    await Movie.getMovListSimple([pagenum, pagesize, query]).then(async res => {
      handleSuccess({ctx, result: res, message: '获取电影成功'})
    }).catch( err => {
      handleError({ctx, message: '获取电影失败', err})
    })
  },
  // 获取正在热映电影（按照评分降序排）
  getSallMovieList: async ctx => {
    let { pagenum, pagesize, query } = ctx.request.query
    await Movie.getSallMovieList([pagenum, pagesize, query]).then( res => {
      handleSuccess({ctx, result: res, message: '获取正在热映电影成功'})
    }).catch( err => {
      handleError({ctx, message: '获取正在热映电影失败', err})
    })
  },
  // 获取分类电影列表 - 简要信息
  getCatMovList: async ctx => {
    let { cat_id } = ctx.request.query
    await Movie.getCatMovList([cat_id]).then(async res => {
      handleSuccess({ctx, result: res, message: '获取分类电影成功'})
    }).catch( err => {
      handleError({ctx, message: '获取分类电影失败', err})
    })
  },
  // 获取分类电影列表 - 详细信息
  getCatMovListDetail: async ctx => {
    let { pagenum, pagesize, query, cat_id } = ctx.request.query
    await Movie.getCatMovListDetail([pagenum, pagesize, query, cat_id]).then(async res => {
      handleSuccess({ctx, result: res, message: '获取分类电影成功'})
    }).catch( err => {
      handleError({ctx, message: '获取分类电影失败', err})
    })
  },
  // 获取电影信息
  getMovieInfo: async ctx => {
    let { movie_id } = ctx.request.query
    await Movie.getMovieInfo([movie_id]).then(async res => {
      handleSuccess({ctx, result: res, message: '获取电影信息成功'})
    }).catch( err => {
      handleError({ctx, message: '获取电影信息失败', err})
    })
  }
}

module.exports = MovieController
