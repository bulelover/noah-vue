<template>
  <div class="page-wrapper flex">
    <div class="white-box full-height" style="flex:0 0 406px;">
      <div class="search-flex mb16">
        <div class="search-group">
          <el-form label-position="top" :model="searchForm" @keyup.enter.native="fetchData" @submit.native.prevent>
            <el-input v-model="searchForm.search" placeholder="编码/名称" style="width: 234px"></el-input>
            <el-button icon="el-icon-search" @click="fetchData"></el-button>
          </el-form>
        </div>
        <div>
          <el-button v-if="$perms.has('sys-role-add')" type="primary" @click="add">新增</el-button>
        </div>
        <!--      <el-checkbox v-model="multiple" label="多选" style="margin-left: 10px"></el-checkbox>-->
      </div>
      <ul class="infinite-list">
        <li v-for="(item,index) in tableData"
            :class="{'infinite-list-item':true, selected: selectedDict.code === item.code}"
            @click="clickDict(item)">{{ index + 1 }}. {{ item.name }} [{{ item.code }}]
          <span class="link-menu menu-right" v-if="$perms.has('sys-dict-edit') || $perms.has('sys-dict-delete')">
            <el-link v-if="$perms.has('sys-dict-edit')" :underline="false" @click.stop="edit(item)" type="primary">修改
            </el-link>
            <el-link v-if="$perms.has('sys-dict-delete')" :underline="false" @click.stop="remove(item)" type="danger">删除
            </el-link>
          </span>
        </li>
      </ul>
    </div>
    <div class="white-box flex1 ml16"  v-loading="itemTableLoading" >
      <div class="search-flex mb16">
        <div class="search-group">
          <div class="page-title mb16">字典项列表</div>
        </div>
        <div>
          <el-button @click="fetchItemData" icon="el-icon-refresh"></el-button>
          <el-button v-if="$perms.has('sys-dict-item-add')" type="primary" @click="addItem">新增</el-button>
        </div>
        <!--      <el-checkbox v-model="multiple" label="多选" style="margin-left: 10px"></el-checkbox>-->
      </div>
      <el-table class="mt16" :data="itemTableData" row-key="id" :height="g.tableHeightNoPageSearch">
        <el-table-column label="序号" width="50" type="index" align="center" show-overflow-tooltip
                         :index="(itemSearchForm.current-1)*itemSearchForm.size+1"></el-table-column>
        <el-table-column prop="code" label="项目编码" min-width="120"></el-table-column>
        <el-table-column prop="name" label="项目名称" min-width="160"></el-table-column>
        <el-table-column prop="remark" label="项目描述" min-width="160"></el-table-column>
        <el-table-column prop="orderBy" label="项目排序" min-width="80"></el-table-column>
        <el-table-column label="操作" min-width="140" class-name="link-menu"
                         v-if="$perms.has('sys-dict-item-edit') || $perms.has('sys-dict-item-delete')">
          <template v-slot="{row}">
            <el-link v-if="$perms.has('sys-dict-item-edit')" :underline="false" @click="editItem(row)" type="primary">修改</el-link>
            <el-link v-if="$perms.has('sys-dict-item-delete')" :underline="false" @click="removeItem(row)" type="danger">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit v-if="this.dialogVisible.edit" ref="edit" @refreshTable="fetchData"></edit>
    <edit-item v-if="this.dialogVisible.editItem" ref="editItem" @refreshTable="fetchItemData"></edit-item>
  </div>
</template>

<script>
import edit from "@/views/admin/sys/dict/edit";
import editItem from "@/views/admin/sys/dict/editItem";
import SysDictApi from './'
export default {
  components: {
    edit, editItem
  },
  data() {
    return {
      dialogVisible: {
        edit: false,
        editItem: false,
      },
      searchForm: {
        name: '',
        code: '',
        size: 500,
        current: 1
      },
      refreshTable: true,
      tableLoading: false,
      tableData: [],
      total: 0,
      itemSearchForm: {
        name: '',
        code: '',
        size: 500,
        current: 1
      },
      itemRefreshTable: true,
      itemTableLoading: false,
      itemTableData: [],
      itemTotal: 0,
      selectedDict: {
        id: '',
        code: '',
        name: '',
        nextOrderBy: 1,
      },
    }
  },
  watch: {},
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.tableData = [];
      this.total = 0;
      this.searchForm.current = 1;
      this.load();
    },
    load() {
      this.tableLoading = true;
      this.itemTableLoading = true;
      SysDictApi.page({
        data: this.searchForm,
        callback: data => {
          this.total = data.total;
          if (this.total === 0) {
            this.itemTableData = [];
            this.selectedDict.code = '';
            return;
          }
          this.tableData = data.records;
          this.clickDict(data.records[0]);
        },
        complete: () => {
          this.itemTableLoading = false;
          this.tableLoading = false;
        }
      });
    },
    fetchItemData() {
      this.itemTableData = [];
      this.itemTableLoading = true;
      SysDictApi.pageItem({
        data: {
          orders: [{
            column: 'orderBy'
          }],
          dictId: this.selectedDict.id,
          ...this.itemSearchForm
        },
        callback: data => {
          this.itemTableData = data.records;
          // this.itemTotal = data.total;
          this.selectedDict.nextOrderBy = this.itemTableData[data.total - 1].orderBy + 10;
        },
        complete: () => {
          this.itemTableLoading = false;
        }
      });
    },
    clickDict(item) {
      if (this.selectedDict.code !== item.code) {
        this.selectedDict = item;
        this.fetchItemData()
      }
    },
    add() {
      this.dialogVisible.edit = true;
      this.$nextTick(()=>{
        this.$refs.edit.init('add');
      })
    },
    edit(row) {
      this.dialogVisible.edit = true;
      this.$nextTick(()=>{
        this.$refs.edit.init('edit', row.id);
      })
    },
    remove(row) {
      this.$confirm2('确定要删除吗?').then(() => {
        SysDictApi.removeById({
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
    addItem() {
      if (this.selectedDict.id === '') {
        this.$message.warning("请先选择字典");
        return;
      }
      this.dialogVisible.editItem = true;
      this.$nextTick(()=>{
        this.$refs.editItem.init('add', this.selectedDict);
      })
    },
    editItem(row) {
      this.dialogVisible.editItem = true;
      this.$nextTick(()=>{
        this.$refs.editItem.init('edit', this.selectedDict, row.id);
      })
    },
    removeItem(row) {
      this.$confirm2('确定要删除吗?').then(() => {
        SysDictApi.removeByItemId({
          data: {
            id: row.id
          },
          callback: data => {
            this.$message.success('删除成功!');
            this.fetchItemData();
          }
        });
      }).catch(e => {
      });
    }
  }
}
</script>

<style scoped lang="scss">
.infinite-list {
  margin: 0;
  padding: 0;
  overflow: auto;
  height: calc(100% - 52px);
  
  .menu-right{
    position: absolute;
    right: 0;
  }
  
  .infinite-list-item {
    position: relative;
    display: block;
    padding: 8px 12px;
    cursor: pointer;
  }
  
  .infinite-list-item:hover {
    background-color: #f1f7ff;
  }
  
  .infinite-list-item.selected {
    background-color: #f1f7ff;
    color: #409EFF;
  }
}
</style>
