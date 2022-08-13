/**
* 日志-API
*/
import http from "@/utils/http";
export default {
  page: (config) => { return http._post('/sys/log/page', config) }, //日志分页列表查询
  myPage: (config) => { return http._post('/sys/log/myPage', config) }, //我的日志分页列表查询
  requestPage: (config) => { return http._post('/sys/log/requestPage', config) }, //访问日志分页列表查询
}