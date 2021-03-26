<template>
  <el-container class="ticket-wrap">
    <!-- 头部 -->
    <el-header height="44px"><Header class="header"></Header></el-header>
    <!-- 正文内容 -->
    <el-main>
      <!-- 头部影片信息 -->
      <el-row class="content-header">
        <el-col :span="12" :offset="6">
          <el-row>
            <el-col :span="7" class="col-cover">
              <div style="width: 218px; height: 300px"></div>
              <div><el-image :src="movie_smallCoverUrl"></el-image></div>
            </el-col>
            <el-col :span="16" class="col-info">
              <el-row class="movie_name"><h1>{{ movieInfo.movie_name }}</h1></el-row>
              <el-row class="movie_alias">{{ movieInfo.movie_alias }}</el-row>
              <el-row class="movie_type">{{ movieInfo.movie_type }}</el-row>
              <el-row class="movie_countryAndDur">
                <span>{{ movieInfo.movie_country }}</span>
                <el-divider direction="vertical"></el-divider>
                <span>{{ movieInfo.movie_duration }}分钟</span>
                </el-row>
              <el-row class="movie_releaseDate">{{ movieInfo.movie_releaseDate }}</el-row>
              <!-- <el-row class="movie_releaseDate">2021-02-12 08:00中国大陆上映</el-row> -->
              <!-- <el-row class="movie_releaseDate">2021-02-12 08:00中国大陆上映</el-row> -->
              <el-row class="btns">
                <el-col :span="4"><el-button type="primary">写影评</el-button></el-col>
                <el-col :span="5"><el-button type="primary" @click="goSubject">查看更多电影详情</el-button></el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- 上映信息 -->
      <el-row class="content-body">
        <el-col :span="14" :offset="5">
          <!-- 步骤条 -->
          <el-row class="row-steps">
            <el-steps :active="stepActive" finish-status="success" align-center>
              <el-step title="选择影院"></el-step>
              <el-step title="选择影片场次"></el-step>
              <el-step title="选择座位"></el-step>
              <el-step title="15分钟内付款"></el-step>
              <el-step title="影院取票观影"></el-step>
            </el-steps>
          </el-row>
          <!-- 观影日期选择 -->
          <el-row class="row-selectDate" v-if="stepActive === 0 || stepActive === 1" @click.native="handleSelectDate">
            <el-col :span="2" class="time" :data-index="0">观影时间：</el-col>
            <el-col :span="2" class="date" :class="[activeArr[0]]" :data-index="0">今天 {{ firstDate }}</el-col>
            <el-col :span="2" class="date" :class="[activeArr[1]]" :data-index="1">明天 {{ secondDate }}</el-col>
            <el-col :span="2" class="date" :class="[activeArr[2]]" :data-index="2">{{ thirdZhou }} {{ thirdDate }}</el-col>
            <el-col :span="2" class="date" :class="[activeArr[3]]" :data-index="3">{{ fourthZhou }} {{ fourthDate }}</el-col>
            <el-col :span="2" class="date" :class="[activeArr[4]]" :data-index="4">{{ fifthZhou }} {{ fifthDate }}</el-col>
          </el-row>
          <!-- 影院头部 -->
          <el-row class="row-cinema-head" v-if="stepActive === 0">
            <div></div>
            <h3>影院列表</h3>
          </el-row>
          <!-- 挑选影院 -->
          <el-row class="row-selectCinema" v-show="stepActive === 0" v-for="item in cinemaList" :key="item.cinema_id">
            <el-col :span="20">
              <el-row class="row-cinemaName">{{ item.cinema_name }}</el-row>
              <el-row class="row-cinemaAddress">地址：{{ item.cinema_address }}</el-row>
            </el-col>
            <el-col :span="2" class="price">
              <span class="rmb">￥</span>
              {{ item.selling_price }}
              <span class="text">起</span>
            </el-col>
            <el-col :span="2"><el-button type="primary" size="mini" @click="handleSelectedCinema(item.cinema_id, item.cinema_name)">选座购票</el-button></el-col>
          </el-row>
          <el-row class="row-noneCinema" v-if="cinemaList.length === 0">
            <i class="el-icon-warning"></i>
            <span>您所在地区还没有影院上映该电影，敬请期待~</span>
          </el-row>
          <!-- 挑选场次 -->
          <el-row class="row-selectSession" v-if="stepActive === 1">
            <el-table
              class="table-session"
              :data="sessionList"
              stripe
              style="width: 100%"
              :header-cell-style="{ background:'#f7f7f7', color:'#333', fontSize: '16px' }"
              :cell-style="setCellStyle">
              <el-table-column
                label="放映时间"
                align="center"
                width="180">
                <template slot-scope="scope">
                  <h3 style="margin-top: 5px;margin-bottom: 0;">{{ scope.row.startTime }}</h3>
                  <span style="font-size: 12px;color: #999;">{{ scope.row.isSecondDay ? '次日' : '' }}{{ scope.row.endTime }}散场</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="lanVersion"
                label="语言版本"
                align="center"
                width="180">
              </el-table-column>
              <el-table-column
                prop="playRoom"
                align="center"
                label="放映厅">
              </el-table-column>
              <el-table-column
                align="center"
                label="售价（元）">
                <template slot-scope="scope">
                  <span style="font-size: 12px;color: #e50914;margin-right: -1px;">￥</span>
                  <span style="font-size: 18px;color: #e50914;font-weight: bold">{{ scope.row.price }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="选座购票">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleSelectedSession(scope.row)">选座购票</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <!-- 挑选座位 -->
          <el-row class="row-selectSeat" v-if="stepActive === 2">
            <el-col :span="16" class="col-seatInfo">
              <el-row class="row-seatTips">
                <el-col :span="5" :offset="2">
                  <el-image :src="unselected"></el-image><span>可选座位</span>
                </el-col>
                <el-col :span="5">
                  <el-image :src="bought"></el-image>已售座位
                </el-col>
                <el-col :span="5">
                  <el-image :src="selected"></el-image>已选座位
                </el-col>
              </el-row>
              <el-row class="row-screen">
                <el-col :span="10" :offset="7"><div class="inner-screen">影厅银幕</div></el-col>
              </el-row>
              <el-row class="row-tag">
                <el-col :span="2" :offset="11"><el-tag type="info">银幕中央</el-tag></el-col>
              </el-row>
              <el-row class="row-seats">
                <el-col :span="1" class="col-index">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                  <span>9</span>
                </el-col>
                <el-col :span="23">
                  <div v-for="row in seatRow" :key="row" class="outter-seat">
                    <!-- 这里的 v-if 很重要，如果没有则会导致报错，因为 seatArray 初始状态为空 -->
                    <div v-for="col in seatCol"
                      :key="col"
                      v-show="seatArray.length > 0"
                      class="seat"
                      :style="{ width: seatSize + 'px', height: seatSize + 'px' }">
                      <div class="inner-seat"
                        @click="handleChooseSeat(row - 1, col - 1)"
                        v-if="seatArray[row - 1][col - 1] !== -1">
                        <el-image v-show="seatArray[row - 1][col - 1] === 0" :src="unselected"></el-image>
                        <el-image v-show="seatArray[row - 1][col - 1] === 1" :src="selected"></el-image>
                        <el-image v-show="seatArray[row - 1][col - 1] === 2" :src="bought"></el-image>
                      </div>
                    </div>
                  </div>
                </el-col>
                <div class="center-line"></div>
              </el-row>
            </el-col>
            <el-col :span="8" class="col-orderInfo">
              <el-row class="row-textTips">
                <el-col><h2>本次购票订单信息</h2></el-col>
              </el-row>
              <el-row class="row-longLine">
                <el-col :span="8" :offset="8"></el-col>
              </el-row>
              <el-row class="row-shortLine">
                <el-col :span="6" :offset="9"></el-col>
              </el-row>
              <el-row class="row-cinema">
                <el-col :span="4">影院：</el-col>
                <el-col :span="20">{{ orderInfo.cinema_name }}</el-col>
              </el-row>
              <el-row class="row-room">
                <el-col :span="4">影厅：</el-col>
                <el-col :span="20">{{ orderInfo.cinema_hallNum }}号厅</el-col>
              </el-row>
              <el-row class="row-version">
                <el-col :span="4">版本：</el-col>
                <el-col :span="20">国语2D</el-col>
              </el-row>
              <el-row class="row-date">
                <el-col :span="4">场次：</el-col>
                <el-col :span="20">{{ orderSeesionDay }} {{ orderInfo.session }}</el-col>
              </el-row>
              <el-row class="row-price">
                <el-col :span="4">票价：</el-col>
                <el-col :span="20">￥{{ orderInfo.price }}/张</el-col>
              </el-row>
              <el-row class="row-seatCount">
                <el-col :span="4"><span>座位：</span></el-col>
                <el-col :span="20" v-show="selectedList.length === 0">一次最多选5个座位</el-col>
                <el-col :span="20" v-show="selectedList.length > 0">
                  <el-tag
                    v-for="tag in selectedList"
                    :key="tag"
                    closable
                    @close="handleTagClose(tag)">
                    {{tag}}
                  </el-tag>
                </el-col>
              </el-row>
              <el-row class="row-unselectTips" v-if="selectedList.length === 0">
                <el-col>请<span>点击左侧</span>座位图选择座位</el-col>
              </el-row>
              <el-row class="row-totalPrice">
                <el-col :span="4"><span>总价：</span></el-col>
                <el-col :span="20">￥<span class="inner-price">{{ orderInfo.priceTotal }}</span></el-col>
              </el-row>
              <el-row class="row-telphone">
                <el-col :span="12" :offset="6">手机号：{{ orderInfo.user_phone }}</el-col>
                <el-col :span="6"><el-link type="primary" @click="editTelphone">编辑</el-link></el-col>
              </el-row>
              <el-row class="row-sureBtn">
                <el-col><el-button type="primary" @click="handleOrderSure">确认选座</el-button></el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 支付 -->
          <el-row class="row-pay" v-if="stepActive === 3">
            <el-row class="row-countdown">
              <el-col :span="2"><i class="iconfont iconshalou"></i></el-col>
              <el-col :span="22">
                <el-row>请在<span>{{ mm }}</span>分钟<span>{{ ss }}</span>秒内完成支付.</el-row>
                <el-row>超时订单会自动取消，请抓紧支付.</el-row>
              </el-col>
            </el-row>
            <el-row class="row-payBtns">
              <el-col :span="5" :offset="7"><el-button type="primary" @click="handlePayFailure">支付失败</el-button></el-col>
              <el-col :span="5"><el-button type="primary" @click="handlePaySuccess">支付成功</el-button></el-col>
            </el-row>
          </el-row>
          <!-- 取票 -->
          <el-row class="row-check-in" v-if="stepActive === 4">
            <el-row class="row-checkInTips">
              <el-row><i class="el-icon-warning"></i>请到影院取票观影.</el-row>
            </el-row>
            <el-row class="row-goIndexBtn">
              <el-col :span="6" :offset="9"><el-button type="primary" @click="goIndex">回到首页</el-button></el-col>
            </el-row>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
    <!-- 底部 -->
    <el-footer height="100px"><Footer></Footer></el-footer>
  </el-container>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import HttpMovie from '../api/movie'
import HttpSelling from '../api/selling'
import HttpCinema from '../api/cinema'
import HttpSeat from '../api/seat'
import HttpOrder from '../api/userOrder'
import store from '../store'
import unselected from '@/assets/unselected.png'
import bought from '@/assets/bought.png'
import selected from '@/assets/selected.png'

export default {
  name: 'BuyTicket',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      movie_smallCoverUrl: '',
      movieInfo: {},
      // 今天、明天...的星期几和日期
      firstDate: '',
      secondDate: '',
      thirdZhou: '',
      thirdDate: '',
      fourthZhou: '',
      fourthDate: '',
      fifthZhou: '',
      fifthDate: '',
      // 上映信息
      sellingList: [],
      selQueryInfo: {
        selling_date: '',
        movie_id: '',
        country_id: ''
      },
      cinemaIDList: [],
      selectedSellingID: '',
      // 影院信息
      cinemaList: [],
      CinQueryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
        country_id: ''
      },
      cinTotal: '',
      selectedCinemaID: '',
      stepActive: 0,
      // 记录哪天被点击
      activeArr: ['curDate', '', '', '', ''],
      // 当前是否正在挑选场次
      isSelecttingSession: false,
      sessionList: [],
      unselected,
      bought,
      selected,
      // 座位数组
      // -1 非座位
      // 0 可选座位 (白色)
      // 1 已选座位 (绿色)
      // 2 已售座位 (红色)
      seatArray: [],
      seatRow: 9,
      seatCol: 18,
      seatSize: 30,
      selectedList: [],
      boughtList: [],
      // 选座位页面的订单信息
      orderInfo: {
        cinema_name: '',
        cinema_hallNum: '',
        version: '国语2D',
        session: '',
        price: '',
        selectedSeatList: [],
        priceTotal: 0,
        user_phone: ''
      },
      orderSeesionDay: '',
      mm: '00',
      ss: '15',
      // 是否停止计时
      isStopCountdown: false,
      addOrderObj: {},
      seat_id: -1
    }
  },
  created() {
    this.getMovieInfo()
    this.getDate()
    this.getSellingList(0)
    // this.getCinemaList()
  },
  methods: {
    // 回到首页
    goIndex() {
      this.$router.push({
        path: '/'
      })
    },
    goSubject() {
      // console.log('id: ', id)
      // window.localStorage.setItem('movie_smallCoverUrl', movie_smallCoverUrl)
      // 跳转到电影详情页
      this.$router.push({ name: 'subject', params: { id: window.localStorage.getItem('movie_id') } })
    },
    // 获取电影信息
    async getMovieInfo() {
      this.movie_smallCoverUrl = window.localStorage.getItem('movie_smallCoverUrl')
      if (this.$route.params.id) window.localStorage.setItem('movie_id', this.$route.params.id)
      const res = await HttpMovie.getMovieInfo({ movie_id: window.localStorage.getItem('movie_id') })
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      // console.log('res: ', res)
      // const res = await HttpUser.getUserInfo({ user_phone: store.state.user.user_phone })
      this.movieInfo = res.result[0]
      console.log('this.movieInfo: ', this.movieInfo)
      // 处理电影信息，方便展示
      // 电影类型
      let tmpTypeArr = this.movieInfo.movie_type.split(',')
      this.movieInfo.movie_type = ''
      for (let i = 0; i < tmpTypeArr.length; i++) {
        if (i !== tmpTypeArr.length - 1) {
          this.movieInfo.movie_type = this.movieInfo.movie_type + tmpTypeArr[i] + ' '
        } else {
          this.movieInfo.movie_type += tmpTypeArr[i]
        }
      }
      // 电影地区
      let tmpCountryArr = this.movieInfo.movie_country.split(',')
      this.movieInfo.movie_country = ''
      for (let i = 0; i < tmpCountryArr.length; i++) {
        if (i !== tmpCountryArr.length - 1) {
          this.movieInfo.movie_country = this.movieInfo.movie_country + tmpCountryArr[i] + ' '
        } else {
          this.movieInfo.movie_country += tmpCountryArr[i]
        }
      }
      // 电影上映日期
      this.movieInfo.movie_releaseDate = this.movieInfo.movie_releaseDate.split(',')[0]
      // this.movieInfo.movie_type = [0] + ' ' + this.movieInfo.movie_type.split(',')[1]
      // this.movieInfo.movie_country = this.movieInfo.movie_country.split(',')[0] + ' ' + this.movieInfo.movie_country.split(',')[1]
    },
    // 获取日期和星期
    getDate() {
      // 今天
      const firstObj = this.computDate(0)
      this.firstDate = firstObj.MM + '月' + firstObj.DD
      // 明天
      const secondObj = this.computDate(1)
      this.secondDate = secondObj.MM + '月' + secondObj.DD
      // 第三天
      const thirdObj = this.computDate(2)
      this.thirdZhou = thirdObj.day
      this.thirdDate = thirdObj.MM + '月' + thirdObj.DD
      // 第四天
      const fourthObj = this.computDate(3)
      this.fourthZhou = fourthObj.day
      this.fourthDate = fourthObj.MM + '月' + fourthObj.DD
      // 第五天
      const fifthObj = this.computDate(4)
      this.fifthZhou = fifthObj.day
      this.fifthDate = fifthObj.MM + '月' + fifthObj.DD
    },
    // 获取上映列表
    async getSellingList(index) {
      // 清空 this.sellingList, this.cinemaIDList 和 this.cinemaList
      this.sellingList = []
      this.cinemaIDList = []
      this.cinemaList = []
      const { day, YYYY, MM, DD } = this.computDate(index)
      this.orderSeesionDay = day
      this.orderInfo.session = MM + '月' + DD + ' '
      this.selQueryInfo.selling_date = YYYY + '.' + MM + '.' + DD
      this.selQueryInfo.movie_id = window.localStorage.getItem('movie_id')
      this.selQueryInfo.country_id = store.state.district_id
      // console.log('this.selQueryInfo: ', this.selQueryInfo)
      const res = await HttpSelling.getSellingList(this.selQueryInfo)
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      // console.log('res: ', res)
      if (res.result.length === 0) {
        this.sessionList = [] // 清空 this.sessionList
        return
      }
      this.sellingList = res.result
      // console.log('this.sellingList: ', this.sellingList)
      // 缓存所有符合条件的影院 ID
      for (const item of this.sellingList) {
        if (this.cinemaIDList.indexOf(item.cinema_id) === -1) this.cinemaIDList.push(item.cinema_id)
      }
      // 根据影院 ID 挨个查询影院信息
      for (const item of this.cinemaIDList) {
        this.getCinemaInfo(item)
      }
      // console.log('this.cinemaList: ', this.cinemaList)

      // 当前在选择场次页面，点击了切换日期，应该模拟一次选择影院（选同一个），获取场次信息
      if (this.isSelecttingSession) {
        this.getSessionInfo(this.selectedCinemaID)
      }
    },
    // 获取影院信息
    async getCinemaInfo(cinema_id) {
      const res = await HttpCinema.getCinemaInfo({ cinema_id })
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      // console.log('res: ', res)
      this.cinemaList.push(res.result[0])
      // 为 cinemaList 中的每一个对象添加 selling_price
      for (const item of this.sellingList) {
        if (item.cinema_id === cinema_id) {
          this.cinemaList[this.cinemaList.length - 1].selling_price = item.selling_price
          return
        }
      }
      // console.log('this.cinemaList: ', this.cinemaList)
    },
    // 获取场次信息
    getSessionInfo(id) {
      // 清空 this.sessionList
      this.sessionList = []
      // if (this.sellingList.length === 0) return
      for (const item of this.sellingList) {
        if (item.cinema_id === id) {
          let tmpStartTimeArr = item.selling_startTime.split(',')
          for (const key of tmpStartTimeArr) {
            const { endTime, isSecondDay } = this.computEndTime(key, this.movieInfo.movie_duration)
            this.sessionList.push({
              selling_id: item.selling_id,
              startTime: key,
              endTime,
              // 标记该场电影是否是第二天散场
              isSecondDay,
              lanVersion: '国语2D',
              playRoom: item.cinema_hallNum + '号厅',
              price: item.selling_price,
              // 开始时间的分钟数，方便进行数组中对象的排序
              startMinute: this.changeStartTime(key)
            })
          }
        }
      }
      // 根据每个对象中的 startTime 来排序
      this.sessionList.sort(this.compare('startMinute'))
      // console.log('this.sessionList: ', this.sessionList)
    },
    // 获取已选场次的座位等信息
    async getSeatAndOrderInfo(selling_id, seat_startTime) {
      // console.log('selling_id, seat_startTime: ', selling_id, seat_startTime)
      const res = await HttpSeat.getSeatInfo({ selling_id, seat_startTime })
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      console.log('res: ', res)
      if (res.result.length > 0) {
        this.seat_id = res.result[0].seat_id
        if (res.result[0].seat_selectedSeat === '') {
          this.boughtList = []
        } else {
          this.boughtList = res.result[0].seat_selectedSeat.split(',')
        }
      }
      // console.log('this.boughtList: ', this.boughtList)
      // 初始化座位
      this.initSeatArray()
    },
    // 生成订单
    async addOrder() {
      this.addOrderObj = {
        order_code: this.createOrderCode(),
        order_phone: this.orderInfo.user_phone,
        order_status: 2,  // 待支付
        order_movCovUrl: window.localStorage.getItem('movie_smallCoverUrl'),
        order_movName: this.movieInfo.movie_name,
        order_cinName: this.orderInfo.cinema_name,
        order_cinHall: this.orderInfo.cinema_hallNum,
        order_seat: this.orderInfo.selectedSeatList.join(','),
        order_session: this.orderInfo.session,
        order_price: this.orderInfo.price,
        order_lanVer: this.orderInfo.version,
        order_priceTotal: this.orderInfo.priceTotal,
        user_id: store.state.user.user_id
      }
      console.log('this.addOrderObj: ', this.addOrderObj)
      const res = await HttpOrder.addOrder(this.addOrderObj)
      // console.log('res: ', res)
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
    },
    // 修改订单信息（这里只允许修改订单状态）
    async editOrder() {
      const res = await HttpOrder.editOrder({
        order_status: this.addOrderObj.order_status,
        order_code: this.addOrderObj.order_code
      })
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      // console.log('res: ', res)
    },
    // 修改座位信息
    async editSeat(flag) {
      let seat_selectedSeat = ''
      if (this.boughtList.length > 0) {
        for (const item of this.boughtList) {
          seat_selectedSeat = seat_selectedSeat + item + ','
        }
      }
      if (flag) {
        for (const item of this.selectedList) {
          let tmpSeat = item.split('排')[0] + '.' + item.split('排')[1].split('座')[0]
          seat_selectedSeat = seat_selectedSeat + tmpSeat + ','
        }
      }
      // 删除最后的逗号
      seat_selectedSeat = seat_selectedSeat.substr(0, seat_selectedSeat.length - 1)
      const res = await HttpSeat.editSeat({
        seat_selectedSeat,
        seat_id: this.seat_id
      })
      console.log('res: ', res)
    },
    // 点击任一观影时间 触发
    handleSelectDate(e) {
      let tmpArr = new Array(5).fill('')
      tmpArr[e.target.dataset.index] = 'curDate'
      this.activeArr = tmpArr
      this.getSellingList(e.target.dataset.index)
      // console.log('this.activeArr: ', this.activeArr)
      // this.$set(this.activeArr, this.activeArr)
    },
    // 选择影院 触发
    handleSelectedCinema(id, cinema_name) {
      this.stepActive++
      this.selectedCinemaID = id
      this.getSessionInfo(id)
      // console.log('this.orderInfo: ', this.orderInfo)
      // 将影院名称缓存到 orderInfo
      this.orderInfo.cinema_name = cinema_name
      // 标记一下当前正在挑选场次
      this.isSelecttingSession = true
      // for (const item of this.cinemaList) {
      //   if (item.cinema_id === id) {
      //     this.orderInfo.cinema_name = item.cinema_name
      //     return
      //   }
      // }
      // console.log('this.orderInfo: ', this.orderInfo)
    },
    // 选择场次 触发
    handleSelectedSession(item) {
      this.stepActive++
      this.orderInfo.cinema_hallNum = item.playRoom.split('号厅')[0]
      this.orderInfo.session += item.startTime
      this.orderInfo.price = item.price
      this.orderInfo.user_phone = store.state.user.user_phone
      this.getSeatAndOrderInfo(item.selling_id, item.startTime)
    },
    // 确认订单 触发
    handleOrderSure() {
      this.stepActive++
      this.countdown(false)
      // 生成订单，状态为待支付
      this.addOrder()
      // 修改座位信息
      this.editSeat(true)
    },
    // 点击支付成功 触发
    handlePaySuccess() {
      this.stepActive++
      // 停止计时
      this.isStopCountdown = true
      // 修改订单（订单状态改为已支付）
      this.addOrderObj.order_status = 1
      this.editOrder()
    },
    // 点击支付失败 触发
    async handlePayFailure() {
      // 停止计时
      this.isStopCountdown = true
      // 修改订单（订单状态改为支付失败）
      this.addOrderObj.order_status = 0
      this.editOrder()
      // 修改座位信息（还原座位）
      this.editSeat(false)

      const confirmData = await this.$confirm('订单支付失败，已自动取消~将跳转回首页。', '提示', {
        confirmButtonText: '知道了',
        // cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 点击 取消， confirmData 为 cancel
      // 点击 确定， confirmData 为 confirm
      // 用户点击了知道了按钮
      if (confirmData === 'confirm') {
        // return this.$message.info('已取消删除~')
        this.goIndex()
      }
    },
    // 支付超时
    async payTimeOut() {
      // 修改座位信息（还原座位）
      this.editSeat(false)
      // 修改订单（订单状态改为已超时）
      this.addOrderObj.order_status = 0
      this.editOrder()

      const confirmData = await this.$confirm('订单超时未支付，已自动取消~将跳转回首页。', '提示', {
        confirmButtonText: '知道了',
        // cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 点击 取消， confirmData 为 cancel
      // 点击 确定， confirmData 为 confirm
      // 用户点击了知道了按钮
      if (confirmData === 'confirm') {
        // return this.$message.info('已取消删除~')
        this.goIndex()
      }
    },
    // 选择/取消选择座位 触发
    handleChooseSeat(row, col) {
      let seatValue = this.seatArray[row][col]
      let newArray = this.seatArray
      // 如果是已售座位，直接返回
      if (seatValue === 2) return

      let realRow = row + 1
      let realCol = col + 1
      let tmpStr = realRow + '排' + realCol + '座'
      // console.log('tmpStr: ', tmpStr)
      // 如果是已选座位点击后变未选
      if (seatValue === 1) {
        newArray[row][col] = 0
        // console.log('index: ', this.selectedList.findIndex(item => item === tmpStr))
        this.selectedList.splice(this.selectedList.indexOf(tmpStr), 1)
      } else if (seatValue === 0) {
        // 先判断当前已选座位个数，以免超过 5 个
        if (this.selectedList.length + 1 > 5) return this.$message({ message: '单次最多购买 5 张电影票！', type: 'warning' })
        newArray[row][col] = 1
        this.selectedList.push(tmpStr)
      }
      // 保存一份已选座位到订单信息中，并且计算总价钱
      this.orderInfo.selectedSeatList = this.selectedList
      // 四舍五入保留一位小数，不然 js 有时候计算有误差
      this.orderInfo.priceTotal = Math.round((this.orderInfo.price * this.orderInfo.selectedSeatList.length) * 10) / 10
      console.log('this.selectedList: ', this.selectedList)
      // 必须整体更新二维数组，Vue 无法检测到数组某一项更新，必须 slice 复制一个数组才行
      this.seatArray = newArray.slice()
    },
    // 标签被关闭时 触发
    handleTagClose(item) {
      this.selectedList.splice(this.selectedList.indexOf(item), 1)
      // 保存一份已选座位到订单信息中，并且计算总价钱
      this.orderInfo.selectedSeatList = this.selectedList
      this.orderInfo.priceTotal = Math.round((this.orderInfo.price * this.orderInfo.selectedSeatList.length) * 10) / 10
      let row = item.split('座')[0].split('排')[0] - 1
      let col = item.split('座')[0].split('排')[1] - 1

      this.seatArray[row][col] = 0
    },
    // 初始化座位数组
    initSeatArray() {
      let seatArray = Array(this.seatRow).fill(0).map(() => Array(this.seatCol).fill(0))
      this.seatArray = seatArray
      // console.log('this.seatArray: ', this.seatArray)
      // 均分父容器宽度作为座位的宽度
      // this.seatSize = this.$refs.innerSeatWrapper ? parseInt(parseInt(window.getComputedStyle(this.$refs.innerSeatWrapper).width,10) / this.seatCol,10) :0
      // 初始化不是座位的地方
      this.initNonSeatPlace()
      this.initboughtSeat()
    },
    // 初始化不是座位的地方
    initNonSeatPlace() {
      for (let i = 0; i < this.seatRow - 1; i++) {
        this.seatArray[i][0] = -1
      }
      for (let i = 0; i < 8; i++) {
        this.seatArray[i][this.seatCol - 1] = -1
        this.seatArray[i][this.seatCol - 2] = -1
      }
      for (let i = 0; i < this.seatRow - 1; i++) {
        this.seatArray[i][this.seatCol - 3] = -1
      }
      for (let i = 0; i < this.seatCol; i++) {
        this.seatArray[2][i] = -1
      }
    },
    // 初始化已售座位
    initboughtSeat() {
      // console.log('this.boughtList: ', this.boughtList)
      for (const item of this.boughtList) {
        const row = item.split('.')[0] - 0
        const col = item.split('.')[1] - 0
        this.seatArray[row - 1][col - 1] = 2
      }
      // console.log('this.seatArray: ', this.seatArray)
    },
    /**
     * 计算电影散场时间
     * start: 开始时间
     * duration: 电影时长
     * return endTime：散场时间；isSecondDay：是否为次日散场
     */
    computEndTime(start, duration) {
      let endTime = ''
      let isSecondDay = false   // 标记该场电影是否是第二天散场
      let hh = Math.floor(duration / 60)
      let mm = duration % 60
      let startHH = start.split(':')[0]
      let startMM = start.split(':')[1]
      // startHH = startHH[0] === '0' ? startHH[0].slice(0, 1) : startHH[0]
      // startMM = startMM[0] === '0' ? startMM[0].slice(0, 1) : startMM[0]
      let tmpHH = startHH - 0 + hh
      let tmpMM = startMM - 0 + mm
      if (tmpMM > 59) {
        tmpMM -= 60
        tmpHH++
      }
      if (tmpHH > 23) {
        tmpHH -= 24
        isSecondDay = true
      }
      endTime = (tmpHH - 0 < 10 ? '0' + tmpHH : tmpHH + '') + ':' + (tmpMM - 0 < 10 ? '0' + tmpMM : tmpMM + '')
      return { endTime, isSecondDay }
    },
    // 将开始时间转化为分钟，方便进行数组中对象的排序
    changeStartTime(start) {
      return ((start.split(':')[0] - 0) * 60) + (start.split(':')[1] - 0)
    },
    // 排序数组的比较函数
    compare(p) {
      return function(m, n) {
        var a = m[p]
        var b = n[p]
        return a - b  // 升序
      }
    },
    editTelphone() {},
    // 倒计时函数
    async countdown() {
      // 用来停止计时
      if (this.isStopCountdown) return
      if (this.mm === '00' && this.ss === '00') {
        this.payTimeOut()
        return
      }
      if (--this.ss < 0) {
        this.ss = 59
        this.mm--
        if (this.mm < 0) return
        this.mm = this.mm < 10 ? '0' + this.mm : this.mm + ''
      }
      // 个位数前补零
      this.ss = this.ss < 10 ? '0' + this.ss : this.ss + ''
      // 一秒后递归
      setTimeout(() => {
        this.countdown()
      }, 1000)
    },
    /**
     * 计算未来几天的日期和星期几
     * num: 0 今天 1 明天 2 后天 3 大后天...以此类推
     * return MM: 月；DD：天
     */
    computDate(num) {
      // 用当前的毫秒数 + num 天的毫秒数，再计算出日期和星期几
      const ms = +new Date() + (24 * 60 * 60 * 1000) * (num - 0)
      const date = new Date(ms)
      const YYYY = date.getFullYear()
      const MM = date.getMonth() + 1
      const DD = date.getDate()
      let day = date.getDay()   // 星期几
      switch (day) {
        case 0:
          day = '周日'
          break
        case 1:
          day = '周一'
          break
        case 2:
          day = '周二'
          break
        case 3:
          day = '周三'
          break
        case 4:
          day = '周四'
          break
        case 5:
          day = '周五'
          break
        case 6:
          day = '周六'
          break
        default:
          break
      }
      if (num === 0) {
        return { day: '今天', YYYY, MM, DD }
      } else if (num === 1) {
        return { day: '明天', YYYY, MM, DD }
      } else {
        return { day, YYYY, MM, DD }
      }
    },
    // 生成订单编号，时间戳 + 6 位随机数
    createOrderCode() {
      let orderCode = ''
      for (let i = 0; i < 6; i++) orderCode += Math.floor(Math.random() * 10)
      orderCode = +new Date() + orderCode
      console.log(orderCode)
      return orderCode
    },
    setCellStyle({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex === 0) {
      //   return 'color: #333;font-weight: bold;font-size: 16px'
      // } else return 'color: #333'
      return 'color: #333'
    }
  }
}
</script>

<style lang="scss" scoped>
.ticket-wrap {
  background-color: #fff;
	// background-color: #f4f4f4;
  .el-header {
    padding: 0;
    .header {
      position: fixed;
      top: 0;
      z-index: 999;
    }
  }
  .el-main {
    min-height: 835px;
    padding: 0 0 80px 0;
    .content-header {
      padding-top: 45px;
      margin-bottom: 75px;
      // background-color: #4c3657;
      background-image: linear-gradient(to bottom right, #6e4351, #392f59);
      .el-col .el-row {
        .col-cover {
          position: relative;
          div:nth-child(2) {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 25px;
            left: 0;
            width: 218px;
            height: 300px;
            background-color: #fff;
            box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.15);
            .el-image {
              width: 208px;
              height: 290px;
            }
          }
        }
        .col-info {
          padding-top: 25px;
          font-size: 14px;
          color: #fff;
          .movie_name {
            h1 {
              margin: 0;
              font-size: 28px;
            }
          }
          .movie_alias {
            font-size: 18px;
          }
          .movie_type,
          .movie_countryAndDur,
          .movie_releaseDate {
            margin-top: 10px;
          }
          .btns {
            margin-top: 60px;
          }
        }
      }
    }
    .content-body {
      // background-color: lightblue;
      .row-steps {
        margin-bottom: 30px;
      }
      .row-selectDate {
        font-size: 14px;
        .time {
          margin-top: 4px;
          margin-bottom: 4px;
        }
        .date {
          margin-top: 4px;
          margin-bottom: 4px;
          margin-right: 20px;
          cursor: pointer;
          &:hover {
            color: #e50914;
          }
        }
        .curDate {
          padding: 4px 10px;
          margin-top: 0;
          margin-bottom: 0;
          color: #fff;
          border-radius: 12px;
          background-color: #e50914;
          cursor: auto;
          &:hover {
            color: #fff;
          }
        }
      }
      .row-cinema-head {
        display: flex;
        padding-top: 35px;
        div {
          width: 5px;
          height: 18px;
          margin-top: 4px;
          margin-right: 6px;
          background-color: #e50914;
        }
        h3 {
          margin-top: 0;
          margin-bottom: 0px;
        }
      }
      .row-selectCinema {
        display: flex;
        align-items: center;
        margin-top: 20px;
        border-bottom: 1px #e6e6e6 solid;
        .row-cinemaName {
          margin-bottom: 7px;
          color: #333;
        }
        .row-cinemaAddress {
          margin-bottom: 20px;
          color: #999;
          font-size: 14px;
        }
        .price {
          color: #e50914;
          font-weight: 700;
          .rmb {
            margin-right: -6px;
            font-size: 12px;
            font-weight: normal;
          }
          .text {
            font-size: 12px;
            font-weight: normal;
            color: #999;
          }
        }
        .el-button {
          box-shadow: 0 2px 10px -2px #e50914;
        }
      }
      .row-noneCinema {
        padding-top: 80px;
        text-align: center;
        i {
          margin-right: 5px;
        }
      }
      .row-selectSession {
        margin-top: 30px;
        .el-button {
          box-shadow: 0 2px 10px -2px #e50914;
        }
      }
      .row-selectSeat {
        // padding: 15px 15px 50px 15px;
        border: 1px #e5e5e5 solid;
        .col-seatInfo {
          padding: 15px 0 0px 15px;
          .row-seatTips {
            .el-col {
              display: flex;
              align-items: center;
              .el-image {
                width: 30px;
                height: 30px;
                margin-right: 8px;
              }
            }
          }
          .row-screen {
            margin: 15px 0 25px 0;
            .el-col {
              font-size: 14px;
              .inner-screen {
                margin-left: 24px;
                padding: 3px 0;
                text-align: center;
                border-bottom-left-radius: 30px;
                border-bottom-right-radius: 30px;
                background-color: #e3e3e3;
              }
            }
          }
          .row-tag {
            margin-bottom: 40px;
            .el-tag {
              height: 26px;
              margin-left: 14px;
              padding: 0 6px;
              line-height: 25px;
            }
          }
          .row-seats {
            position: relative;
            .col-index {
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              height: 315px;
            }
            .outter-seat {
              display: flex;
              .seat {
                margin-left: 8px;
                margin-top: 5px;
                .inner-seat {
                  // float: left;
                  width: 100%;
                  height: 100%;
                  .el-image {
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
            .center-line {
              position: absolute;
              top: -40px;
              left: 376px;
              width: 1px;
              height: 355px;
              border-right: 1px #333 dotted;
              background-color: #fff;
            }
            // .bought-seat {
            //   background: url('D:/all_project/Front-end_project/onemovie/src/assets/bought.png') no-repeat;
            // }
            // .unselected-seat {
            //   background: url('../assets/unselected.png') no-repeat;
            // }
          }
        }
        .col-orderInfo {
          padding: 20px;
          // padding-right: 13px;
          color: #999;
          font-size: 14px;
          background-color: #f9f9f9;
          .row-textTips {
            text-align: center;
            color: #333;
            h2 {
              margin-top: 0;
              margin-bottom: 10px;
            }
          }
          .row-longLine,
          .row-shortLine {
            margin-bottom: 15px;
            .el-col {
              height: 1px;
              background-color: #bbb;
            }
          }
          .row-cinema,
          .row-room,
          .row-version,
          .row-date,
          .row-price {
            margin-bottom: 8px;
            .el-col:nth-child(2) {
              margin-left: -10px;
              color: #151515;
            }
          }
          .row-date .el-col:nth-child(2) {
            color: #e50914;
          }
          .row-price {
            padding-bottom: 10px;
            border-bottom: 1px #e5e5e5 dotted;
          }
          .row-seatCount {
            margin: 15px 0 23px 0;
            .el-col:nth-child(1) {
              display: flex;
              align-items: center;
              height: 31px;
            }
            .el-col:nth-child(2) {
              display: flex;
              align-items: center;
              height: 31px;
              margin-left: -10px;
            }
            .el-col:nth-child(3) {
              margin-left: -10px;
            }
            .el-tag {
              margin-right: 10px;
              margin-bottom: 10px;
              padding-right: 8px;
              &:nth-child(3) {
                margin-right: 0;
              }
            }
          }
          .row-unselectTips {
            margin-bottom: 40px;
            color: #151515;
            text-align: center;
            span {
              color: #e50914;
            }
          }
          .row-totalPrice {
            padding-bottom: 10px;
            border-bottom: 1px #e5e5e5 dotted;
            .el-col:nth-child(1) {
              display: flex;
              flex-direction: column-reverse;
              height: 28px;
            }
            .el-col:nth-child(2) {
              color: #e50914;
              margin-left: -10px;
              span {
                font-size: 24px;
              }
            }
          }
          .row-telphone {
            margin-top: 22px;
            .el-col:nth-child(2) {
              display: flex;
              align-items: center;
            }
          }
          .row-sureBtn {
            margin-top: 40px;
            margin-bottom: 20px;
            font-size: 16px;
            .el-col {
              display: flex;
              justify-content: center;
              .el-button {
                font-size: 16px;
                padding: 12px 97px;
                border-radius: 25px;
                box-shadow: 0 2px 10px -2px #e50914;
              }
            }
          }
        }
      }
      .row-pay {
        .row-countdown {
          padding: 20px 0 25px;
          color: #666;
          background-color: #fff3f3;
          .el-col:nth-child(1) {
            display: flex;
            align-items: center;
            height: 66px;
            i {
              margin-left: 24px;
              margin-top: 10px;
              color: #ffd2d2;
              font-size: 50px;
            }
          }
          .el-col:nth-child(2) {
            margin-left: -6px;
            .el-row:nth-child(1) {
              margin-bottom: 5px;
              span {
                margin: 0 8px;
                color: #f03d37;
                font-size: 32px;
              }
            }
            .el-row:nth-child(2) {
              color: #f03d37;
              font-size: 14px;
            }
          }
        }
        .row-payBtns {
          margin-top: 80px;
          .el-col:nth-child(1),
          .el-col:nth-child(2) {
            display: flex;
            justify-content: center;
          }
          .el-button {
            font-size: 16px;
            padding: 12px 62px;
            border-radius: 25px;
            box-shadow: 0 2px 10px -2px #e50914;
          }
        }
      }
      .row-check-in {
        .row-checkInTips {
          padding: 50px 0;
          color: #666;
          background-color: #fff3f3;
          .el-row {
            text-align: center;
            i {
              margin-right: 5px;
            }
          }
        }
        .row-goIndexBtn {
          margin-top: 80px;
          .el-col {
            display: flex;
            justify-content: center;
            .el-button {
              font-size: 16px;
              padding: 12px 62px;
              border-radius: 25px;
              box-shadow: 0 2px 10px -2px #e50914;
            }
          }
        }
      }
    }
  }
  .el-footer {
    padding: 0;
  }
}
</style>
<style lang="scss">
// 步骤条样式
.el-step__title {
  font-size: 14px;
}
.el-step__title.is-process,
.el-step__title.is-success {
  color: #e50914;
}
.el-step__title.is-wait {
  color: #999;
}
.el-step__icon {
  width: 18px;
  height: 18px;
  color: #e50914;
  font-size: 12px;
}
.el-step__icon.is-text {
  border-color: #e50914;
}
.el-step__head.is-success {
  border-color: #e50914;
  .el-step__line {
    background-color: #e50914;
  }
}
.el-step__head.is-process {
  .el-step__line {
    background-color: #ffd8d7;
  }
}
.el-step__head.is-wait {
  // border-color: #ffd8d7;
  .el-step__line {
    background-color: #ffd8d7;
  }
  .el-step__icon.is-text {
    color: #ffd8d7;
    border-color: #ffd8d7;
  }
}
// 表格样式
.table-session {
  .el-table__header {
    // background-color: #f7f7f7;
  }
  .el-table__row:hover > td {
    background-color: #ffffff !important;
  }
  .el-table__row--striped:hover > td {
    background-color: #f9f9f9 !important;
  }
}
// 渲染已选座位的 el-tag 标签样式
.el-tag .el-icon-close {
  right: -3px;
}
</style>
