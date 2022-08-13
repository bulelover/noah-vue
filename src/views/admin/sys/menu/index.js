/**
* 菜单-API
*/
import http from "@/utils/http";
export default {
  getAllMenuList: (config) => { return http._get('/sys/menu/getAllMenuList', config) }, //查询所有菜单
  page: (config) => { return http._post('/sys/menu/page', config) }, //菜单分页列表查询
  children: (config) => { return http._get('/sys/menu/children', config) }, //查询下级菜单列表
  getById: (config) => { return http._get('/sys/menu/getById', config) }, //根据ID查询菜单
  add: (config) => { return http._post('/sys/menu/add', config) }, //新增菜单信息
  edit: (config) => { return http._post('/sys/menu/edit', config) }, //修改菜单信息
  enable: (config) => { return http._post('/sys/menu/enable', config) }, //启用菜单
  disable: (config) => { return http._post('/sys/menu/disable', config) }, //禁用菜单
  removeById: (config) => { return http._post('/sys/menu/removeById', config) }, //根据ID删除角色
}