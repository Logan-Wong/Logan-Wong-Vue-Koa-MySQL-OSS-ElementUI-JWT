<template>
  <div class="home-wrap">
    <!-- 头部 -->
    <Header class="header"></Header>
    <!-- 首页实体 -->
    <div class="content">
      <!-- 大封面区域 -->
      <div class="bigCover" @click="goSubject(curSallMovie.movie_id, curSallMovie.movieImg_url)">
        <div class="bigCover-info" @click.stop="">
          <!-- <div class="halfOpacity"></div> -->
          <h1>{{ curSallMovie.movie_name }}</h1>
          <span>{{ curSallMovie.movie_actor }}</span>
        </div>
        <div class="select-seat">
          <el-button @click.stop="buyticket(curSallMovie.movie_id, curSallMovie.movieImg_url)">选座购票</el-button>
        </div>
        <div class="mohu"></div>
      </div>
      <!-- 正在热映 -->
      <div class="salling">
        <h1>正在热映</h1>
        <div class="salling-box">
          <div class="left-hidden-box" @click="toPrePage" @mouseover="handleLeftMouseover" @mouseout="handleLeftMouseout">
            <div class="img-box">
              <img :class="mouseoverLeft ? 'img-filter' : ''" src="https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210301204650.png" alt="">
            </div>
            <i class="el-icon-arrow-left"></i>
          </div>
          <div class="movie-box" v-for="item in sallMovieList" :key="item.movie_id">
            <div class="cover" @click="goSubject(item.movie_id, item.movieImg_url)">
              <img :src="item.movieImg_url" alt="">
            </div>
            <div class="movieTitle">
              <h2>{{ item.movie_name }}</h2>
            </div>
            <div class="movieActions">
              <span>{{ item.actorThree }}</span>
            </div>
            <div class="movieSelSeat">
              <el-button @click.stop="buyticket(item.movie_id, item.movieImg_url)">选座购票</el-button>
            </div>
          </div>
          <div class="right-hidden-box" @click="toNextPage" @mouseover="handleRightMouseover" @mouseout="handleRightMouseout">
            <div class="img-box">
              <img :class="mouseoverRight ? 'img-filter' : ''" src="https://onemovie-img.oss-cn-guangzhou.aliyuncs.com/img/20210301204744.png" alt="">
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
      <!-- 热门电影 -->
      <div class="hotMovie">
        <h1>热门电影</h1>
        <div class="hot-box">
          <div class="movie-box" v-for="item in hotMovieList" :key="item.movie_id">
            <div class="cover" @click="goSubject(item.movie_id, item.movieImg_url)">
              <img :src="item.movieImg_url" alt="">
            </div>
            <div class="movieTitle">
              <h3>{{ item.movie_name }}</h3>
            </div>
          </div>
        </div>
        <!-- 底下分页按钮 -->
        <div class="hotFooter">
          <el-pagination
            layout="prev, pager, next"
            :total="hotTotal"
            :current-page="hotQueryInfo.pagenum"
            :page-size="hotQueryInfo.pagesize"
            @current-change="handleCurrentChange"
            background>
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <Footer></Footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import HttpMovie from '../api/movie'
import HttpMovieImg from '../api/movieImg'
// import loadBMap from '../utils/loadBMap.js'
import isLogin from '@/utils/checkLoginStatus'
// import config from '../config/index'
// import router from '../router'
// import BMap from 'BMap'

export default {
  name: 'Home',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      sallMovieList: [],
      sallQueryInfo: {
        query: '',
        // 当前页
        pagenum: 1,
        // 一页展示数据条数
        pagesize: 7
      },
      sallTotal: 0,
      curSallMovie: {},
      allSallMovie: [],
      // 单独设置左右边页数，用于渲染正在热映电影的上下页按钮背景图
      leftPagenum: 1,
      rightPagenum: 1,
      hotMovieList: [],
      hotQueryInfo: {
        query: '',
        // 当前页
        pagenum: 1,
        // 一页展示数据条数
        pagesize: 16
      },
      hotTotal: 0,
      mouseoverLeft: false,
      mouseoverRight: false
    }
  },
  created() {
    this.getSallMovieList()
    this.getBigCover()
    this.getHotMovieList()
    // this.getCurPosition()
  },
  async mounted() {
    // await loadBMap(config.BAIDU.ak)
    // await this.getCurPosition()
  },
  methods: {
    // 获取正在热映电影列表
    async getSallMovieList() {
      let res = await HttpMovie.getSallMovieList(this.sallQueryInfo)
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      this.sallMovieList = res.result[0]
      this.sallTotal = res.result[1][0].total

      for (let item of this.sallMovieList) {
        // 拼接电影主演
        let tmpArr = item.movie_actor.split(',')
        item.actorThree = tmpArr[0] + ' / ' + tmpArr[1] + ' / ' + tmpArr[2]
      }

      // 当前是第一页
      if (this.sallQueryInfo.pagenum === 1) {
        this.leftPagenum = Math.ceil(this.sallTotal / this.sallQueryInfo.pagesize) + 1
      }
      // 上一页：(this.leftPagenum - 1) * 7
      document.querySelector('.left-hidden-box img').setAttribute('src', this.allSallMovie[(this.leftPagenum - 1) * 7 - 1].movieImg_url)

      // 当前是最后一页
      if (this.sallQueryInfo.pagenum === Math.ceil(this.sallTotal / this.sallQueryInfo.pagesize)) {
        this.rightPagenum = 0
      }
      // 下一页：this.rightPagenum * 7 + 1
      document.querySelector('.right-hidden-box img').setAttribute('src', this.allSallMovie[this.rightPagenum * 7 + 1 - 1].movieImg_url)
    },
    // 获取大封面
    // 1. 先获取全部正在热映电影，随机取一部，数据保存到 curSallMovie
    // 2. 再根据电影名称获取对应的大封面
    async getBigCover() {
      let resMov = await HttpMovie.getSallMovieList({ query: '', pagenum: 1, pagesize: 28 })
      if (resMov.code !== 1) return this.$message({ message: '获取全部正在热映电影失败！', type: 'error' })
      this.allSallMovie = resMov.result[0]

      // 生成 0 到 total 之间的随机数
      let tmpNumZeroToTotal = parseInt(Math.random() * (resMov.result[1][0].total - 0 + 1) + 0, 10)
      // 随机取一部电影
      this.curSallMovie = this.allSallMovie[tmpNumZeroToTotal]
      // 构造只有四位主演的数据（用于渲染）
      let tmpArr = this.curSallMovie.movie_actor.split(',')
      this.curSallMovie.movie_actor = tmpArr[0] + ' / ' + tmpArr[1] + ' / ' + tmpArr[2] + ' / ' + tmpArr[3]

      let resCov = await HttpMovieImg.getMovieBigCov({ movie_name: this.curSallMovie.movie_name })
      if (resCov.code !== 1) return this.$message({ message: resCov.message, type: 'error' })

      // 生成 0 到 2 之间的随机数
      let tmpNumZeroToTwo = parseInt(Math.random() * (2 - 0 + 1) + 0, 10)
      this.curSallMovie.movie_bigCov = resCov.result[tmpNumZeroToTwo].movieImg_url
      // 渲染大封面做背景图
      document.querySelector('.bigCover').style.backgroundImage = 'url(' + this.curSallMovie.movie_bigCov + ')'
    },
    // 获取热门电影列表
    async getHotMovieList() {
      let res = await HttpMovie.getHotMovieList(this.hotQueryInfo)
      // console.log('res: ', res)
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      this.hotMovieList = res.result[0]
      this.hotTotal = res.result[1][0].total
    },
    // 获取当前地址
    async getCurPosition() {
      // 先清空原先的位置信息
      this.$store.commit('REMOVE_DISTRICT')
      const that = this
      let geolocation = new window.BMap.Geolocation()
      await geolocation.getCurrentPosition(function(posRes) {
        // console.log('posRes: ', posRes)
        if (this.getStatus() !== 'BMAP_STATUS_SUCCESS') {
          // let mk = new BMap.Marker(r.point)
          // 调用百度地图经纬度解码器，解析出详细地址
          let gc = new window.BMap.Geocoder()
          gc.getLocation(posRes.point, function(locRes) {
            let addComp = locRes.addressComponents
            let detailAddr = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
            console.log('detailAddr: ', detailAddr)

            that.$store.commit('SET_DISTRICT', addComp.district)
          })
        }
      })
      // console.log('852')
      // if (!flag) this.$message({ message: '地址获取失败：' + this.getStatus(), type: 'error' })
    },
    // 鼠标经过正在热映电影上一页按钮
    handleLeftMouseover() {
      // console.log('555')
      this.mouseoverLeft = true
    },
    // 鼠标离开正在热映电影上一页按钮
    handleLeftMouseout() {
      this.mouseoverLeft = false
    },
    // 鼠标经过正在热映电影下一页按钮
    handleRightMouseover() {
      // console.log('555')
      this.mouseoverRight = true
    },
    // 鼠标离开正在热映电影下一页按钮
    handleRightMouseout() {
      this.mouseoverRight = false
    },
    // 正在热映电影 上一页
    toPrePage() {
      if (--this.sallQueryInfo.pagenum < 1) {
        this.sallQueryInfo.pagenum = Math.ceil(this.sallTotal / this.sallQueryInfo.pagesize)
      }
      if (--this.leftPagenum < 1) {
        this.leftPagenum = Math.ceil(this.sallTotal / this.sallQueryInfo.pagesize)
      }
      this.getSallMovieList()
    },
    // 正在热映电影 下一页
    toNextPage() {
      // console.log('this.sallTotal: ', this.sallTotal)
      if (++this.sallQueryInfo.pagenum > Math.ceil(this.sallTotal / this.sallQueryInfo.pagesize)) {
        this.sallQueryInfo.pagenum = 1
      }
      if (++this.rightPagenum > Math.ceil(this.sallTotal / this.sallQueryInfo.pagesize)) {
        this.rightPagenum = 1
      }
      this.getSallMovieList()
    },
    // 当前页码改变 触发
    handleCurrentChange(val) {
      this.hotQueryInfo.pagenum = val
      this.getHotMovieList()
    },
    goSubject(id, movie_smallCoverUrl) {
      // console.log('id: ', id)
      window.localStorage.setItem('movie_smallCoverUrl', movie_smallCoverUrl)
      // 跳转到电影详情页
      this.$router.push({ name: 'subject', params: { id } })
    },
    // 跳转到选座购票页
    buyticket(id, movie_smallCoverUrl) {
      // console.log('id: ', id)
      // 当前已登录
      if (isLogin()) {
        window.localStorage.setItem('movie_smallCoverUrl', movie_smallCoverUrl)
        // 跳转到买电影票页
        this.$router.push({ name: 'buyticket', params: { id } })
      } else {
        this.$message({
          message: '登录后再选座购票哦~',
          type: 'warning'
        })
        this.$router.push({
          path: '/login',
          // 添加一个重定向后缀，等登录以后再到这里来
          query: { redirect: '/buyTicket' }
          // query: { redirect: router.currentRoute.fullPath }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-wrap {
  background-color: #f4f4f4;
  .header {
    position: fixed;
    z-index: 999;
  }
  .content {
    position: relative;
    width: 100%;
    height: 2140px;
    .bigCover {
      position: relative;
      width: 100%;
      height: 1080px;
      background: no-repeat;
      // background: url('../assets/bigCover.png') no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
      .bigCover-info {
        position: absolute;
        top: 380px;
        left: 80px;
        // width: 450px;
        height: 180px;
        padding: 0 30px 0 20px;
        color: #fff;
        border-radius: 5px;
        cursor: auto;
        background: rgba($color: #797979, $alpha: .7);
        h1 {
          font-size: 46px;
        }
        span {
          font-size: 25px;
        }
      }
      .select-seat {
        position: absolute;
        top: 600px;
        left: 80px;
        .el-button {
          width: 275px;
          height: 65px;
          border: none;
          color: #fff;
          font-size: 30px;
          background-color: #E50914; // 主色调
        }
      }
      .mohu {
        position: absolute;
        top: 760px;
        width: 100%;
        height: 320px;
        background-color: rgba(255, 255, 255, 0.3);
        // 渐变色
        // background-image: linear-gradient(to top , #f4f4f4, skyblue);
        // 毛玻璃
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
    }
    .salling {
      position: absolute;
      top: 760px;
      left: 0;
      h1 {
        margin-left: 80px;
        color: #fff;
      }
      .salling-box {
        position: relative;
        margin-left: 80px;
        height: 480px;
        // *:nth-child(7) {
        //   margin-right: 0;
        // }
        .left-hidden-box,
        .right-hidden-box {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          height: 350px;
          color: #fff;
          font-size: 50px;
          cursor: pointer;
          overflow: hidden;
          // background-color: pink;
          .img-box {
            position: absolute;
            top: 0;
            width: 250px;
            height: 350px;
            img {
              width: 100%;
              height: 100%;
              filter: blur(2px);
            }
            .img-filter {
              filter: blur(4px);
            }
          }
          i {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          &:hover {
            // background-color: lightblue;
            background: rgba(20, 20, 20,.5);
          }
        }
        .left-hidden-box {
          left: -80px;
          width: 75px;
          border-radius: 0 5px 5px 0;
          .img-box {
            right: 0;
          }
        }
        .right-hidden-box {
          right: -73px;
          width: 85px;
          border-radius: 5px 0 0 5px;
          .img-box {
            left: 0;
          }
        }
        .movie-box {
          float: left;
          position: relative;
          width: 234px;
          height: 480px;
          padding-top: 10px;
          margin-right: 16px;
          border-radius: 5px;
          background: rgba($color: #797979, $alpha: .7);
          .cover {
            position: absolute;
            top: 10px;
            left: 50%;
            width: 214px;
            height: 320px;
            transform: translateX(-50%);
            border-radius: 5px;
            overflow: hidden;
            cursor: pointer;
            // margin-left: 10px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .movieTitle {
            position: absolute;
            top: 320px;
            left: 50%;
            width: 240px;
            transform: translateX(-50%);
            text-align: center;
            color: #fff;
            h2 {
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              -webkit-text-overflow: ellipsis;
              overflow: hidden;
            }
          }
          .movieActions {
            position: absolute;
            top: 385px;
            left: 50%;
            width: 240px;
            transform: translateX(-50%);
            text-align: center;
            color: #fff;
            font-size: 18px;
            span {
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              -webkit-text-overflow: ellipsis;
              overflow: hidden;
            }
          }
          .movieSelSeat {
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            .el-button {
              width: 190px;
              height: 55px;
              border: none;
              color: #fff;
              font-size: 24px;
              background-color: #E50914; // 主色调
            }
          }
        }
      }
    }
    .hotMovie {
      position: absolute;
      top: 1360px;
      left: 0;
      padding-bottom: 60px;
      // border: 1px red solid;
      h1 {
        margin-left: 80px;
        color: #333;
      }
      .hot-box {
        margin-left: 80px;
        .movie-box {
          float: left;
          position: relative;
          width: 180px;
          // width: 234px;
          height: 286px;
          // height: 388px;
          padding-top: 10px;
          margin-right: 36px;
          // margin-right: 60px;
          margin-bottom: 20px;
          border-radius: 5px;
          background: rgba($color: #797979, $alpha: .7);
          .cover {
            position: absolute;
            top: 10px;
            left: 50%;
            width: 160px;
            // width: 214px;
            height: 240px;
            // height: 320px;
            transform: translateX(-50%);
            border-radius: 5px;
            overflow: hidden;
            cursor: pointer;
            // margin-left: 10px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .movieTitle {
            position: absolute;
            top: 240px;
            // top: 320px;
            left: 50%;
            width: 240px;
            transform: translateX(-50%);
            text-align: center;
            color: #fff;
            h3 {
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              -webkit-text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
      }
      .hotFooter {
        position: absolute;
        bottom: 0px;
        left: 50%;
        width: 530px;
        height: 60px;
        transform: translateX(-50%);
        // border: 1px red solid;
        .el-pagination {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          // color: #E50914;
        }
        // .left {
        //   position: absolute;
        //   top: 50%;
        //   left: 0;
        //   width: 18px;
        //   height: 22px;
        //   transform: translateY(-50%);
        //   // border: 1px red solid;
        //   i {
        //     color: #E50914;
        //     font-weight: bold;
        //   }
        // }
        // .center {
        //   position: absolute;
        //   top: 50%;
        //   left: 50%;
        //   width: 97px;
        //   height: 11px;
        //   transform: translate(-50%, -50%);
        //   // border: 1px red solid;
        //   .radiusPoint {
        //     float: left;
        //     width: 10px;
        //     height: 10px;
        //     margin-right: 5px;
        //     border: 1px #E50914 solid;  // 主色调
        //     border-radius: 50%;
        //     // background-color: #E50914;  // 主色调
        //   }
        //   .radiusPoint:nth-child(1) {
        //     background-color: #E50914;  // 主色调
        //   }
        //   .radiusPoint:nth-child(6) {
        //     margin-right: 0;
        //   }
        // }
        // .right {
        //   position: absolute;
        //   top: 50%;
        //   right: 0;
        //   width: 18px;
        //   height: 22px;
        //   transform: translateY(-50%);
        //   // border: 1px red solid;
        //   i {
        //     color: #E50914;
        //     font-weight: bold;
        //   }
        // }
      }
    }
  }
}
</style>
<style>
/* // 设置鼠标经过时的样式 */
.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #E50914;
}
/* // 进行修改选中项背景色 */
/* // 注意：不能写在 scoped 中 */
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #E50914;
  color: #fff;
}
/* // .el-pagination button:hover {
//   color: #E50914;
// } */
</style>
