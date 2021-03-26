<template>
  <div class="app-container selling-wrap">
    <el-card>
      <!-- 首行，搜索框、搜索按钮 -->
      <el-row :gutter="20" class="firstRow">
        <el-col :span="3">
          <area-cascader v-model="selectedAreaList" :level="1" :data="pcaa" type="all" size="large" @change="handleAreaChange" />
        </el-col>
        <el-col :span="18">
          <el-button type="primary" icon="el-icon-refresh" size="small" @click="handleClear">重置</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addSelling">添加放映信息</el-button>
        </el-col>
      </el-row>
      <!-- 非首行，上映信息列表表格区域 -->
      <el-table
        border
        :data="sellingList"
        :default-sort="{order: 'descending'}"
        style="width: 100%"
        @expand-change="handleExpandChange"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row>
              <el-tabs tab-position="left" @tab-click="handleTabClick">
                <el-tab-pane v-for="(item, index) in props.row.selling_startTime.split(',')" :key="index" :label="item">
                  <el-row>
                    <el-col :span="12" :offset="3">
                      <el-row class="row-seatTips">
                        <el-col :span="5" :offset="2">
                          <el-image :src="unselected" /><span>可选座位</span>
                        </el-col>
                        <el-col :span="5">
                          <el-image :src="bought" />已售座位
                        </el-col>
                        <el-col :span="5">
                          <el-image :src="selected" />已选座位
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
                            <div
                              v-for="col in seatCol"
                              v-show="seatArray.length > 0"
                              :key="col"
                              class="seat"
                              :style="{ width: seatSize + 'px', height: seatSize + 'px' }"
                            >
                              <div
                                v-if="seatArray[row - 1][col - 1] !== -1"
                                class="inner-seat"
                              >
                                <el-image v-show="seatArray[row - 1][col - 1] === 0" :src="unselected" />
                                <el-image v-show="seatArray[row - 1][col - 1] === 1" :src="selected" />
                                <el-image v-show="seatArray[row - 1][col - 1] === 2" :src="bought" />
                              </div>
                            </div>
                          </div>
                        </el-col>
                        <div class="center-line" />
                      </el-row>
                    </el-col>
                  </el-row>
                </el-tab-pane>
              </el-tabs>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="#"
        />
        <el-table-column
          prop="selling_id"
          label="上映id"
          width="65"
        />
        <el-table-column
          prop="selling_date"
          label="放映日期"
          sortable
          width="110"
        >
          <template />
        </el-table-column>
        <el-table-column
          prop="movie_name"
          label="电影名称"
        />
        <el-table-column
          prop="cinema_name"
          label="影院名称"
        />
        <el-table-column
          prop="cinema_hallNum"
          label="影厅号"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.cinema_hallNum }}号厅
          </template>
        </el-table-column>
        <el-table-column
          prop="selling_price"
          label="单价"
          width="100"
        >
          <template slot-scope="scope">
            ￥{{ scope.row.selling_price }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160"
        >
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="修改时间"
          width="160"
        >
          <template slot-scope="scope">
            {{ scope.row.updateTime }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
        >
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 编辑上映信息按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editSelling(scope.row.selling_id)" />
            <!-- 删除上映信息按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delSelling(scope.row.selling_id)" />
          </template>
        </el-table-column>
      </el-table>
      <!-- 完整分页布局 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 30, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 添加上映信息 弹框 -->
    <el-dialog title="添加放映信息" :visible.sync="addSellingDialogVisible">
      <el-form ref="addSellingRef" :model="addSellingObj" :rules="addSellingRules" class="form-addSelling">
        <!-- <el-form-item v-for="item in 3" :key="item" label="" style="width: 80%" label-width="100px" prop="">
        </el-form-item> -->
        <el-form-item label="电影名称" style="width: 80%" label-width="100px" prop="">
          <el-select v-model="addSellingObj.movie_id" placeholder="请选择电影" @change="movieSelectChange">
            <el-option
              v-for="item in selMovieList"
              :key="item.movie_id"
              :label="item.movie_name"
              :value="item.movie_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="放映区域" style="width: 80%" label-width="100px" prop="">
          <area-cascader v-model="selectedAddSelAreaList" :level="1" :data="pcaa" type="all" size="large" @change="handleAddSelAreaChange" />
        </el-form-item>
        <el-form-item label="影院名称" style="width: 80%" label-width="100px" prop="">
          <el-select v-model="addSellingObj.cinema_id" placeholder="请选择影院" @visible-change="cinemaSelectVisibleChange">
            <el-option
              v-for="item in cinemaList"
              :key="item.cinema_id"
              :label="item.cinema_name"
              :value="item.cinema_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="影厅" style="width: 80%" label-width="100px" prop="">
          <el-select v-model="addSellingObj.cinema_hallNum" placeholder="请选择影厅" @visible-change="hallSelectVisibleChange">
            <el-option
              v-for="item in cinemaHallList"
              :key="item"
              :label="item + '号厅'"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="放映日期" style="width: 80%" label-width="100px" prop="selling_name">
          <el-date-picker
            v-model="addSellingObj.selling_date"
            type="date"
            placeholder="选择日期"
            format="yyyy年M月dd日"
            value-format="yyyy.M.dd"
          />
        </el-form-item>
        <el-form-item label="开始时间" style="width: 100%" label-width="100px" prop="">
          <el-tag
            v-for="tag in dynamicTimeTags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleTimeTagClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="timeInputVisible"
            ref="saveTimeTagInput"
            v-model="timeInputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleTimeInputConfirm"
            @blur="handleTimeInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showTimeInput">添加时间</el-button>
          <el-row v-if="selectedMovieDuration" class="row-duration">
            Tips: 当前影片时长
            <el-tag type="warning">{{ selectedMovieDuration }}</el-tag>
            分钟
          </el-row>
        </el-form-item>
        <el-form-item label="售卖单价" style="width: 80%" label-width="100px" prop="selling_price">
          <el-input v-model="addSellingObj.selling_price" placeholder="29.8" type="number">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSellingDialogCancel">取 消</el-button>
        <el-button type="primary" @click="addSellingDialogSure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑上映信息 弹框 -->
    <!-- <el-dialog title="修改上映信息信息" :visible.sync="editSellingDialogVisible">
      <el-form :model="editSellingObj" :rules="editSellingRules" ref="editSellingRef">
        <el-form-item v-for="item in 3" :key="item" label="" style="width: 80%" label-width="100px" prop="">
        </el-form-item>
        <el-form-item label="上映信息头像" style="width: 80%" label-width="100px" prop="">
        </el-form-item>
        <el-form-item label="上映信息名称" style="width: 80%" label-width="100px" prop="selling_name">
          <el-input v-model="editSellingObj.selling_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editSellingDialogCancel">取 消</el-button>
        <el-button type="primary" @click="editSellingDialogSure">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { pcaa } from 'area-data'
import unselected from '@/assets/unselected.png'
import bought from '@/assets/bought.png'
import selected from '@/assets/selected.png'

export default {
  data() {
    const checkPrice = (rule, value, callback) => {
      const tmpArr = (value + '').split('.')
      if (tmpArr[0].length > 3) {
        callback(new Error('售卖单价应当在1000以内！'))
      }
      if (tmpArr.length === 2 && tmpArr[1].length > 1) {
        callback(new Error('售卖单价只保留一位小数！'))
      }
      callback()
      // if (tmpArr.length > 3) {
      //   callback(new Error('不应有多个小数点！'))
      // }
    }
    return {
      // 上映信息列表
      sellingList: [],
      // 获取上映信息列表时所需的参数
      queryInfo: {
        country_id: '',
        // 当前页
        pagenum: 1,
        // 一页展示数据条数
        pagesize: 10
      },
      // 总数据条数
      total: null,
      selectedAreaList: [],
      pcaa,
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
      selling_id: '',
      seat_startTime: '',
      // 控制添加上映信息弹框是否显示
      addSellingDialogVisible: false,
      selMovieList: [],
      selectedMovieInfo: '',
      selectedMovieDuration: '',
      backupMovieDuration: '',
      selectedAddSelAreaList: [],
      cinemaList: [],
      cinemaHallList: [],
      dynamicTimeTags: [],
      timeInputVisible: false,
      timeInputValue: '',
      // addSellingObj: {
      //   selling_avatarUrl: ''
      // },
      addSellingObj: {
        movie_id: '',
        country_id: '',
        cinema_id: '',
        cinema_hallNum: '',
        selling_date: '',
        selling_startTime: '',
        selling_price: ''
      },
      // 表单的验证规则对象
      addSellingRules: {
        // 验证售卖单价
        selling_price: [
          { required: true, message: '售卖单价不能为空', trigger: 'blur' },
          { validator: checkPrice, trigger: 'blur' }
        ]
      },
      isAddSellingFlag: true,
      // 控制编辑上映信息弹框是否显示
      editSellingDialogVisible: false,
      /** **************************************/
      selling_name: null,
      editSellingObj: {
        selling_id: '',
        selling_name: '',
        selling_avatarUrl: ''
      },
      // 表单的验证规则对象
      editSellingRules: {
        // 验证上映信息名称
        selling_name: [
          { required: true, message: '请输入上映信息名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getSellingList()
  },
  methods: {
    // 获取上映列表
    async getSellingList() {
      const { data: res } = await this.$http.get('getsellistback', { params: this.queryInfo })
      if (res.code !== 1) return this.$message.error(res.message)
      this.sellingList = res.result[0]
      // console.log('this.sellingList: ', this.sellingList)
      this.total = res.result[1][0].total
      // console.log('this.total: ', this.total)
      for (const item of this.sellingList) {
        item.movie_name = await this.getMovieInfo(item.movie_id)
        item.cinema_name = await this.getCinemaInfo(item.cinema_id)
      }
      // 为数组的每一项添加了属性 movie_name 和 cinema_name，但 vue 检测不到数组的更新，要手动刷新（这里随便刷新了一项）
      const tmpLen = this.sellingList.length - 1
      this.$set(this.sellingList, tmpLen, this.sellingList[tmpLen])
      // console.log('this.sellingList: ', this.sellingList);
    },
    // 根据电影 ID 获取电影信息
    async getMovieInfo(movie_id) {
      const { data: res } = await this.$http.get('getmovinfo', { params: { movie_id }})
      // console.log('res: ', res)
      if (res.code !== 1) return this.$message.error(res.message)
      return res.result[0].movie_name
    },
    // 根据影院 ID 获取影院信息
    async getCinemaInfo(cinema_id) {
      const { data: res } = await this.$http.get('getcininfo', { params: { cinema_id }})
      // console.log('res: ', res)
      if (res.code !== 1) return this.$message.error(res.message)
      return res.result[0].cinema_name
    },
    // 获取已选场次的座位等信息
    async getSeatAndOrderInfo() {
      // this.boughtList = []
      // console.log('selling_id, seat_startTime: ', selling_id, seat_startTime)
      const { data: res } = await this.$http.get('getseatinfo', { params: { selling_id: this.selling_id, seat_startTime: this.seat_startTime }})
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      // console.log('res: ', res)
      if (res.result.length > 0) {
        // this.seat_id = res.result[0].seat_id
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
    // 获取正在热映电影列表
    async getMovieList() {
      const { data: res } = await this.$http.get('getsallmovlist', { params: {
        query: '',
        pagenum: '1',
        pagesize: '28'
      }})
      // console.log('sellmovielist:', res)
      if (res.code !== 1) return this.$message.error(res.message)
      this.selMovieList = res.result[0]
    },
    // 获取影院列表
    async getCinemaList() {
      if (!this.addSellingObj.country_id) return this.$message.error('请先选择区域！')
      const { data: res } = await this.$http.get('getcinlistsim', { params: {
        country_id: this.addSellingObj.country_id
      }})
      // console.log('sellmovielist:', res)
      if (res.code !== 1) return this.$message.error(res.message)
      this.cinemaList = res.result
      if (!this.isAddSellingFlag) {
        this.getCinemaHall()
      }
    },
    // 获取影厅列表
    getCinemaHall() {
      // console.log('this.cinemaList: ', this.cinemaList)
      if (!this.addSellingObj.cinema_id) return this.$message.error('请先选择影院！')
      for (const item of this.cinemaList) {
        if (item.cinema_id === this.addSellingObj.cinema_id - 0) {
          // console.log('this.cinemaHallList: ', this.cinemaHallList)
          this.cinemaHallList = item.cinema_hallNums.split(',')
        }
      }
    },
    // 当前页要展示的数据条数发生改变 触发
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getSellingList()
    },
    // 当前页码改变 触发
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getSellingList()
    },
    // 选中一个区域 触发
    handleAreaChange() {
      for (const key in this.selectedAreaList[2]) {
        if (Object.hasOwnProperty.call(this.selectedAreaList[2], key)) {
          // this.$store.commit('SET_DISTRICT_ID', key)
          // this.$store.commit('SET_DISTRICT', this.selectedAreaList[2][key])
          // this.addSellingObj.country_id = key
          this.queryInfo.country_id = key
          console.log('this.addSellingObj.country_id: ', this.addSellingObj.country_id)
          // this.district = this.selectedAreaList[2][key]
          this.getSellingList()
        }
      }
      // this.queryInfo.country_id = this.selectedAreaList
    },
    // 重置区域 触发
    handleClear() {
      this.queryInfo.country_id = ''
      this.getSellingList()
    },
    // 选择展开行中的时间节点 触发
    handleTabClick(e) {
      // console.log('e.label: ', e.label)
      this.seat_startTime = e.label
      this.getSeatAndOrderInfo()
    },
    // 点击展开行 触发
    handleExpandChange(row, expandedRows) {
      this.selling_id = row.selling_id
      this.seat_startTime = row.selling_startTime.split(',')[0]
      this.getSeatAndOrderInfo()
      // console.log('row, expandedRows: ', row, expandedRows)
    },
    // 按下添加上映信息按钮
    addSelling() {
      this.addSellingDialogVisible = true
      this.isAddSellingFlag = true
      this.getMovieList()
    },
    // 选择一个区域 触发
    handleAddSelAreaChange() {
      for (const key in this.selectedAddSelAreaList[2]) {
        if (Object.hasOwnProperty.call(this.selectedAddSelAreaList[2], key)) {
          this.addSellingObj.country_id = key
          // console.log('this.addSellingObj.country_id: ', this.addSellingObj.country_id)
        }
      }
    },
    // 电影选择器选中值之后 触发
    movieSelectChange(e) {
      // console.log('e: ', e)
      // this.addSellingObj.movie_id = e.movie_id
      for (const item of this.selMovieList) {
        if (item.movie_id === e) {
          this.selectedMovieDuration = item.movie_duration
          this.backupMovieDuration = item.movie_duration
          return
        }
      }
    },
    // 影院选择器显示/隐藏 触发
    cinemaSelectVisibleChange(e) {
      if (e) {
        this.getCinemaList()
      }
    },
    // 影厅选择器显示/隐藏 触发
    hallSelectVisibleChange(e) {
      if (e) {
        this.getCinemaHall()
      }
    },
    // 删除任一时间标签 触发
    handleTimeTagClose(tag) {
      this.dynamicTimeTags.splice(this.dynamicTimeTags.indexOf(tag), 1)
    },
    // 显示时间输入框
    showTimeInput() {
      this.timeInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTimeTagInput.$refs.input.focus()
      })
    },
    // 确定输入的时间 触发
    handleTimeInputConfirm() {
      const timeInputValue = this.timeInputValue
      if (timeInputValue) {
        this.dynamicTimeTags.push(timeInputValue)
      }
      this.timeInputVisible = false
      this.timeInputValue = ''
    },
    // 点击添加上映信息弹框中的确定按钮
    addSellingDialogSure() {
      // console.log('this.dynamicTimeTags: ', this.dynamicTimeTags)
      this.addSellingObj.selling_startTime = this.dynamicTimeTags.join(',')
      // 表单预检验
      this.$refs.addSellingRef.validate(async valid => {
        if (!valid) return
        // console.log('this.addSellingObj: ', this.addSellingObj)
        // 当前正在添加上映信息
        if (this.isAddSellingFlag) {
          const { data: res } = await this.$http.post('addselling', this.addSellingObj)
          // console.log(res)
          if (res.code !== 1) return this.$message.error('添加上映信息失败!!')
          this.$message.success('添加上映信息成功~')
        } else { // 当前正在修改上映信息
          const { data: res } = await this.$http.put('editselling', this.addSellingObj)
          // console.log(res)
          if (res.code !== 1) return this.$message.error(res.message)
          this.$message.success(res.message)
        }
        // console.log('this.addSellingObj: ', this.addSellingObj)
        // 让添加上映信息弹框隐藏
        this.addSellingDialogVisible = false
        // 清空整个表单
        this.addSellingObj.movie_id = ''
        this.addSellingObj.cinema_id = ''
        this.addSellingObj.cinema_hallNum = ''
        this.addSellingObj.selling_date = ''
        this.dynamicTimeTags = []
        this.selectedMovieDuration = ''
        this.$refs.addSellingRef.resetFields()
        this.getSellingList()
      })
    },
    // 按下编辑上映信息信息按钮
    async editSelling(id) {
      // 缓存一下旧的 selling_name
      // this.selectedMovieDuration = this.backupMovieDuration
      this.isAddSellingFlag = false
      // 显示编辑上映信息弹框
      this.addSellingDialogVisible = true
      // 根据 selling_id 查询上映信息信息，保存到 editSellingObj，用于渲染到编辑上映信息信息弹框
      // const { data: res } = await this.$http.get('getselinfo', { params: { selling_name } })
      // if (res.code !== 1) return
      for (const item of this.sellingList) {
        if (item.selling_id === id) {
          this.addSellingObj = item
          // console.log('this.addSellingObj: ', this.addSellingObj)
          this.getMovieList()
          this.getCinemaList()
          this.dynamicTimeTags = item.selling_startTime.split(',')
          for (const key of this.selMovieList) {
            if (item.movie_name === key.movie_name) {
              this.selectedMovieDuration = key.movie_duration
              // console.log('65413')
            }
          }
          return
        }
      }
    },
    // 按下添加/编辑上映信息弹框的取消按钮
    addSellingDialogCancel() {
      this.addSellingDialogVisible = false
      // 清空整个表单
      this.addSellingObj.movie_id = ''
      this.addSellingObj.cinema_id = ''
      this.addSellingObj.cinema_hallNum = ''
      this.addSellingObj.selling_date = ''
      this.dynamicTimeTags = []
      this.selectedMovieDuration = ''
      this.$refs.addSellingRef.resetFields()
      // 刷新上映信息列表
      this.getSellingList()
    },
    // 按下编辑上映信息弹框的确定按钮
    // async editSellingDialogSure() {
    //   // 表单预检验
    //   this.$refs.editSellingRef.validate(async valid => {
    //     if (!valid) return
    //     const { data: res } = await this.$http.put('editact', this.editSellingObj)
    //     // // console.log(res)
    //     if (res.code !== 1) return this.$message.error(res.message)
    //     this.$message.success(res.message)
    //     // 让修改上映信息弹框隐藏
    //     this.editSellingDialogVisible = false
    //     // 清空整个表单
    //     this.addSellingObj.movie_id = ''
    //     this.addSellingObj.cinema_id = ''
    //     this.addSellingObj.cinema_hallNum = ''
    //     this.addSellingObj.selling_date = ''
    //     this.dynamicTimeTags = []
    //     this.$refs.addSellingRef.resetFields()
    //     // 刷新上映信息列表
    //     this.getSellingList()
    //   })
    // },
    // 点击删除上映信息按钮 触发
    async delSelling(id) {
      // 弹出 MessageBox 弹框
      const confirmData = await this.$confirm('此操作将永久删除该放映条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 点击 取消， confirmData 为 cancel
      // 点击 确定， confirmData 为 confirm
      // 点击了取消按钮
      if (confirmData !== 'confirm') {
        return this.$message.info('已取消删除~')
      }
      // 执行到这里，代表点了确定
      const { data: res } = await this.$http.delete('delselling', { data: { selling_id: id }})
      // // console.log(res)
      if (res.code !== 1) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getSellingList()
    },
    // 初始化座位数组
    initSeatArray() {
      const seatArray = Array(this.seatRow).fill(0).map(() => Array(this.seatCol).fill(0))
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
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .el-card {
    .firstRow {
      margin-bottom: 15px;
      .el-col:nth-child(3) {
        padding-left: 58px !important;
      }
    }
    .el-table {
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
  }
}
</style>

<style lang="scss">
.el-button--small {
  padding: 8px 15px;
}
.el-tabs__item {
  padding-left: 0;
}
.el-tabs__header {
  margin: 50px 0;
}
.selling-wrap .el-dialog {
  width: 35%;
}
.form-addSelling {
  .area-select {
    height: 36px;
  }
  .area-select .area-selected-trigger {
    line-height: 18px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .row-duration {
    .el-tag {
      margin: 0 5px;
      height: 20px;
      line-height: 18px;
    }
  }
  .el-input-group {
    width: 40%;
  }
}
</style>
