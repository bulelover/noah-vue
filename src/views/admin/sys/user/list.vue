<template>
  <div class="page-wrapper">
    <div class="white-box full-height">
      <span class="page-title mb16">用户列表</span>
      <div class="search-flex mb16">
        <div class="search-group">
          <el-form label-position="top" :model="searchForm" @keyup.enter.native="refreshList" @submit.native.prevent>
            <el-input v-model="searchForm.search" placeholder="用户名/姓名" style="width: 220px"></el-input>
            <el-select v-model="searchForm.state" @change="refreshList" style="width: 120px">
              <el-option label="状态：全部" value=""></el-option>
              <el-option label="状态：启用" value="1"></el-option>
              <el-option label="状态：禁用" value="0"></el-option>
            </el-select>
            <el-button icon="el-icon-search" @click="refreshList"></el-button>
          </el-form>
        </div>
        <div>
          <el-button v-if="$perms.has('sys-user-add')" type="primary" @click="add">新增</el-button>
        </div>
        <!--      <el-checkbox v-model="multiple" label="多选" style="margin-left: 10px"></el-checkbox>-->
      </div>
      <el-table ref="table" border :data="tableData" v-loading="tableLoading" row-key="id" :height="g.tableHeight" >
        <!-- :row-class-name="g.rowClass"       -->
        <!--        <el-table-column width="50" align="center">
                  <template slot="header" v-if="multiple">
                    <el-checkbox v-model="multipleCbx" :indeterminate="isIndeterminate"></el-checkbox>
                  </template>
                  <template v-slot="{row}">
                    <span class="el-checkbox__input is-checked row-checked">
                      <span class="el-checkbox__inner"></span>
                    </span>
                    <span class="el-checkbox__input row-unchecked">
                      <span class="el-checkbox__inner"></span>
                    </span>
                  </template>
                </el-table-column>-->
        <el-table-column label="序号" width="50" type="index" align="center" show-overflow-tooltip
                         :index="(searchForm.current-1)*searchForm.size+1"></el-table-column>
        <el-table-column prop="realName" label="真实姓名" min-width="120">
          <template v-slot="{row}">
            <el-link type="primary" v-if="$perms.has('sys-user-view')"
                  :underline="false" @click="view(row)">{{ row.realName }}</el-link>
            <template v-else>{{ row.realName }}</template>
          </template>
        </el-table-column>
        <el-table-column prop="loginName" label="登录名" min-width="120"></el-table-column>
        <el-table-column prop="sex" label="性别" min-width="70">
          <template v-slot="{row}">
            <i :class="['mr6',row.sex === '1'?'el-icon-male primary':'el-icon-female danger']"></i
            >{{ $dict.name('sys-gender', row.sex) }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" min-width="120"></el-table-column>
        <el-table-column label="状态" min-width="120">
          <template v-slot="{row}">
            <template v-if="$perms.has('sys-user-state')">
              <span class="pointer primary-hover" @click.stop="changeState(row)"
                    :title="row.state === '1'?'点击停用':'点击启用'">
                <i :class="['mr6', row.loading?'el-icon-loading':(row.state === '1'?'el-icon-success success':'el-icon-remove danger')]"></i
                >{{ row.state === '1' ? '正常' : '停用' }}
              </span>
            </template>
            <template v-else>
              <i :class="['mr6', row.state === '1'?'el-icon-success success':'el-icon-remove danger']"></i
              >{{ row.state === '1' ? '正常' : '停用' }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="position" label="岗位" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mail" label="电子邮箱" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mail" label="操作" :width="toolbarWidth" class-name="link-menu" fixed="right"
          v-if="toolbarWidth > 0">
          <template v-slot="{row}">
            <el-link v-if="$perms.has('sys-user-edit')" :underline="false" type="primary" @click="edit(row)">修改</el-link>
            <el-link v-if="$perms.has('sys-user-role')" :underline="false" type="primary" @click="assignRoles(row)">
              分配角色
            </el-link>
            <el-link v-if="$perms.has('sys-user-delete')" :underline="false" type="danger" @click="del(row)">删除</el-link>
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
    <assign-roles v-if="assignRolesVisible" ref="assignRoles"></assign-roles>
  </div>
</template>

<script>
import SysUserApi from './'
import edit from './edit'
import AssignRoles from './AssignRoles'
export default {
  components: {
    edit, AssignRoles
  },
  data() {
    return {
      searchForm: {
        loginName: '',
        realName: '',
        search: '',
        // url: '',
        type: '1',
        state: '',
        // parentName: '',
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
      editVisible: false,
      assignRolesVisible: false,
      selectRow: null,
      tableData: [],
    }
  },
  computed:{
    toolbarWidth(){
      let perms = [
          [this.$perms.has('sys-user-edit'), 60],
          [this.$perms.has('sys-user-role'), 90],
          [this.$perms.has('sys-user-delete'), 60],
        ],
        width = 0;
      perms.forEach(v => {
        if(v[0]) width += v[1];
      })
      return width;
    }
  },
  watch: {
    //切换多选/单选
    multiple() {
      this.selectRow = null;
      this.isIndeterminate = false;
      this.$table.watchMultipleCbx(g.rowClass, false, this);
    },
    multipleCbx(val) {
      this.$table.watchMultipleCbx(g.rowClass, val, this);
      // this.$table.watchMultipleCbx(g.rowClass, val, this, options);
      // options=>{  // 用于设置不同的变量替代，已下是默认值，建议直接使用默认值
      //   multiple: 'multiple',  //多选
      //   multipleCbx: 'multipleCbx', //全选
      //   isIndeterminate: 'isIndeterminate', //是否只是选中了部分
      //   selectRow: 'selectRow', //选择的行
      //   tableData: 'tableData', //表格数据
      //   tableRef: 'tableRef',  //表格ref
      // }
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
    rowClick(row, column, e) {
      this.$table.rowClick(e, row, this);
      // this.$table.rowClick(e,row,this,options);   //options同上
    },
    refreshList() {
      if (this.$refs.table) {
        this.$refs.table.doLayout()
      }
      this.searchForm.current = 1;
      this.fetchData();
    },
    fetchData() {
      this.selectRow = null;
      this.tableLoading = true;
      this.tableData = [];
      SysUserApi.page({
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
      this.editVisible = true;
      this.$nextTick(() => {
        this.$refs.edit.init('add');
      })
    },
    edit(row) {
      this.editVisible = true;
      this.$nextTick(() => {
        this.$refs.edit.init('edit', row.id);
      })
    },
    view(row) {
      this.editVisible = true;
      this.$nextTick(() => {
        this.$refs.edit.init('view', row.id);
      })
    },
    assignRoles(row) {
      this.assignRolesVisible = true;
      this.$nextTick(() => {
        this.$refs.assignRoles.init(row);
      })
    },
    del(row) {
      this.$confirm2('确定要删除该用户吗？').then(() => {
        SysUserApi.removeById({
          data: {
            id: row.id
          },
          callback: (d, msg) => {
            this.$message.success(msg);
            this.fetchData()
          },
        })
      }).catch(_ => _)
    },
    changeState(row) {
      this.$confirm2('确定要' + (row.state === '0' ? '启用' : '停用') + '该用户吗？').then(() => {
        this.$set(row, 'loading', true);
        if (row.state === '0') {
          SysUserApi.enable({
            data: {
              id: row.id
            },
            callback: (d, msg) => {
              row.state = '1';
              this.$message.success(msg);
            },
            complete: () => {
              this.$set(row, 'loading', false);
            }
          })
        } else {
          SysUserApi.disable({
            data: {
              id: row.id
            },
            callback: (d, msg) => {
              row.state = '0';
              this.$message.success(msg);
            },
            complete: () => {
              this.$set(row, 'loading', false);
            }
          })
        }
      }).catch(_ => _);
    },
  }
}
</script>

<style scoped lang="scss">

</style>
