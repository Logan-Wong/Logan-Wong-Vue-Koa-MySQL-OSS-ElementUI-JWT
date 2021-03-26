const Like = require('../model/likeOrNot.model')
const {handleSuccess, handleError} = require("../middlewears/handle")

const LikeController = {
  // 添加点赞或踩
  addLike: async ctx => {
    let { like_flag, user_id, com_id } = ctx.request.body
    await Like.addLike([like_flag, user_id, com_id]).then( res => {
      handleSuccess({ctx, result: res, message: '添加点赞或踩成功'})
    }).catch( err => {
      handleError({ctx, message: '添加点赞或踩失败', err})
    })
  },
  // 删除点赞或踩
  delLike: async ctx => {
    let { user_id, com_id } = ctx.request.body
    await Like.delLike([user_id, com_id]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '删除点赞或踩成功', message: '删除点赞或踩成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '删除点赞或踩失败', err})
    })
  },
  // 修改点赞或踩
  editLike: async ctx => {
    let { like_flag, user_id, com_id } = ctx.request.body
    await Like.editLike([like_flag, user_id, com_id]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '修改点赞或踩成功', message: '修改点赞或踩成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '修改点赞或踩失败', err})
    })
  },
  // 获取评论点赞列表（根据评论 ID，也就是查看哪些用户点赞或踩了该评论）
  getLikeList: async ctx => {
    let { com_id } = ctx.request.query
    await Like.getLikeList([com_id]).then( res => {
      handleSuccess({ctx, result: res, message: '获取评论点赞列表成功'})
    }).catch( err => {
      handleError({ctx, message: '获取评论点赞列表失败', err})
    })
  }
}

module.exports = LikeController
