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
        <el-form-item label="当前字典">
          {{dictName}} [{{dictCode}}]
        </el-form-item>
        <el-form-item label="项目编码" prop="code" :rules="[{required:true, trigger: 'blur', message: '不能为空'}]">
          <el-input v-model="form.code" placeholder="请输入项目编码"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="name" :rules="[{required:true, trigger: 'blur', message: '不能为空'}]">
          <el-input v-model="form.name" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目描述" prop="url">
          <el-input v-model="form.remark" placeholder="请输入项目描述"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderBy" :rules="[{required:true,trigger: 'blur', message: '不能为空'}]">
          <el-input-number v-model="form.orderBy" :min="1" :step="5"></el-input-number>
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
      dictCode: '',
      dictName: '',
      form: {
        id: '',
        dictId: '',
        code: '',
        name: '',
        remark: '',
        orderBy: null,
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
    init(page, options, id){
      this.title= '新增字典项';
      this.visible = true;
      this.id = id;
      this.dictCode = options.code;
      this.form.dictId = options.id;
      this.dictName = options.name;
      this.page = page;
      if(this.page === 'add'){
        this.form.orderBy = options.nextOrderBy || 10;
      }
      //编辑、查看
      if(this.page === 'edit' || this.page === 'view'){
        this.title = this.isView?'查看字典项': '修改字典项';
        this.loading = true;
        SysDictApi.getItemById({
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
            SysDictApi.addItem(opts);
          }
          if (this.page === 'edit') {
            this.saveLoading = true;
            SysDictApi.editItem(opts);
          }
        } else {
          return false
        }
      })
    },
    close() {
      this.visible = false;
      setTimeout(()=>{
        this.$parent.dialogVisible.editItem = false;
      }, g.destroyTimeout)
    },
    refreshTable(){
      this.$emit('refreshTable');
    }
  }
}
</script>

<style scoped lang="scss">
</style>
