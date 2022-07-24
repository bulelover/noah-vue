<template>
  <el-dialog :title="title"
             :append-to-body="true"
             :width="G.dialogWidth1"
             :visible.sync="visible"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :before-close="close"
             v-dialog-drag>
    <div class="form-container" v-loading="loading">
      <el-form ref="form" :model="form" label-width="120px" :disabled="isView">
        <el-form-item label="字典编码" prop="code" :rules="[{required:true, trigger: 'blur', message: '不能为空'}]">
          <el-input v-model="form.code" placeholder="请输入字典编码"></el-input>
        </el-form-item>
        <el-form-item label="字典名称" prop="name" :rules="[{required:true, trigger: 'blur', message: '不能为空'}]">
          <el-input v-model="form.name" placeholder="请输入字典名称"></el-input>
        </el-form-item>
        <el-form-item label="字典描述" prop="url">
          <el-input v-model="form.remark" placeholder="请输入字典描述"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="loading" v-if="!isView" type="primary" @click="save" :loading="saveLoading">保存</el-button>
      <el-button :disabled="loading" @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import SysDictApi from './'
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
        code: '',
        name: '',
        remark: '',
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
      this.title= '新增字典';
      this.visible = true;
      this.id = id;
      this.page = page;
      //编辑、查看
      if(this.page === 'edit' || this.page === 'view'){
        this.title = this.isView?'查看字典': '修改字典';
        this.loading = true;
        SysDictApi.getById({
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
            SysDictApi.add(opts);
          }
          if (this.page === 'edit') {
            this.saveLoading = true;
            SysDictApi.edit(opts);
          }
        } else {
          return false
        }
      })
    },
    close() {
      this.visible = false;
      setTimeout(()=>{
        this.$parent.dialogVisible.edit = false;
      }, G.destroyTimeout)
    },
    refreshTable(){
      this.$emit('refreshTable');
    }
  }
}
</script>

<style scoped lang="scss">
</style>
