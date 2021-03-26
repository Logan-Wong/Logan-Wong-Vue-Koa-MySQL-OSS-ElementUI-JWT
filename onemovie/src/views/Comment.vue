<template>
  <div class="com-wrap">
    <!-- 头部 -->
		<Header class="header"></Header>
    <!-- 正文内容 -->
    <div class="content-box">
      <div class="content">
        <h1>个人影评</h1>
        <div class="com-box">
          <div v-if="comList.length > 0" class="all-com">
            <div class="every-com" v-for="(item, index) in comList" :key="index">
              <!-- <h3>{{ item.movie_name }}</h3> -->
              <div class="movieNameAndOperate">
                <h3>{{ item.movie_name }}</h3>
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCom(index)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"  @click="delCom(item.com_id)"></el-button>
              </div>
              <!-- 评论标题 -->
              <div class="com-header clearfix">
                <h3 v-if="!isEditComList[index]">{{ item.com_title }}</h3>
                <el-input v-else placeholder="请输入标题" v-model="editComObj.com_title" ref="titleInput" @keyup.enter.native="handleTitleEnter(index)"></el-input>
                <span>{{ item.updateTime }}</span>
              </div>
              <!-- 评论内容 -->
              <p v-if="!isEditComList[index]">
                {{ isDetailComList[index] ? detailComContentList[index] : item.com_content }}
                <span v-if="!isShorterThan180[index]" @click="handleCom(index)">{{ isDetailComList[index] ? '收起' : '展开...' }}</span>
              </p>
              <el-input v-else placeholder="请输入内容" v-model="editComObj.com_content" ref="contentInput" type="textarea" :rows="textareaRow" @keyup.enter.native="handleContentEnter(index)"></el-input>
              <div class="likeOrNot clearfix">
                <div class="likeOrNot-box">
                  <i class="iconfont iconthumb-up like"></i>
                  <!-- <span class="likeCount">125</span> -->
                  <span class="likeCount">{{ item.com_likeCount }}</span>
                  <i class="iconfont iconthumb-up unlike"></i>
                  <span class="unlikeCount">{{ item.com_notLikeCount }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="com-none">
            <p>您没有写任何个人影评。</p>
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
import HttpCom from '../api/comment'
import store from '../store'

export default {
  name: 'Comment',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      comList: [],
      // 标记哪条评论正在编辑
      isEditComList: [],
      editComObj: {},
      textareaRow: 0,
      // 标记哪条评论被展开
      isDetailComList: [],
      // 详细评论内容数组
      detailComContentList: [],
      // 标记评论内容是否短于180的数组
      isShorterThan180: []
    }
  },
  created() {
    this.getCom()
  },
  methods: {
    async getCom() {
      const res = await HttpCom.getUserComList({ user_id: store.state.user.user_id })
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      this.comList = res.result
      // 原本的 comList 中的 com_content 字段存放简要内容，详细内容存在 detailComContentList 中
      for (let i = 0; i < this.comList.length; i++) {
        if (this.comList[i].com_content.length <= 180) this.isShorterThan180[i] = true
        this.detailComContentList[i] = this.comList[i].com_content
        this.comList[i].com_content = this.comList[i].com_content.slice(0, 180)
      }
      // console.log('this.comList: ', this.comList)
    },
    // 按下编辑评论按钮 触发
    editCom(i) {
      console.log('①: ', this.comList[i].com_content)
      // console.log('this.comList[i]: ', this.comList[i])
      // console.log('this.detailComContentList[i]: ', this.detailComContentList[i])
      this.textareaRow = this.detailComContentList[i].length / 40
      this.isEditComList[i] = true
      this.$set(this.isEditComList, i, this.isEditComList[i])
      // console.log('this.isEditComList: ', this.isEditComList)
      this.editComObj = this.comList[i]
      this.editComObj.com_content = this.detailComContentList[i]
      console.log('this.editComObj: ', this.editComObj)
      // 手动刷新一遍 comList
      // this.getCom()
      // 输入框自动聚焦
      // this.$nextTick(() => {
      //   this.$refs.titleInput.focus()
      // })
    },
    // 标题中按下回车 触发
    async handleTitleEnter(i) {
      const res = await HttpCom.editCom(this.editComObj)
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      this.isEditComList[i] = false
      this.$set(this.isEditComList, i, this.isEditComList[i])
      this.$message({ message: res.message, type: 'success' })
      // 刷新 comList
      this.comList[i].com_title = this.editComObj.com_title
      this.$set(this.comList, i, this.comList[i])
      // 手动刷新一遍 comList
      // this.getCom()
    },
    // 内容中按下回车 触发
    async handleContentEnter(i) {
      console.log('②: ', this.comList[i].com_content)
      const res = await HttpCom.editCom(this.editComObj)
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      this.isEditComList[i] = false
      this.$set(this.isEditComList, i, this.isEditComList[i])
      this.$message({ message: res.message, type: 'success' })

      // 修改之前评论长度小于180
      if (this.isShorterThan180[i]) {
        console.log('111')
        // 看看修改之后的长度是否大于180
        if (this.editComObj.com_content.length > 180) {
          this.isShorterThan180[i] = false
          // this.$set(this.isShorterThan180, i, this.isShorterThan180[i])
          // 刷新 comList
          this.comList[i].com_content = this.editComObj.com_content.slice(0, 180)
        } else {
          // 刷新 comList
          this.comList[i].com_content = this.editComObj.com_content
          // this.$set(this.comList, i, this.comList[i])
        }
        // 刷新 detailComContentList
        this.detailComContentList[i] = this.editComObj.com_content
        // this.$set(this.detailComContentList, i, this.detailComContentList[i])
      } else {
        console.log('222')
        // 看看修改之后的长度是否小于180
        if (this.editComObj.com_content.length <= 180) {
          console.log('333')
          this.isShorterThan180[i] = true
          this.$set(this.isShorterThan180, i, this.isShorterThan180[i])
          // 刷新 comList
          this.comList[i].com_content = this.editComObj.com_content
          this.$set(this.comList, i, this.comList[i])
        }
        // 刷新 detailComContentList
        this.detailComContentList[i] = this.editComObj.com_content
        this.$set(this.detailComContentList, i, this.detailComContentList[i])
      }
      // 重置 this.isDetailComList[i]
      this.isDetailComList[i] = false
      this.$set(this.isDetailComList, i, this.isDetailComList[i])
      // this.comList[i].com_content
      console.log('③: ', this.comList[i].com_content)
      console.log('this.detailComContentList[i]: ', this.detailComContentList[i])
      // 手动刷新一遍 comList
      // this.getCom()
    },
    // 展开收起评论 触发
    handleCom(i) {
      this.isDetailComList[i] = !this.isDetailComList[i]
      // 刷新 isDetailComList
      this.$set(this.isDetailComList, i, this.isDetailComList[i])
      // console.log('this.isDetailComList: ', this.isDetailComList)
      // 手动刷新 获取评论列表
      // this.getCom()
    },
    // 点击删除影评按钮 触发
    async delCom(id) {
      // 弹出 MessageBox 弹框
      const confirmData = await this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 点击 取消， confirmData 为 cancel
      // 点击 确定， confirmData 为 confirm
      // 用户点击了取消按钮
      if (confirmData !== 'confirm') {
        return this.$message.info('已取消删除~')
      }
      // 执行到这里，代表用户点了确定
      const res = await HttpCom.delCom({ data: { com_id: id } })
      // console.log('res: ', res)
      if (res.code !== 1) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getCom()
    }
  }
}
</script>

<style lang="scss" scoped>
.com-wrap {
  background-color: #fff;
	// background-color: #f4f4f4;
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
      width: 980px;
      height: 100%;
      margin: 0 auto;
      // background-color: lightblue;
      h1 {
        font-size: 45px;
        font-weight: 549;
        text-align: center;
        margin-bottom: 50px;
        color: #1d1d1f;
      }
      .com-box {
        border-top: 1px #d2d2d7 solid;
        padding: 85px 30px 0 30px;
        .all-com {
          .every-com {
            margin-bottom: 30px;
            padding: 5px 20px 20px;
            border-radius: 15px;
            // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            background-color: #f2f2f2;
            // background-color: #fff;
            .movieNameAndOperate {
              position: relative;
              h3 {
                margin-bottom: 0;
                text-align: center;
                color: #1d1d1f;
              }
              .el-button {
                position: absolute;
                top: 0;
                right: 0;
              }
              .el-button:nth-child(2) {
                right: 55px;
              }
            }
            // h3 {
            //   margin-bottom: 0;
            //   text-align: center;
            //   color: #1d1d1f;
            // }
            .com-header {
              height: 60px;
              h3 {
                float: left;
                margin-right: 20px;
                line-height: 22px;
                color: #1d1d1f;
              }
              .el-input:nth-child(1) {
                float: left;
                width: 40%;
                margin-top: 10px;
                margin-right: 20px;
              }
              span {
                float: left;
                line-height: 60px;
              }
            }
            p {
              margin-top: 0;
              text-indent: 2em;
              span {
                margin-left: 20px;
                font-size: 16px;
                color: #E50914;
                cursor: pointer;
              }
            }
            .el-textarea {
              margin: 10px 0 15px 0;
            }
            .likeOrNot {
              // position: relative;
              height: 18px;
              color: #E50914;
              .likeOrNot-box {
                float: right;
                // width: 160px;
                height: 100%;
                margin-right: 15px;
                .iconyidongduan_dianzan {
                  color: #E50914;
                }
                .like {
                  float: left;
                  margin-right: 8px;
                }
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
                }
                .unlikeCount {
                  float: left;
                  line-height: 18px;
                }
              }
            }
          }
        }
        .com-none {
          text-align: center;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.com-box {
  .el-button--primary {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
  }
  .com-header input.el-input__inner {
    // 此处颜色是输入框输入的文字的颜色
    color: #1d1d1f;
    font-weight: 550;
    font-size: 17px;
  }
  .every-com textarea.el-textarea__inner {
    // 此处颜色是输入框输入的文字的颜色
    font-family: Microsoft YaHei;
    font-size: 15px;
    color: #000;
  }
}
</style>
