<template>
  <div>
    <template v-for="(item,index) in menus">
      <el-submenu v-if="item.children && item.children.length > 0 && item.children[0].type === '1'" :index="item.code">
        <template slot="title">
          <i style="color: inherit" v-if="item.icon.indexOf('el-icon') === 0" :class="item.icon"></i>
          <i  style="color: inherit" v-else-if="item.icon.indexOf('icon-') === 0" :class="'iconfont ' + item.icon"></i>
          <icon v-else :type="item.icon"></icon>
          <span slot="title">{{ item.name }}</span>
        </template>
        <tree-menu :menus="item.children" @changeMenu="changeMenu"></tree-menu>
      </el-submenu>
      <el-menu-item v-else-if="item.type === '1'" :index="item.code" @click="selectMenu(item)">
        <i style="color: inherit" v-if="item.icon.indexOf('el-icon') === 0" :class="item.icon"></i>
        <i style="color: inherit" v-else-if="item.icon.indexOf('icon-') === 0" :class="'iconfont ' + item.icon"></i>
        <icon v-else :type="item.icon"></icon>
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'tree-menu',
  props: {
    menus: Array
  },
  methods: {
    selectMenu(item){
      this.changeMenu(item);
    },
    changeMenu(item){
      this.$emit('changeMenu', item);
    }
  }
}
</script>

<style scoped lang="scss">
  .el-menu--collapse>div>.el-menu-item span:not(.i-icon), .el-menu--collapse>div>.el-submenu>.el-submenu__title span:not(.i-icon) {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
  }
  .el-menu-item .iconfont,
  .el-submenu__title .iconfont,
  .el-menu-item .i-icon,
  .el-submenu__title .i-icon{
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
    vertical-align: middle;
  }
</style>
