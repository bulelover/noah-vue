<template>
  <el-drawer
      title="主题设置"
      :append-to-body="true"
      :modal-append-to-body="false"
      :visible.sync="drawer"
      :size="280"
      direction="rtl">
    <el-row>
      <el-col :span="12"><div @click="setThemeColor('theme-default')"><span class="theme-span" style="background-color: #2e9aff;"></span> 天空蓝</div></el-col>
      <el-col :span="12"><div @click="setThemeColor('theme-coffee')"><span class="theme-span" style="background-color: #9a7b71;"></span> 咖啡色</div></el-col>
      <el-col :span="12"><div @click="setThemeColor('theme-cyan')"><span class="theme-span" style="background-color: rgba(22, 178, 163,1);"></span> 青葱绿</div></el-col>
      <el-col :span="12"><div @click="setThemeColor('theme-green')"><span class="theme-span" style="background-color: #3D9259;"></span> 绿如茵</div></el-col>
      <el-col :span="12"><div @click="setThemeColor('theme-black')"><span class="theme-span" style="background-color: rgba(18, 18, 18, 0.9);"></span> 黑色系</div></el-col>
      <el-col :span="12"><div @click="setThemeColor('theme-dark-blue')"><span class="theme-span" style="background-color: rgb(11, 99, 192);"></span> 深邃蓝</div></el-col>
      <el-col :span="12"><div @click="setThemeColor('theme-purple')"><span class="theme-span" style="background-color: rgb(165, 82, 192);"></span> 轻柔紫</div></el-col>
      <el-col :span="12"><div @click="setThemeColor('theme-orangered')"><span class="theme-span" style="background-color: rgb(243, 104, 56);"></span> 橘子红</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"><el-checkbox v-model="checked" @change="setMultiTab">显示页签</el-checkbox></el-col>
      <el-col :span="12"><el-checkbox v-model="positionV" @change="setPosition">显示位置</el-checkbox></el-col>
      <el-col :span="12"><el-checkbox v-model="steepV" @change="setSteep">沉浸式主题</el-checkbox></el-col>
      <el-col :span="12"><el-checkbox v-model="whiteV" @change="setWhite">白色背景</el-checkbox></el-col>
    </el-row>
  </el-drawer>
</template>

<script>

export default {
  name: "ThemeDrawer",
  props: {
    steep: Boolean,
    white: Boolean,
    position: Boolean,
    multiTab: Boolean,
  },
  data(){
    return {
      drawer: false,
      checked: false,
      steepV: false,
      whiteV: false,
      positionV: false,
    }
  },
  methods:{
    open(){
      this.steepV = this.steep;
      this.whiteV = this.white;
      this.positionV = this.position;
      this.checked = this.multiTab;
      this.drawer = true;
    },
    setMultiTab(v){
      G.setMultiTab(v?'1':'0');
      this.$emit('update', 'multiTab', v);
    },
    setWhite(v){
      G.setWhite(v?'1':'0');
      this.$emit('update', 'white', v);
      if(v){
        document.body.classList.add('white-theme');
      }else {
        for(let i=document.body.classList.length; i>0; i--){
          if(document.body.classList[i-1].indexOf('white-theme') === 0){
            document.body.classList.remove(document.body.classList[i-1]);
          }
        }
      }
    },
    setPosition(v){
      G.setPosition(v?'1':'0');
      this.$emit('update', 'position', v);
    },
    setSteep(v){
      G.setSteep(v?'1':'0');
      this.$emit('update', 'steep', v);
    },
    
    setThemeColor(command){
      for(let i=document.body.classList.length; i>0; i--){
        if(document.body.classList[i-1].indexOf('theme-') === 0){
          document.body.classList.remove(document.body.classList[i-1]);
        }
      }
      //设置主题色
      document.body.classList.add(command);
      G.setTheme(command);
    }
  }
}
</script>

<style scoped lang="scss">
.theme-span{
  border-radius: 3px;
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: text-top;
}
.el-row{
  padding:0 20px 20px;
}
.el-col{
  margin-bottom: 16px;
  div {
    cursor: pointer;
    display: inline-block;
  }
}
</style>
