/**
* 组织-API
*/
import http from "@/utils/http";
export default {
  getById: (config) => { return http._get('/sys/org/getById', config) }, //根据ID查询组织
  page: (config) => { return http._post('/sys/org/page', config) }, //组织分页列表查询
  add: (config) => { return http._post('/sys/org/add', config) }, //新增组织信息
  edit: (config) => { return http._post('/sys/org/edit', config) }, //修改组织信息
  removeById: (config) => { return http._post('/sys/org/removeById', config) }, //删除组织
}