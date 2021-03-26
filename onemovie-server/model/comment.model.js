let query = require('../db/mysql')

const Comment = {
  // 添加评论
  addCom(params){
    let _sql = "insert into comment set com_title = ?, com_content = ?, movie_id = ?, user_id = ?;"
    return query( _sql, params )
  },
// 添加回复
  addReplyComment(params){
    let _sql = "insert into comment set artId= ?, content = ? ,from_uname=?,from_uemail=?,from_uavatar=?,from_uweb=? ,   oldContent = ? ,to_uname=?,to_uemail=?,to_uavatar=?,to_uweb=?,cdate=?,oldCdate=?;"
    return query( _sql, params )
  },
  // 删除评论
  delCom(params) {
    let _sql = "delete from comment where com_id = ?;"
    return query(_sql, params)
  },
  // 修改评论
  editCom(params) {
    let _sql = `update comment set com_title = "${params[0]}", com_content = "${params[1]}", com_likeCount = ${params[2]}, com_notLikeCount = ${params[3]} where com_id = "${params[4]}";`
    return query(_sql, params)
  },
  // 获取电影评论列表
  getMovComList(params){
    let _sql = `select c.com_id, c.com_title, c.com_content, c.com_likeCount, c.com_notLikeCount, c.updateTime, c.movie_id, u.user_id, u.user_nickname, u.user_avatarUrl from comment c join user u on c.movie_id = "${params}" and c.user_id = u.user_id order by c.updateTime desc;`
    return query(_sql, params)
  },
  // 获取用户评论列表
  getUserComList(params) {
    let _sql = `select c.com_id, c.com_title, c.com_content, c.com_likeCount, c.com_notLikeCount, c.updateTime, m.movie_name from comment c join movie m on c.user_id = "${params}" and c.com_fatherId = -1 and c.movie_id = m.movie_id order by updateTime desc;`
    return query(_sql, params)
  },
  // 获取评论信息
  getComInfo(params) {
    let _sql = `select com_id, com_title, com_content, com_likeCount, com_notLikeCount, createTime, updateTime from comment where com_id = ${params};`
    return query(_sql, params)
  }
}

module.exports = Comment
