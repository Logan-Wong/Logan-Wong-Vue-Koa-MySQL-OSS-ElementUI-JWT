let query = require('../db/mysql')
const User =  {
  // 注册
  register(params) {
    let _sql = `insert into user set user_nickname = "${params[0]}", user_phone = "${params[1]}", user_password = "${params[2]}", user_avatarUrl = "${params[3]}";`
    return query(_sql, params)
  },
  // 登录
  login(params) {
    let _sql = `select user_id, user_phone, user_password, user_nickname from user where user_phone="${params}";`
    return query(_sql, params)
  },
  // 删除用户
  deleteUser(params) {
    let _sql = `delete from user where user_phone="${params}";`
    return query(_sql, params)
  },
  // 修改密码
  editPwd(params) {
    let _sql = `update user set user_password = "${params[1]}" where user_phone = "${params[0]}";`
    return query(_sql, params)
  },
  // 修改用户信息
  editUser(params) {
    let _sql = `update user set user_nickname = ?, user_avatarUrl = ? where user_phone = ?;`
    return query(_sql, params)
  },
  // 检查用户密码（通过手机号）
  checkPwd(params) {
    let _sql = `select user_id, user_phone, user_password from user where user_phone="${params}";`
    return query(_sql, params)
  },
  // 获取用户信息（通过手机号）
  getUserInfo(params) {
    let _sql = `select user_id, user_phone, user_password, user_nickname, user_avatarUrl from user where user_phone="${params}";`
    return query(_sql, params)
  },
  // 获取用户列表
  getUserList(params) {
    let _sql = `select SQL_CALC_FOUND_ROWS user_id, user_phone, user_nickname, user_avatarUrl, createTime, updateTime from user where user_phone like '%${params[2]}%' limit ${params[1]} offset ${params[1] * (params[0] - 1)};` + `select FOUND_ROWS() as total;`
    // let _sql = `select * from users where userId >= ((select max(userId) from users) - (select min(userId) from users)) * rand() + (select min(userId) from users)  limit 1;`
    // let _sql = `SELECT * FROM users  AS t1  JOIN (SELECT ROUND(RAND() * ((SELECT MAX(userId) FROM users)-(SELECT MIN(userId) FROM users))+(SELECT MIN(userId) FROM users)) AS userId) AS t2 WHERE t1.userId >= t2.userId ORDER BY t1.userId LIMIT 1;`
    return query(_sql, params)
  },
  // 通过 user_nickname 查找
  // findByNickname(params) {
  //   let _sql = `select user_id, user_phone, user_password, user_nickname, user_avatarUrl from user where user_nickname="${params}";`
  //   return query( _sql ,params)
  // },
  // 通过 user_phone 查找
  findByUserPhone(params) {
    let _sql = `select user_id, user_phone from user where user_phone="${params}";`
    return query(_sql, params)
  }
}

module.exports = User
