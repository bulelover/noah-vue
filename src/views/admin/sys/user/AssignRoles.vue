<template>
  <el-dialog :title="title"
             :append-to-body="true"
             :width="g.dialogWidth1"
             :visible.sync="visible"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :before-close="close"
             v-dialog-drag>
    <div class="form-container same-padding" v-loading="loading">
      <el-descriptions title="用户信息" border size="medium">
        <el-descriptions-item label="用户名">{{ row.loginName }}</el-descriptions-item>
        <el-descriptions-item label="真实姓名">{{ row.realName }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="分配角色" border size="medium" style="margin-top: 20px;"></el-descriptions>
      <el-checkbox-group v-model="selected">
        <el-checkbox v-for="r in roles" :label="r.id" :key="r.id">{{ r.name }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="loading" type="primary" @click="save" :loading="saveLoading">保存</el-button>
      <el-button :disabled="loading || saveLoading" @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      id: '',
      title: '分配角色',
      row: {},
      roles: [],
      selected: []
    }
  },
  methods: {
    init(row){
      this.id = row.id;
      this.row = row;
      this.visible = true;
      this.loading = true;
      this.$api.sysUserGetUserRoles({
        data: {
          id: this.id
        },
        callback: d => {
          this.loading = false;
          this.roles = d;
          this.roles.forEach(item => {
            if(item.has === '1'){
              this.selected.push(item.id);
            }
          });
        },
        failure: e => {
          this.loading = false;
        }
      });
    },
    save() {
      let checkedKeys = '';
      if(this.selected && this.selected.length > 0){
        this.selected.forEach(item => {
          checkedKeys += ','+item;
        })
        checkedKeys = checkedKeys.substring(1);
      }
      this.saveLoading = true;
      this.$api.sysUserSaveUserRole({
        data: {
          id: this.id,
          roleIds: checkedKeys
        },
        callback: (d, msg) => {
          this.$message.success(msg);
          this.saveLoading = false;
          this.close();
        },
        failure: e => {
          this.saveLoading = false;
        }
      });
    },
    close() {
      this.visible = false;
      setTimeout(()=>{
        this.$parent.assignRolesVisible = false;
      },g.destroyTimeout)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
