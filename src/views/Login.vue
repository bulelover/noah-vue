<template>
  <div class="login-bg">
    <el-card class="login-card" body-style="padding: 20px 40px;" v-if="!isLogin">
      <template #header>
        <div class="card-header">
          <span>欢迎登录</span>
        </div>
      </template>
      <el-form :model="formData" status-icon :rules="rules" ref="form" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" autocomplete="off" size="large">
            <template #prefix>
              <i class="el-input__icon el-icon-user"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="formData.password" autocomplete="off" size="large">
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
          <el-button type="primary" @click="submitForm" size="large" style="width: 100%;"
                     :loading="loading">{{ loginText }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="check-login-card" body-style="padding: 20px 40px;height:260px;" v-else
             v-loading="true" element-loading-text="正在检查登录状态，请稍后...">
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
    this.$api.sysUserInfo({
      callback: data => {
        //已经登录，直接调整到首页
        this.$router.replace({name: g.home.code});
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
            this.loading = false
            this.loginText = '登 录';
            this.$router.replace({name: g.home.code});
          },
          failure: () => {
            this.loading = false
            this.loginText = '登 录';
          }
        });
      });
    }
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
  background: #f5f5f5;
  
  .login-card {
    width: 450px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -260px 0 0 -225px;
    
    .card-header {
      font-size: 22px;
    }
  }
  .check-login-card {
    width: 440px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -200px 0 0 -220px;
  }
}

</style>
