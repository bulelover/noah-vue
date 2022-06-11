<template>
  <el-card>
    <template #header>本机IP</template>
    <span class="public-ip"></span>
  </el-card>
</template>

<script>
import {getPublicIp} from "../../../utils/tools";
export default {
  data() {
    return {
      home: '首页'
    }
  },

  created() {
    getPublicIp();
  }
}
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>