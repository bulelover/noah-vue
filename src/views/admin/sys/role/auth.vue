<template>
  <el-dialog :title="title"
             :append-to-body="true"
             :visible.sync="visible"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :before-close="close"
             width="900px"
             v-dialog-drag>
    <div class="form-container same-padding" v-loading="loading">
<!--      <el-tree ref="tree"-->
<!--          :data="menus"-->
<!--          show-checkbox-->
<!--          node-key="id"-->
<!--          :default-checked-keys="selected">-->
<!--      </el-tree>-->
      <div style="text-align: right;margin-bottom: 10px;">
        开启级联选择，一般第一次设置权限时使用：<el-switch v-model="checkCascade" @change="checkCascadeChange"></el-switch>
      </div>
      <el-cascader-panel v-if="panelShow" ref="tree" v-model="selected" :options="menus"
                         :props="{ multiple: true, checkStrictly: !checkCascade, value: 'id' }">
        <template v-slot="{ node, data }">
          <span>{{ data.label }}</span>
          <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
        </template>
      </el-cascader-panel>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="loading" type="primary" @click="save" :loading="saveLoading">保存</el-button>
      <el-button :disabled="loading || saveLoading" @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import SysRoleApi from './'
export default {
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      checkCascade: false,
      panelShow: true,
      id: '',
      title: '角色授权',
      menus: [],
      selected: [],
    }
  },
  methods: {
    checkCascadeChange(){
      this.panelShow = false;
      this.$nextTick(()=>{
        this.panelShow = true;
      })
    },
    init(id){
      this.id = id;
      this.visible = true;
      this.loading = true;
      SysRoleApi.getMenusByRoleId({
        data: {
          id: this.id
        },
        callback: d => {
          this.menus = d.menus;
          let parent = {};
          let setData = function (root, pId){
            root.forEach((item) => {
              if(!g.isEmpty(pId)){
                parent[item.id] = pId;
              }
              if(item.children && item.children.length === 0){
                item.children = null;
              }
              if(item.children && item.children.length > 0){
                setData(item.children, item.id);
              }
            });
          }
          setData(this.menus);
          let setOptions = (id, arr) => {
            if(parent[id]){
              arr.unshift(id);
              setOptions(parent[id],arr);
            }else {
              arr.unshift(id);
            }
          }
          if(d.selected && d.selected.length>0){
            d.selected.forEach(id => {
              let arr = [];
              setOptions(id, arr);
              this.selected.push(arr);
            })
          }
        },
        complete: () => {
          this.loading = false;
        }
      });
    },
    save() {
      let checkedKeys = '';
      let cks = this.$refs.tree.getCheckedNodes();
      if(cks && cks.length > 0){
        cks.forEach(item => {
          checkedKeys += ','+item.value;
        })
        checkedKeys = checkedKeys.substring(1);
      }
      this.saveLoading = true;
      SysRoleApi.saveRoleMenu({
        data: {
          id: this.id,
          menuIds: checkedKeys
        },
        callback: (d, msg) => {
          this.$message.success(msg);
          this.close();
        },
        complete: () => {
          this.saveLoading = false;
        }
      });
      
    },
    close() {
      this.visible = false;
      //延时销毁form表单
      setTimeout(()=>{
        this.$parent.authVisible = false;
      },g.destroyTimeout)
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep .el-dialog{
    .el-cascader-menu__wrap{
      height: 380px;
    }
  }
</style>
