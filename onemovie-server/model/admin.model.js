let query = require('../db/mysql')
const Admin =  {
  // 登录
  login(params) {
    let _sql = `select admin_id, admin_name, admin_password from admin where admin_name="${params}";`
    return query(_sql, params)
  },
  // 获取管理员信息
  getAdminInfo(params) {
    let _sql = `select admin_id, admin_name from admin where admin_id="${params}"`
    return query(_sql, params)
  }
}

module.exports = Admin
