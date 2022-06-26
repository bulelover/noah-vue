<template>
  <div class="page-wrapper">
<!--    <div class="search-wrapper" v-openSearch>
      <div class="search-content">
        <el-form label-position="top" :model="searchForm" @keyup.enter.native="fetchData()" @submit.native.prevent>
          <el-form-item label="访问地址">
            <el-input v-model="searchForm.uri"></el-input>
          </el-form-item>
          <el-form-item label="IP地址">
            <el-input v-model="searchForm.remoteAddr"></el-input>
          </el-form-item>
          <el-form-item label="是否过滤自身请求">
            <el-select v-model="searchForm.owner">
              <el-option value="0" label="不过滤"></el-option>
              <el-option value="1" label="过滤"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="search-btn">
        <el-button type="primary" @click="fetchData" icon="el-icon-search">查询</el-button>
        <el-button class="more-view"><span class="more-text">更多</span><i class="el-icon-arrow-right"></i></el-button>
      </div>
    </div>
    <div class="search-next white-box">
      <el-button type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
    </div>-->
    <div class="white-box full-height">
      <span class="page-title mb16">日志列表</span>
      <div class="search-flex mb16">
        <div class="search-group">
          <el-form label-position="top" :model="searchForm" @keyup.enter.native="fetchData" @submit.native.prevent>
            <el-input v-model="searchForm.uri" placeholder="访问地址" style="width: 220px"></el-input>
            <el-input v-model="searchForm.remoteAddr" placeholder="IP地址" style="width: 180px"></el-input>
            <el-select v-model="searchForm.owner" @change="fetchData" style="width: 150px">
              <el-option value="0" label="不过滤自身请求"></el-option>
              <el-option value="1" label="过滤自身请求"></el-option>
            </el-select>
            <el-button icon="el-icon-search" @click="fetchData"></el-button>
          </el-form>
        </div>
        <div></div>
      </div>
      <el-table border stripe :data="tableData" v-loading="tableLoading" row-key="id" :height="g.tableHeight">
        <el-table-column label="序号" width="50" type="index" align="center" show-overflow-tooltip
                         :index="(searchForm.current-1)*searchForm.size+1"></el-table-column>
        <el-table-column prop="uri" label="访问地址" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="params" label="请求参数" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="method" label="请求方式" min-width="80" align="center"></el-table-column>
        <el-table-column prop="browserName" label="浏览器" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="browserVersion" label="浏览器版本" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="osName" label="操作系统" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remoteAddr" label="IP地址" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createRealName" label="操作人" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="160" align="center"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total"
                       :current-page.sync="searchForm.current"
                       :page-sizes="[10, 20, 50, 100]"
                       :page-size.sync="searchForm.size"
                       @size-change="fetchData"
                       @current-change="fetchData"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import SysLogApi from './'
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
        uri: '',
        params: '',
        method: '',
        remoteAddr: '',
        owner: '1',
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
          this.tableData = data.records;
          this.total = data.total
        },
        complete: () => {
          this.tableLoading = false;
        }
      };
      SysLogApi.requestPage(opts);
    },
    view(row) {
      console.log('')
      // this.$refs.edit.init('view', row.id);
    }
  }
}
</script>

<style scoped lang="scss">
</style>
