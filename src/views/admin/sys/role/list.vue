<template>
  <div class="page-wrapper">
    <div class="white-box full-height">
      <span class="page-title mb16">角色列表</span>
      <div class="search-flex mb16">
        <div class="search-group">
          <el-form label-position="top" :model="searchForm" @keyup.enter.native="refreshList" @submit.native.prevent>
            <el-input v-model="searchForm.search" placeholder="角色名称" style="width: 220px"></el-input>
<!--            <el-select v-model="searchForm.state" @change="refreshList" style="width: 120px">
              <el-option label="状态：全部" value=""></el-option>
              <el-option label="状态：启用" value="1"></el-option>
              <el-option label="状态：禁用" value="0"></el-option>
            </el-select>-->
            <el-button icon="el-icon-search" @click="refreshList"></el-button>
          </el-form>
        </div>
        <div>
          <el-button v-if="G.hasPerm('sys-role-add')" type="primary" @click="add">新增</el-button>
        </div>
        <!--      <el-checkbox v-model="multiple" label="多选" style="margin-left: 10px"></el-checkbox>-->
      </div>
      <el-table ref="table" border :data="tableData" v-loading="tableLoading" row-key="id" :height="G.tableHeight">
        <el-table-column label="序号" width="50" type="index" align="center"
                         :index="(searchForm.current-1)*searchForm.size+1"></el-table-column>
        <el-table-column prop="name" label="角色名称" min-width="120" show-overflow-tooltip>
          <template v-slot="{row}">
            <el-link type="primary" v-if="G.hasPerm('sys-role-view')" :underline="false"
                  @click="view(row)">{{ row.name }}</el-link>
            <template v-else>{{ row.name }}</template>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="角色描述" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="state" label="状态" min-width="70" align="center">
          <template v-slot="{row}">
            <el-tag type="success" v-if="row.state === '1'">启用</el-tag>
            <el-tag type="danger" v-if="row.state === '0'">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderBy" align="right" label="排序" min-width="80"></el-table-column>
        <el-table-column prop="createRealName" label="创建人" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="170" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" min-width="200" class-name="link-menu" fixed="right">
          <template v-slot="{row}">
            <el-link v-if="G.hasPerm('sys-role-menu')" @click="auth(row)" type="primary" :underline="false">角色授权</el-link>
            <el-link v-if="G.hasPerm('sys-role-edit')" @click="edit(row)" type="primary" :underline="false">修改</el-link>
            <el-link v-if="G.hasPerm('sys-role-delete') && row.id !== 'admin'" @click="remove(row)" type="danger" :underline="false">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total"
                       :current-page.sync="searchForm.current"
                       :page-sizes="[10, 20, 50, 100]"
                       :page-size.sync="searchForm.size"
                       @size-change="refreshList"
                       @current-change="fetchData"
        ></el-pagination>
      </div>
    </div>
    <edit v-if="editVisible" ref="edit" @refreshTable="fetchData"></edit>
    <auth v-if="authVisible" ref="auth"></auth>
  </div>
</template>

<script>
import SysRoleApi from './'
import edit from "@/views/admin/sys/role/edit";
import auth from "@/views/admin/sys/role/auth";
export default {
  components:{
    edit, auth
  },
  data() {
    return {
      editVisible: false,
      authVisible: false,
      searchForm: {
        name: '',
        id: '',
        type: '1',
        size: 10,
        current: 1,
        orders: [{
          column: 'orderBy',
          type: 'asc'
        }]
      },
      tableLoading: false,
      tableData: [],
      total: 0
    }
  },
  watch: {},
  
  created() {
    this.refreshList()
  },
  activated() {
    if (this.$refs.table) {
      this.$refs.table.doLayout()
    }
  },
  methods: {
    refreshList() {
      if (this.$refs.table) {
        this.$refs.table.doLayout()
      }
      this.searchForm.current = 1;
      this.fetchData();
    },
    fetchData() {
      this.tableLoading = true;
      SysRoleApi.page({
        data: {
          ...this.searchForm
        },
        callback: data => {
          this.tableData = data.records;
          this.total = data.total
        },
        complete: () => {
          this.tableLoading = false;
        }
      });
    },
    auth(row) {
      this.authVisible = true
      this.$nextTick(()=>{
        this.$refs.auth.init(row.id);
      })
    },
    edit(row) {
      this.editVisible = true
      this.$nextTick(()=>{
        this.$refs.edit.init('edit', row.id);
      })
    },
    view(row) {
      this.editVisible = true
      this.$nextTick(()=>{
        this.$refs.edit.init('view', row.id);
      })
    },
    remove(row) {
      this.$confirm2('确定要删除吗?').then(() => {
        SysRoleApi.removeById({
          data: {
            id: row.id
          },
          callback: data => {
            this.$message.success( '删除成功!');
            this.fetchData();
          }
        });
      }).catch(e => {});
    },
    add() {
      this.editVisible = true
      this.$nextTick(()=>{
        this.$refs.edit.init('add');
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
