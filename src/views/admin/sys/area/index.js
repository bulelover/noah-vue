/**
* 区划-API
*/
import http from "@/utils/http";
export default {
  getById: (config) => { return http._get('/sys/area/getById', config) }, //根据ID查询区划
  children: (config) => { return http._get('/sys/area/children', config) }, //根据PID查询下级区划
  page: (config) => { return http._post('/sys/area/page', config) }, //区划分页列表查询
  add: (config) => { return http._post('/sys/area/add', config) }, //新增区划信息
  edit: (config) => { return http._post('/sys/area/edit', config) }, //修改区划信息
  removeById: (config) => { return http._post('/sys/area/removeById', config) }, //删除区划
}