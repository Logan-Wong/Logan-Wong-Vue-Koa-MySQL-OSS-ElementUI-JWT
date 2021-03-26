<template>
  <div class="app-container">
    <el-card>
      <!-- 首行，搜索框、搜索按钮 -->
      <el-row :gutter="20" class="firstRow">
        <el-col :span="5">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="handleSearchClearOrClick">
            <el-button slot="append" icon="el-icon-search" @click="handleSearchClearOrClick" />
          </el-input>
        </el-col>
        <el-col :span="18">
          <el-button type="primary" @click="addActor">添加演职员</el-button>
        </el-col>
      </el-row>
      <!-- 非首行，演职员列表表格区域 -->
      <el-table
        border
        :data="actorList"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="#"
        />
        <el-table-column
          prop="actor_id"
          label="演职员id"
          width="80"
        />
        <el-table-column
          prop="actor_avatarUrl"
          label="演职员头像"
          width="100"
        >
          <template slot-scope="scope">
            <div class="actorAvatar-box">
              <img :src="scope.row.actor_avatarUrl" class="avatar">
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="actor_name"
          label="演职员名称"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="380"
        >
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="修改时间"
          width="380"
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
            <!-- 编辑演职员按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editActor(scope.row.actor_name)" />
            <!-- 删除演职员按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delActor(scope.row.actor_id)" />
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
    <!-- 添加演职员 弹框 -->
    <el-dialog title="添加演职员" :visible.sync="addActorDialogVisible">
      <el-form ref="addActorRef" :model="addActorObj" :rules="addActorRules">
        <div class="avatar-box">
          <img :src="addActorObj.actor_avatarUrl" alt="">
          <el-upload
            ref="avatarUpload"
            class="upload"
            action="none"
            accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF"
            :multiple="false"
            :limit="1"
            :show-file-list="false"
            :before-upload="avatarIsLessThan8M"
            :http-request="selectedAvatar"
            :on-success="uploadSuccess"
          >
            <el-button size="mini" type="primary">点击上传</el-button>
          </el-upload>
        </div>
        <el-form-item v-for="item in 3" :key="item" label="" style="width: 80%" label-width="100px" prop="" />
        <el-form-item label="演职员头像" style="width: 80%" label-width="100px" prop="" />
        <el-form-item label="演职员名称" style="width: 80%" label-width="100px" prop="actor_name">
          <el-input v-model="addActorObj.actor_name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addActorDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addActorDialogSure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑演职员 弹框 -->
    <el-dialog title="修改演职员信息" :visible.sync="editActorDialogVisible">
      <el-form ref="editActorRef" :model="editActorObj" :rules="editActorRules">
        <div class="avatar-box">
          <img :src="editActorObj.actor_avatarUrl" alt="">
          <el-upload
            ref="avatarUpload"
            class="upload"
            action="none"
            accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF"
            :multiple="false"
            :limit="1"
            :show-file-list="false"
            :before-upload="avatarIsLessThan8M"
            :http-request="selectedAvatar"
            :on-success="uploadSuccess"
          >
            <el-button size="mini" type="primary">点击修改</el-button>
          </el-upload>
        </div>
        <el-form-item v-for="item in 3" :key="item" label="" style="width: 80%" label-width="100px" prop="" />
        <el-form-item label="演职员头像" style="width: 80%" label-width="100px" prop="" />
        <el-form-item label="演职员名称" style="width: 80%" label-width="100px" prop="actor_name">
          <el-input v-model="editActorObj.actor_name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editActorDialogCancel">取 消</el-button>
        <el-button type="primary" @click="editActorDialogSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import config from '../../config/index'
import OSS from 'ali-oss'

export default {
  data() {
    return {
      // 演职员列表
      actorList: [],
      // 获取演职员列表时所需的参数
      queryInfo: {
        query: '',
        // 当前页
        pagenum: 1,
        // 一页展示数据条数
        pagesize: 10
      },
      // 总数据条数
      total: null,
      ossClient: null,
      actor_name: null,
      // 控制添加演职员弹框是否显示
      addActorDialogVisible: false,
      addActorObj: {
        actor_name: '',
        actor_avatarUrl: ''
      },
      // 表单的验证规则对象
      addActorRules: {
        // 验证演职员名称
        actor_name: [
          { required: true, message: '请输入演职员名称', trigger: 'blur' }
        ]
      },
      // 控制编辑演职员弹框是否显示
      editActorDialogVisible: false,
      editActorObj: {
        actor_id: '',
        actor_name: '',
        actor_avatarUrl: ''
      },
      // 表单的验证规则对象
      editActorRules: {
        // 验证演职员名称
        actor_name: [
          { required: true, message: '请输入演职员名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getActorList()
  },
  methods: {
    async getActorList() {
      const { data: res } = await this.$http.get('getactlist', { params: this.queryInfo })
      if (res.code !== 1) return this.$message.error(res.message)
      this.actorList = res.result[0]
      this.total = res.result[1][0].total
      console.log('this.total: ', this.total)
      console.log('this.actorList: ', this.actorList)
    },
    // 当前页要展示的数据条数发生改变 触发
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getActorList()
    },
    // 当前页码改变 触发
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getActorList()
    },
    // 点击清除搜索框或者搜索按钮 触发
    handleSearchClearOrClick() {
      // 重置一下 pagenum 和 pagesize
      this.queryInfo.pagenum = 1
      this.queryInfo.pagesize = 10

      this.getActorList()
    },
    // 创建 OSS Client
    async initOSSClient() {
      const { data: res } = await this.$http.get('ststoken')
      if (res.code !== 1) return this.$message.error(res.message)

      this.ossClient = new OSS({
        accessKeyId: res.result.AccessKeyId,
        accessKeySecret: res.result.AccessKeySecret,
        stsToken: res.result.SecurityToken,
        bucket: config.OSS.bucket,
        region: config.OSS.origin
      })
    },
    // 已选择封面 触发
    async selectedAvatar(param) {
      console.log('param: ', param)
      if (!this.ossClient) await this.initOSSClient()
      const fileNameAndPath = 'img/' + this.formatDate() + '.' + param.file.type.split('/')[1]
      // 封面上传到 OSS
      const OSSRes = await this.ossClient.put(fileNameAndPath, param.file)
      console.log('ossClientRes: ', OSSRes)
      // 缓存 OSS 返回来的图片 url
      this.addActorObj.actor_avatarUrl = OSSRes.url
      this.editActorObj.actor_avatarUrl = OSSRes.url

      // 当前在修改演职员信息
      // 需要提交旧的 actor_name，保证本次发请求只修改头像
      if (this.editActorDialogVisible) {
        const { data: res } = await this.$http.put('editact', {
          actor_id: this.editActorObj.actor_id,
          actor_name: this.actor_name,
          actor_avatarUrl: this.editActorObj.actor_avatarUrl
        })
        if (res.code !== 1) return this.$message({ message: '封面修改失败！', type: 'error' })
        this.$message({ message: '封面修改成功~', type: 'success' })
      }
      // this.getMovSmallCov(this.movie_name)
    },
    // 解决不刷新页面，只能上传一次的问题
    // 每次上传成功，清空缓存中的文件
    uploadSuccess() {
      this.$refs.avatarUpload.clearFiles()
    },
    // 上传之前 触发
    // 用于校验图片大小，这里设置超过 8 MB 就阻止上传！
    avatarIsLessThan8M(file) {
      const flag = file.size / 1024 / 1024 < 8
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
    // 按下添加演职员按钮
    addActor() {
      this.addActorObj.actor_avatarUrl = ''
      this.addActorDialogVisible = true
    },
    // 点击添加演职员弹框中的确定按钮
    addActorDialogSure() {
      // 表单预检验
      this.$refs.addActorRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('addact', this.addActorObj)
        // // console.log(res)
        if (res.code !== 1) return this.$message.error('添加演职员失败!!')
        this.$message.success('添加演职员成功~')
        // 让添加演职员弹框隐藏
        this.addActorDialogVisible = false
        // 清空表单
        this.$refs.addActorRef.resetFields()
        this.getActorList()
      })
    },
    // 按下编辑演职员信息按钮
    async editActor(actor_name) {
      // 缓存一下旧的 actor_name
      this.actor_name = actor_name
      // 显示编辑演职员信息弹框
      this.editActorDialogVisible = true
      // 根据 actor_id 查询演职员信息，保存到 editActorObj，用于渲染到编辑演职员信息弹框
      const { data: res } = await this.$http.get('getactinfo', { params: { actor_name }})
      if (res.code !== 1) return
      this.editActorObj = res.result[0]
    },
    // 按下编辑演职员弹框的取消按钮
    editActorDialogCancel() {
      this.editActorDialogVisible = false
      // 清空表单
      this.$refs.editActorRef.resetFields()
      // 刷新演职员列表
      this.getActorList()
    },
    // 按下编辑演职员弹框的确定按钮
    async editActorDialogSure() {
      // 表单预检验
      this.$refs.editActorRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('editact', this.editActorObj)
        // // console.log(res)
        if (res.code !== 1) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 让修改演职员弹框隐藏
        this.editActorDialogVisible = false
        // 清空表单
        this.$refs.editActorRef.resetFields()
        // 刷新演职员列表
        this.getActorList()
      })
    },
    // 点击删除演职员按钮 触发
    async delActor(id) {
      // 弹出 MessageBox 弹框
      const confirmData = await this.$confirm('此操作将永久删除该演职员, 是否继续?', '提示', {
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
      // 执行到这里，代表演职员点了确定
      const { data: res } = await this.$http.delete('delact', { data: { actor_id: id }})
      // // console.log(res)
      if (res.code !== 1) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getActorList()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .el-card {
    .firstRow {
      margin-bottom: 15px;
    }
    // 演职员头像样式
    .actorAvatar-box {
      width: 80px;
      height: 110px;
      .avatar {
        width: 100%;
        height: 100%;
      }
    }
  }
  .el-dialog__body {
    position: relative;
    // 编辑电影弹框中的小封面盒子
    .avatar-box {
      position: absolute;
      top: 75px;
      left: 120px;
      width: 200px;
      height: 110px;
      z-index: 99;
      // background-color: pink;
      img {
        width: 80px;
        height: 100%;
      }
      .el-upload .el-button {
        position: absolute;
        bottom: 0;
        left: 105px;
      }
    }
  }
}
</style>
