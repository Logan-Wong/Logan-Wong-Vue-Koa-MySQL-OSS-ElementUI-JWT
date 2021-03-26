<template>
  <div class="order-wrap">
    <!-- 头部 -->
		<Header class="header"></Header>
    <!-- 正文内容 -->
    <div class="content-box">
      <div class="content">
        <h1>个人订单</h1>
        <div class="order-box">
          <el-row v-if="orderList.length > 0" class="row-allOrder">
            <el-row class="row-everyOrder" v-for="item in orderList" :key="item.order_id">
              <el-row class="row-orderHeader">
                <el-col :span="3">{{ item.createTime.split(' ')[0] }}</el-col>
                <el-col :span="20">OneMovie订单号：{{ item.order_code }}</el-col>
                <el-col :span="1"><i class="el-icon-delete" @click="handleDelOrder(item.order_id)"></i></el-col>
              </el-row>
              <el-row class="row-orderBody">
                <el-col :span="3"><div class="imgBox"><el-image :src="item.order_movCovUrl"></el-image></div></el-col>
                <el-col :span="11">
                  <el-row>《{{ item.order_movName }}》</el-row>
                  <el-row>{{ item.order_cinName }}</el-row>
                  <el-row>{{ item.order_cinHall }}号厅  {{ item.order_seat }}</el-row>
                  <el-row>{{ item.order_session }}</el-row>
                </el-col>
                <el-col :span="3"><span>￥{{ item.order_priceTotal }}</span></el-col>
                <el-col :span="4">
                  <span>{{ item.order_status }}</span>
                  <i :class="item.order_status === '支付成功' ? 'el-icon-success' : 'el-icon-error'"></i>
                </el-col>
                <el-col :span="3">
                  <span v-if="item.order_status === '超时/支付失败' || item.order_status === '支付成功'">{{ item.order_btnText }}</span>
                  <el-button v-else type="primary">{{ item.order_btnText }}</el-button>
                </el-col>
              </el-row>
            </el-row>
          </el-row>
          <el-row v-else class="order-none">您没有任何个人订单。</el-row>
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
import HttpOrder from '../api/userOrder'
import store from '../store'

export default {
  name: 'Order',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      orderList: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      const res = await HttpOrder.getOrderList({ user_id: store.state.user.user_id })
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      // console.log('res: ', res)
      this.orderList = res.result
      // 过滤掉待支付的订单，该页面暂时不支持支付待支付的订单
      for (let i = 0; i < this.orderList.length; i++) {
        if (this.orderList[i].order_status === 2) {
          this.orderList.splice(this.orderList.indexOf(this.orderList[i]), 1)
          i--
        }
      }
      for (let item of this.orderList) {
        if (item.order_status === 0) {
          item.order_status = '超时/支付失败'
          item.order_btnText = '已取消'
        } else if (item.order_status ===  1) {
          item.order_status = '支付成功'
          item.order_btnText = '已完成'
        } else if (item.order_status ===  2) {
          item.order_status = '待支付'
          item.order_btnText = '去付款'
        } else item.order_status = '发生未知错误'
      }
    },
    async handleDelOrder(id) {
      // 弹出 MessageBox 弹框
      const confirmData = await this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
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
      const res = await HttpOrder.delOrder({ data: { order_id: id } })
      // console.log('res: ', res)
      if (res.code !== 1) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getOrderList()
    }
  }
}
</script>

<style lang="scss" scoped>
.order-wrap {
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
      .order-box {
        border-top: 1px #d2d2d7 solid;
        padding: 85px 30px 0 30px;
        // background-color: pink;
        .row-allOrder {
          .row-everyOrder {
            margin-bottom: 30px;
            border: 1px #e5e5e5 solid;
            .row-orderHeader {
              padding: 15px 20px;
              color: #333;
              font-size: 14px;
              background-color: #f7f7f7;
              .el-col:nth-child(2) {
                color: #999;
              }
              .el-col:nth-child(3) {
                display: flex;
                justify-content: center;
                cursor: pointer;
              }
            }
            .row-orderBody {
              padding: 15px 20px;
              padding-right: 0;
              color: #333;
              .el-col:nth-child(1) {
                .imgBox {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 70px;
                  height: 95px;
                  background-color: #fff;
                  box-shadow: 0 1px 2px 0 #000;
                  .el-image {
                    width: 66px;
                    height: 91px;
                  }
                }
              }
              .el-col:nth-child(2) {
                margin-left: -15px;
                font-size: 12px;
                .el-row:nth-child(1) {
                  margin: 5px 0 7px -5px;
                  font-size: 16px;
                  font-weight: 700;
                }
                .el-row:nth-child(2) {
                  margin-top: 5px;
                  color: #999;
                }
                .el-row:nth-child(3) {
                  margin-top: 5px;
                  color: #999;
                }
                .el-row:nth-child(4) {
                  margin-top: 5px;
                  color: #e50914;
                }
              }
              .el-col:nth-child(3) {
                display: flex;
                align-items: center;
                // height: 100%;
                height: 95px;
                font-size: 14px;
              }
              .el-col:nth-child(4) {
                display: flex;
                align-items: center;
                height: 95px;
                font-size: 14px;
                i {
                  margin-left: 8px;
                }
                .el-icon-success {
                  color: #5ab034;
                }
                .el-icon-error {
                  color: #e50914;
                }
              }
              .el-col:nth-child(5) {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 95px;
                .el-button {
                  padding: 10px 30px;
                  border-radius: 100px;
                }
              }
            }
          }
        }
        .order-none {
          padding: 16px 0;
          text-align: center;
        }
      }
    }
  }
}
</style>
