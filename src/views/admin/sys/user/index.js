/**
* 用户-API
*/
import ajax from "@/utils/ajax";
export default {
  getById: (config) => { return ajax._get('/sys/user/getById', config) }, //根据ID查询用户
  children: (config) => { return ajax._get('/sys/user/children', config) }, //根据PID查询下级区划
  page: (config) => { return ajax._post('/sys/user/page', config) }, //查询用户分页信息
  add: (config) => { return ajax._post('/sys/user/save', config) }, //新增用户信息
  edit: (config) => { return ajax._put('/sys/user/save', config) }, //修改用户信息
  removeById: (config) => { return ajax._delete('/sys/user/removeById', config) }, //删除用户
  enable: (config) => { return ajax._put('/sys/user/enable', config) }, //解锁用户
  disable: (config) => { return ajax._put('/sys/user/disable', config) }, //锁定用户
  savePersonalInfo: (config) => { return ajax._put('/sys/user/savePersonal', config) }, //保存个人信息
  saveHeadImg: (config) => { return ajax._put('/sys/user/saveImg', config) }, //保存个人信息
  getUserRoles: (config) => { return ajax._get('/sys/user/getUserRoles', config) }, //查询所有角色 并标识用户所拥有的角色
  saveUserRole: (config) => { return ajax._post('/sys/user/saveUserRole', config) }, //分配角色
}