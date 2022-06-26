/**
* 菜单-API
*/
import ajax from "@/utils/ajax";
export default {
  getAllMenuList: (config) => { return ajax._get('/sys/menu/getAllMenuList', config) }, //查询所有菜单
  page: (config) => { return ajax._post('/sys/menu/page', config) }, //菜单分页列表查询
  children: (config) => { return ajax._get('/sys/menu/children', config) }, //查询下级菜单列表
  getById: (config) => { return ajax._get('/sys/menu/getById', config) }, //根据ID查询菜单
  add: (config) => { return ajax._post('/sys/menu/save', config) }, //新增菜单信息
  edit: (config) => { return ajax._put('/sys/menu/save', config) }, //修改菜单信息
  enable: (config) => { return ajax._put('/sys/menu/enable', config) }, //启用菜单
  disable: (config) => { return ajax._put('/sys/menu/disable', config) }, //禁用菜单
  removeById: (config) => { return ajax._delete('/sys/menu/removeById', config) }, //根据ID删除角色
}