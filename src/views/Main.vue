<template>
  <el-container :class="{'main-body':true,'menu-steep':steep && !white, 'white-theme':white}" >
    <el-header style="height:60px;overflow:hidden;position:relative;">
      <div style="position: absolute;top:0;right: 0;left: 0;" :z-index="90">
        <div class="app-title">
          <div >{{ appTitle }}</div>
        </div>
      </div>
      <div class="header-menu">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
             <span style="display: inline-block;vertical-align: top;line-height: 44px;">欢迎您{{state.user === null?'':'，'+state.user.realName}}</span>
             <img :src="state.user === null?'':$api.preview(state.user.headImgPath)" class="head-img" alt="头像">
          </span>
          <template slot="dropdown">
            <el-dropdown-menu>
              <el-dropdown-item icon="el-icon-user" command="personal">个人中心</el-dropdown-item>
              <el-dropdown-item command="skin"><i class="iconfont icon-skin-fill"></i>主题设置</el-dropdown-item>
              <el-dropdown-item icon="el-icon-switch-button" style="color: red;" divided command="logout">注销登录</el-dropdown-item>
              <!--            <el-dropdown-item command="frame-default">满屏</el-dropdown-item>
                          <el-dropdown-item command="frame-lg">大窗口</el-dropdown-item>
                          <el-dropdown-item command="frame-mid">中等窗口</el-dropdown-item>
                          <el-dropdown-item command="frame-sm">小窗口</el-dropdown-item>-->
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <theme-drawer ref="themeDrawer" :steep="steep" :white="white" :position="position" :multi-tab="multiTab" @update="updateTheme"></theme-drawer>
    <el-container style="position: relative;">
      <el-aside :style="'overflow:hidden; width: '+$theme.lmWidth">
        <div class="aside-content">
          <el-menu ref="menu" :unique-opened="true" :default-active="currentMeta.code" v-loading="menuLoading" :collapse="isCollapse">
            <tree-menu :menus="menus" @changeMenu="changeTabs"></tree-menu>
          </el-menu>
        </div>
      </el-aside>
      <div class="top-recent-tags" v-if="multiTab" :style="'left: '+$theme.lmWidth">
        <div class="app-tab-scroll" style="width: 41px;line-height: 1;text-align: left;padding-left: 4px;">
          <el-tag v-if="!isCollapse" size="—" @click="isCollapse = true;$theme.lmWidth='65px'" class="collapse-tag"
                  type="info" effect="plain">
            <i class="el-icon el-icon-s-fold"></i>
          </el-tag>
          <el-tag v-if="isCollapse" size="—" @click="isCollapse = false;$theme.lmWidth='220px'" class="collapse-tag"
                  type="info" effect="plain">
            <i class="el-icon el-icon-s-unfold"></i>
          </el-tag>
        </div>
        <div v-if="haScroll" class="app-tab-scroll" @click="scrollLeft">
          <i class="el-icon el-icon-arrow-left"></i>
        </div>
        <div class="app-recent-tab" ref="scrollObj">
          <template v-for="(t,i) in tabs">
            <el-tag :key="i" v-if="i===0" size="—" @click="openMenu(t)" :class="{'menu-tag ':true, 'tag-selected': currentMeta.code === t.code}"
                    type="info" effect="plain"
            ><i class="el-icon el-icon-s-home"></i> 首页</el-tag>
            <el-tag :key="i" v-else size="—"  closable @click="openMenu(t)" :class="{'menu-tag ':true, 'tag-selected': currentMeta.code === t.code}"
                    type="info" effect="plain"
                    :disable-transitions="false" @close="tabClose(t)">
              <i v-if="t.icon && t.icon.indexOf('el-icon') === 0" :class="'el-icon ' + t.icon"></i>
              <i v-else-if="t.icon.indexOf('icon-') === 0" :class="'iconfont ' + t.icon"></i>
              <icon v-else :type="t.icon"></icon> {{t.name}}
            </el-tag>
          </template>
        </div>
        <div v-if="haScroll"  class="app-tab-scroll" @click="scrollRight">
          <i class="el-icon el-icon-arrow-right"></i>
        </div>
      </div>
      <el-main :style="'left: '+$theme.lmWidth+';top:'+(this.multiTab?'40px':'0')" ref="main">
        <div class="app-current-p" v-if="position">
          <span style="font-weight: bold">当前位置：</span>
          <el-breadcrumb style="font-size:14px;display: inline-block;">
            <template v-for="(item,index) in currentMeta.parents">
              <el-breadcrumb-item v-if="(item.type+'') === '1'">{{ item.name }}</el-breadcrumb-item>
            </template>
            <el-breadcrumb-item>{{ currentMeta.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-link icon="el-icon-refresh" type="primary" :underline="false" @click="reLoadPage"
                   style="font-size:14px;" v-if="currentMeta.code !== 'error-page'">重新加载</el-link>
        </div>
        <transition name="slide-fade">
            <div v-show="show" :style="{position: 'absolute',top:position?'30px':0,right: 0,left: 0,bottom: 0}">
              <keep-alive v-if="debug">
                <router-view ref="alive" v-if="view"></router-view>
              </keep-alive>
              <keep-alive v-else>
                <router-view ref="alive" v-if="view" :key="currentMeta.code + (pageKey[currentMeta.code]?pageKey[currentMeta.code]:0)"></router-view>
              </keep-alive>
            </div>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import TreeMenu from "@/views/layout/TreeMenu";
import $ from "jquery";
import Vue from "vue";
import store from '@/utils/store'
import ThemeDrawer from "@/views/layout/ThemeDrawer";

export default {
  components: {TreeMenu,ThemeDrawer},
  data() {
    return {
      isCollapse: false,
      tabs: [g.home],
      menus: [],
      menuLoading: false,
      show: true,
      timeOutMl: null,
      appTitle: window.g.appTitle,
      haScroll: false,
      view: true,
      pageKey: {},
      steep: false,
      white: false,
      multiTab: false,
      position: false,
      state: store.state
    }
  },
  
  created() {
    //绑定Vue全局事件
    Vue.prototype.$navtab = (path) => {
      this.changeTabs(g.router[path]);
    }
    this.show = false;
    this.pageKey[g.home.code] = 0;
    this.menus = this.state.menus;
  },
  
  mounted() {
    this.steep = g.steep === '1';
    this.white = g.white === '1';
    this.multiTab = g.multiTab === '1';
    this.position = g.position === '1';
    if(this.currentMeta.code !== g.home.code){
      let curTab = {
        url: this.$route.fullPath,
        code: this.currentMeta.code,
        parentPath: this.currentMeta.parentPath,
        name: this.currentMeta.name,
        icon: this.currentMeta.icon
      };
      this.tabs.push(curTab);
      this.pageKey[curTab.code] = 0;
    }
    setTimeout(()=>{
      this.show = true;
    }, 100);
  
    //标签栏自适应显示滑动条
    window.onresize = () => {
      this.setHaScroll()
    }
    if (this.$route.name === g.home.c || this.$route.name === 'error') {
      //默认展开第一个菜单
      this.$nextTick(() => {
        $('.el-submenu__title:eq(0)').trigger('click')
      })
    }
  },
  
  computed: {
    currentMeta: {
      get() {
        return this.$route.meta
      }
    },
    debug: {
      get(){
        return process.env.NODE_ENV !== 'production'
      }
    }
  },
  
  methods: {
    updateTheme(type, val){
      this[type] = val;
    },
    handleCommand(command) {
      if(command === 'personal'){
        this.$navtab('/admin/sys/user/personal');
        return;
      }
      if(command === 'skin'){
        this.$refs.themeDrawer.open();
        return;
      }
      if(command === 'logout'){
        this.$api.logout({
          callback: data => {
            this.$router.replace({name: 'login'});
          }
        });
        return;
      }
      
      if(command.indexOf('frame-') === 0){
        for(let i=document.body.classList.length; i>0; i--){
          if(document.body.classList[i-1].indexOf('frame-') === 0){
            document.body.classList.remove(document.body.classList[i-1]);
          }
        }
        document.body.classList.add(command);
        g.setFrame(command);
      }
    },
    
    openMenu(tab){
      let cur = tab.code === this.currentMeta.code;
      if(cur){
        return;
      }
      this.show = false;
      setTimeout(()=>{
        this.$router.push(tab.url, ()=>{
          this.show = true;
        });
      }, 100);
      
    },
    changeTabs(item){
      let cur = item.code === this.currentMeta.code;
      if(cur){
        return;
      }
      this.show = false;
      setTimeout(()=>{
        let index = this.indexOf(this.tabs,item);
        if(index > -1){
          this.$router.push(item.url, ()=>{
            this.show = true;
          });
          return;
        }
        if(this.tabs.length >= 20){
          this.tabs.splice(0,1);
        }
        this.tabs.push(item);
        this.pageKey[item.code] = 0;
        this.$router.push(item.url, ()=>{
          this.$nextTick(()=>{
            this.setHaScroll();
          })
          this.show = true;
        });
      },100)
      
    },
    clearAliveCache(key){
      //关闭清除keep-alive缓存
      if(!this.$refs.alive){
        return;
      }
      let cache = this.$refs.alive.$vnode.parent.componentInstance.cache;
      let keys = this.$refs.alive.$vnode.parent.componentInstance.keys;
      if(cache[key] != null){
        delete cache[key];
        let index = keys.indexOf(key);
        if(index > -1){
          keys.splice(index, 1);
        }
      }
    },
    tabClose(t){
      let i = this.tabs.indexOf(t);
      let cur = t.code === this.currentMeta.code;
      this.tabs.splice(i, 1);
      if(cur || this.currentMeta.code === 'error-page'){
        this.openMenu(this.tabs[i-1]);
      }
      this.clearAliveCache(t.code+this.pageKey[t.code]);
    },
    reLoadPage(){
      if(this.debug){
        location.reload();
      }
      let currentIndex = -1;
      let tab;
      this.tabs.forEach((t,index) => {
        if(t.code === this.currentMeta.code){
          currentIndex = index;
          tab = t;
        }
      })
      if(currentIndex > -1){
        this.view = false;
        this.$nextTick(()=>{
          this.clearAliveCache(tab.code + this.pageKey[tab.code]);
          this.pageKey[tab.code]++;
          this.$nextTick(()=>{
            this.changeTabs(tab);
          })
          this.view = true;
        })
      }
    },
    //获取tabs下标
    indexOf(tabsRev,item){
      let index = -1;
      tabsRev.forEach((tab,i) => {
        if(tab.code === item.code){
          index = i;
        }
      })
      return index;
    },
    scrollLeft(){
      this.$refs.scrollObj.scrollTo({ left: this.$refs.scrollObj.scrollLeft - 500, behavior: 'smooth' })
    },
    scrollRight(){
      this.$refs.scrollObj.scrollTo({ left: this.$refs.scrollObj.scrollLeft + 500, behavior: 'smooth' })
    },
    setHaScroll(){
      if(this.$refs.scrollObj){
        this.haScroll = this.$refs.scrollObj.scrollWidth > this.$refs.scrollObj.clientWidth;
      }
    },
  }
}
</script>

<style scoped lang="scss">
.recent-menu{
  cursor: pointer;
  padding: 6px 8px 4px;
  margin-right: 20px;
  border-radius: 3px;
  background-color: #ffffff;
}
.recent-menu:hover{
  color: #409EFF;
}

.main-body {
  position: fixed;
  overflow: hidden;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #f1f1f1;
  box-shadow: 0 0 101px 1px #aaaaaa;
}
.el-aside{
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  .aside-content{
    overflow-y: auto;
    height: calc(100% + 32px);
    width: 230px;
    margin-top: -16px;
    margin-bottom: -16px;
    padding: 16px 0;
  }
}
.el-header {
  line-height: 60px;
  .app-title {
    height: 60px;
    font-size: 22px;
    background: url('/favicon.ico') no-repeat 14px 14px;
    background-size: 32px;
    padding-left:60px;
  }
  
  ::v-deep .header-menu {
    position: absolute;
    top: 8px;
    right: 10px;
    //background-color: rgba(255, 255, 255, 0.34);
    line-height: 1;
    border-radius: 5px;
    
    .el-dropdown-link, span{
      padding: 1px 4px;
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
      margin-left: 8px;
    }
    span i{
      color: #ffffff;
      font-size: 16px;
    }
    .head-img {
      width: 40px;
      border-radius: 20px;
      display: inline-block;
      vertical-align: top;
      margin-left: 14px;
    }
  }
}

.app-current-p {
  position: absolute;
  left: 0;
  top: 5px;
  padding: 12px 0 0 20px;
  font-size: 14px;
  >span,>div,>a{
    vertical-align: top;
    display: inline-block;
    line-height: 1;
  }
  >div{
    color: #4a4a4a;
  }
  >span{
    padding-right: 4px;
    color: #4a4a4a;
  }
  >a {
    margin-left: 20px;
    font-size: 14px;
  }
}
.app-recent-tab{
  display: inline-block;
  vertical-align: top;
  width: calc(100% - 104px);
  overflow: auto;
  position: relative;
  line-height: 1;
  padding: 0 0 10px;
  white-space: nowrap;
  .el-tag:not(:first-child){
    margin-left: 5px;
  }
}
.top-recent-tags{
  padding: 5px 1px 10px;
  background-color: #ffffff;
  color: rgb(74, 74, 74);
  height: 40px;
  position: absolute;
  right: 0;
  top: 0;
  overflow: hidden;
  .el-tag{
    height: 30px;
  }
}
.app-tab-scroll{
  display: inline-block;
  vertical-align: top;
  width: 30px;
  cursor: pointer;
  line-height: 34px;
  text-align: center;
}

::v-deep {
  .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
    font-weight: 400;
    color: inherit;
    cursor: text;
  }
  .el-breadcrumb__inner {
    color: inherit;
  }
}

.el-menu{
  border-right: 0;
}

.el-main {
  position: absolute;
  overflow-y: auto;
  overflow-x: hidden;
  top: 40px;
  bottom: 0;
  right: 0;
  padding: 0 16px 16px;
  font-size: 14px;
  min-width: 750px;
}

.collapse-tag{
  cursor: pointer;
  border: 0;
  background-color: #ffffff;
  color: #4a4a4a;
}
.slide-fade{
  position: absolute;left:0;right: 0;
}
.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  
  transition: all .1s cubic-bezier(2.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
{
  left:0;right: 0;
  transform: translateX(50px);
  opacity: 0;
}
</style>
