<template>
  <div class="page-wrapper">
    <div class="white-box full-height">
      <span class="page-title mb16">模型列表</span>
      <div class="search-flex mb16">
        <div class="search-group">
          <el-form label-position="top" :model="searchForm" @keyup.enter.native="refreshList" @submit.native.prevent>
            <el-input v-model="searchForm.search" placeholder="key/name" style="width: 220px"></el-input>
<!--            <el-select v-model="searchForm.state" @change="refreshList" style="width: 120px">
              <el-option label="状态：全部" value=""></el-option>
              <el-option label="状态：启用" value="1"></el-option>
              <el-option label="状态：禁用" value="0"></el-option>
            </el-select>-->
            <el-button icon="el-icon-search" @click="refreshList"></el-button>
          </el-form>
        </div>
        <div>
          <el-button v-if="$perms.has('sys-user-add')" type="primary" @click="add">新增</el-button>
        </div>
      </div>
      <el-table ref="table" border :data="tableData" v-loading="tableLoading" row-key="id" :height="G.tableHeight" >
        <el-table-column label="序号" width="50" type="index" align="center" show-overflow-tooltip
                         :index="(searchForm.current-1)*searchForm.size+1"></el-table-column>
        <el-table-column prop="realName" label="流程名称" min-width="120">
          <template v-slot="{row}">
            <el-link type="primary" v-if="$perms.has('sys-user-view')"
                     :underline="false" @click="view(row)">{{ row.name }}</el-link>
            <template v-else>{{ row.name }}</template>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本号" min-width="60"></el-table-column>
        <el-table-column prop="mail" label="操作" :width="toolbarWidth" class-name="link-menu" fixed="right"
                         v-if="toolbarWidth > 0">
          <template v-slot="{row}">
            <el-link v-if="$perms.has('flw-model-save')" :underline="false" type="primary" @click="edit(row)">设计</el-link>
            <el-link v-if="$perms.has('flw-model-release')" :underline="false" type="primary" @click="release(row)">
              发布
            </el-link>
            <el-link v-if="$perms.has('flw-model-delete')" :underline="false" type="danger" @click="del(row)">删除</el-link>
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
  </div>
</template>

<script>
import FlwModelApi from './'
export default {
  components: {
  },
  data() {
    return {
      searchForm: {
        search: '',
        size: 10,
        current: 1,
        // orders: [{
        //   column: 'code',
        //   type: 'asc'
        // }, {
        //   column: 'code2',
        //   type: 'asc'
        // }]
      },
      tableLoading: false,
      total: 0,
      multiple: false,
      multipleCbx: false,
      isIndeterminate: false,
      tableData: [],
    }
  },
  computed:{
    toolbarWidth(){
      let perms = [
            [this.$perms.has('flw-model-save'), 60],
            [this.$perms.has('flw-model-release'), 60],
            [this.$perms.has('flw-model-delete'), 60],
          ],
          width = 0;
      perms.forEach(v => {
        if(v[0]) width += v[1];
      })
      return width;
    }
  },
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
      this.tableData = [];
      FlwModelApi.page({
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
    add() {
      G._navtab({
        path:'/admin/flw/model/design',
        query: {
          title: '流程设计'
        }
      });
    },
    edit(row) {
      G._navtab({
        path:'/admin/flw/model/design',
        query: {
          title: '流程设计',
          id: row.id,
          child: true
        }
      });
    },
    view(row) {

    },
    release(row) {

    },
    del(row) {
      this.$confirm2('确定要删除该用户吗？').then(() => {
        /*SysUserApi.removeById({
          data: {
            id: row.id
          },
          callback: (d, msg) => {
            this.$message.success(msg);
            this.fetchData()
          },
        })*/
      }).catch(_ => _)
    },
  }
}
</script>

<style scoped lang="scss">

</style>
