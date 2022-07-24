<template>
  <div class="page-wrapper">
    <div class="white-box">
      <h1>{{home}}</h1>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      home: '首页'
    }
  },

  created() {

  },
  mounted() {
    //默认展开第一个菜单
    this.$nextTick(() => {
      let $firstMenu = $('.el-submenu__title:eq(0)');
      if(!$firstMenu.parent().hasClass('is-opened')){
        $firstMenu.trigger('click')
      }
    })
  }
}
</script>

<style scoped lang="scss">
h1 {
  color: #42b983;
}
</style>
