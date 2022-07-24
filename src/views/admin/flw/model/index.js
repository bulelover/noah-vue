/**
* 流程模型-API
*/
import ajax from "@/utils/ajax";
export default {
  getById: (config) => { return ajax._get('/flowable/model/getById', config) }, //根据ID查询流程模型
  page: (config) => { return ajax._post('/flowable/model/page', config) }, //查询流程模型分页信息
  save: (config) => { return ajax._post('/flowable/model/save', config) }, //修改流程模型信息
  
}