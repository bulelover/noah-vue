/**
* 角色-API
*/
import http from "@/utils/http";
export default {
  getById: (config) => { return http._get('/sys/role/getById', config) }, //根据ID查询角色
  getMenusByRoleId: (config) => { return http._get('/sys/role/getMenusByRoleId', config) }, //根据ID查询角色
  page: (config) => { return http._post('/sys/role/page', config) }, //角色分页列表查询
  add: (config) => { return http._post('/sys/role/add', config) }, //新增角色信息
  edit: (config) => { return http._post('/sys/role/edit', config) }, //修改角色信息
  saveRoleMenu: (config) => { return http._post('/sys/role/saveRoleMenu', config) }, //保存角色授权信息
  removeById: (config) => { return http._post('/sys/role/removeById', config) }, //根据ID删除角色
}