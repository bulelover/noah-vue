<template>
  <div class="page-wrapper">
    <div class="white-box full-height">
      <span class="page-title mb16">日志列表</span>
      <div class="search-flex mb16">
        <div class="search-group">
          <el-form label-position="top" :model="searchForm" @keyup.enter.native="fetchData" @submit.native.prevent>
            <el-input v-model="searchForm.transName" placeholder="日志摘要" style="width: 340px"></el-input>
            <el-button icon="el-icon-search" @click="fetchData"></el-button>
          </el-form>
        </div>
        <div></div>
      </div>
      <el-table border stripe :data="tableData" v-loading="tableLoading" row-key="id" :height="g.tableHeight">
        <el-table-column label="序号" width="50" type="index" align="center" show-overflow-tooltip
                         :index="(searchForm.current-1)*searchForm.size+1"></el-table-column>
        <el-table-column prop="transName" label="交易摘要" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="transIn" label="交易入参" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="transOut" label="交易出参" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="transIp" label="IP地址" min-width="120"></el-table-column>
        <el-table-column prop="createRealName" label="操作人" min-width="100"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="140" align="center"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total"
                       :current-page.sync="searchForm.current"
                       :page-sizes="[10, 20, 50, 100]"
                       :page-size="searchForm.size"
                       @size-change="fetchData"
                       @current-change="fetchData"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    isMy:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchForm: {
        transName: '',
        transIn: '',
        transType: '',
        transIp: '',
        createRealName: '',
        createLoginName: '',
        createTimeBegin: null,
        createTimeEnd: null,
        size: 10,
        current: 1,
        orders: [{
          column: 'createTime',
          type: 'desc'
        }]
      },
      tableLoading: false,
      tableData: [],
      total: 0
    }
  },
  watch: {},
  
  created() {
    this.fetchData()
  },
  
  methods: {
    fetchData() {
      this.tableLoading = true;
      let opts = {
        data: {
          ...this.searchForm
        },
        callback: data => {
          this.tableLoading = false;
          this.tableData = data.records;
          this.total = data.total
        },
        failure: err => {
          this.tableLoading = false;
        }
      };
      if(this.isMy){
        this.$api.sysMyLogPage(opts);
      }else{
        this.$api.sysLogPage(opts);
      }
    },
    view(row) {
      console.log('')
      // this.$refs.edit.init('view', row.id);
    }
  }
}
</script>

<style scoped>
/* 修正上下级列对齐 */
::v-deep(.el-table__placeholder) {
  margin-right: 3px;
}
.el-table .el-button--small.el-button--text{
  padding: 0 8px;
}
</style>
