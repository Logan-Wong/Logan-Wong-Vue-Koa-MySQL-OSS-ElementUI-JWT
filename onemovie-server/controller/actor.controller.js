const Actor = require('../model/actor.model')
const {handleSuccess, handleError} = require("../middlewears/handle")

const ActorController = {
  // 添加演职员
  addActor: async ctx => {
    let {actor_name, actor_avatarUrl} = ctx.request.body
    await Actor.addActor([actor_name, actor_avatarUrl]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '新增演职员成功', message: '新增演职员成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '新增演职员失败', err})
    })
  },
  // 删除演职员
  deleteActor: async ctx => {
    let {actor_id} = ctx.request.body
    await Actor.deleteActor([actor_id]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '删除演职员成功', message: '删除演职员成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '删除演职员失败', err})
    })
  },
  // 修改演职员
  editActor: async ctx => {
    let {actor_id, actor_name, actor_avatarUrl} = ctx.request.body
    console.log('actor_avatarUrl: ', actor_avatarUrl);
    console.log('actor_name: ', actor_name);
    console.log('actor_id: ', actor_id);
    await Actor.editActor([actor_name, actor_avatarUrl, actor_id]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '修改演职员成功', message: '修改演职员成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '修改演职员失败', err})
    })
  },
  // 获取演职员信息
  getActorInfo: async ctx => {
    let { actor_name } = ctx.request.query
    await Actor.getActorInfo([actor_name]).then( res => {
      handleSuccess({ctx, result: res, message: '获取演职员信息成功'})
    }).catch( err => {
      handleError({ctx, message: '获取演职员信息失败', err})
    })
  },
  // 获取演职员列表
  getActorList: async ctx => {
    let { pagenum, pagesize, query } = ctx.request.query
    await Actor.getActorList([pagenum, pagesize, query]).then( res => {
      handleSuccess({ctx, result: res, message: '获取演职员列表成功'})
    }).catch( err => {
      handleError({ctx, message: '获取演职员列表失败', err})
    })
  }
}

module.exports = ActorController
