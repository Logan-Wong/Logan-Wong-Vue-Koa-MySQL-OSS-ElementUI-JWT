const Router = require('koa-router')
const config = require('../config/index')
const controller = require('../controller')

const router = new Router({ prefix: config.APP.ROOT_PATH })

/***********************前***台***管***理***相***关***API***********************/
router
.get('/', (ctx, next) => {
  ctx.response.body = config.INFO
})
/* 用户数据 */
.post('/register', controller.user.register)      // 前后 - 注册
.post('/login', controller.user.login)            // 前 - 登录
.delete('/deluser', controller.user.deleteUser)   // 后 - 删除用户
.put('/editpwd', controller.user.editPwd)         // 前后 - 修改密码
.put('/edituser', controller.user.editUser)       // 前后 - 修改用户
.get('/checkpwd', controller.user.checkPwd) // 前后 - 获取用户密码
.get('/getuserinfo', controller.user.getUserInfo) // 前后 - 获取用户信息
.get('/getuserlist', controller.user.getUserList) // 后 - 获取用户列表
/* 管理员数据 */
.post('/adlogin', controller.admin.login)         // 后 - 登陆
.get('/getadinfo', controller.admin.getAdminInfo) // 后 - 获取管理员信息
/* 电影数据 */
.post('/addmovie', controller.movie.addMovie)               // 后 - 添加电影
.delete('/delmovie', controller.movie.deleteMovie)          // 后 - 删除电影
.put('/editmovie', controller.movie.editMovie)              // 后 - 修改电影
.get('/getmovielist', controller.movie.getMovieList)        // 后 - 获取电影列表（按照评分降序排）- 详细信息
.get('/getmovlistsim', controller.movie.getMovListSimple)   // 前后 - 获取电影列表（按照评分降序排）- 简要信息
.get('/getsallmovlist', controller.movie.getSallMovieList)  // 前后 - 获取正在热映电影（按照评分降序排）
.get('/getcatmovlist', controller.movie.getCatMovList)      // 前 - 获取分类电影列表 - 简要信息
.get('/getcatmovlistdet', controller.movie.getCatMovListDetail) // 后 - 获取分类电影列表 - 详细信息
.get('/getmovinfo', controller.movie.getMovieInfo)          // 前 - 获取电影信息
/* 电影分类数据 */
.post('/addcat', controller.category.addCategory)         // 后 - 添加分类
.delete('/delcat', controller.category.deleteCategory)    // 后 - 删除分类
.put('/editcat', controller.category.editCategory)        // 后 - 修改分类
.get('/getcatlist', controller.category.getCategoryList)  // 前后 - 获取分类列表
.get('/getcatinfo', controller.category.getCategoryInfo)  // 后 - 获取分类信息
/* 电影分类关系 */
.post('/addmovcat', controller.movieCategory.addMovieCategory)  // server - 添加电影分类关系
/* 电影图片 */
.post('/addmovsmallcov', controller.movieImg.addMovSmallCov) // 后 - 添加电影小封面
.put('/editmovsmallcov', controller.movieImg.editMovieSmallCov) // 后 - 修改电影小封面
.get('/getmovsmallcov', controller.movieImg.getMovieSmallCov)   // 前后 - 获取电影小封面
.get('/getmovbigcov', controller.movieImg.getMovieBigCov)       // 前 - 获取电影大封面
/* 演职员数据 */
.post('/addact', controller.actor.addActor)         // 后 - 添加演职员
.delete('/delact', controller.actor.deleteActor)    // 后 - 删除演职员
.put('/editact', controller.actor.editActor)        // 后 - 修改演职员信息
.get('/getactinfo', controller.actor.getActorInfo)  // 前后 - 获取演职员信息
.get('/getactlist', controller.actor.getActorList)  // 前后 - 获取演职员信息
/* 评论数据 */
.post('/addcom', controller.comment.addCom)                 // 前 - 添加评论
.delete('/delcom', controller.comment.delCom)               // 后 - 删除评论
.put('/editcom', controller.comment.editCom)                // 前后 - 修改评论
.get('/getmovcomlist', controller.comment.getMovComList)    // 前后 - 获取电影评论列表
.get('/getusercomlist', controller.comment.getUserComList)  // 前后 - 获取用户评论列表
.get('/getcominfo', controller.comment.getComInfo)  // 前后 - 获取用户评论列表
/* 点赞或踩数据 */
.post('/addlike', controller.like.addLike)                 // 前 - 添加评论
.delete('/dellike', controller.like.delLike)               // 前 - 删除评论
.put('/editlike', controller.like.editLike)        // 前 - 修改点赞或踩
.get('/getlikelist', controller.like.getLikeList)   // 前 - 获取评论点赞列表
/* ali-oss */
.get('/ststoken', controller.oss.getCredential) // 前后 - 获取 STS Token
/* 影院数据 */
.post('/addcin', controller.cinema.addCinema)                 // 后 - 添加影院
.delete('/delcin', controller.cinema.deleteCinema)               // 后 - 删除影院
.put('/editcin', controller.cinema.editCinema)                // 后 - 修改影院
.get('/getcinlist', controller.cinema.getCinemaList)  // 获取影院列表 - 详细信息
.get('/getcinlistsim', controller.cinema.getCinemaListSim)  // 获取影院列表 - 简要信息
.get('/getcininfo', controller.cinema.getCinemaInfo)  // 获取影院信息
/* 上映数据 */
.post('/addselling', controller.selling.addSelling)  // 添加上映信息
.delete('/delselling', controller.selling.deleteSelling)  // 删除上映信息
.put('/editselling', controller.selling.editSelling)                // 后 - 修改影院
.get('/getsellist', controller.selling.getSelListFro)  // 前 - 获取上映列表
.get('/getsellistback', controller.selling.getSelListBack)  // 后 - 获取上映列表
/* 座位数据 */
.put('/editseat', controller.seat.editSeat)                // 前 - 修改座位信息
.get('/getseatinfo', controller.seat.getSeatInfo)  // 前后 - 获取座位信息
/* 订单数据 */
.post('/addorder', controller.order.addOrder)  // 添加订单
.delete('/delorder', controller.order.delOrder)  // 删除订单
.put('/editorder', controller.order.editOrder)  // 修改订单信息
.get('/getordlist', controller.order.getOrderList)  // 获取订单列表

module.exports = router
