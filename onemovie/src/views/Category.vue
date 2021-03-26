<template>
  <div class="cat-wrap">
    <!-- 头部 -->
		<Header class="header"></Header>
    <!-- 正文内容 -->
    <div class="content-box">
      <div class="content">
        <h1>{{ cat_name }}电影</h1>
        <div class="cat-box">
          <div v-if="movieList.length > 0" class="all-cat clearfix">
            <div class="movie-box" v-for="item in movieList" :key="item.movie_id">
              <div class="cover" @click="goSubject(item.movie_id, item.movieImg_url)">
                <img :src="item.movieImg_url" alt="">
              </div>
              <div class="movieTitle">
                <h4>{{ item.movie_name }}</h4>
              </div>
            </div>
          </div>
          <div v-else class="cat-none">
            <p>没有任何{{ cat_name }}电影。</p>
          </div>
        </div>
      </div>
    </div>
		<!-- 底部 -->
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import HttpCat from '../api/category'
import store from '../store'
// import store from '../store'

export default {
  name: 'Category',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      movieList: [],
      cat_name: ''
    }
  },
  created() {
    this.getCat()
  },
  methods: {
    async getCat() {
      this.cat_name = store.state.cat_name
      const res = await HttpCat.getCatMovList({ cat_id: store.state.cat_id })
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      console.log('res: ', res)
      this.movieList = res.result
    },
    goSubject(id, movie_smallCoverUrl) {
      // console.log('id: ', id)
      window.localStorage.setItem('movie_smallCoverUrl', movie_smallCoverUrl)
      // 跳转到电影详情页
      this.$router.push({ name: 'subject', params: { id } })
    }
  }
}
</script>

<style lang="scss" scoped>
.cat-wrap {
	background-color: #f4f4f4;
  .header {
    position: fixed;
    top: 0;
    z-index: 999;
  }
  .content-box {
    width: 100%;
    min-height: 879px;
    padding-top: 85px;
    padding-bottom: 50px;
    box-sizing: border-box;
    .content {
      width: 1070px;
      // width: 980px;
      height: 100%;
      margin: 0 auto;
      // background-color: lightblue;
      h1 {
        font-size: 45px;
        font-weight: 549;
        text-align: center;
        margin-bottom: 50px;
      }
      .cat-box {
        border-top: 1px #d2d2d7 solid;
        padding: 85px 30px 0 30px;
        .all-cat {
          .movie-box {
            float: left;
            margin-right: 10px;
            .cover {
              width: 160px;
              height: 240px;
              cursor: pointer;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .movieTitle {
              h4 {
                margin-top: 10px;
                text-align: center;
              }
            }
          }
          .movie-box:nth-child(6n) {
            margin-right: 0;
          }
        }
        .cat-none {
          text-align: center;
        }
      }
    }
  }
}
</style>
