/**
 * 流程模型-API
 */
import http from "@/utils/http";
export default {
  getById: (config) => { return http._get('/flowable/model/getById', config) }, //根据ID查询流程模型
  page: (config) => { return http._post('/flowable/model/page', config) }, //查询流程模型分页信息
  save: (config) => { return http._post('/flowable/model/save', config) }, //修改流程模型信息
  removeById: (config) => { return http._post('/flowable/model/removeById', config) }, //删除
  deploy: (config) => { return http._post('/flowable/model/deploy', config) }, //发布

}