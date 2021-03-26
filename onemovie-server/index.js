const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const jwt = require('jsonwebtoken')
const koaJwt = require('koa-jwt')
const config = require('./config/index')
const router = require('./routers')
const whitelistAPI = require('./routers/whitelistAPI')

const path = require('path')
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const cors = require('koa2-cors');

const app = new Koa()

// session 存储配置
const sessionMysqlConfig = {
  user: config.MYSQL.USERNAME,
  password: config.MYSQL.PASSWORD,
  database: config.MYSQL.DATABASE,
  host: config.MYSQL.HOST,
}

// 配置session中间件
// app.use(session({
//     key: 'USER_SID',
//     store: new MysqlStore(sessionMysqlConfig)
// }))

// middleware 1
app.use(bodyParser({
  formLimit: '1mb'
}))

// app.use(cors());

// middleware 2
app.use(async (ctx, next) => {
  // 拦截器
  const allowedOrigins = ['http://www.brandhuang.com', 'http://admin.brandhuang.com', 'https://www.brandhuang.com', 'https://admin.brandhuang.com', 'file://'];
  const origin = ctx.request.headers.origin || '';
  if (allowedOrigins.includes(origin) || origin.includes('localhost')) {
    ctx.set('Access-Control-Allow-Origin', origin);
  }
  ctx.set({
    'Access-Control-Allow-Headers': 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With, X-Token',
    'Access-Control-Allow-Methods': 'PUT,PATCH,POST,GET,DELETE,OPTIONS',
    'Access-Control-Max-Age': '1728000',
    'Content-Type': 'application/json;charset=utf-8'
  });

  // OPTIONS
  if (ctx.request.method == 'OPTIONS') {
    ctx.status = 200;
    return false;
  }

  if (Object.is(process.env.NODE_ENV, 'production')) {
    const { origin, referer } = ctx.request.headers;
    if (origin !== 'file://') {
      const originVerified = (!origin	|| origin.includes('brandhuang.com')) &&
      (!referer || referer.includes('brandhuang.com'))
      if (!originVerified) {
        ctx.throw(403, { code: 0, message: '身份验证失败！' })
        return false;
      };
    }
  }
  await next();
})

// const secret = config.USER.jwtSecret

// middleware 3, 验证 token 是否有效
app.use((ctx, next) => {
  if (ctx.header && ctx.header.authorization) {
    const parts = ctx.header.authorization.split(' ')
    if (parts.length === 2) {
      // 取出 token
      const scheme = parts[0]
      const token = parts[1]
      
      if (/^Bearer$/i.test(scheme)) {
        // jwt.verify 方法验证 token 是否有效
        // token 正确且在有效期内, decoded 保存着用户信息
        // token 错误或者已失效, decoded 为 undefined
        jwt.verify(token, config.USER.jwtSecret, (err, decoded) => {
          // console.log('decoded: ', decoded)
          if (err) {
            // token 过期, 生成新的 token
            // const { user_id, user_phone, user_nickname } = decoded     // decoded 保存着用户信息
            // const payload = { user_id, user_phone, user_nickname }
            // const newToken = jwt.sign(payload, config.USER.jwtSecret, { expiresIn: '1h' })
            // // 将新 token 放入 Authorization 中返回给前端
            // ctx.res.setHeader('Authorization', newToken)
          }
        })
      }
    }
  }
  return next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = 'token 已过期, 请重新登录!'
    } else {
      throw err
    }
  })
})

// app.use((ctx, next) => {
//   return next().catch((err) => {
//     if(err.status === 401){
//       ctx.status = 401;
//       ctx.body = 'token 已过期！，请重新登录';
//     }else{
//       throw err;
//     }
//   })
// })

// middleware 4
// 路由权限控制 除了path 里的路径不需要验证 token 其他都要
app.use(koaJwt({
  secret: config.USER.jwtSecret
}).unless({
  path: whitelistAPI
}))

// middleware 5 路由
app.use(router.routes(), router.allowedMethods())

app.listen(config.APP.PORT)

console.log(`listening on port ${config.APP.PORT}`)
