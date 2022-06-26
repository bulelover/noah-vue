/**
* 角色-API
*/
import ajax from "@/utils/ajax";
export default {
  getById: (config) => { return ajax._get('/sys/role/getById', config) }, //根据ID查询角色
  getMenusByRoleId: (config) => { return ajax._get('/sys/role/getMenusByRoleId', config) }, //根据ID查询角色
  page: (config) => { return ajax._post('/sys/role/page', config) }, //角色分页列表查询
  add: (config) => { return ajax._post('/sys/role/save', config) }, //新增角色信息
  edit: (config) => { return ajax._put('/sys/role/save', config) }, //修改角色信息
  saveRoleMenu: (config) => { return ajax._post('/sys/role/saveRoleMenu', config) }, //保存角色授权信息
  removeById: (config) => { return ajax._delete('/sys/role/removeById', config) }, //根据ID删除角色
}