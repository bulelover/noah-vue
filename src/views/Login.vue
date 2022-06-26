<template>
  <div class="login-bg">
    <div class="bg"></div>
    <div class="bg bg2"></div>
    <div class="bg bg3"></div>
    <div>
      <transition name="slide-fade">
        <el-card class="login-card" body-style="padding: 48px 56px 30px" v-show="!isLogin">
          <template #header>
            <div class="card-header">
              <span>欢迎登录，Noah后台</span>
            </div>
          </template>
          <el-form :model="formData" :rules="rules" ref="form" label-position="top">
            <el-form-item label="" prop="username">
              <el-input v-model="formData.username" placeholder="用户名" autocomplete="off" size="large">
                <template #prefix>
                  <i class="el-input__icon el-icon-user"></i>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input type="password" placeholder="密码" v-model="formData.password" autocomplete="off" size="large">
                <template #prefix>
                  <i class="el-input__icon el-icon-lock"></i>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="formData.rememberMe === '1'" label="记住我"
                           @change="(check)=>{this.formData.rememberMe = check?'1':'0'}"></el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn" type="primary" @click="submitForm" size="large" style="width: 100%;"
                         :loading="loading">{{ loginText }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </transition>
      <el-card class="check-login-card login-card" body-style="padding: 20px 40px;" v-if="isLogin"
               v-loading="true" element-loading-text="正在检查登录状态，请稍后...">
      </el-card>
    </div>
  </div>
</template>

<script>
import store from '@/utils/store'
export default {
  data() {
    return {
      state: store.state,
      isLogin: true,
      loading: false,
      loginText: '登 录',
      formData: {
        username: '',
        password: '',
        rememberMe: '1'
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    store.setInitMenu(false);
    store.setMenus(null);
    this.$api.getLoginUserInfo({
      callback: data => {
        //已经登录，直接调整到首页
        this.$router.push({name: g.home.code});
      },
      failure: err => {
        this.isLogin = false;
        return false;
      }
    });
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        this.loginText = '登录中';
        this.$api.login({
          data: this.formData,
          callback: data => {
            localStorage.setItem('tokenKey', data.tokenName);
            localStorage.setItem(data.tokenName, data.tokenValue);
            g.tokenName = data.tokenName;
            g.tokenValue = data.tokenValue;
            // this.loading = false
            // this.loginText = '登 录';
            this.$router.push({name: g.home.code});
          },
          failure: () => {
            this.loading = false
            this.loginText = '登 录';
          }
        });
      });
    },
  }
}
</script>

<style scoped lang="scss">
.login-bg {
  position: fixed;
  overflow: auto;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #92c4f6;
  display: flex;
  align-items: center;
  justify-items: center;
  align-content: center;
  justify-content: center;
  .login-card {
    background: rgba(0, 0, 0, .1);
    width: 400px;
    .card-header {
      font-size: 22px;
      color: #f1f1f1;
    }
  }
  
  .check-login-card {
    background: rgba(0, 0, 0, .1);
    width: 400px;
    height: 400px;
  }
  
  .login-btn {
    font-size: 18px;
    color: #FFF;
    background-color: #0B63C0;
    border-color: #0B63C0;
  }
  .login-btn:hover {
    background-color: #007bff;
    border-color: #007bff;
  }
}

::v-deep {
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #0B63C0;
    border-color: #0B63C0;
  }
  .el-loading-mask {
    background: rgba(0, 0, 0, .1);
  }
  
  .el-loading-spinner .path,
  .el-loading-spinner .el-loading-text {
    stroke: #FFFFFF;
    color: #FFFFFF;
  }
  
  .el-input__inner {
    background-color: rgba(0, 0, 0, .1);;
    color: #f1f1f1;
  }
  
  .el-form-item:first-child {
    margin-bottom: 32px;
  }
  
  .el-card{
    border:0;
  }
  .el-checkbox__label{
    color: #FFFFFF;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label{
    color: #0B63C0;
    font-weight: bolder;
  }
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .5s ease;
}

.slide-fade-leave-active {
  transition: all .5s ease;
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */
{
  transform: translateY(60px);
  opacity: 0;
}
.bg {
  animation:slide 3s ease-in-out infinite alternate;
  background-image: linear-gradient(-60deg, #6c3 50%, #09f 50%);
  bottom:0;
  left:-50%;
  opacity:.5;
  position:fixed;
  right:-50%;
  top:0;
  z-index:-1;
}

.bg2 {
  animation-direction:alternate-reverse;
  animation-duration:4s;
}

.bg3 {
  animation-duration:5s;
}
@keyframes slide {
  0% {
    transform:translateX(-25%);
  }
  100% {
    transform:translateX(25%);
  }
}
</style>
