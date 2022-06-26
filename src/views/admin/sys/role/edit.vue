<template>
  <el-dialog :title="title"
             :append-to-body="true"
             :width="g.dialogWidth1"
             :visible.sync="visible"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :before-close="close"
             v-dialog-drag>
    <div class="form-container" v-loading="loading">
      <el-form ref="form" :model="form" label-width="120px" :disabled="isView">
        <el-form-item label="角色名称" prop="name" :rules="[{required:true, trigger: 'blur', message: '不能为空'}]">
          <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入角色描述"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-switch v-model="form.state" active-text="启用" inactive-text="禁用" active-value="1"
                     inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="排序" prop="orderBy" :rules="[{required:true,trigger: 'blur', message: '不能为空'}]">
          <el-input-number v-model="form.orderBy" :min="1" :step="5"></el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer" v-if="visible">
      <el-button :disabled="loading" v-if="!isView" type="primary" @click="save" :loading="saveLoading">保存</el-button>
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
      id: '',
      title: '',
      page: 'view',
      form: {
        id: '',
        name: '',
        state: '1',
        remark: '',
        orderBy: 10,
      },
    }
  },
  computed:{
    isView: {
      get(){
        return this.page === 'view';
      }
    }
  },
  methods: {
    init(page,id){
      this.title= '新增角色';
      this.visible = true;
      this.id = id;
      this.page = page;
      //编辑、查看
      if(this.page === 'edit' || this.page === 'view'){
        this.title = this.isView?'查看角色': '修改角色';
        this.loading = true;
        SysRoleApi.getById({
          data: {
            id: this.id
          },
          callback: d => {
            this.form = d;
          },
          complete: () => {
            this.loading = false;
          }
        });
      }
    },
    save() {
      let opts = {
        data: this.form,
        callback: (d, msg) => {
          this.$message.success(msg);
          this.refreshTable();
          this.close();
        },
        complete: () => {
          this.saveLoading = false;
        }
      };
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.page === 'add') {
            this.saveLoading = true;
            SysRoleApi.add(opts);
          }
          if (this.page === 'edit') {
            this.saveLoading = true;
            SysRoleApi.edit(opts);
          }
        } else {
          return false
        }
      })
    },
    close() {
      this.visible = false;
      //延时销毁form表单
      setTimeout(()=>{
        this.$parent.editVisible = false;
      },g.destroyTimeout)
    },
    refreshTable(){
      this.$emit('refreshTable');
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep .el-dialog{
    height: 386px;
  }
</style>
