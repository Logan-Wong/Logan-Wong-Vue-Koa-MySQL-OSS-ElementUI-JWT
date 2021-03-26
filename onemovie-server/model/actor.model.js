let query = require('../db/mysql')
const Actor =  {
  // 添加演职员
  addActor(params) {
    let _sql = "insert into actor set actor_name = ?, actor_avatarUrl = ?;"
    return query(_sql, params)
  },
  // 删除演职员
  deleteActor(params) {
    let _sql = "delete from actor where actor_id = ?;"
    return query(_sql, params)
  },
  // 修改演职员
  editActor(params) {
    let _sql = "update actor set actor_name = ?, actor_avatarUrl = ? where actor_id = ?;"
    return query(_sql, params)
  },
  // 获取演职员信息
  getActorInfo(params) {
    let _sql = `select actor_id, actor_name, actor_avatarUrl from actor where actor_name = "${params}";`
    return query(_sql, params)
  },
  // 获取演职员列表（按 actor_id 升序排）
  getActorList(params) {
    let _sql = `select SQL_CALC_FOUND_ROWS actor_id, actor_name, actor_avatarUrl, createTime, updateTime from actor where actor_name like '%${params[2]}%' order by actor_id limit ${params[1]} offset ${params[1] * (params[0] - 1)};` + `select FOUND_ROWS() as total;`
    return query(_sql, params)
  },
  // 通过 actor_name 查找
  findByActorName(params) {
    let _sql = `select actor_id, actor_name from actor where actor_name = "${params}";`
    return query(_sql, params)
  }
}

module.exports = Actor
