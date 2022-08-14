<template>
	<div class="page-wrapper">
		<div class="white-box full-height">
			<span class="page-title mb16">区划列表</span>
			<el-table ref="table" border :data="tableData" v-loading="tableLoading" lazy row-key="id"
                :load="load" :height="G.tableHeightOnlyList">
				<el-table-column label="序号" width="50" type="index" align="center" show-overflow-tooltip
				                 :index="(searchForm.current-1)*searchForm.size+1"></el-table-column>
				<el-table-column prop="name" label="区域名称" min-width="280">
					<template v-slot="{row}">
						<el-link type="primary" v-if="G.hasPerm('sys-area-view')"
										 :underline="false" @click="view(row)">{{ row.name }}
						</el-link>
						<template v-else>{{ row.name }}</template>
            <i v-if="treeMaps.get(row.id)" class="el-icon-refresh" style="cursor: pointer;margin-left: 10px;"
               @click="refreshLoadTree(row.id)"></i>
					</template>
				</el-table-column>
				<el-table-column prop="code" label="区域编号" min-width="100" show-overflow-tooltip></el-table-column>
				<el-table-column prop="areaLevel" label="区域等级" min-width="80" show-overflow-tooltip>
          <template v-slot="{row}">
            {{ G.getDictLabel('area-level', row.areaLevel) }}
          </template>
        </el-table-column>
				<el-table-column prop="areaName" label="地区名称（全）" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="200" class-name="link-menu" fixed="right"
          v-if="G.hasPerm('sys-area-edit') || G.hasPerm('sys-area-delete')">
					<template v-slot="{row}">
						<el-link v-if="G.hasPerm('sys-area-edit')" @click="edit(row)" :underline="false" type="primary">修改</el-link>
            <el-link v-if="G.hasPerm('sys-menu-add')" @click="addChild(row)" type="primary" :underline="false">添加下级</el-link>
						<el-link v-if="G.hasPerm('sys-area-delete')" @click="del(row)" :underline="false" type="danger">删除</el-link>
					</template>
				</el-table-column>
			</el-table>
		</div>
    <SysAreaForm v-if="editVisible" ref="edit" @refreshTable="refreshLoadTree"></SysAreaForm>
  </div>
</template>
<script>
  import SysAreaForm from "./SysAreaForm";
	import SysAreaApi from './';
  export default {
    components: {
      SysAreaForm
    },
		data() {
			return {
				searchForm: {
					search: '',
					size: 100,
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
        treeMaps: new Map(),
				total: 0,
				editVisible: false,
				tableData: [],
			}
		},
		created() {
			this.refreshList();
		},
		activated() {
			if (this.$refs.table) {
				this.$refs.table.doLayout();
			}
		},
		methods: {
			refreshList() {
				this.fetchData();
			},
			fetchData() {
        this.tableLoading = true;
        //重置树变量存储
        this.treeMaps = new Map();
        SysAreaApi.children({
          data: {
            pid: ''
          },
          callback: data => {
            this.tableData = data;
          },
          complete: () => {
            this.tableLoading = false;
          }
        });
			},
      load(tree, treeNode, resolve) {
        SysAreaApi.children({
          data: {
            pid: tree.id
          },
          callback: data => {
            this.treeMaps.set(tree.id, { tree, treeNode, resolve });
            resolve(data);
            if (this.$refs.table) {
              this.$refs.table.doLayout();
            }
          }
        });
      },
      refreshLoadTree(pId) {
        if(pId === ''){
          this.fetchData();
          return;
        }
        if(!this.treeMaps.get(pId)){
          return;
        }
        // 根据更改节点的父ID取出相应数据
        const { tree, treeNode, resolve } = this.treeMaps.get(pId);
        this.$set(this.$refs.table.store.states.lazyTreeNodeMap, pId, []);
        if (tree) {
          //设置表格内部loading状态
          this.$refs.table.store.states.treeData[tree.id].loading = true;
          this.$refs.table.store.states.treeData[tree.id].expanded = false;
          this.$refs.table.store.states.treeData[tree.id].loaded = false;
          // 将取出对应数据再传给load方法
          this.load(tree, treeNode, resolve);
        }
      },
			add() {
				this.editVisible = true;
				this.$nextTick(() => {
          this.$refs.edit.init('add');
				})
			},
      addChild(row) {
        this.editVisible = true;
        this.$nextTick(()=>{
          this.$refs.edit.init('child', row);
        })
      },
			edit(row) {
				this.editVisible = true;
				this.$nextTick(() => {
          this.$refs.edit.init('edit', row);
				})
			},
			view(row) {
				this.editVisible = true;
				this.$nextTick(() => {
					this.$refs.edit.init('view', row);
				})
			},
			del(row) {
				this.$confirm2('确定要删除这条数据吗？').then(() => {
          SysAreaApi.removeById({
            data: {
              id: row.id
            },
            callback: (d, msg) => {
              this.$message.success(msg);
              this.refreshLoadTree(row.parentId);
            },
          })
				}).catch(_ => _)
			},
		}

  }
</script>

<style scoped lang="scss">

</style>

