<template>
  <div class="account-wrap">
    <!-- 头部 -->
		<Header class="header"></Header>
    <!-- 正文内容 -->
    <div class="content">
      <div class="content-header">
        <div class="greet">
          <h1>嗨，{{ userObj.user_nickname }}</h1>
        </div>
      </div>
      <div class="content-body clearfix">
        <h1>账户设置</h1>
        <div class="avatar clearfix">
          <div class="left">
            <h3>头像</h3>
          </div>
          <div class="right">
            <div class="block"><el-avatar shape="square" :size="90" :src="userObj.user_avatarUrl"></el-avatar></div>
            <el-upload
              class="upload"
              ref="avatarUpload"
              action="none"
              accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF"
              :multiple="false"
              :limit="1"
              :show-file-list="false"
              :before-upload="avatarIsLessThan3M"
              :http-request="selectedAvatar"
              :on-success="uploadSuccess">
              <el-link type="primary">编辑</el-link>
              <!-- <el-button size="small" type="primary">点击上传</el-button> -->
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </div>
        </div>
        <div class="nickname clearfix">
          <div class="left">
            <h3>昵称</h3>
          </div>
          <div class="right">
            <p v-if="!editingNickname">{{ userObj.user_nickname }}</p>
            <el-input v-else v-model="userObj.user_nickname" placeholder="请输入昵称" ref="nicknameInput" @blur="nicknameBlur" @keyup.enter.native="nicknameEnter"></el-input>
            <el-link v-if="!editingNickname" type="primary" @click="editNickname">编辑</el-link>
            <el-button v-else type="primary" size="mini" @click="submitNickname">完成</el-button>
          </div>
        </div>
        <div class="userphone clearfix">
          <div class="left">
            <h3>OneMovie ID</h3>
          </div>
          <div class="right">
            {{ userObj.user_phone }}
            <p>OneMovie ID 是你用来登录 OneMovie 网的手机号码。</p>
          </div>
        </div>
        <div class="userpwd clearfix">
          <div class="left">
            <h3>密码</h3>
          </div>
          <div class="right">
            <p>········</p>
            <el-link type="primary" @click="editUserPwd">编辑</el-link>
          </div>
        </div>
      </div>
    </div>
		<!-- 底部 -->
    <Footer></Footer>
    <!-- 修改密码 弹框 -->
    <el-dialog title="修改密码" :visible.sync="editPwdDialogVisible">
      <el-form :model="editPwdObj" :rules="editPwdRules" ref="editPwdRef" status-icon class="editPwd">
        <el-form-item label="原密码" label-width="85px" prop="oldPwd">
          <el-input v-model="editPwdObj.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="85px" prop="user_password">
          <el-input v-model="editPwdObj.user_password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="85px" prop="rePwd">
          <el-input v-model="editPwdObj.rePwd"></el-input>
          <!-- <el-input v-model="rePwd"></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEditPwdDialog" size="medium">取 消</el-button>
        <el-button type="primary" @click="editPwdDialogSure" size="medium">更改密码</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import HttpUser from '../api/user'
import HttpSTSToken from '../api/stsToken'
import store from '../store'
import md5 from 'md5'
import OSS from 'ali-oss'
import config from '../config/index'

export default {
  name: 'Account',
  components: {
    Header,
    Footer
  },
  data() {
    // 验证原密码
    const validateOldPwd = (rule, value, callback) => {
      console.log('this.isTrueOldPwd1: ', this.isTrueOldPwd)
      if (md5('onemovie' + this.editPwdObj.oldPwd) !== this.userObj.user_password) {
        callback(new Error('原密码不正确！'))
      } else {
        callback()
      }
    }
    // 验证新密码
    const validateNewPwd = (rule, value, callback) => {
      let reg = /^[\w_.-]{6,16}$/
      if (!reg.test(value)) {
        callback(new Error('密码包含非法字符，仅支持字母、数字、下划线、小圆点、减号！'))
      } else if (value === this.editPwdObj.oldPwd) {
        callback(new Error('新密码必须与原密码不同！'))
      } else {
        callback()
      }
    }
    // // 验证二次密码
    const validateRePwd = (rule, value, callback) => {
      if (value !== this.editPwdObj.user_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userObj: {},
      ossClient: null,
      // 当前是否正在编辑昵称
      editingNickname: false,
      oldNickname: '',
      editPwdDialogVisible: false,
      editPwdObj: {
        user_phone: '',
        oldPwd: '',
        user_password: '',
        rePwd: ''
      },
      // editPwdObj: {
      //   oldPwd: ''
      // },
      // 原密码
      oldPwd: '',
      // 确认密码
      rePwd: '',
      // 原密码验证结果
      isTrueOldPwd: true,
      // 表单的验证规则对象
      editPwdRules: {
        // 验证原密码
        oldPwd: [
          { required: true, message: '原密码未填写', trigger: 'blur' },
          { validator: validateOldPwd, trigger: 'blur' }
        ],
        // 验证新密码
        user_password: [
          { required: true, message: '新密码未填写', trigger: 'blur' },
          { validator: validateNewPwd, trigger: 'blur' }
        ],
        // 验证确认密码
        rePwd: [
          { required: true, message: '确认密码未填写', trigger: 'blur' },
          { validator: validateRePwd, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      const res = await HttpUser.getUserInfo({ user_phone: store.state.user.user_phone })
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      this.userObj = res.result
    },
    // 创建 OSS Client
    async initOSSClient() {
      const res = await HttpSTSToken.getStsToken()
      if (res.code !== 1) return this.$message.error(res.message)

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
      // console.log('param.file: ', param.file)
      if (!this.ossClient) await this.initOSSClient()
      const fileNameAndPath = 'img/' + this.formatDate() + '.' + param.file.type.split('/')[1]
      // 头像上传到 OSS
      const OSSRes = await this.ossClient.put(fileNameAndPath, param.file)
      // console.log('ossClientRes: ', OSSRes)
      // 将 OSS 返回来的图片 url 保存到数据库
      this.userObj.user_avatarUrl = OSSRes.url
      const res = await HttpUser.editUser(this.userObj)
      if (res.code !== 1) return this.$message({ message: '头像修改失败！', type: 'error' })
      this.$message({ message: '头像修改成功~', type: 'success' })
      this.getUserInfo()
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
    // 点击编辑昵称按钮 触发
    editNickname() {
      // 缓存一下原来的昵称
      this.oldNickname = this.userObj.user_nickname
      this.editingNickname = true
      // 输入框自动选中所有内容
      this.$nextTick(() => {
        // this.$refs.nicknameInput.focus()
        this.$refs.nicknameInput.select()
      })
    },
    // 点击完成昵称按钮 触发
    async submitNickname() {
      // 如果没修改昵称，中断代码执行
      if (this.oldNickname === this.userObj.user_nickname) {
        this.editingNickname = false
        return
      }
      const res = await HttpUser.editUser(this.userObj)
      if (res.code !== 1) return this.$message({ message: '昵称修改失败！', type: 'error' })
      this.$message({ message: '昵称修改成功~', type: 'success' })
      // console.log('res: ', res)
      this.editingNickname = false
    },
    // 敲击昵称输入框回车 触发
    nicknameEnter() {
      // console.log('555')
      this.submitNickname()
    },
    // 昵称输入框失去焦点 触发
    nicknameBlur() {
      // console.log('888')
      // this.submitNickname()
    },
    // 点击编辑密码按钮 触发
    editUserPwd() {
      // 弹出弹框
      this.editPwdDialogVisible = true
      this.editPwdObj.user_phone = this.userObj.user_phone
    },
    // 点击取消按钮 触发
    cancelEditPwdDialog() {
      this.editPwdDialogVisible = false
      // 清空表单
      this.$refs.editPwdRef.resetFields()
      this.oldPwd = ''
    },
    // 点击更改密码确定按钮 触发
    async editPwdDialogSure() {
      // 表单预检验
      this.$refs.editPwdRef.validate(async valid => {
        if (!valid) return
        const res = await HttpUser.editPwd(this.editPwdObj)
        if (res.code !== 1) return this.$message.error({ message: res.message, type: 'error' })
        this.$message.success({ message: res.message, type: 'error' })
        // 让修改密码弹框隐藏
        this.editPwdDialogVisible = false
        // 清空表单
        this.$refs.editPwdRef.resetFields()
        this.getUserInfo()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.account-wrap {
  background-color: #fff;
	// background-color: #f4f4f4;
  .header {
    position: fixed;
    top: 0;
    z-index: 999;
  }
  .content {
    width: 100%;
    min-height: 879px;
    padding-top: 44px;
    padding-bottom: 50px;
    color: #1d1d1f;
    box-sizing: border-box;
    // background-color: pink;
    .content-header {
      position: relative;
      width: 100%;
      height: 175px;
      background-color: #f5f5f7;
      .greet {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 860px;
        // background-color: pink;
      }
    }
    .content-body {
      width: 860px;
      margin: 50px auto;
      // background-color: lightblue;
      h1 {
        padding-bottom: 24px;
      }
      .avatar {
        position: relative;
        .el-link {
          position: absolute;
          bottom: 0;
          left: 350px;
        }
      }
      .avatar,
      .nickname,
      .userphone,
      .userpwd {
        width: 100%;
        margin-bottom: 18px;
      }
      .nickname,
      .userpwd {
        p {
          display: inline-block;
          margin-top: 0;
        }
      }
      .nickname {
        // position: relative;
        .el-input {
          // float: left;
          // left: 0;
        }
        .el-button {
          // line-height: 20px;
          // left: 300px;
          margin-left: 30px;
        }
      }
      .userphone {
        p {
          font-size: 14px;
        }
      }
      .userpwd {
        p {
          font-weight: 550;
        }
      }
      .left {
        float: left;
        width: 245px;
      }
      .right {
        float: left;
      }
      h3 {
        margin-top: 0;
      }
      .el-link {
        margin-left: 15px;
      }
    }
  }
}
</style>
<style lang="scss">
.content-body .avatar {
  .el-avatar--square {
    border-radius: 8px;
  }
}
.nickname {
  .el-input {
    width: 200px;
  }
  .el-input__inner {
    // display: inline-block;
    width: 200px;
  }
}
.account-wrap .el-dialog {
  width: 30%;
}
.editPwd {
  .el-icon-circle-check:before {
    color: green;
  }
}
.upload {
  width: 0;
  height: 0;
}
</style>
