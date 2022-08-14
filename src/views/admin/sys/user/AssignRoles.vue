<template>
  <div style="height: 100%;">
    <div class="form-container" style="width: 900px" v-loading="loading">
      <div class="form-title">
        <div class="page-title">{{ title }}</div>
        <div>
          <el-button :disabled="loading" type="primary" @click="save" :loading="saveLoading">保存</el-button>
          <el-button :disabled="loading || saveLoading" @click="close">取消</el-button>
        </div>
      </div>
      <div class="form-body same-padding">
        <el-descriptions title="用户信息" border size="medium">
          <el-descriptions-item label="用户名">{{ row.loginName }}</el-descriptions-item>
          <el-descriptions-item label="真实姓名">{{ row.realName }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="分配角色" border size="medium" style="margin-top: 20px;"></el-descriptions>
        <el-checkbox-group v-model="selected">
          <el-checkbox v-for="r in roles" :label="r.id" :key="r.id">{{ r.name }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
import SysUserApi from './'

export default {
  data() {
    return {
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
    init(row) {
      this.id = row.id;
      this.row = row;
      this.loading = true;
      SysUserApi.getUserRoles({
        data: {
          id: this.id
        },
        callback: d => {
          this.roles = d;
          this.roles.forEach(item => {
            if (item.has === '1') {
              this.selected.push(item.id);
            }
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
    },
    save() {
      let checkedKeys = '';
      if (this.selected && this.selected.length > 0) {
        this.selected.forEach(item => {
          checkedKeys += ',' + item;
        })
        checkedKeys = checkedKeys.substring(1);
      }
      this.saveLoading = true;
      SysUserApi.saveUserRole({
        data: {
          id: this.id,
          roleIds: checkedKeys
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
      this.$parent.assignRolesVisible = false;
    }
  }
}
</script>

<style scoped lang="scss">
</style>
