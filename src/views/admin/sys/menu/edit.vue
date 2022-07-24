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
      <el-form ref="form" :model="form" label-width="110px" :disabled="isView">
        <el-form-item label="上级菜单">
          <el-cascader v-model="form.parentId" :options="options" @change="parentIdChange"  placeholder="请选择上级菜单"
                       :props="{ checkStrictly: true,value: 'id' }" style="width: 100%;" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="菜单编码" prop="code" :rules="[{required:true, trigger: 'blur', message: '不能为空'}]">
          <el-input v-model="form.code" placeholder="请输入菜单编码"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name" :rules="[{required:true, trigger: 'blur', message: '不能为空'}]">
          <el-input v-model="form.name" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="路由地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入路由地址"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.type">
            <el-radio label="1">菜单</el-radio>
            <el-radio label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" @input="icon = true" placeholder="请输入图标代码">
            <i slot="prepend" v-if="form.icon.indexOf('el-icon') === 0" :class="form.icon"></i>
            <i slot="prepend" v-else-if="form.icon.indexOf('icon-') === 0" :class="'iconfont '+form.icon"></i>
            <icon slot="prepend" v-else-if="form.icon && icon" :type="form.icon"></icon>
            <span slot="prepend" v-else></span>
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="url">
          <el-switch v-model="form.state" active-text="启用" inactive-text="禁用" active-value="1"
                     inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="排序" prop="orderBy" :rules="[{required:true,trigger: 'blur', message: '不能为空'}]">
          <el-input-number v-model="form.orderBy" :min="1" :step="5"></el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="loading" v-if="!isView" type="primary" @click="save" :loading="saveLoading">保存</el-button>
      <el-button :disabled="loading || saveLoading" @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import SysMenuApi from './'
export default {
  errorCaptured(err, vm, info) {
    //拦截图标报错
    if (vm.type) {
      this.icon = false;
      return false;
    }
  },
  data() {
    return {
      icon: true,
      visible: false,
      loading: false,
      saveLoading: false,
      id: '',
      title: '',
      page: '',
      loadParent: false,
      oldParentId: null,
      form: {
        id: '',
        code: '',
        name: '',
        url: '',
        type: '1',
        state: '1',
        icon: '',
        remark: '',
        parentId: '',
        orderBy: 10,
        platformType: '0',
      }
    }
  },
  computed:{
    isView: {
      get(){
        return this.page === 'view';
      }
    },
    options:{
      get(){
        if(G.menuOptions && G.menuOptions.length>0){
          this.loadParent = true;
        }
        return this.loadParent? G.menuOptions : [];
      }
    }
  },
  methods: {
    init(page, row){
      this.title= '新增菜单';
      this.visible = true;
      this.id = row?row.id : '';
      this.page = page;
      this.initParents();
      //添加下级
      if(this.page === 'child'){
        this.form.parentId = this.id;
        this.oldParentId = row.parentId;
      }
      //编辑、查看
      if(this.page === 'edit' || this.page === 'view'){
        this.title = this.isView?'查看菜单': '修改菜单';
        this.loading = true;
        SysMenuApi.getById({
          data: {
            id: this.id
          },
          callback: d => {
            this.form = d;
            this.oldParentId = d.parentId;
          },
          complete: () => {
            this.loading = false;
          }
        });
      }
    },
    initParents(){
      if(this.loadParent){
        return;
      }
      SysMenuApi.getAllMenuList({
        callback: data => {
          /* 处理数据 */
          let setData = function (root){
            root.forEach((item) => {
              if(item.children && item.children.length === 0){
                item.children = null;
              }
              if(item.children && item.children.length > 0){
                setData(item.children);
              }
            });
          }
          setData(data);
          G.menuOptions = data;
          this.loadParent = true;
        }
      });
    },
    parentIdChange(val) {
      this.form.parentId = val && val.length > 0 ? val[val.length - 1] : '';
    },
    save() {
      let opts = {
        data: this.form,
        callback: (d, msg) => {
          this.$message.success(msg);
          this.$emit('refresh', this.form.parentId)
          if(this.oldParentId !== null && this.oldParentId !== this.form.parentId){
            this.$emit('refresh', this.oldParentId)
          }
          G.menuOptions = null;
          this.close();
        },
        complete: () => {
          this.saveLoading = false;
        }
      };
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.page === 'add' || this.page === 'child') {
            this.saveLoading = true;
            SysMenuApi.add(opts);
          }
          if (this.page === 'edit') {
            this.saveLoading = true;
            SysMenuApi.edit(opts);
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
      }, G.destroyTimeout)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-input-group__prepend{
  width: 40px;
  padding: 0;
  text-align: center;
}
</style>
