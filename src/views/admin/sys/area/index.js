/**
* 区划-API
*/
import ajax from "@/utils/ajax";
export default {
  getById: (config) => { return ajax._get('/sys/area/getById', config) }, //根据ID查询区划
  children: (config) => { return ajax._get('/sys/area/children', config) }, //根据PID查询下级区划
  page: (config) => { return ajax._post('/sys/area/page', config) }, //区划分页列表查询
  add: (config) => { return ajax._post('/sys/area/save', config) }, //新增区划信息
  edit: (config) => { return ajax._put('/sys/area/save', config) }, //修改区划信息
  removeById: (config) => { return ajax._delete('/sys/area/removeById', config) }, //删除区划
}