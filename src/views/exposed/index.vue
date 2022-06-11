<template>
  <el-container>
    <el-header>
      <el-menu :default-active="$route.path" class="el-menu-demo"
               mode="horizontal" :router="true"
               @select="handleSelect">
        <el-menu-item index="/exposed/home">首页</el-menu-item>
        <!--        <el-sub-menu index="2">-->
        <!--          <template #title>Workspace</template>-->
        <!--          <el-menu-item index="2-1">item one</el-menu-item>-->
        <!--          <el-menu-item index="2-2">item two</el-menu-item>-->
        <!--          <el-menu-item index="2-3">item three</el-menu-item>-->
        <!--        </el-sub-menu>-->
        <el-menu-item index="/exposed/blogs">博客</el-menu-item>
        <el-menu-item index="/exposed/tools">工具</el-menu-item>
      </el-menu>
      <div class="header-menu">
        <template v-if="!isLogin">
          <el-button round type="primary" @click="toCmsLogin">注册</el-button>
          <el-button round @click="toCmsLogin">登录</el-button>
        </template>
        <template v-else>
          <el-dropdown trigger="click" style="cursor: pointer;" @command="handleCommand">
            <span class="el-dropdown-link"  style="color: #4a4a4a">
              欢迎您，{{ loginUser.realName }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template slot="dropdown">
              <el-dropdown-menu>
                <el-dropdown-item icon="el-icon-user">个人中心</el-dropdown-item>
                <el-dropdown-item icon="el-icon-setting" command="toCmsIndex">后台管理</el-dropdown-item>
                <el-dropdown-item icon="el-icon-switch-button" style="color: red;" divided command="logout">注销登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </el-header>
    <el-main>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </el-main>
  </el-container>
</template>
<script>

export default {
  name: "index",
  data() {
    return {
      isLogin: false,
      loginUser: {},
    }
  },
  
  created() {
    this.$api.sysUserInfo({
      callback: data => {
        //已经登录，直接调整到首页
        this.isLogin = true;
        this.loginUser = data;
      },
      failure: err => {
        this.isLogin = false;
        return false;
      }
    });
  },
  
  methods: {
    toCmsLogin() {
      let href = this.$router.resolve({name: 'login'});
      window.open(href.href, '_blank')
    },
    handleCommand(command) {
      if('toCmsIndex' === command){
        let href = this.$router.resolve({name: 'login'});
        window.open(href.href, '_blank')
      }
      if('logout' === command){
        this.logout()
      }
    },
    logout() {
      this.$api.logout({
        callback: data => {
          location.reload();
        }
      });
    },
    handleSelect(key, keyPath) {
      // console.log(key, keyPath)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep(.el-header) {
  padding: 0;
  border-bottom: 1px solid #ebeef5;
  overflow: hidden;
  
  .el-menu--horizontal {
    border-bottom: 0;
    width: 600px;
    margin: auto;
  }
}

.header-menu {
  position: absolute;
  top: 15px;
  right: 10px;
  padding: 8px 10px;
  border-radius: 5px;
}
</style>
