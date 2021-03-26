<template>
  <div class="header-wrap" :class="isFullSearch ? 'bg1a1a1a' : 'bg333'">
    <!-- 常规 header 部分 -->
    <div v-if="!isFullSearch && !isFullLocation">
      <!-- logo区域 -->
      <div class="logo">
        <span @click="goIndex">ONEMOVIE</span>
      </div>
      <!-- 分类区域 -->
      <div class="category">
        <ul>
          <li v-for="item in firstSixCat" :key="item.cat_id" @click="goCategory(item.cat_id, item.cat_name)">{{ item.cat_name }}</li>
          <!-- <li>更多分类</li> -->
          <li>
            <el-select v-model="selectedCatItem" placeholder="更多分类" @change="selectedCat">
              <el-option
                v-for="item in backCat"
                :key="item.cat_id"
                :label="item.cat_name"
                :value="item">
              </el-option>
            </el-select>
          </li>
        </ul>
      </div>
      <!-- search-location-user_center区域 -->
      <div class="info">
        <div class="search">
          <i class="el-icon-search" @click="handleSearch"></i>
        </div>
        <div class="location">
          <i class="el-icon-location" @click="handleLocation"></i>
          <span v-if="district" @click="handleLocation">{{ district }}</span>
        </div>
        <div class="user_center">
          <el-dropdown @visible-change="handleVisibleChange($event)" @command="handleUserCommand" class="user-dropdown" trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-s-custom"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="user-dropdown-menu" style="padding: 10px 15px; transform-origin: left left;min-width: 245px;">
              <el-dropdown-item icon="el-icon-chat-line-square" command="com"> 影评 </el-dropdown-item>
              <el-dropdown-item divided icon="el-icon-s-goods" command="order"> 订单 </el-dropdown-item>
              <el-dropdown-item divided icon="el-icon-setting" command="center"> 账户 </el-dropdown-item>
              <el-dropdown-item divided icon="el-icon-user-solid" command="login"> {{ user_nickname ? '注销 ' + user_nickname : '登录' }} </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- 点击搜索图标触发的搜索框和下拉框 -->
    <div v-else-if="isFullSearch && !isFullLocation" class="fullSearch">
      <el-input
        ref="input"
        placeholder="请输入电影名称"
        prefix-icon="el-icon-search"
        @input="searchDebounce($event)"
        @blur="searchBlur"
        @keyup.esc.native="isFullSearch=false"
        v-model="queryInfo.query">
      </el-input>
      <i class="el-icon-close" @click="handleClose"></i>
      <!-- 控制整个 dropdown-box 是否显示是个难点！ -->
      <div class="dropdown-box" v-if="!queryInfo.query || !isDebounce || movieList.length > 0">
        <div class="fast-box">
          <svg  width="44" height="13">
            <text font-size="11" x="0" y="1em" fill="#6e6e73">快速链接</text>
          </svg>
          <div class="fastItem">
            <ul @click="handleFastLiClick" @mouseover="handleFastLiMouseover" @mouseout="handleFastLiMouseout">
              <li :data-index="1" :data-id="4">你好，李焕英<span :data-index="1"  :data-id="4">(2021)</span></li>
              <li :data-index="2" :data-id="5">唐人街探案3<span :data-index="2" :data-id="5">(2021)</span></li>
              <li :data-index="3" :data-id="6">送你一朵小红花<span :data-index="3" :data-id="6">(2020)</span></li>
              <li :data-index="4" :data-id="2">中国机长<span :data-index="4" :data-id="2">(2019)</span></li>
              <li :data-index="5" :data-id="1">紧急救援<span :data-index="5" :data-id="1">(2020)</span></li>
            </ul>
          </div>
        </div>
        <div class="search-res-box" v-if="movieList.length > 0">
          <svg  width="44" height="13">
            <text font-size="11" x="0" y="1em" fill="#6e6e73">搜索结果建议</text>
          </svg>
          <div class="searchItem">
            <ul  @click="handleSearchLiClick" @mouseover="handleSearchLiMouseover" @mouseout="handleSearchLiMouseout">
              <li v-for="(item, index) in movieList" :key="item.movie_id" :data-index="index">
                <i class="el-icon-search" style="margin-right: 8px;"></i>
                {{ item.movie_name }}
                <span :data-index="index">({{ item.movie_year }})</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 点击定位图标触发的地址选择器 -->
    <div v-else class="fullLocation" @keyup.esc.native="isFullLocation=false">
      <area-select v-model="selectedAreaList" :level="2" :disableLinkage="true" :data="pcaa" type="all" size="large"></area-select>
      <el-button type="primary" size="mini" @click="handleAreaSure">确定</el-button>
    </div>
  </div>
</template>

<script>
import isLogin from '@/utils/checkLoginStatus'
import debounce from '@/utils/debounce'
import HttpUser from '../api/user'
import HttpMovie from '../api/movie'
import HttpMovieImg from '../api/movieImg'
import HttpCat from '../api/category'
import store from '../store'
// 引入地区数据
import { pcaa } from 'area-data'

export default {
  name: 'Header',
  data() {
    return {
      user_nickname: '',
      // 是否全栏展示搜索
      isFullSearch: false,
      queryInfo: {
        query: '',
        pagenum: 1,   // 只展示一页
        pagesize: 5   // 只展示 5 条数据
      },
      movieList: [],
      // 当前是否在防抖
      isDebounce: false,
      // 前六个分类列表
      firstSixCat: [],
      // 剩下的所有
      backCat: [],
      // Select 选择器中选中的分类项
      selectedCatItem: '',
      // 当前设备的县(区、市)
      district: '',
      // 地址选择器中已选择的数据
      selectedAreaList: [],
      // 是否全栏展示地址选择器
      isFullLocation: false,
      pcaa
    }
  },
  created () {
    this.getCatList()
    this.getDistrict()
    // 按下 Esc 隐藏地址选择器
    document.onkeydown = evt => {
      evt = evt || window.event
      if (evt.keyCode === 27) {
        this.isFullLocation = false
      }
    }
    // document.onkeydown = (e) => {
    //   let key = window.event.keyCode
    //   if (key === 27) this.isFullSearch = false
    // }
  },
  watch: {
    // 需要监听对象中的属性时，用字符串来表示对象的属性调用
    'queryInfo.query'(newVal) {
      // 每当清空了 input 框的内容，重置一下 isDebounce
      if (!newVal) {
        this.isDebounce = false
      }
    },
    // 当 Vuex 中的 district 发生变化时，更新 this.district
    '$store.state.district'(newVal) {
      console.log('newVal: ', newVal)
      // this.district = this.$store.state.district
    }
  },
  methods: {
    // 回到首页
    goIndex() {
      this.$router.push({
        path: '/'
      })
    },
    // 获取分类列表
    async getCatList() {
      const res = await HttpCat.getCatList()
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      this.firstSixCat = res.result.slice(0, 6)
      this.backCat = res.result.slice(6)
    },
    // 点击一个分类 触发
    goCategory(id, cat_name) {
      this.$store.commit('SET_CAT_ID', id)
      this.$store.commit('SET_CAT_NAME', cat_name)
      // 刷新当前页面
      this.$router.push({ name: 'category', params: { id, cat_name } })
      // location.reload()
    },
    // 获取地区信息
    getDistrict() {
      this.district = this.$store.state.district
    },
    // Select 选择器中有分类被选中了
    selectedCat() {
      this.goCategory(this.selectedCatItem.cat_id, this.selectedCatItem.cat_name)
    },
    // 鼠标点击个人中心图标 触发
    handleVisibleChange(flag) {
      // 触发了下拉菜单
      if (flag) {
        // 当前已登录
        if (isLogin()) {
          this.user_nickname = store.state.user.user_nickname.slice(0, 10)
          if (store.state.user.user_nickname.length > 6) this.user_nickname += '...'
        } else {
          this.user_nickname = ''
        }
      }
    },
    // 点击下拉菜单中任一 item 触发
    handleUserCommand(command) {
      // 如果当前未登录, 跳转到登录
      if (command !== 'login') {
        var tmpRedirect = ''
        if (command === 'com') {
          tmpRedirect = '/comment'
        } else if (command === 'order') {
          tmpRedirect = '/order'
        } else if (command === 'center') {
          tmpRedirect = '/account'
        }
      }
      if (!this.user_nickname) {
        return this.$router.push({
          path: '/login',
          // 添加一个重定向后缀，等登录以后再到这里来
          query: { redirect: tmpRedirect }
        })
      }
      switch (command) {
        case 'com':
          // 跳转到个人影评
          this.$router.push({
            path: '/comment'
          })
          break
        case 'order':
          // 跳转到个人订单
          this.$router.push({
            path: '/order'
          })
          break
        case 'center':
          // 跳转到个人账号
          this.$router.push({
            path: '/account'
          })
          break
        case 'login':
          // 当前已登录, 注销
          HttpUser.logout()
          this.$message({
            message: '注销成功~',
            type: 'warning'
          })
          break
        default:
          break
      }
    },
    // 点击搜索图标 触发
    handleSearch() {
      // 隐藏其他内容
      this.isFullSearch = true
      // 清空 movieList
      this.movieList = []
      // 输入框自动聚焦
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    // 点击关闭搜索框图标
    handleClose() {
      // 展示其他内容
      this.isFullSearch = false
      // 清空数据框
      this.queryInfo.query = ''
    },
    // input 防抖 触发
    searchDebounce(E) {
      debounce(async () => {
        if (E.trim()) {
          this.queryInfo.query = E.trim()
          let res = await HttpMovie.getHotMovieList(this.queryInfo)
          if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
          // console.log(res)
          this.movieList = res.result[0]
          // 进入防抖
          this.isDebounce = true
        } else {
          this.movieList = []
        }
      }, 1000)
    },
    // 点击快速链接 li 触发
    async handleFastLiClick(e) {
      // 要过滤掉ul，不然会出问题
      if (e.target.nodeName.toLowerCase() === 'li') {
        // 先获取小封面，保存到 localStorage
        const res = await HttpMovieImg.getMovieSmallCov({ movie_name: e.target.innerHTML.split('<span')[0] })
        if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
        window.localStorage.setItem('movie_smallCoverUrl', res.result[0].movieImg_url)
      } else if (e.target.nodeName.toLowerCase() === 'span') {
        // 先获取小封面，保存到 localStorage
        const res = await HttpMovieImg.getMovieSmallCov({ movie_name: e.target.parentNode.innerHTML.split('<span')[0] })
        if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
        window.localStorage.setItem('movie_smallCoverUrl', res.result[0].movieImg_url)
      }
      const id = parseInt(e.target.dataset.id)
      // 跳转到电影详情页
      this.$router.push({ name: 'subject', params: { id } })
    },
    // 点击搜索结果建议 li 触发
    async handleSearchLiClick(e) {
      // 要过滤掉ul，不然会出问题
      if (e.target.nodeName.toLowerCase() === 'li' || e.target.nodeName.toLowerCase() === 'span') {
        const index = parseInt(e.target.dataset.index)
        // 跳转到电影详情页（先获取小封面，保存到 localStorage）
        const res = await HttpMovieImg.getMovieSmallCov({ movie_name: this.movieList[index].movie_name })
        window.localStorage.setItem('movie_smallCoverUrl', res.result[0].movieImg_url)
        this.$router.push({ name: 'subject', params: { id: this.movieList[index].movie_id } })
      }
    },
    // 鼠标经过快速链接 li 触发
    handleFastLiMouseover(e) {
      // 要过滤掉ul，不然会出问题
      if (e.target.nodeName.toLowerCase() === 'li' || e.target.nodeName.toLowerCase() === 'span') {
        const index = parseInt(e.target.dataset.index)
        // 改变对应 li 的背景色 字体颜色
        document.querySelector(`.dropdown-box .fast-box ul>li:nth-child(${index})`).style.color = '#E50914'
        document.querySelector(`.dropdown-box .fast-box ul>li:nth-child(${index}) span`).style.color = '#E50914'
        document.querySelector(`.dropdown-box .fast-box ul>li:nth-child(${index})`).style.backgroundColor = '#f5f5f7'
      }
    },
    // 鼠标离开快速链接 li 触发
    handleFastLiMouseout(e) {
      // 要过滤掉ul，不然会出问题
      if (e.target.nodeName.toLowerCase() === 'li' || e.target.nodeName.toLowerCase() === 'span') {
        const index = parseInt(e.target.dataset.index)
        // 改变对应 li 的背景色 字体颜色
        document.querySelector(`.dropdown-box .fast-box ul>li:nth-child(${index})`).style.color = '#1e1e20'
        document.querySelector(`.dropdown-box .fast-box ul>li:nth-child(${index}) span`).style.color = '#1e1e20'
        document.querySelector(`.dropdown-box .fast-box ul>li:nth-child(${index})`).style.backgroundColor = '#fff'
      }
    },
    // 鼠标经过搜索结果建议 li 触发
    handleSearchLiMouseover(e) {
      // 要过滤掉ul，不然会出问题
      if (e.target.nodeName.toLowerCase() === 'li' || e.target.nodeName.toLowerCase() === 'span') {
        const index = parseInt(e.target.dataset.index)
        // 改变对应 li 的背景色 字体颜色
        document.querySelector(`.dropdown-box .search-res-box ul>li:nth-child(${index + 1})`).style.color = '#E50914'
        document.querySelector(`.dropdown-box .search-res-box ul>li:nth-child(${index + 1}) span`).style.color = '#E50914'
        document.querySelector(`.dropdown-box .search-res-box ul>li:nth-child(${index + 1})`).style.backgroundColor = '#f5f5f7'
      }
    },
    // 鼠标离开搜索结果建议 li 触发
    handleSearchLiMouseout(e) {
      // 要过滤掉ul，不然会出问题
      if (e.target.nodeName.toLowerCase() === 'li' || e.target.nodeName.toLowerCase() === 'span') {
        const index = parseInt(e.target.dataset.index)
        // 改变对应 li 的背景色 字体颜色
        document.querySelector(`.dropdown-box .search-res-box ul>li:nth-child(${index + 1})`).style.color = '#1e1e20'
        document.querySelector(`.dropdown-box .search-res-box ul>li:nth-child(${index + 1}) span`).style.color = '#1e1e20'
        document.querySelector(`.dropdown-box .search-res-box ul>li:nth-child(${index + 1})`).style.backgroundColor = '#fff'
      }
    },
    // 输入框失去焦点
    searchBlur() {
      // 展示其他内容
      // this.isFullSearch = false
      // // 清空数据框
      // this.queryInfo.query = ''
    },
    // 点击定位图标 触发
    handleLocation() {
      // 隐藏其他内容
      this.isFullLocation = true
    },
    // 点击确定选择地址按钮 触发
    handleAreaSure() {
      console.log(this.selectedAreaList)
      // 展示其他内容
      this.isFullLocation = false
      for (const key in this.selectedAreaList[2]) {
        if (Object.hasOwnProperty.call(this.selectedAreaList[2], key)) {
          this.$store.commit('SET_DISTRICT_ID', key)
          this.$store.commit('SET_DISTRICT', this.selectedAreaList[2][key])
          this.district = this.$store.state.district
        }
      }
      // 刷新当前页面
      // location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.header-wrap {
  position: relative;
  width: 100%;
  height: 44px;
  padding-left: 80px;
  box-sizing: border-box;
  div {
    // logo区域
    .logo {
      position: absolute;
      top: 50%;
      left: 80px;
      transform: translateY(-50%);
      width: 160px;
      height: 24px;
      // border: 1px red solid;
      span {
        position: absolute;
        display: inline-block;
        top: -6px;
        height: 100%;
        color: #E50914; // 主色调
        font-size: 26px;
        cursor: pointer;
      }
    }
    // 分类区域
    .category {
      position: absolute;
      top: 50%;
      left: 350px;
      transform: translateY(-50%);
      height: 44px;
      // border: 1px red solid;
      ul {
        height: 100%;
        li {
          float: left;
          margin-right: 60px;
          line-height: 44px;
          font-size: 14px;
          color: #d6d6d6;
          cursor: pointer;
          &:hover {
            color: #fff;
          }
        }
      }
    }
    // search-location-user_center区域
    .info {
      display: flex;
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      justify-content: space-between;
      align-items: center;
      width: 150px;
      height: 100%;
      color: #d6d6d6;
      // border: 1px red solid;
      .search,
      .location {
        i {
          font-weight: bold;
          cursor: pointer;
          &:hover {
            color: #fff;
          }
        }
      }
      .user_center {
        .el-dropdown-link {
          color: #d6d6d6;
          i {
            font-weight: bold;
            cursor: pointer;
          }
          &:hover {
            color: #fff;
          }
        }
      }
      .location {
        display: flex;
        flex-direction: column;
        i {
          width: 16px;
          height: 16px;
          margin: 0 auto;
        }
        span {
          font-size: 12px;
          cursor: pointer;
          &:hover {
            color: #fff;
          }
        }
      }
    }
  }
  .fullSearch {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 680px;
    height: 100%;
    padding-right: 21px;
    box-sizing: border-box;
    .el-input {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      // background-color: #333;
    }
    .dropdown-box {
      position: absolute;
      top: 44px;
      left: 0;
      width: 680px;
      padding: 19px 40px;
      padding-bottom: 12px;
      border-radius: 0 0 15px 15px;
      background-color: #fff;
      box-sizing: border-box;
      svg {
        width: 100%;
      }
      .fastItem,
      .searchItem {
        margin: 15px 0 0 0px;
        font-size: 13px;
        color: #1e1e20;
        ul {
          li {
            // padding-left: 15px;
            margin-bottom: 10px;
            padding: 7px 0 7px 15px;
            cursor: pointer;
            span {
              color: #6e6e73;
              margin-left: 7px;
            }
          }
        }
      }
      .search-res-box {
        margin-top: 30px;
        padding-top: 22px;
        border-top: 1px #d2d2d7 solid;
      }
    }
  }
  .fullLocation {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 718px;
    .el-button {
      position: absolute;
      top: 50%;
      right: -150px;
      transform: translateY(-50%);
    }
  }
}
.bg333 {
  background-color: #333;
}
.bg1a1a1a {
  background-color: #1a1a1a;
}
</style>
<style lang="scss">
.fullSearch {
  .el-input {
    input.el-input__inner {
      border: none;
      // 此处颜色是输入框输入的文字的颜色
      color: #fff;
      font-size: 15px;
      background-color: #1a1a1a;
      // 此处改 placeholder 的样式
      &::placeholder {
        color: #6e6e73;
      }
    }
    .el-icon-search:before {
      // 此处是输入框中图标的颜色
      color: #707074;
      font-size: 18px;
    }
  }
  .el-icon-close {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    margin-right: 5px;
    color: #707074;
    font-size: 21px;
    cursor: pointer;
  }
}
.category {
  .el-input {
    input.el-input__inner {
      width: 100px;
      border: none;
      // 此处颜色是输入框输入的文字的颜色
      // color: #fff;
      // font-size: 15px;
      background-color: #333;
      // 此处改 placeholder 的样式
      &::placeholder {
        color: #d6d6d6;
      }
      // 鼠标经过输入框，改变 placeholder 的字体颜色
      &:hover {
        &::placeholder {
          color: #fff;
        }
      }
    }
    // 垂直居中图标
    .el-input__icon {
      line-height: 44px;
    }
  }
}
.fullLocation {
  .area-select-wrap .area-select {
    height: 28px;
    margin: 0 20px;
    line-height: 12px;
  }
}
</style>
