let query = require('../db/mysql')

const Like = {
  // 添加点赞或踩
  addLike(params){
    let _sql = "insert into likeOrNot set like_flag = ?, user_id = ?, com_id = ?;"
    return query( _sql, params )
  },
  // 删除点赞或踩
  delLike(params) {
    let _sql = "delete from likeOrNot where user_id = ? and com_id = ?;"
    return query(_sql, params)
  },
  // 修改点赞或踩
  editLike(params) {
    let _sql = `update likeOrNot set like_flag = ${params[0]} where user_id = ${params[1]}, com_id = ${params[2]};`
    return query(_sql, params)
  },
  // 获取评论点赞列表
  getLikeList(params) {
    let _sql = `select like_id, like_flag, user_id, createTime, updateTime from likeOrNot where com_id = ${params};`
    return query(_sql, params)
  }
}

module.exports = Like