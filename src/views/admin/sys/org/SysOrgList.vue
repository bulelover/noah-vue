<template>
	<div class="page-wrapper">
		<div class="white-box full-height" v-show="!(editVisible)">
			<span class="page-title mb16">组织列表</span>
			<div class="search-flex mb16">
				<div class="search-group">
					<el-form label-position="top" :model="searchForm" @keyup.enter.native="refreshList"
					         @submit.native.prevent>
						<el-input v-model="searchForm.search" placeholder="模糊搜索（需后台实现）" style="width: 220px"></el-input>
						<el-button icon="el-icon-search" @click="refreshList"></el-button>
					</el-form>
				</div>
				<div>
					<el-button v-if="G.hasPerm('sys-org-add')" type="primary" @click="add">新增</el-button>
				</div>
			</div>
			<el-table ref="table" border :data="tableData" v-loading="tableLoading" row-key="id"
								:height="G.tableHeight">
				<el-table-column label="序号" width="50" type="index" align="center" show-overflow-tooltip
				                 :index="(searchForm.current-1)*searchForm.size+1"></el-table-column>
				<el-table-column prop="name" label="组织名称" min-width="120" show-overflow-tooltip>
					<template v-slot="{row}">
						<el-link type="primary" v-if="G.hasPerm('sys-org-view')"
										 :underline="false" @click="view(row)">{{ row.name }}
						</el-link>
						<template v-else>{{ row.name }}</template>
					</template>
				</el-table-column>
				<el-table-column prop="code" label="组织代码" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="type" label="组织类型" min-width="120" show-overflow-tooltip>
          <template v-slot="{row}">
            {{ G.getDictLabel('org_type', row.type) }}
          </template>
        </el-table-column>
				<el-table-column prop="state" label="状态" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createUserId" label="创建人用户ID" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="updateUserId" label="更新人用户ID" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createLoginName" label="创建人登录用户名" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createRealName" label="创建人真实姓名" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="updateTime" label="更新时间" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="updateLoginName" label="更新人登录用户名" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="updateRealName" label="更新人真实姓名" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="legalRepresentative" label="法定代表人" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="uscCode" label="社会信用代码" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="establishmentDate" label="成立日期" min-width="120" show-overflow-tooltip>
          <template v-slot="{row}">
            {{ row.establishmentDate? row.establishmentDate.substring(0, 10) : '' }}
          </template>
        </el-table-column>
				<el-table-column prop="areaCode" label="行政区划代码" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="areaName" label="行政区划名称" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="address" label="地址" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="phone" label="联系电话" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="phone2" label="备用联系电话" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mail" label="邮箱" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="industry" label="行业性质" min-width="120" show-overflow-tooltip>
          <template v-slot="{row}">
            {{ G.getDictLabel('industry', row.industry) }}
          </template>
        </el-table-column>
				<el-table-column prop="abbreviation" label="简称" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="logo" label="企业logo" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="parentId" label="父级主键" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="remarks" label="备注" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" :width="toolbarWidth" class-name="link-menu" fixed="right"
												 v-if="toolbarWidth > 0">
					<template v-slot="{row}">
						<el-link v-if="G.hasPerm('sys-org-edit')" :underline="false" type="primary" @click="edit(row)">修改
						</el-link>
						<el-link v-if="G.hasPerm('sys-org-delete')" :underline="false" type="danger" @click="del(row)">删除
						</el-link>
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
		<transition name="slide-fade">
			<div class="page-children" v-show="editVisible">
				<SysOrgForm v-if="editVisible" ref="edit" @refreshTable="fetchData"></SysOrgForm>
			</div>
		</transition>
  </div>
</template>
<script>
  import SysOrgForm from "./SysOrgForm";
	import SysOrgApi from './';
  export default {
    components: {
      SysOrgForm
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
				editVisible: false,
				tableData: [],
			}
		},
		computed: {
			toolbarWidth() {
				let perms = [
									[G.hasPerm('sys-org-edit'), 60],
									[G.hasPerm('sys-org-delete'), 60],
								], width = 0;
				perms.forEach(v => {
					if (v[0]) width += v[1];
				})
				return width;
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
				if (this.$refs.table) {
					this.$refs.table.doLayout();
				}
				this.searchForm.current = 1;
				this.fetchData();
			},
			fetchData() {
				this.tableLoading = true;
				SysOrgApi.page({
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
          this.$refs.edit.init('edit', {id: row.id});
				})
			},
			view(row) {
				this.editVisible = true;
				this.$nextTick(() => {
					this.$refs.edit.init('view', {id: row.id});
				})
			},
			del(row) {
				this.$confirm2('确定要删除这条数据吗？').then(() => {
          SysOrgApi.removeById({
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
		}

  }
</script>

<style scoped lang="scss">

</style>

