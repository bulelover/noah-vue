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
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="form.loginName" :disabled="this.page !== 'add'" placeholder="请输入登录名"
                    show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName" maxlength="30">
          <el-input v-model="form.realName" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio v-for="item in G.getDictList('gender')" :key="item.code" :label="item.code">{{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone" maxlength="20" :rules="[]">
          <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNo" maxlength="20" :rules="[]">
          <el-input v-model="form.idNo" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="position">
          <el-input v-model="form.position" placeholder="请输入岗位"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="form.mail" maxlength="50" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-switch v-model="form.state" active-text="正常" inactive-text="锁定" active-value="1"
                     inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import SysUserApi from './'
import validate from "@/utils/validate";

export default {
  data() {
    return {
      loading: false,
      saveLoading: false,
      id: '',
      title: '',
      page: 'view',
      rules: {
        loginName: [{required: true, trigger: 'blur', message: '不能为空'}],
        realName: [{required: true, trigger: 'blur', message: '不能为空'}],
        phone: [{validator: validate.checkPhone, trigger: 'blur'}]
      },
      form: {
        id: '',
        loginName: '',
        realName: '',
        sex: '',
        phone: '',
        position: '',
        mail: '',
        idNo: '',
        state: '1'
        // orderBy: 10,
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
    init(page, id) {
      this.title = '新增用户';
      this.id = id;
      this.page = page;
      //编辑、查看
      if (!this.isAdd) {
        this.title = this.isView ? '查看用户' : '修改用户';
        this.loading = true;
        this.refreshData();
      }
    },
    refreshData(){
      this.loading = true;
      SysUserApi.getById({
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
            SysUserApi.add(opts);
          }
          if (this.page === 'edit') {
            this.saveLoading = true;
            SysUserApi.edit(opts);
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
