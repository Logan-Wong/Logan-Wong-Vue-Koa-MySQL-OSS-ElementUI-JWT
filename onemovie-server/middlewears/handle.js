// 请求成功和失败统一处理
exports.handleSuccess = ({ ctx, message = '请求成功', result = null }) => {
  ctx.response.body = { code: 1, message, result }
}

exports.handleError = ({ ctx, message = '请求失败', err = null }) => {
  ctx.body = { code: 0, message, debug: err }
}
