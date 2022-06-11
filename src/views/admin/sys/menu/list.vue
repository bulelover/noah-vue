<template>
  <div class="page-wrapper">
    <div class="white-box full-height">
      <span class="page-title mb16">菜单列表</span>
      <div class="search-flex mb16">
        <div class="search-group">
          <el-form label-position="top" :model="searchForm" @keyup.enter.native="fetchData" @submit.native.prevent>
            <el-input v-model="searchForm.search" placeholder="编码/名称" style="width: 220px"></el-input>
            <el-button icon="el-icon-search" @click="fetchData"></el-button>
          </el-form>
        </div>
        <div>
          <el-button v-if="$hasAuth('sys-role-add')" type="primary" @click="add">新增</el-button>
        </div>
        <!--      <el-checkbox v-model="multiple" label="多选" style="margin-left: 10px"></el-checkbox>-->
      </div>
      <el-table ref="table" border v-if="refreshTable" :data="tableData" v-loading="tableLoading" lazy row-key="id"
                :load="load" :height="g.tableHeightNoPage">
        <el-table-column label="序号" width="50" type="index" align="center"
                         :index="(searchForm.current-1)*searchForm.size+1"></el-table-column>
        <el-table-column prop="name" label="菜单名称" min-width="220" show-overflow-tooltip>
          <template v-slot="{row}">
            <el-link type="primary" v-if="$hasAuth('sys-menu-view')" :underline="false"
                  @click="view(row)">{{ row.name }}</el-link>
            <template v-else>{{ row.name }}</template>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="菜单编码" min-width="220" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="图标" min-width="60" align="center">
          <template v-slot="{row}">
            <i v-if="row.icon.indexOf('el-icon') === 0" :class="row.icon"></i>
            <i v-else-if="row.icon.indexOf('icon-')=== 0" :class="'iconfont '+row.icon"></i>
            <icon v-else-if="row.icon" :type="row.icon"></icon>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" min-width="80" align="center">
          <template v-slot="{row}">
            <template v-if="$hasAuth('sys-menu-state')">
              <el-switch v-model="row.state" active-value="1" inactive-value="0"
                         @change="changeState($event, row)"></el-switch>
            </template>
            <template v-else>
              <el-tag type="success" v-if="row.state === '1'">启用</el-tag>
              <el-tag type="danger" v-if="row.state === '0'">禁用</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="URL" min-width="280" show-overflow-tooltip></el-table-column>
        <el-table-column prop="type" label="类型" min-width="70" align="center">
          <template v-slot="{row}">
            <el-tag v-if="row.type === '1'">菜单</el-tag>
            <el-tag type="info" v-if="row.type === '2'">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderBy" label="排序" min-width="80" align="right"></el-table-column>
        <el-table-column label="操作" min-width="200" class-name="link-menu" fixed="right">
          <template v-slot="{row}">
            <el-link v-if="$hasAuth('sys-menu-edit')" @click="edit(row)" type="primary" :underline="false">修改</el-link>
            <el-link v-if="$hasAuth('sys-menu-add')" @click="addChild(row)" type="primary" :underline="false">添加下级</el-link>
            <el-link v-if="$hasAuth('sys-menu-delete')" @click="remove(row)" type="danger" :underline="false">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit v-if="editVisible" ref="edit"></edit>
  </div>
</template>

<script>
import edit from "@/views/admin/sys/menu/edit";

export default {
  components: {
    edit
  },
  errorCaptured(err, vm, info) {
    //拦截图标报错
    if (vm.type) {
      return false;
    }
  },
  data() {
    return {
      searchForm: {
        name: '',
        code: '',
        type: '1',
        size: 1000,
        current: 1,
        // orders: [{
        //   column: 'code',
        //   type: 'asc'
        // }, {
        //   column: 'code2',
        //   type: 'asc'
        // }]
      },
      refreshTable: true,
      editVisible: false,
      tableLoading: false,
      tableData: [],
      total: 0
    }
  },
  watch: {},
  
  created() {
    this.fetchData()
  },
  activated() {
    if (this.$refs.table) {
      this.$refs.table.doLayout()
    }
  },
  methods: {
    fetchData() {
      if (this.$refs.table) {
        this.$refs.table.doLayout()
      }
      this.refreshTable = false;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
      this.tableLoading = true;
      if (g.isEmpty(this.searchForm.search)) {
        this.$api.sysMenuChildren({
          data: {
            pid: ''
          },
          callback: data => {
            this.tableLoading = false;
            this.tableData = data;
          },
          failure: err => {
            this.tableLoading = false;
          }
        });
      } else {
        this.$api.sysMenuPage({
          data: {
            ...this.searchForm
          },
          callback: data => {
            this.tableLoading = false;
            this.tableData = data.records;
          },
          failure: err => {
            this.tableLoading = false;
          }
        });
      }
    },
    load(tree, treeNode, resolve) {
      this.$api.sysMenuChildren({
        data: {
          pid: tree.id
        },
        callback: data => {
          resolve(data);
        }
      });
    },
    edit(row) {
      this.editVisible = true;
      this.$nextTick(()=>{
        this.$refs.edit.init('edit', row.id);
      })
    },
    view(row) {
      this.editVisible = true;
      this.$nextTick(()=>{
        this.$refs.edit.init('view', row.id);
      })
    },
    add() {
      this.editVisible = true;
      this.$nextTick(()=>{
        this.$refs.edit.init('add');
      })
    },
    addChild(row) {
      this.editVisible = true;
      this.$nextTick(()=>{
        this.$refs.edit.init('child', row.id);
      })
    },
    remove(row) {
      this.$confirm2('确定要删除此菜单吗,请谨慎操作').then(() => {
        this.$api.sysMenuRemoveById({
          data: {
            id: row.id
          },
          callback: data => {
            this.$message.success('删除成功!');
            this.fetchData();
          }
        });
      }).catch(e => {
      });
    },
    changeState(val, row) {
      this.$confirm2('确定要' + (val === '1' ? '启用' : '禁用') + '此菜单吗？').then(() => {
        if (val === '1') {
          this.$api.sysMenuEnable({
            data: {
              id: row.id
            },
            callback: (d, msg) => {
              this.$message.success(msg);
            },
            failure: () => {
              row.state = '0';
            }
          })
        } else {
          this.$api.sysMenuDisable({
            data: {
              id: row.id
            },
            callback: (d, msg) => {
              this.$message.success(msg);
            },
            failure: () => {
              row.state = '1';
            }
          })
        }
      }).catch((err) => {
        row.state = val === '1' ? '0' : '1';
      });
    },
  }
}
</script>

<style scoped>
/* 修正上下级列对齐 */
::v-deep(.el-table__placeholder) {
  margin-right: 3px;
}

.el-table .el-button--small.el-button--text {
  padding: 0 8px;
}
</style>
