<template>
	<div class="sub-wrap">
		<!-- 头部 -->
		<Header class="header"></Header>
    <!-- 正文内容 -->
    <div class="content">
      <!-- 左边主要信息 -->
      <div class="main" ref="main">
        <div class="title clearfix">
          <h1>{{ movieInfo.movie_name }}</h1>
          <h1 class="year">({{ movieInfo.movie_year }})</h1>
        </div>
        <div class="info">
          <div class="smallCover">
            <img :src="movieInfo.movie_smallCoverUrl" alt="">
          </div>
          <div class="details">
            <div>
              <span>导演：</span>
              <span>{{ movieInfo.movie_director }}</span>
            </div>
            <div>
              <span>编剧：</span>
              <span>{{ movieInfo.movie_screenwriter }}</span>
            </div>
            <div class="det-actor">
              <span>主演：</span>
              <span>{{ curActor }}<span @click="handleActor">{{ isAllAct ? '收起' : '展开...' }}</span></span>
            </div>
            <div>
              <span>类型：</span>
              <span>{{ movieInfo.movie_type }}</span>
            </div>
            <div>
              <span>制片国家/地区：</span>
              <span>{{ movieInfo.movie_country }}</span>
            </div>
            <div>
              <span>语言：</span>
              <span>{{ movieInfo.movie_language }}</span>
            </div>
            <div>
              <span>上映日期：</span>
              <span>{{ movieInfo.movie_releaseDate }}</span>
            </div>
            <div>
              <span>片长：</span>
              <span>{{ movieInfo.movie_duration }}</span>
            </div>
            <div>
              <span>又名：</span>
              <span>{{ movieInfo.movie_alias }}</span>
            </div>
            <div>
              <span>IMDb链接：</span>
              <span>
                <a :href="movieInfo.movie_IMDb" target="_blank">{{ imdb }}</a>
              </span>
            </div>
          </div>
        </div>
        <!-- 剧情简介 -->
        <div class="synopsis">
          <h2>{{ movieInfo.movie_name }}的剧情简介 ····</h2>
          <p>{{ movieInfo.movie_synopsis }}</p>
          <!-- <p>1912年4月10日，号称 “世界工业史上的奇迹”的豪华客轮泰坦尼克号开始了自己的处女航，从英国的南安普顿出发驶往美国纽约。富家少女罗丝（凯特•温丝莱特）与母亲及未婚夫卡尔坐上了头等舱；另一边，放荡不羁的少年画家杰克（莱昂纳多·迪卡普里奥）也在码头的一场赌博中赢得了下等舱的船票。</p>
          <p>罗丝厌倦了上流社会虚伪的生活，不愿嫁给卡尔，打算投海自尽，被杰克救起。很快，美丽活泼的罗丝与英俊开朗的杰克相爱，杰克带罗丝参加下等舱的舞会、为她画像，二人的感情逐渐升温。</p>
          <p>1912年4月14日，星期天晚上，一个风平浪静的夜晚。泰坦尼克号撞上了冰山，“永不沉没的”泰坦尼克号面临沉船的命运，罗丝和杰克刚萌芽的爱情也将经历生死的考验。</p> -->
        </div>
        <!-- 演职员 -->
        <div class="actor clearfix">
          <h2>{{ movieInfo.movie_name }}的演职员 ····</h2>
          <div class="more-box" @click="handleMore">
            <span>{{ isAllActor ? '收起' : '全部' }}</span>
            <i :class="isAllActor ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </div>
          <div class="actor-box">
            <div class="everyActor" v-for="(item, index) in showActors" :key="index">
              <div class="actorImg">
                <img :src="item.avatarUrl" alt="">
              </div>
              <div class="actorName">
                <span>{{ item.name }}</span>
              </div>
              <div class="actorRoleName">
                <span>{{ item.roleName }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 视频和图片 -->
        <!-- <div class="videoAndPic">
          <h2>{{ movieInfo.movie_name }}的视频和图片 ····</h2>
          <div class="vAp-box">
            <div class="trailer">
              <img src="../assets/trailer.png" alt="">
            </div>
            <div class="videoCom">
              <img src="../assets/videoCom.png" alt="">
            </div>
            <div class="pic1">
              <img src="../assets/pic1.png" alt="">
            </div>
            <div class="pic2">
              <img src="../assets/pic2.png" alt="">
            </div>
          </div>
        </div> -->
      </div>
      <!-- 右边评论 -->
      <div class="comment">
        <div class="comHeader clearfix">
          <h2>{{ movieInfo.movie_name }}的影评 ····</h2>
          <span v-if="comList.length > 0">共{{ comList.length }}条</span>
          <el-button type="warning" icon="el-icon-edit" size="small" @click="addCom">我要写影评</el-button>
        </div>
        <div v-if="comList.length > 0" class="com-box" ref="comBox">
          <div class="everyCom" v-for="(item, index) in comList" :key="index">
            <div class="userInfo">
              <img :src="item.user_avatarUrl" alt="">
              <span class="username">{{ item.user_nickname }}</span>
              <span class="comTime">{{ item.updateTime }}</span>
            </div>
            <div class="comTitle">
              <h2>{{ item.com_title }}</h2>
            </div>
            <div class="comContent">
              <p>{{ isDetailComList[index] ? detailComContentList[index] : item.com_content }}<span v-if="!isShorterThan180[index]" @click="handleCom(index)">{{ isDetailComList[index] ? '收起' : '展开...' }}</span></p>
            </div>
            <div class="likeOrNot clearfix">
              <div class="likeOrNot-box">
                <i class="iconfont like" :class="item.isCurUserLike === 1 ? 'iconthumb-up-o' : 'iconthumb-up'" @click="handleLike(item.isCurUserLike, item.com_id, index)"></i>
                <!-- <img class="like" src="../assets/thumb-up-o.png" alt=""> -->
                <span class="likeCount">{{ item.com_likeCount }}</span>
                <i class="iconfont unlike" :class="item.isCurUserLike === 2 ? 'iconthumb-up-o' : 'iconthumb-up'" @click="handleUnLike(item.isCurUserLike, item.com_id, index)"></i>
                <!-- <img class="unlike" src="../assets/thumb-up-o.png" alt=""> -->
                <span class="unlikeCount">{{ item.com_notLikeCount}}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="com-none">
          <i class="el-icon-warning"></i>
          <span>当前还没有影评，快去写一条吧~</span>
        </div>
      </div>
    </div>
		<!-- 底部 -->
    <Footer></Footer>
    <!-- 添加评论 弹框 -->
    <el-dialog title="添加评论" :visible.sync="addComDialogVisible">
      <el-form :model="addComObj" :rules="addComRules" ref="addComRef">
        <el-form-item label="评论标题" label-width="100px" prop="com_title">
          <el-input v-model="addComObj.com_title"></el-input>
        </el-form-item>
        <el-form-item label="评论内容" label-width="100px" prop="com_content">
          <el-input v-model="addComObj.com_content" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addComDialogVisible = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="addComDialogSure" size="medium">发 布</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import store from '../store'
import router from '../router'
import isLogin from '@/utils/checkLoginStatus'
import HttpMovie from '../api/movie'
import HttpActor from '../api/actor'
import HttpCom from '../api/comment'
import HttpLike from '../api/likeOrNot'

export default {
  name: 'Subject',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      movieInfo: {},
      curActor: '',
      imdb: '',
      // 导演的个数, 方便拼接饰演角色
      directorLen: 0,
      // 导演 主演 编剧
      actors: [],
      // 是否展示全部演职员
      isAllActor: false,
      showActors: [],
      comList: [],
      comCueryInfo: {
        size: 3
      },
      // 是否展示全部主演
      isAllAct: false,
      // 是否显示详细评论数组
      isDetailComList: [],
      // 详细评论内容数组
      detailComContentList: [],
      // 标记评论内容是否短于180的数组
      isShorterThan180: [],
      // 控制添加评论弹框是否显示
      addComDialogVisible: false,
      addComObj: {
        com_title: '',
        com_content: '',
        movie_id: this.$route.params.id,
        user_id: store.state.user.user_id
      },
      // 表单的验证规则对象
      addComRules: {
        // 验证评论标题
        com_title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        // 验证评论内容
        com_content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      // 单条评论信息
      comInfo: {}
    }
  },
  watch: {
    showActors(newVal, oldVal) {
      // console.log('newVal: ', newVal)
      // 处理完数据, 计算 main 容器的高度, 给到 com-box(记得减去 com-header 的高度 70px)
      // document.querySelector('.com-box').style.height = this.$refs.main.offsetHeight - 70 + 'px'
    },
    actors(newVal, oldVal) {
      // console.log('newactors: ', newVal)
    }
  },
  created() {
    this.getMovieDetail()
    this.getMovComList()
    // this.getLikeList()
  },
  updated() {
    this.getMainHeight()
  },
  methods: {
    // 获取电影详情
    async getMovieDetail() {
      await HttpMovie.getMovieInfo({ movie_id: this.$route.params.id }).then(res => {
        // console.log('res: ', res)
        if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
        this.movieInfo = res.result[0]
        // 获取小封面
        this.movieInfo.movie_smallCoverUrl = window.localStorage.getItem('movie_smallCoverUrl')
        // 主演分割成数组, 保存一份
        let directorArr = this.movieInfo.movie_director.split(',')
        this.directorLen = directorArr.length
        let actorArr = this.movieInfo.movie_actor.split(',')
        let writerArr = this.movieInfo.movie_screenwriter.split(',')
        // 拼接 导演,编剧,主演 等信息
        this.movieInfo.movie_director = this.movieInfo.movie_director.replace(/,/g, ' / ')
        this.movieInfo.movie_screenwriter = this.movieInfo.movie_screenwriter.replace(/,/g, ' / ')
        this.movieInfo.movie_actor = this.movieInfo.movie_actor.replace(/,/g, ' / ')
        this.curActor = this.movieInfo.movie_actor.split(' / ').slice(0, 15).join(' / ')
        this.movieInfo.movie_roleName = this.movieInfo.movie_roleName.split(',')
        this.movieInfo.movie_type = this.movieInfo.movie_type.replace(/,/g, ' / ')
        this.movieInfo.movie_country = this.movieInfo.movie_country.replace(/,/g, ' / ')
        this.movieInfo.movie_language = this.movieInfo.movie_language.replace(/,/g, ' / ')
        this.movieInfo.movie_releaseDate = this.movieInfo.movie_releaseDate.replace(/,/g, ' / ')
        this.movieInfo.movie_duration += '分钟'
        this.movieInfo.movie_alias = this.movieInfo.movie_alias.replace(/,/g, ' / ')
        let tmpArr = this.movieInfo.movie_IMDb.split('/')
        if (tmpArr[tmpArr.length - 1]) {
          this.imdb = tmpArr[tmpArr.length - 1]
        } else {
          this.imdb = tmpArr[tmpArr.length - 2]
        }
        // 调用函数获取演职员头像
        this.getActorImg([...directorArr, ...actorArr, ...writerArr])
        // console.log('this.actors: ', this.actors)
      })
    },
    // 获取演职员头像 名称 饰演角色
    async getActorImg(actorsArr) {
      for (let i = 0; i < actorsArr.length; i++) {
        let res = await HttpActor.getActorInfo({ actor_name: actorsArr[i] })
        // console.log('res: ', res)
        this.actors.push({})
        this.actors[i].name = res.result[0].actor_name
        if (this.directorLen > 0) {
          this.actors[i].roleName = '导演'
          this.directorLen--
        } else if (this.movieInfo.movie_roleName[i - (this.directorLen + 1)]) {
          this.actors[i].roleName = '饰 ' + this.movieInfo.movie_roleName[i - (this.directorLen + 1)]
        } else {
          this.actors[i].roleName = '编剧'
        }
        this.actors[i].avatarUrl = res.result[0].actor_avatarUrl
      }
      this.showActor()
    },
    // 获取电影评论列表
    async getMovComList() {
      const res = await HttpCom.getMovComList({ movie_id: this.$route.params.id })
      // console.log('res: ', res)
      this.comList = res.result
      // 原本的 comList 中的 com_content 字段存放简要内容，详细内容存在 detailComContentList 中
      for (let i = 0; i < this.comList.length; i++) {
        if (this.comList[i].com_content.length <= 180) this.isShorterThan180[i] = true
        this.detailComContentList[i] = this.comList[i].com_content
        this.comList[i].com_content = this.comList[i].com_content.slice(0, 150)
        // 添加一个属性，记录当前用户点赞或踩该评论
        // 0 没有操作 1 点赞了 2 踩了
        this.comList[i].isCurUserLike = 0
      }
      this.getLikeList()
      // this.isDetailComList = Array(this.comList.length).fill(false)
      // console.log('this.isDetailComList: ', this.isDetailComList)
    },
    // 获取评论点赞列表
    async getLikeList() {
      // console.log('store.state.user.user_id: ', store.state.user.user_id)
      // 只有用户登录了才发起请求
      if (store.state.user.user_id) {
        // console.log('this.comList: ', this.comList)
        for (let i = 0; i < this.comList.length; i++) {
          const res = await HttpLike.getLikeList({ com_id: this.comList[i].com_id })
          // 该条评论有用户点赞或踩
          if (res.result.length > 0) {
            // console.log('this.comList[i].com_id: ', this.comList[i].com_id)
            // console.log('likeres: ', res)
            for (const key of res.result) {
              // console.log('7899')
              // console.log('key.user_id: ', key.user_id)
              if (key.user_id === store.state.user.user_id - 0) {
                this.comList[i].isCurUserLike = key.like_flag ? 1 : 2
                // console.log('this.comList.indexOf(this.comList[i]): ', this.comList.indexOf(this.comList[i]))
                this.$set(this.comList, i, this.comList[i])
                break
              }
            }
            // console.log('this.comList[i] ', this.comList[i])
          }
        }
      }
    },
    // 获取评论信息
    async getComInfo(com_id) {
      const res = await HttpCom.getComInfo({ com_id })
      // console.log('res: ', res)
      if (res.code !== 1) return this.$message({ message: '发生错误，取消点赞失败！', type: 'error' })
      this.comInfo = res.result[0]
    },
    // 修改评论信息
    async editCom(isEditLike, isPlus, i) {
      // 当前需要修改点赞数量
      if (isEditLike) {
        // 当前需要 点赞数++
        if (isPlus) {
          this.comInfo.com_likeCount++
        } else {
          this.comInfo.com_likeCount--
        }
      } else {  // 当前需要修改踩数量
        // 当前需要 踩数++
        if (isPlus) {
          this.comInfo.com_notLikeCount++
        } else {
          this.comInfo.com_notLikeCount--
        }
      }
      console.log('this.comInfo: ', this.comInfo)
      const res = await HttpCom.editCom(this.comInfo)
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      // console.log('res: ', res)
      if (isEditLike) {
        this.comList[i].com_likeCount = this.comInfo.com_likeCount
      } else {
        this.comList[i].com_notLikeCount = this.comInfo.com_notLikeCount
      }
      this.$set(this.comList, i, this.comList[i])
    },
    // 点击点赞按钮 触发
    async handleLike(isCurUserLike, com_id, i) {
      // console.log('com_id: ', com_id)
      // 用户原先点赞了该评论
      if (isCurUserLike === 1) {
        // 删除该记录
        const res = await HttpLike.delLike({ data: { user_id: store.state.user.user_id - 0, com_id } })
        // console.log('res: ', res)
        if (res.code !== 1) return this.$message({ message: '发生错误，取消点赞失败！', type: 'error' })
        this.$message({ message: '已取消点赞~', type: 'success' })
        // 更新点赞数量
        await this.getComInfo(com_id)
        await this.editCom(true, false, i)
        // 不用重新调用 this.getLikeList()，只更新 this.comList 中特定的项就好了
        this.comList[i].isCurUserLike = 0
        this.$set(this.comList, i, this.comList[i])
      } else if (isCurUserLike === 2) { // 用户原先踩了该评论
        this.$message({ message: '您已踩过该评论，不可以再点赞！', type: 'warning' })
      } else {  // 用户原先没有操作过该评论
        // 添加一条记录
        const res = await HttpLike.addLike({
          like_flag: 1,
          user_id: store.state.user.user_id - 0,
          com_id
        })
        // console.log('res: ', res)
        if (res.code !== 1) return this.$message({ message: '发生错误，点赞失败！', type: 'error' })
        this.$message({ message: '已点赞~', type: 'success' })
        // 更新点赞数量
        await this.getComInfo(com_id)
        await this.editCom(true, true, i)
        // 不用重新调用 this.getLikeList()，只更新 this.comList 中特定的项就好了
        this.comList[i].isCurUserLike = 1
        this.$set(this.comList, i, this.comList[i])
        // this.getLikeList()
      }
    },
    // 点击踩按钮 触发
    async handleUnLike(isCurUserLike, com_id, i) {
      // 用户原先踩了该评论
      if (isCurUserLike === 2) {
        // 删除该记录
        const res = await HttpLike.delLike({ data: { user_id: store.state.user.user_id - 0, com_id } })
        // console.log('res: ', res)
        if (res.code !== 1) return this.$message({ message: '发生错误，取消踩失败！', type: 'error' })
        this.$message({ message: '已取消踩~', type: 'success' })
        // 更新点赞数量
        await this.getComInfo(com_id)
        await this.editCom(false, false, i)
        // 不用重新调用 this.getLikeList()，只更新 this.comList 中特定的项就好了
        this.comList[i].isCurUserLike = 0
        this.$set(this.comList, i, this.comList[i])
      } else if (isCurUserLike === 1) { // 用户原先点赞了该评论
        this.$message({ message: '您已点赞过该评论，不可以再踩！', type: 'warning' })
      } else {  // 用户原先没有操作过该评论
        // 添加一条记录
        const res = await HttpLike.addLike({
          like_flag: 0,
          user_id: store.state.user.user_id - 0,
          com_id
        })
        // console.log('res: ', res)
        if (res.code !== 1) return this.$message({ message: '发生错误，踩失败！', type: 'error' })
        this.$message({ message: '已踩~', type: 'success' })
        // 更新点赞数量
        await this.getComInfo(com_id)
        await this.editCom(false, true, i)
        // 不用重新调用 this.getLikeList()，只更新 this.comList 中特定的项就好了
        this.comList[i].isCurUserLike = 2
        this.$set(this.comList, i, this.comList[i])
        // this.getLikeList()
      }
    },
    // 展开收起主演 触发
    handleActor() {
      this.isAllAct = !this.isAllAct
      if (this.isAllAct) {
        this.curActor = this.movieInfo.movie_actor
      } else {
        this.curActor = this.movieInfo.movie_actor.split(' / ').slice(0, 15).join(' / ')
      }
    },
    // 展开收起评论 触发
    handleCom(i) {
      this.isDetailComList[i] = !this.isDetailComList[i]
      // 手动刷新 获取电影评论列表
      this.getMovComList()
    },
    // 处理要展示的演职员数据
    showActor() {
      this.showActors = this.isAllActor ? this.actors : this.actors.slice(0, 10)
    },
    // 点击 more 按钮 触发
    handleMore() {
      this.isAllActor = !this.isAllActor
      this.showActor()
    },
    // 按下 写影评 按钮
    addCom() {
      // 当前已登录
      if (isLogin()) {
        this.addComDialogVisible = true
      } else {
        this.$message({
          message: '登录后再写影评哦~',
          type: 'warning'
        })
        this.$router.push({
          path: '/login',
          // 添加一个重定向后缀，等登录以后再到这里来
          query: { redirect: router.currentRoute.fullPath }
        })
      }
    },
    // 点击添加评论弹框中的确定按钮
    addComDialogSure() {
      // 表单预检验
      this.$refs.addComRef.validate(async valid => {
        if (!valid) return
        const res = await HttpCom.addCom(this.addComObj)
        // // console.log(res)
        if (res.code !== 1) return this.$message.error({ message: res.message, type: 'error' })
        this.$message.success({ message: res.message, type: 'error' })
        // 让添加评论弹框隐藏
        this.addComDialogVisible = false
        // 清空表单
        this.$refs.addComRef.resetFields()
        this.getMovComList()
      })
    },
    // 获取 main 区域的高度，赋值给评论区域
    getMainHeight() {
      document.querySelector('.com-box').style.height = this.$refs.main.offsetHeight - 70 + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-wrap {
  position: relative;
	background-color: #f4f4f4;
  .header {
    position: fixed;
    z-index: 999;
    // margin-bottom: 44px;
  }
  .content {
    display: flex;
    width: 100%;
    // height: 1680px;
    padding-top: 64px;
    box-sizing: border-box;
    // border: 1px red solid;
    .main {
      width: 54%;
      height: 100%;
      padding: 0 0px 0px 80px;
      margin-top: 40px;
      margin-bottom: 30px;
      // border: 1px red solid;
      border-right: 1px #797979 solid;
      h1 {
        margin-top: 0;
      }
      h2 {
        color: #E50914;
      }
      .title {
        color: #494949;
        // border: 1px red solid;
        h1 {
          float: left;
          margin-right: 10px;
          font-size: 44px;
        }
        .year {
          color: #888;
        }
      }
      .info {
        display: flex;
        justify-content: space-between;
        // border: 1px black solid;
        // box-sizing: border-box;
        .smallCover {
          // 不缩小
          flex-shrink: 0;
          width: 210px;
          height: 300px;
          margin-right: 20px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .details {
          font-size: 21px;
          padding-right: 25px;
          // border: 1px red solid;
          span:nth-child(1) {
            color: #666;
          }
          span:nth-child(2) {
            color: #111;  // 文本主色调
            font-size: 19px;
          }
          .det-actor {
            // text-overflow: ellipsis;
            // // -webkit-text-overflow: ellipsis;
            // overflow: hidden;
            // display: -webkit-box;
            // -webkit-line-clamp: 2;
            // -webkit-box-orient: vertical;
            span:nth-child(2)>span {
              margin-left: 20px;
              font-size: 16px;
              color: #E50914;
              cursor: pointer;
            }
          }
          a {
            // font-size: 20px;
            // border: 1px black solid;
          }
          // 鼠标移动到链接上
          a:hover {
            background-color: #E50914;
          }
          // 鼠标点击时
          a:active {
            background-color: #E50914;
          }
        }
      }
      .synopsis {
        padding-right: 25px;
        margin-top: 30px;
        p {
          text-indent: 2em;
          font-size: 18px;
          margin: 5px;
          // border: 1px red solid;
        }
      }
      .actor {
        position: relative;
        padding-right: 25px;
        margin-top: 10px;
        .more-box {
          position: absolute;
          top: 25px;
          right: 20px;
          width: 55px;
          height: 24px;
          cursor: pointer;
          // background-color: pink;
          span {
            margin-right: 5px;
            color: #E50914;
          }
        }
        .actor-box {
          // display: flex;
          // justify-content: space-between;
          // flex-wrap: wrap;
          .everyActor {
            float: left;
            width: 140px;
            margin-right: 52px;
            .actorImg {
              width: 140px;
              height: 200px;
              // border: 1px red solid;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .actorName {
              width: 100%;
              margin-top: 10px;
              text-align: center;
              // border: 1px red solid;
              span {
                // 块状元素文字省略号显示才生效
                display: block;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                // -webkit-text-overflow: ellipsis;
              }
            }
            .actorRoleName {
              width: 100%;
              margin: 3px 0 10px 0;
              color: #9B9B9B;
              font-size: 15px;
              text-align: center;
              // border: 1px red solid;
              span {
                display: block;
                // width: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                -webkit-text-overflow: ellipsis;
                overflow: hidden;
              }
            }
          }
          .everyActor:nth-child(5n) {
            margin-right: 0;
          }
        }
      }
      .videoAndPic {
        margin-top: 10px;
        .vAp-box {
          .trailer,
          .videoCom {
            float: left;
            width: 270px;
            height: 144px;
            margin-right: 10px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .pic1,
          .pic2 {
            float: left;
            width: 144px;
            height: 144px;
            margin-right: 10px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
    .comment {
      position: relative;
      width: 45%;
      height: 100%;
      padding: 0 50px 30px 30px;
      margin-top: 40px;
      // border: 1px red solid;
      // border-left: 1px #797979 solid;
      .comHeader {
        position: relative;
        h2 {
          float: left;
          margin-right: 30px;
          color: #E50914;
        }
        span {
          position: absolute;
          float: left;
          top: 50%;
          // left: 266px;
          transform: translateY(-50%);
        }
        .el-button {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
        }
      }
      .com-box {
        height: 1100px;
        padding-right: 10px;
        overflow: auto;
        .everyCom {
          border-bottom: 1px #E6E6E6 solid;
          padding-bottom: 15px;
          margin-bottom: 15px;
          .userInfo {
            height: 30px;
            img {
              float: left;
              width: 30px;
              height: 30px;
            }
            span {
              float: left;
              line-height: 30px;
              font-size: 21px;
            }
            .username {
              margin-left: 15px;
            }
            .comTime {
              margin-left: 40px;
              font-size: 18px;
              color: #999;
            }
          }
          .comTitle {
            h2 {
              color: #111;
              font-size: 20px;
            }
          }
          .comContent {
            p {
              font-size: 18px;
              text-indent: 2em;
              // text-overflow: ellipsis;
              // overflow: hidden;
              // display: -webkit-box;
              // -webkit-line-clamp: 3;
              // -webkit-box-orient: vertical;
              span {
                margin-left: 20px;
                font-size: 16px;
                color: #E50914;
                cursor: pointer;
              }
            }
          }
          .likeOrNot {
            // position: relative;
            height: 18px;
            color: #E50914;
            .likeOrNot-box {
              float: right;
              // width: 160px;
              height: 100%;
              margin-right: 30px;
              // .iconyidongduan_dianzan {
              //   color: #E50914;
              // }
              .like {
                float: left;
                margin-right: 8px;
                cursor: pointer;
              }
              // .like {
              //   float: left;
              //   width: 16px;
              //   height: 16px;
              //   margin-right: 8px;
              // }
              .likeCount {
                float: left;
                line-height: 18px;
                margin-right: 25px;
              }
              .unlike {
                float: left;
                display: inline-block;
                transform: rotate(180deg);
                margin-right: 8px;
                cursor: pointer;
              }
              // .unlike {
              //   float: left;
              //   display: inline-block;
              //   width: 16px;
              //   height: 16px;
              //   line-height: 10px;
              //   transform: rotate(180deg);
              //   margin-right: 8px;
              // }
              .unlikeCount {
                float: left;
                line-height: 18px;
              }
            }
          }
        }
      }
      .com-none {
        position: absolute;
        top: 300px;
        left: 50%;
        transform: translateX(-50%);
        width: 257px;
        height: 24px;
        // background-color: pink;
        i {
          margin-right: 3px;
        }
      }
    }
  }
}
</style>
