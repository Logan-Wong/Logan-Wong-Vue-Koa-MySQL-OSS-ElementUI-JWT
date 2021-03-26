const Admin = require('../model/admin.model')
const config = require('../config/index')
// const md5 = require('md5')
const jsonToken = require('jsonwebtoken')
const {handleSuccess, handleError} = require("../middlewears/handle")
const AdminController = {
  // 登录
  login: async (ctx) => {
    let {admin_name, admin_password} = ctx.request.body
    await Admin.login([admin_name]).then(res => {
      // 比较密码
      if (res[0].admin_password === admin_password) {
        let data = {
          admin_id: res[0].admin_id,
          admin_name: res[0].admin_name,
          // 生成 token
          token: jsonToken.sign({
            data: {admin_name: res[0].admin_name, admin_id: res[0].admin_id},
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 6) // 6小时过期
          }, config.ADMIN.jwtTokenSecret)
        }
        handleSuccess({ctx, result: data, message: '登录成功'})
      } else {
        handleError({ctx, message: '密码错误'})
      }
    }).catch(err => {
      handleError({ctx, message: '登录失败', err})
    })
  },
  // 获取管理员信息
  getAdminInfo: async (ctx) => {
    let {admin_id} = ctx.request.query
    await Admin.getAdminInfo([admin_id]).then(async res => {
      let data = {
        name: res[0].admin_name,
        avatar: 'https://gitee.com/wlogan/pic-go-picture-bed/raw/master/images/20210123222802.png',
        introduction: '我是一个超管~',
        roles: ['suAdmin']
      }
      handleSuccess({ctx, result: data, message: '获取管理员信息成功'})
    }).catch(err => {
      handleError({ctx, result: err, message: '获取管理员信息出错了'})
    })
  }
}

module.exports = AdminController
