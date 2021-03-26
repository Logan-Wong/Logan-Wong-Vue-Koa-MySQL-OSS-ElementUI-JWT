const User = require('../model/user.model')
const config = require('../config/index')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const {handleSuccess, handleError} = require("../middlewears/handle")
const UserController = {
  // 注册
  register: async (ctx) => {
    let {user_nickname, user_phone, user_password, user_avatarUrl} = ctx.request.body
    // 如果没有获取到用户头像，则给默认的
    if (!user_avatarUrl) user_avatarUrl = 'https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210309220417.png'
    // 先查看用户名是否已经存在
    await User.findByUserPhone([user_phone]).then(async res => {
      if (res.length > 0) {
        handleError({ctx, message: '账号已存在,注册失败'})
      } else {
        // 如果用户名不存在，再注册
        await User.register([user_nickname, user_phone, md5(config.USER.pwdSalt + user_password), user_avatarUrl]).then(res => {
          if (res.affectedRows > 0) {
            handleSuccess({ctx, result: '注册成功', message: '注册成功'})
          } else {
            handleError({ctx, message: '注册失败'})
          }
        }).catch(err => {
          handleError({ctx, message: '注册失败', err})
        })
      }
    }).catch(err => {
      handleError({ctx, message: '注册失败', err})
    })

  },
  // 登录
  login: async (ctx) => {
    let {user_phone, user_password} = ctx.request.body
    await User.login([user_phone]).then(res => {
      // 比较密码
      if (res[0].user_password === md5(config.USER.pwdSalt + user_password)) {
        const user_id = res[0].user_id
        const user_phone = res[0].user_phone
        const user_nickname = res[0].user_nickname
        const payload = { user_id, user_phone, user_nickname }
        let data = {
          user_id,
          user_phone,
          user_nickname,
          // 生成 token, 过期时间 1h
          token: jwt.sign(payload, config.USER.jwtSecret, { expiresIn: '1h' })
        }
        handleSuccess({ctx, result: data, message: '登录成功'})
      } else {
        handleError({ctx, message: '密码错误'})
      }
    }).catch(err => {
      handleError({ctx, message: '登录失败', err})
    })

  },
  // 删除用户
  deleteUser: async (ctx) => {
    let {user_phone} = ctx.request.body
    await User.deleteUser([user_phone]).then(async res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '删除用户成功', message: '删除用户成功'})
      }
    }).catch(err => {
      handleError({ctx, message: '删除用户失败', err})
    })
  },
  // 修改密码
  editPwd: async (ctx) => {
    let {user_phone, user_password} = ctx.request.body

    await User.editPwd([user_phone, md5(config.USER.pwdSalt + user_password)]).then(res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '密码修改成功', message: '密码修改成功'})
      }
    }).catch(err => {
      handleError({ctx, message: '密码修改失败', err})
    })
  },
  // 修改用户信息
  editUser: async (ctx) => {
    let {user_nickname, user_avatarUrl, user_phone} = ctx.request.body
    await User.editUser([user_nickname, user_avatarUrl, user_phone]).then(res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '修改用户成功', message: '修改用户成功'})
      }
    }).catch(err => {
      handleError({ctx, message: '修改用户失败', err})
    })
  },
  // 检查用户密码
  checkPwd: async (ctx) => {
    let {user_phone, user_password} = ctx.request.query
    await User.checkPwd([user_phone]).then(async res => {
      // 比较密码
      if (res[0].user_password === md5(config.USER.pwdSalt + user_password)) {
        handleSuccess({ctx, result: true, message: '原密码正确'})
      } else {
        handleError({ctx, result: false, message: '原密码错误'})
      }
    }).catch(err => {
      handleError({ctx, result: err, message: '获取用户密码错误'})
    })
  },
  // 获取用户信息
  getUserInfo: async (ctx) => {
    let {user_phone} = ctx.request.query
    await User.getUserInfo([user_phone]).then(async res => {
      handleSuccess({ctx, result: res[0], message: '获取用户信息成功'})
    }).catch(err => {
      handleError({ctx, result: err, message: '获取用户信息出错了'})
    })
  },
  // 获取用户列表
  getUserList: async (ctx) => {
    let { pagenum, pagesize, query } = ctx.request.query
    await User.getUserList([pagenum, pagesize, query]).then( res => {
      handleSuccess({ctx, result: res, message: '获取用户列表成功'})
    }).catch( err => {
      handleError({ctx, message: '获取用户列表失败', err})
    })
  }
}

module.exports = UserController
