<template>
  <div class="app-container">
    <el-card>
      <!-- 首行，搜索框、搜索按钮和添加用户按钮 -->
      <el-row :gutter="20" class="firstRow">
        <el-col :span="5">
          <el-input v-model="queryInfo.query" placeholder="请输入用户手机号码" clearable @clear="handleSearchClearOrClick">
            <el-button slot="append" icon="el-icon-search" @click="handleSearchClearOrClick" />
          </el-input>
        </el-col>
        <el-col :span="18">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 非首行，用户列表表格区域 -->
      <el-table
        class="userTable"
        :data="userList"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="#"
        />
        <el-table-column
          prop="user_id"
          label="用户id"
          width="65"
        />
        <el-table-column
          prop="user_avatarUrl"
          label="用户头像"
          width="80"
        >
          <template slot-scope="scope">
            <div class="block user-avatar"><el-avatar shape="square" size="large" :src="scope.row.user_avatarUrl" /></div>
          </template>
        </el-table-column>
        <el-table-column
          prop="user_phone"
          label="用户手机号"
          width="120"
        />
        <el-table-column
          prop="user_nickname"
          label="用户昵称"
        />
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
          prop="user_weight"
          label="用户订单"
          width="100"
        >
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 查看订单按钮 -->
            <el-button type="primary" icon="el-icon-check" size="mini" @click="checkUserOrder(scope.row.user_id, scope.row.user_nickname)">打开</el-button>
          </template>
        </el-table-column>
        <el-table-column
          type="expand"
          prop="user_comment"
          label="用户评论"
          width="100"
        >
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <div class="com-box">
              <div v-if="scope.row.comList.length > 0" class="all-com">
                <div v-for="(item, index) in scope.row.comList" :key="index" class="every-com">
                  <div class="movieNameAndOperate">
                    <h3>{{ item.movie_name }}</h3>
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCom(item)" />
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCom(item.com_id)" />
                  </div>
                  <div class="com-header clearfix">
                    <h3>{{ item.com_title }}</h3>
                    <span>{{ item.updateTime }}</span>
                  </div>
                  <p>{{ item.com_content }}</p>
                  <div class="likeOrNot clearfix">
                    <div class="likeOrNot-box">
                      <i class="iconfont iconyidongduan_dianzan like" />
                      <!-- <span class="likeCount">125</span> -->
                      <span class="likeCount">{{ item.com_likeCount }}</span>
                      <i class="iconfont iconyidongduan_dianzan unlike" />
                      <span class="unlikeCount">{{ item.com_notLikeCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="com-none">
                <p>该用户没有写任何个人影评。</p>
              </div>
            </div>
            <!-- 查看评论按钮 -->
            <!-- <el-button type="primary" icon="el-icon-check" size="mini" @click="checkUserCom(scope.row.user_phone)">展开</el-button> -->
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
        >
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 编辑用户按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row)" />
            <!-- 删除用户按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(scope.row.user_phone)" />
          </template>
        </el-table-column>
      </el-table>
      <!-- 完整分页布局 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 添加用户 弹框 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialogVisible">
      <el-form ref="addUserRef" :model="addUserObj" :rules="addUserRules" style="width: 60%;">
        <el-form-item label="用户昵称" label-width="100px" prop="user_nickname">
          <el-input v-model="addUserObj.user_nickname" />
        </el-form-item>
        <el-form-item label="用户手机号" label-width="100px" prop="user_phone">
          <el-input v-model="addUserObj.user_phone" />
        </el-form-item>
        <el-form-item label="用户密码" label-width="100px" prop="user_password">
          <el-input v-model="addUserObj.user_password" />
        </el-form-item>
        <div class="avatar-box">
          <div class="block"><el-avatar shape="square" :size="90" :src="addUserObj.user_avatarUrl" /></div>
          <el-upload
            ref="avatarUpload"
            class="upload"
            action="none"
            accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF"
            :multiple="false"
            :limit="1"
            :show-file-list="false"
            :before-upload="avatarIsLessThan3M"
            :http-request="selectedAvatar"
            :on-success="uploadSuccess"
          >
            <el-button size="mini" type="primary">点击上传</el-button>
          </el-upload>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserDialogSure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户 弹框 -->
    <el-dialog title="修改用户信息" :visible.sync="editUserDialogVisible" class="editUserDialog">
      <el-form ref="editUserRef" :model="editUserObj" :rules="editUserRules" style="width: 60%;">
        <el-form-item label="用户昵称" label-width="100px" prop="user_nickname">
          <el-input v-model="editUserObj.user_nickname" />
        </el-form-item>
        <el-form-item label="用户手机号" label-width="100px" prop="user_phone">
          <el-input v-model="editUserObj.user_phone" :disabled="true" />
        </el-form-item>
        <div class="avatar-box">
          <div class="block"><el-avatar shape="square" :size="90" :src="editUserObj.user_avatarUrl" /></div>
          <el-upload
            ref="avatarUpload"
            class="upload"
            action="none"
            accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF"
            :multiple="false"
            :limit="1"
            :show-file-list="false"
            :before-upload="avatarIsLessThan3M"
            :http-request="selectedAvatar"
            :on-success="uploadSuccess"
          >
            <!-- <el-link type="primary">编辑</el-link> -->
            <el-button size="mini" type="primary">点击修改</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogCancel">取 消</el-button>
        <el-button type="primary" @click="editUserDialogSure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑评论 弹框 -->
    <el-dialog title="修改评论" :visible.sync="editComDialogVisible">
      <el-form ref="editComRef" :model="editComObj" :rules="editComRules">
        <el-form-item label="评论标题" label-width="100px" prop="com_title">
          <el-input v-model="editComObj.com_title" />
        </el-form-item>
        <el-form-item label="评论内容" label-width="100px" prop="com_content">
          <el-input v-model="editComObj.com_content" type="textarea" :rows="12" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editComDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editComDialogSure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 展示用户订单的 Drawer 抽屉 -->
    <el-drawer
      :title="user_nickname + '的个人订单'"
      :visible.sync="drawerVisible"
    >
      <div class="order-box">
        <el-row v-if="orderList.length > 0" class="row-allOrder">
          <el-row v-for="item in orderList" :key="item.order_id" class="row-everyOrder">
            <el-row class="row-orderHeader">
              <el-col :span="3">{{ item.createTime.split(' ')[0] }}</el-col>
              <el-col :span="20">OneMovie订单号：{{ item.order_code }}</el-col>
              <el-col :span="1"><i class="el-icon-delete" @click="handleDelOrder(item.order_id)" /></el-col>
            </el-row>
            <el-row class="row-orderBody">
              <el-col :span="3"><div class="imgBox"><el-image :src="item.order_movCovUrl" /></div></el-col>
              <el-col :span="11">
                <el-row>《{{ item.order_movName }}》</el-row>
                <el-row>{{ item.order_cinName }}</el-row>
                <el-row>{{ item.order_cinHall }}号厅  {{ item.order_seat }}</el-row>
                <el-row>{{ item.order_session }}</el-row>
              </el-col>
              <el-col :span="3"><span>￥{{ item.order_priceTotal }}</span></el-col>
              <el-col :span="4">
                <span>{{ item.order_status }}</span>
                <i :class="item.order_status === '支付成功' ? 'el-icon-success' : 'el-icon-error'" />
              </el-col>
              <el-col :span="3">
                <span v-if="item.order_status === '超时/支付失败' || item.order_status === '支付成功'">{{ item.order_btnText }}</span>
                <el-button v-else type="primary">{{ item.order_btnText }}</el-button>
              </el-col>
            </el-row>
          </el-row>
        </el-row>
        <el-row v-else class="order-none">该用户没有任何个人订单。</el-row>
      </div>
      <!-- <div v-if="comList.length > 0" class="com-box" ref="comBox">
        <div class="everyCom" v-for="(item, index) in comList" :key="index">
          <div class="userInfo">
            <img :src="item.user_avatarUrl" alt="">
            <span class="username">{{ item.user_nickname }}</span>
            <span class="comTime">{{ item.updateTime }}</span>
          </div>
          <div class="comTitle">
            <h4>{{ item.com_title }}</h4>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCom(item, index)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"  @click="delCom(item.com_id)"></el-button>
          </div>
          <div class="comContent">
            <p>{{ isDetailComList[index] ? detailComContentList[index] : item.com_content }}<span v-if="!isShorterThan180[index]" @click="handleCom(index, item.movie_id)">{{ isDetailComList[index] ? '收起' : '展开...' }}</span></p>
          </div>
          <div class="likeOrNot clearfix">
            <div class="likeOrNot-box">
              <i class="iconfont iconthumb-up like"></i>
              <span class="likeCount">{{ item.com_likeCount }}</span>
              <i class="iconfont iconthumb-up unlike"></i>
              <span class="unlikeCount">{{ item.com_notLikeCount}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="com-none">
        <i class="el-icon-warning"></i>
        <span>该用户没有任何个人订单！</span>
      </div> -->
    </el-drawer>
  </div>
</template>

<script>
import config from '../../config/index'
import OSS from 'ali-oss'

export default {
  data() {
    // 自定义手机号验证规则
    var validatePhone = (rule, value, callback) => {
      // 手机号正则表达式
      const regPhone = /^1[3-9]\d{9}$/
      if (regPhone.test(value)) {
        // 合法手机号
        callback()
        return
      }
      callback(new Error('手机号码做用户名，请输入正确的手机号~'))
    }
    return {
      // 用户列表
      userList: [],
      // 获取用户列表时所需的参数
      queryInfo: {
        query: '',
        // 当前页
        pagenum: 1,
        // 一页展示数据条数
        pagesize: 5
      },
      // 总数据条数
      total: null,
      // 搜索框双向绑定的数据
      searchInput: '',
      // 控制添加用户弹框是否显示
      addUserDialogVisible: false,
      addUserObj: {
        user_nickname: '',
        user_phone: '',
        user_password: '',
        user_avatarUrl: ''
      },
      // 表单的验证规则对象
      addUserRules: {
        // 验证昵称
        user_nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        // 验证用户名
        user_phone: [
          { required: true, message: '请输入用户名（手机号）', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        // 验证密码
        user_password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度应为6-16位，支持字母、数字、下划线、减号', trigger: 'blur' }
        ]
      },
      // 控制编辑用户弹框是否显示
      editUserDialogVisible: false,
      editUserObj: {
        user_id: '',
        user_nickname: '',
        user_phone: '',
        user_password: '',
        user_avatarUrl: ''
      },
      user_nickname: '',
      ossClient: null,
      // 表单的验证规则对象
      editUserRules: {
        // 验证昵称
        user_nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ]
      },
      editComDialogVisible: false,
      editComObj: {
        com_id: '',
        com_title: '',
        com_content: ''
      },
      editComRules: {
        // 验证评论标题
        com_title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        com_content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      // 只保存单个用户的评论列表
      comList: [],
      isDetailComList: [],
      // 详细评论内容数组
      detailComContentList: [],
      // 标记评论内容是否短于180的数组
      isShorterThan180: [],
      // 控制 Drawer 抽屉是否显示
      drawerVisible: false,
      orderList: [],
      user_id: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('getuserlist', {
        params: this.queryInfo
      })
      const { result } = res
      // console.log('result: ', result);
      if (res.code !== 1) return this.$message.error(res.message)
      this.userList = result[0]
      console.log('this.userList: ', this.userList)
      this.total = result[1][0].total
      this.getUserComList()
    },
    async getUserInfo(user_phone) {
      const { data: res } = await this.$http.get('getuserinfo', { params: { user_phone }})
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      this.editUserObj = res.result
    },
    // 获取订单列表
    async getOrderList(user_id) {
      const { data: res } = await this.$http.get('getordlist', { params: { user_id }})
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      // console.log('res: ', res)
      this.orderList = res.result
      console.log('this.orderList: ', this.orderList)
      // 过滤掉待支付的订单，该页面暂时不支持支付待支付的订单
      for (let i = 0; i < this.orderList.length; i++) {
        if (this.orderList[i].order_status === 2) {
          this.orderList.splice(this.orderList.indexOf(this.orderList[i]), 1)
          i--
        }
      }
      for (const item of this.orderList) {
        if (item.order_status === 0) {
          item.order_status = '超时/支付失败'
          item.order_btnText = '已取消'
        } else if (item.order_status === 1) {
          item.order_status = '支付成功'
          item.order_btnText = '已完成'
        } else if (item.order_status === 2) {
          item.order_status = '待支付'
          item.order_btnText = '去付款'
        } else item.order_status = '发生未知错误'
      }
    },
    // 当前页要展示的数据条数发生改变 触发
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    // 当前页码改变 触发
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    // 点击清除搜索框或者搜索按钮 触发
    handleSearchClearOrClick() {
      // 重置一下 pagenum 和 pagesize
      this.queryInfo.pagenum = 1
      this.queryInfo.pagesize = 5

      this.getUserList()
    },
    // 点击删除用户按钮 触发
    async delUser(phone) {
      // 弹出 MessageBox 弹框
      const confirmData = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
      const { data: res } = await this.$http.delete('deluser', { data: { user_phone: phone }})
      // // console.log(res)
      if (res.code !== 1) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getUserList()
    },
    // 按下添加用户按钮
    addUser() {
      this.addUserObj.user_avatarUrl = ''
      this.addUserDialogVisible = true
    },
    // 点击添加用户弹框中的确定按钮
    addUserDialogSure() {
      // 表单预检验
      this.$refs.addUserRef.validate(async valid => {
        if (!valid) return
        // console.log('this.addUserObj: ', this.addUserObj)
        const { data: res } = await this.$http.post('register', this.addUserObj)
        // console.log('res: ', res)
        if (res.code !== 1) return this.$message.error('添加用户失败!!')
        this.$message.success('添加用户成功~')
        // 让添加用户弹框隐藏
        this.addUserDialogVisible = false
        // 清空表单
        this.$refs.addUserRef.resetFields()
        this.getUserList()
      })
    },
    // 按下编辑用户信息按钮
    async editUser(userObj) {
      // 缓存一下旧的 user_nickname
      this.user_nickname = userObj.user_nickname
      // 显示编辑用户信息弹框
      this.editUserDialogVisible = true
      // 根据 user_phone 查询用户信息，保存到 editUserObj，用于渲染到编辑用户信息弹框
      this.getUserInfo(userObj.user_phone)
    },
    // 创建 OSS Client
    async initOSSClient() {
      const { data: res } = await this.$http.get('ststoken')
      if (res.code !== 1) return this.$message.error(res.message)
      // console.log('res.result: ', res)

      this.ossClient = new OSS({
        accessKeyId: res.result.AccessKeyId,
        accessKeySecret: res.result.AccessKeySecret,
        stsToken: res.result.SecurityToken,
        bucket: config.OSS.bucket,
        region: config.OSS.origin
      })
    },
    // 已选择头像 触发
    async selectedAvatar(param) {
      console.log('param.file: ', param.file)
      if (!this.ossClient) await this.initOSSClient()
      const fileNameAndPath = 'img/' + this.formatDate() + '.' + param.file.type.split('/')[1]
      // console.log('fileNameAndPath: ', fileNameAndPath)
      // 头像上传到 OSS
      const OSSRes = await this.ossClient.put(fileNameAndPath, param.file)
      console.log('ossClientRes: ', OSSRes)
      // 缓存 OSS 返回来的图片 url
      this.editUserObj.user_avatarUrl = OSSRes.url
      this.addUserObj.user_avatarUrl = OSSRes.url

      // 当前在修改用户信息
      // 需要提交旧的 user_nickname，保证本次发请求只修改头像
      if (this.editUserDialogVisible) {
        const { data: res } = await this.$http.put('edituser', {
          user_phone: this.editUserObj.user_phone,
          user_nickname: this.user_nickname,
          user_avatarUrl: this.editUserObj.user_avatarUrl,
          user_password: this.editUserObj.user_password
        })
        if (res.code !== 1) return this.$message({ message: '头像修改失败！', type: 'error' })
        this.$message({ message: '头像修改成功~', type: 'success' })
      }
      // this.getUserInfo()
    },
    // 解决不刷新页面，只能上传一次的问题
    // 每次上传成功，清空缓存中的文件
    uploadSuccess(response, file, fileList) {
      this.$refs.avatarUpload.clearFiles()
    },
    // 上传之前 触发
    // 用于校验图片大小，这里设置超过 3 MB 就阻止上传！
    avatarIsLessThan3M(file) {
      const flag = file.size / 1024 / 1024 < 3
      if (!flag) {
        this.$message.error('图片大小不可超过3MB!')
        return false
      } else {
        return true
      }
    },
    // 格式化日期
    formatDate() {
      const date = new Date(+new Date())
      const YYYY = date.getFullYear()
      const MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
      const DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      const hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      const mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      const ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      let ms = date.getMilliseconds()
      if (ms < 10) {
        ms += '00'
      } else if (ms < 100) {
        ms += '0'
      }
      return YYYY + MM + DD + hh + mm + ss + ms
    },
    // 按下编辑用户弹框的取消按钮
    editUserDialogCancel() {
      this.editUserDialogVisible = false
      // 刷新用户列表，用户只修改头像时，可能改完会点取消按钮
      this.getUserList()
    },
    // 按下编辑用户弹框的确定按钮
    async editUserDialogSure() {
      // 表单预检验
      this.$refs.editUserRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('edituser', this.editUserObj)
        // // console.log(res)
        if (res.code !== 1) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 让修改用户弹框隐藏
        this.editUserDialogVisible = false
        // 清空表单
        // this.$refs.editUserRef.resetFields()
        // 刷新用户列表
        this.getUserList()
      })
    },
    async getUserComList() {
      for (const item of this.userList) {
        const { data: res } = await this.$http.get('getusercomlist', {
          params: { user_id: item.user_id }
        })
        if (res.code !== 1) return this.$message.error(res.message)
        // console.log('res.result: ', res.result)
        item.comList = res.result
      }
      // console.log('userList: ', this.userList);
    },
    // 点击编辑评论按钮 触发
    editCom(item) {
      console.log('item: ', item)
      this.editComDialogVisible = true

      this.editComObj.com_id = item.com_id
      this.editComObj.com_title = item.com_title
      this.editComObj.com_content = item.com_content
    },
    // 点击编辑评论弹框的确定按钮
    async editComDialogSure() {
      const { data: res } = await this.$http.put('editcom', this.editComObj)
      if (res.code !== 1) return this.$message.error(res.message)
      this.$message.success(res.message)

      this.editComDialogVisible = false
      // 清空表单
      this.$refs.editComRef.resetFields()
      this.getUserList()
    },
    // 点击删除评论按钮 触发
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
      const { data: res } = await this.$http.delete('delcom', { data: { com_id: id }})
      // console.log(res)
      if (res.code !== 1) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getUserList()
    },
    // 点击打开用户订单按钮 触发
    checkUserOrder(id, user_nickname) {
      this.drawerVisible = true
      // 缓存一下 user_nickname 和 user_id
      this.user_nickname = user_nickname
      this.user_id = id
      this.getOrderList(id)
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
      const { data: res } = await this.$http.delete('delorder', { data: { order_id: id }})
      // console.log('res: ', res)
      if (res.code !== 1) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getOrderList(this.user_id)
    }
    // 点击展开行按钮时 触发
    // handleExpandChange(row) {
    //   console.log('row: ', row)
    //   this.getComList(row.user_id)
    // },
    // 获取单个用户评论列表
    // async getComList(id) {
    //   const { data: res } = await this.$http.get('getusercomlist', {
    //     params: { user_id: id }
    //   })
    //   if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
    //   this.comList = res.result
    //   // 原本的 comList 中的 com_content 字段存放简要内容，详细内容存在 detailComContentList 中
    //   for (let i = 0; i < this.comList.length; i++) {
    //     console.log(i + ': ' + this.comList[i].com_content.length)
    //     if (this.comList[i].com_content.length <= 180) this.isShorterThan180[i] = true
    //     this.detailComContentList[i] = this.comList[i].com_content
    //     this.comList[i].com_content = this.comList[i].com_content.slice(0, 150)
    //   }
    //   // console.log('this.comList: ', this.comList)
    // },
    // // 展开收起评论 触发
    // handleCom(id, i) {
    //   this.isDetailComList[i] = !this.isDetailComList[i]
    //   // console.log('this.isDetailComList: ', this.isDetailComList)
    //   // 手动刷新 获取单个用户评论列表
    //   this.getComList(id)
    // }
  }
}
</script>

<style lang="scss" scoped>
.firstRow {
  margin-bottom: 15px;
}
.user-avatar {
  width: 40px;
  height: 40px;
}
// 用户评论样式
.com-box {
  border-top: 1px #d2d2d7 solid;
  padding: 85px 30px 0 30px;
  .all-com {
    .every-com {
      margin-bottom: 15px;
      padding: 5px 20px 20px;
      border-radius: 8px;
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
      .com-header {
        height: 60px;
        h3 {
          float: left;
          margin-right: 20px;
          line-height: 22px;
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
.el-dialog__body {
  position: relative;
  // 编辑用户弹框中的头像盒子
  .avatar-box {
    position: absolute;
    top: 86px;
    right: 40px;
    width: 250px;
    height: 90px;
    // background-color: pink;
    .el-upload .el-button {
      position: absolute;
      bottom: 0;
      left: 110px;
    }
  }
}
// 用户订单样式
.order-box {
  border-top: 1px #d2d2d7 solid;
  padding: 50px 15px 0 15px;
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
    padding: 100px 0;
    text-align: center;
  }
}
</style>
<style lang="scss">
.userTable {
  .el-table__expand-column .cell {
    .el-table__expand-icon--expanded { // 这是点击后的旋转角度
      transform: rotate(180deg);
    }
    .el-table__expand-icon {
      .el-icon-arrow-right:before { // 这是展开图标
        content: "\e6df";
      }
    }
  }
}
.avatar-box {
  .el-avatar--square {
    border-radius: 8px;
  }
}
// 抽屉样式
.el-drawer.rtl {
  width: 50% !important;
  overflow: scroll;
}
.el-drawer__header {
  font-size: 20px;
  :focus {
    outline:0;
  }
}
.el-drawer__body {
  margin: 0 20px;
}
</style>
