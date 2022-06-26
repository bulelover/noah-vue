/**
* 字典-API
*/
import ajax from "@/utils/ajax";
export default {
  getById: (config) => { return ajax._get('/sys/dict/getById', config) }, //根据ID查询字典
  page: (config) => { return ajax._post('/sys/dict/page', config) }, //字典分页列表查询
  add: (config) => { return ajax._post('/sys/dict/save', config) }, //新增字典信息
  edit: (config) => { return ajax._put('/sys/dict/save', config) }, //修改字典信息
  removeById: (config) => { return ajax._delete('/sys/dict/removeById', config) }, //根据ID删除字典
  getItemById: (config) => { return ajax._get('/sys/dict/getItemById', config) }, //根据ID查询字典项
  pageItem: (config) => { return ajax._post('/sys/dict/dictItemPage', config) }, //根据字典ID查询字典项列表
  addItem: (config) => { return ajax._post('/sys/dict/saveItem', config) }, //新增字典项信息
  editItem: (config) => { return ajax._put('/sys/dict/saveItem', config) }, //修改字典项信息
  removeByItemId: (config) => { return ajax._delete('/sys/dict/removeByItemId', config) }, //根据ID删除字典项
}