<template>
  <div style="height: 100%;">
    <div class="form-container" style="width: 900px" v-loading="loading">
      <div class="form-title">
        <div class="page-title">
          {{ title }}
          <el-link v-if="!isAdd" @click="refreshData" icon="el-icon-refresh" :underline="false">刷新</el-link>
        </div>
        <div>
          <el-button :disabled="loading" v-if="!isView" type="primary" @click="save" :loading="saveLoading">保存</el-button>
          <el-button :disabled="loading || saveLoading" @click="close">取消</el-button>
        </div>
      </div>
      <el-form class="form-body" ref="form" :model="form" :rules="rules" label-width="120px" :disabled="isView">
                  <el-form-item class="w-ib w-1-2" label="组织代码" prop="code">
          <el-input v-model="form.code" placeholder="请输入组织机构代码"
                    maxlength="20" show-word-limit @blur="updateSearchCode"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="组织名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入组织/企业/单位名称"
                    maxlength="50" show-word-limit @blur="updateSearchCode"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="组织类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择组织类型" clearable>
            <el-option v-for="item in G.getDictList('org_type')" :key="item.code"
                       :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="状态" prop="state">
          <el-switch v-model="form.state" active-text="正常" inactive-text="锁定" active-value="1"
                     inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="法定代表人" prop="legalRepresentative">
          <el-input v-model="form.legalRepresentative" placeholder="请输入法定代表人"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="社会信用代码" prop="uscCode">
          <el-input v-model="form.uscCode" placeholder="请输入统一社会信用代码"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="成立日期" prop="establishmentDate">
          <el-date-picker v-model="form.establishmentDate" type="date" placeholder="请选择成立日期" clearable
                          format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 100%;">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="行政区划代码" prop="areaCode">
          <el-input v-model="form.areaCode" placeholder="请输入行政区划代码"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="行政区划名称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入行政区划名称"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="联系方式" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话/手机号"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="备用联系方式" prop="phone2">
          <el-input v-model="form.phone2" placeholder="请输入备用联系电话"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="邮箱" prop="mail">
          <el-input v-model="form.mail" placeholder="请输入邮箱"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="行业性质" prop="industry">
          <el-select v-model="form.industry" placeholder="请选择行业性质" clearable>
            <el-option v-for="item in G.getDictList('industry')" :key="item.code"
                       :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="简称" prop="abbreviation">
          <el-input v-model="form.abbreviation" placeholder="请输入简称"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="企业logo（图片ID）" prop="logo">
          <el-input v-model="form.logo" placeholder="请输入企业logo（图片ID）"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="父级主键" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入父级主键"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="备注" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请输入备注"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-1-2" label="搜索码" prop="remarks">
          <el-input v-model="form.searchCode" placeholder="请输入搜索码"
                    maxlength="300"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import SysOrgApi from './'
  import { pinyin } from 'pinyin-pro';
  export default {
    data() {
      return {
        loading: false,
        saveLoading: false,
        id: '',
        title: '',
        page: 'view',
        rules: {
          code: [],
          name: G.validator.required('blur', '组织名称不能为空'),
          type: G.validator.required('blur', '组织类型不能为空'),
          // areaCode: [{required: false, trigger: 'blur', message: '行政区划不能为空'}],
          phone: G.validator.phone(),
          mail: G.validator.email(),
        },
        form: {
          id: '',
          code: '',
          name: '',
          type: '',
          state: '1',
          legalRepresentative: '',
          uscCode: '',
          establishmentDate: null,
          areaCode: '',
          areaName: '',
          address: '',
          phone: '',
          phone2: '',
          mail: '',
          industry: '',
          abbreviation: '',
          logo: '',
          parentId: '',
          remarks: '',
          searchCode: '',
        },
      }
    },
    computed: {
      isView: {
        get() {
          return this.page === 'view';
        }
      },
      isAdd: {
        get() {
          return this.page === 'add';
        }
      }
    },
    methods: {
      updateSearchCode(){
        this.form.searchCode = '';
        if(this.form.name){
          this.form.searchCode += this.form.name + ";";
          this.form.searchCode += pinyin(this.form.name, { pattern: 'initial' }).toUpperCase().replaceAll(' ', '') + ";";
        }
        if(this.form.code){
          this.form.searchCode += this.form.code + ";";
        }
      },
      init(page, obj) {
        this.title = '新增组织';
        this.page = page;
        //编辑、查看
        if (!this.isAdd) {
          this.id = obj.id;
          this.title = this.isView ? '查看组织' : '修改组织';
          this.refreshData();
        }
      },
      refreshData(){
        this.loading = true;
        SysOrgApi.getById({
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
              SysOrgApi.add(opts);
            }
            if (this.page === 'edit') {
              this.saveLoading = true;
              SysOrgApi.edit(opts);
            }
          } else {
            return false
          }
        })
      },
      close() {
        this.$parent.editVisible = false;
      },
      refreshTable() {
        this.$emit('refreshTable');
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
