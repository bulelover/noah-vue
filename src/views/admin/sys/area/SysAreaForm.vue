<template>
  <el-dialog :title="title"
             :append-to-body="true"
             :width="g.dialogWidth2"
             :visible.sync="visible"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :before-close="close"
             v-dialog-drag>
    <div class="form-container" v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" :disabled="isView">
        <el-form-item class="w-ib w-1-2" label="父区域编号" prop="pCode">
          <el-input v-model="form.pCode" placeholder="请输入父区域编号" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="父级名称" prop="pName">
          <el-input v-model="form.pName" placeholder="请输入父级名称" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="区域编号" prop="code">
          <el-input v-model="form.code" placeholder="请输入区域编号"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="区域名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入区域名称"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="地区全称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入地区名称（全）"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="拼音码" prop="pinyin">
          <el-input v-model="form.pinyin" placeholder="请输入拼音码"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="区域等级" prop="areaLevel">
          <el-select v-model="form.areaLevel" placeholder="请选择区域等级" :disabled="true">
            <el-option v-for="item in $dict.list('sys-area-level')" :key="item.code"
                       :label="item.name" :value="parseInt(item.code)"></el-option>
          </el-select>
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
  import SysAreaApi from './';
  import pinyin from '@/components/pinyin'
  export default {
    data() {
      return {
        visible: false,
        loading: false,
        saveLoading: false,
        id: '',
        title: '',
        page: 'view',
        oldParentId: null,
        rules: {
          code: [{required: true, trigger: 'blur', message: '区域编号不能为空'}],
          name: [{required: true, trigger: 'blur', message: '区域名称不能为空'}],
          pCode: [{required: false, trigger: 'blur', message: '父区域编号不能为空'}],
          areaLevel: [{required: false, trigger: 'blur', message: '区域等级不能为空'}],
          pName: [{required: false, trigger: 'blur', message: '父级名称不能为空'}],
          areaName: [{required: false, trigger: 'blur', message: '地区名称（全）不能为空'}],
          pinyin: [{required: false, trigger: 'blur', message: '拼音码不能为空'}],
        },
        form: {
          id: '',
          code: '',
          name: '',
          pCode: '',
          areaLevel: null,
          pName: '',
          areaName: '',
          pinyin: '',
          state: '1',
        },
      }
    },
    computed: {
      isView: {
        get() {
          return this.page === 'view';
        }
      }
    },
    watch: {
      'form.areaName': {
        handler(val, oldVal){
          this.form.pinyin = pinyin.chineseToPinYin(val, true).toUpperCase();
        }
      }
    },
    methods: {
      init(page, row) {
        this.title = '新增区划';
        this.visible = true;
        this.id = row?row.id : '';
        this.page = page;
        //添加下级
        if(this.page === 'child'){
          this.form.pCode = this.id;
          this.form.pName = row.name;
          this.form.areaName = row.areaName;
          this.form.areaLevel = row.areaLevel+1;
          this.oldParentId = row.parentId;
        }
        //编辑、查看
        if (this.page === 'edit' || this.page === 'view') {
          this.title = this.isView ? '查看区划' : '修改区划';
          this.loading = true;
          SysAreaApi.getById({
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
            this.$emit('refresh', this.form.parentId)
            if(this.oldParentId !== null && this.oldParentId !== this.form.parentId){
              this.$emit('refresh', this.oldParentId)
            }
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
              SysAreaApi.add(opts);
            }
            if (this.page === 'edit') {
              this.saveLoading = true;
              SysAreaApi.edit(opts);
            }
          } else {
            return false
          }
        })
      },
      close() {
        this.visible = false;
        //延时销毁form表单
        setTimeout(() => {
          this.$parent.editVisible = false;
        }, g.destroyTimeout)
      },
    }
  }
</script>

<style scoped lang="scss">

</style>
