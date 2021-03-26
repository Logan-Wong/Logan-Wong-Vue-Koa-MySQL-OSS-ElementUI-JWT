<template>
  <div class="login-wrap">
    <!-- 头部 -->
    <Header class="header"></Header>
    <!-- 登录页实体部分 -->
    <div class="content">
      <div class="login-box">
        <h1>请登录</h1>
        <el-form :model="loginForm" :rules="loginRules" ref="loginRef" label-width="auto">
          <el-form-item prop="user_phone" class="id-from-item">
            <el-input v-model="loginForm.user_phone" placeholder="OneMovie ID" @keyup.enter.native="login"></el-input>
          </el-form-item>
          <el-form-item prop="user_password" class="pwd-from-item">
            <el-input placeholder="密码" v-model="loginForm.user_password" show-password  @keyup.enter.native="login"></el-input>
          </el-form-item>
          <el-form-item prop="name" class="tipText">
            <p>你的 OneMovie ID 是你用来登录 OneMovie 网的手机号码。</p>
          </el-form-item>
          <el-form-item prop="name" class="loginButton">
            <el-button type="primary" @click="login">登录</el-button>
          </el-form-item>
          <el-link type="primary" @click="goRegister">没有 OneMovie ID？立即创建一个。</el-link>
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
  name: 'login',
  components: {
    Header,
    Footer
  },
  data() {
    // 验证用户名（手机号）
    const validateUserPhone = (rule, value, callback) => {
      let reg = /^1[3-9]\d{9}$/
      if (!reg.test(value)) {
        callback(new Error('手机号码做 ID，请填写正确的 OneMovie ID'))
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
    return {
      loginForm: {
        user_phone: '15340489102',
        user_password: 'Hzc.9102'
      },
      loginStatus: false,
      loginRules: {
        user_phone: [
          { required: true, message: 'OneMovie ID 未填写', trigger: 'blur' },
          { min: 11, max: 11, message: '请填写11位 OneMovie ID', trigger: 'blur' },
          { validator: validateUserPhone, trigger: 'blur' }
        ],
        user_password: [
          { required: true, message: '密码未填写', trigger: 'blur' },
          { min: 6, max: 16, message: '请填写 6 到 16 位密码', trigger: 'blur' },
          { validator: validatePwd, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // let that = this
    // document.onkeydown = (e) => {
    //   console.log('e: ', e)
    //   let key = window.event.keyCode
    //   if (key === 13 || key === 108) {
    //     console.log('654')
    //     that.login()
    //   }
    // }
  },
  methods: {
    goRegister() {
      this.$router.push({
        path: '/register'
      })
    },
    async login() {
      this.$refs.loginRef.validate(async (valid) => {
        if (valid) {
          let res = await HttpUser.login(this.loginForm)
          if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
          this.$message({ message: res.message, type: 'success' })

          this.$store.commit('save', {
            user_id: res.result.user_id,
            user_phone: res.result.user_phone,
            user_nickname: res.result.user_nickname,
            token: res.result.token,
            tokenIssTime: new Date().getTime()
          })

          // 获取回跳的 redirect 地址
          const redirect = this.$route.query.redirect
          if (redirect) {
            // 如果 redirect 存在说明当前用户是进入某页面后未登陆自动跳转到登陆页面来的，所以登陆完成后得再次回跳到该地址
            this.$router.push(redirect)
          } else {
            // 否则跳转到默认的页面，首页或者其他页面
            this.$router.push('/')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-wrap {
  background-color: #fff;
  .header {
    position: fixed;
    z-index: 999;
  }
  .content {
    position: relative;
    width: 100%;
    height: 950px;
    .login-box {
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
          top: 118px;
          height: 20px;
          p {
            color: #1d1d1f;
            font-size: 13px;
          }
        }
        .loginButton {
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
        top: 267px;
        left: 50%;
        transform: translateX(-50%);
        width: 233px;
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
.login-box {
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
  .id-from-item,
  .pwd-from-item {
    // 不通过验证规则时的错误提醒
    .el-form-item__error {
      padding-top: 1px;
      left: 10px;
      color: #e50914;
    }
  }
  .pwd-from-item {
    // 不通过验证规则时的错误提醒
    .el-form-item__error {
      padding-top: 2px;
    }
  }
}
</style>
