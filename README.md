# One Movie

One Movie，一个类似豆瓣电影的网站，前台包含查看正在热映电影，热门电影，电影详情，写影评，点赞，踩和基本个人中心等功能，后台就是对所有这些功能的管理（增删改查），服务端做接口服务，数据库做数据持久化存储

### 这里面一共三个项目

#### onemovie文件夹下是网站的前台部分（Vue+ElementUI+Axios+OSS）

#### onemovie-admin文件夹下是网站的后台管理部分（[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)）

#### onemovie-server文件夹下是网站的服务端部分（Koa+MySQL+JWT）

#### onemovie.sql是项目的数据库结构和部分数据（MySQL）

### 下载：

```
git clone https://github.com/Logan-Wong/Vue-Koa-MySQL-OSS-ElementUI-JWT.git
```

### 使用：

1. 分别进入相应的文件夹下，安装依赖

   ```
   npm install
   ```

2. 运行

   1. 前台部分：

      ```
      npm run serve
      ```

   2. 后台部分：

      ```
      npm run dev
      ```

      Tips：前台和后台用的是vue-cli搭建，如果想用脚手架运行的话，在命令行输入 vue ui 开启 vue-cli（前提是你已经安装了Vue脚手架），然后选择对应的目录进行运行项目

   3. 服务端部分：运行之前先在你的本地数据库中创建一个名为onemovie的数据库，然后执行onemovie.sql文件，接着修改onemovie-server文件夹下config/index.js中的MYSQL字段，修改成你的数据库的相关信息

      ```
      npm run dev
      ```

3. 如此下来应该就能看到所有的项目效果了！欢迎 **star** 和 **fork**，谢谢~

### 效果图

1. 前台部分：

   1. 首页

      ![20210326171754](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326184046.png)

   2. 电影详情页

      ![image-20210326171915495](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326171915.png)

   3. 注册、登录

      ![image-20210326171940295](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326171940.png)

      ![image-20210326172044466](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326172044.png)

   4. 搜索电影

      ![20210326172131](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326184101.png)

   5. 购票

      ![20210326172318](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326184114.png)

      ![image-20210326172340214](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326172340.png)

      ![image-20210326172421957](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326172422.png)

      ![20210326172445](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326184125.png)

   6. 用户订单

      ![image-20210326172525728](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326172525.png)

   7. 用户信息

      ![image-20210326172545022](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326172545.png)

2. 后台部分：

   1. 用户管理

      ![image-20210326172700022](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326172700.png)

   2. 电影管理

      ![image-20210326172726248](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326172726.png)

   3. 放映管理

      ![image-20210326172759177](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326172759.png)

   4. 影院管理

      ![image-20210326172821131](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326172821.png)

   5. 分类管理

      ![image-20210326172842433](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326172842.png)

   6. 演职员管理

      ![image-20210326172903131](https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210326172903.png)

### 参考

- [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)
- [Koa2-nuxt-MySQL](https://github.com/CQBoyBrand/Koa2-nuxt-MySQL)
- [vue-koa-mongodb-oss](https://github.com/weirui88888/vue-koa-mongodb-oss)
- ....