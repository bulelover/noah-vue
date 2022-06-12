<template>
  <el-carousel height="400px">
    <el-carousel-item key="1"><div style="background-color: #8be3a7;height: 100%;">1</div></el-carousel-item>
    <el-carousel-item key="2"><div style="background-color: #8e8be3;height: 100%;">2</div></el-carousel-item>
    <el-carousel-item key="3"><div style="background-color: #cbb3b3;height: 100%;">3</div></el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  data() {
    return {
      home: '首页'
    }
  },
  created() {
  
  }
}
</script>

<style scoped lang="scss">
h1 {
  color: #42b983;
}
</style>
