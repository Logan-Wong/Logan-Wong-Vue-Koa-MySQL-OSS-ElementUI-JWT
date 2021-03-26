<template>
  <div class="register-wrap">
    <!-- 头部 -->
    <Header class="header"></Header>
    <!-- 注册页实体部分 -->
    <div class="content">
      <div class="register-box">
        <h1>创建您的 OneMovie ID</h1>
        <el-form :model="registerForm" :rules="registerRules" ref="registerRef" label-width="auto">
          <el-form-item prop="user_nickname" class="nickname-from-item">
            <el-input v-model="registerForm.user_nickname" placeholder="您的昵称" @keyup.enter.native="register"></el-input>
          </el-form-item>
          <el-form-item prop="user_phone" class="id-from-item">
            <el-input v-model="registerForm.user_phone" placeholder="OneMovie ID" @keyup.enter.native="register"></el-input>
          </el-form-item>
          <el-form-item prop="user_password" class="pwd-from-item">
            <el-input placeholder="密码" v-model="registerForm.user_password" show-password @keyup.enter.native="register"></el-input>
          </el-form-item>
          <el-form-item prop="re_user_pwd" class="re-pwd-from-item">
            <el-input placeholder="确认密码" v-model="registerForm.re_user_pwd" show-password @keyup.enter.native="register"></el-input>
          </el-form-item>
          <el-form-item prop="name" class="tipText">
            <p>你的 OneMovie ID 是你用来登录 OneMovie 网的手机号码。</p>
          </el-form-item>
          <el-form-item prop="name" class="registerButton">
            <el-button type="primary" @click="register">创建 ID</el-button>
          </el-form-item>
          <el-link type="primary" @click="goLogin">已有 OneMovie ID？去登陆。</el-link>
        </el-form>
      </div>
    </div>
    <!-- 底部 -->
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import HttpUser from '../api/user'

export default {
  name: 'register',
  components: {
    Header,
    Footer
  },
  data() {
    // 验证用户名（手机号）
    const validateUserPhone = (rule, value, callback) => {
      let reg = /^1[3-9]\d{9}$/
      if (!reg.test(value)) {
        callback(new Error('手机号码做 ID，请填写正确的手机号'))
      } else {
        callback()
      }
    }
    // 验证密码
    const validatePwd = (rule, value, callback) => {
      let reg = /^[\w_.-]{6,16}$/
      if (!reg.test(value)) {
        callback(new Error('密码包含非法字符，仅支持字母、数字、下划线、小圆点、减号！'))
      } else {
        callback()
      }
    }
    // 验证二次密码
    const validateRepwd = (rule, value, callback) => {
      if (value !== this.registerForm.user_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        user_nickname: '',
        user_phone: '',
        user_password: '',
        re_user_pwd: ''
      },
      registerStatus: false,
      registerRules: {
        user_nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 1, max: 20, message: '请填写20位以内的昵称', trigger: 'blur' }
        ],
        user_phone: [
          { required: true, message: 'OneMovie ID 未填写', trigger: 'blur' },
          { min: 11, max: 11, message: '请填写11位 OneMovie ID', trigger: 'blur' },
          { validator: validateUserPhone, trigger: 'blur' }
        ],
        user_password: [
          { required: true, message: '密码未填写', trigger: 'blur' },
          { min: 6, max: 16, message: '请填写 6 到 16 位密码', trigger: 'blur' },
          { validator: validatePwd, trigger: 'blur' }
        ],
        re_user_pwd: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validateRepwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    goLogin() {
      this.$router.push({
        path: '/login'
      })
    },
    async register() {
      this.$refs.registerRef.validate(async (valid) => {
        if (valid) {
          let res = await HttpUser.register(this.registerForm)
          if (res.code !== 1) return this.$message({ message: 'OneMovie ID 创建失败！', type: 'error' })
          this.$message({ message: 'OneMovie ID 创建成功，请登录', type: 'success' })

          this.$router.push({
            path: '/login'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.register-wrap {
  background-color: #fff;
  .header {
    position: fixed;
    z-index: 999;
  }
  .content {
    position: relative;
    width: 100%;
    height: 950px;
    .register-box {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 410px;
      height: 500px;
      // border: 1px red solid;
      h1 {
        text-align: center;
        color: #1d1d1f;
        margin-bottom: 60px;
      }
      .el-form {
        position: relative;
        .el-form-item {
          margin-bottom: 15px;
        }
        .tipText {
          position: absolute;
          top: 260px;
          height: 20px;
          p {
            color: #1d1d1f;
            font-size: 13px;
          }
        }
        .registerButton {
          margin-top: 70px;
          .el-button {
            width: 410px;
            height: 56px;
            border-radius: 10px;
            font-size: 16px;
          }
        }
      }
      .el-link {
        position: absolute;
        top: 409px;
        left: 50%;
        transform: translateX(-50%);
        width: 191px;
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
  }
}
</style>
<style lang="scss">
.register-box {
  .el-input__inner {
    width: 410px;
    height: 56px;
    color: #1d1d1f;
    border: 1px #d2d2d7 solid;
    border-radius: 10px;
    // 此处改 placeholder 的样式
    &::placeholder {
      font-size: 14px;
      color: #86868b;
    }
  }
  .nickname-from-item,
  .id-from-item,
  .pwd-from-item,
  .re-pwd-from-item {
    // 不通过验证规则时的错误提醒
    .el-form-item__error {
      padding-top: 1px;
      left: 10px;
      color: #e50914;
    }
  }
  .re-pwd-from-item {
    // 不通过验证规则时的错误提醒
    .el-form-item__error {
      padding-top: 2px;
    }
  }
  .el-form-item.is-error .el-input__inner,
  .el-form-item.is-error .el-input__inner:focus,
  .el-form-item.is-error .el-textarea__inner,
  .el-form-item.is-error .el-textarea__inner:focus,
  .el-message-box__input input.invalid,
  .el-message-box__input input.invalid:focus {
    border-color: #e50914;
  }
}
</style>
