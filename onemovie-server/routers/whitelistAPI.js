const whitelistAPI = [
  /* 用户数据 */
  /register/,     // 注册
  /login/,        // 登陆
  /deluser/,      // 删除用户
  /edituser/,     // 修改用户
  /getuserinfo/,  // 获取用户信息
  /getuserlist/,  // 获取用户列表
  /* 电影数据 */
  /addmovie/,         // 添加电影
  /delmovie/,         // 删除电影
  /editmovie/,        // 修改电影
  /getmovielist/,     // 获取电影列表 - 详细信息
  /getmovlistsim/,    // 获取电影列表 - 简要信息
  /getsallmovlist/,   // 获取正在热映电影列表
  /getcatmovlist/,    // 获取分类电影列表 - 简要信息
  /getcatmovlistdet/, // 获取分类电影列表 - 详细信息
  /getmovinfo/,
  /* 分类数据 */
  /addcat/,     // 添加分类
  /delcat/,     // 删除分类
  /editcat/,    // 修改分类
  /getcatlist/, // 获取分类列表
  /getcatinfo/, // 获取分类信息
  /* 电影图片数据 */
  /addmovsmallcov/,   // 添加电影小封面
  /editmovsmallcov/,  // 修改电影小封面
  /getmovsmallcov/,   // 获取电影小封面
  /getmovbigcov/,     // 获取电影大封面
  /* 演职员数据 */
  /addact/,     // 添加演职员
  /delact/,     // 删除演职员
  /editact/,    // 修改演职员信息
  /getactinfo/, // 获取演职员信息
  /getactlist/, // 获取演职员列表
  /* 评论数据 */
  // /addcom/,      // 添加评论
  /delcom/,         // 删除评论
  /editcom/,        // 修改评论
  /getmovcomlist/,  // 获取电影评论列表
  /getusercomlist/, // 获取用户评论列表
  /* 座位数据 */
  /getseatinfo/,    // 获取座位信息
  /* 订单数据 */
  /addorder/,    // 添加订单
  /delorder/,    // 删除订单
  /getordlist/,    // 获取订单列表
  /* 上映数据 */
  /addselling/,    // 添加上映信息
  /delselling/,    // 删除上映信息
  /editselling/,    // 修改上映信息
  /getsellistback/,    // 获取上映列表
  /* 影院数据 */
  /addcin/,      // 添加影院
  /delcin/,         // 删除影院
  /editcin/,        // 修改影院
  /getcinlist/,    // 获取影院列表 - 详细信息
  /getcinlistsim/,    // 获取影院列表 - 简要信息
  /getcininfo/,    // 获取影院信息
  /* 管理员数据 */
  /adlogin/,        // 管理员登陆
  /getadinfo/,      // 获取管理员信息
  /* ali-oss 数据 */
  /ststoken/        // 获取 STS Token
]

module.exports =  whitelistAPI
