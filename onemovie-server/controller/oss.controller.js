let OSS = require('ali-oss')
const STS = OSS.STS;
var config = require('../config/index.js')
const {handleSuccess, handleError} = require("../middlewears/handle")

// let client = new OSS({
//   bucket: config.OSS.bucket,
//   region: config.OSS.region,
//   accessKeyId: config.OSS.accessKeyID,
//   accessKeySecret: config.OSS.accessKeySecret
// })

const sts = new STS({
  accessKeyId: config.OSS.accessKeyID,
  accessKeySecret: config.OSS.accessKeySecret
})

const OssController = {
  // 获取 STS Token
  getCredential: async ctx => {
    try {
      // credentials 既是 STS Token
      const { credentials } = await sts.assumeRole(
        'acs:ram::1251413641173039:role/uploader',  // Role arn: 可以从 RAM 角色的详情页面获取
        null,         // Policy: 自定义的策略, 由于已经为角色添加了权限策略，所以可以传 null
        15 * 60,      // Expiration: STS Token 的过期时间, 应该在 15min ~ 60min 之间
        'web-client'  // Session name: 自定义的一个会话名称
      )
      handleSuccess({ctx, result: credentials, message: '获取 STS Token 成功'})
    } catch (err) {
      handleError({ctx, message: '获取 STS Token 失败', err})
    }
  }
}

module.exports = OssController
