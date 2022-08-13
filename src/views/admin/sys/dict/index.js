/**
* 字典-API
*/
import http from "@/utils/http";
export default {
  getById: (config) => { return http._get('/sys/dict/getById', config) }, //根据ID查询字典
  page: (config) => { return http._post('/sys/dict/page', config) }, //字典分页列表查询
  add: (config) => { return http._post('/sys/dict/add', config) }, //新增字典信息
  edit: (config) => { return http._post('/sys/dict/edit', config) }, //修改字典信息
  removeById: (config) => { return http._post('/sys/dict/removeById', config) }, //根据ID删除字典
  getItemById: (config) => { return http._get('/sys/dict/getItemById', config) }, //根据ID查询字典项
  pageItem: (config) => { return http._post('/sys/dict/dictItemPage', config) }, //根据字典ID查询字典项列表
  addItem: (config) => { return http._post('/sys/dict/addItem', config) }, //新增字典项信息
  editItem: (config) => { return http._post('/sys/dict/editItem', config) }, //修改字典项信息
  removeByItemId: (config) => { return http._post('/sys/dict/removeByItemId', config) }, //根据ID删除字典项
}