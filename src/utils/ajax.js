import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import {merge} from 'lodash'
// import { clearLoginInfo } from '@/utils'
import qs from 'qs'
import {
  Message,
  MessageBox
} from 'element-ui'

// 超时时间
axios.defaults.timeout = 100000
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
//request-body方式 这里不需要
// axios.defaults.headers = {'Content-Type': 'application/json; charset=utf-8'}
/*
* 2020-10-22
* 去除默认固定配置的请求头
* 使用axios默认请求头
*/
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8'
// 非生产环境 && 开启代理, 接口前缀统一使用[/api]前缀做代理拦截!
const BASE_URL = process.env.NODE_ENV !== 'production' ? '/api' : G.serverUrl
// 这只基础请求路径
axios.BASE_URL = BASE_URL
Vue.prototype.$uploadUrl = BASE_URL+'/file/upload'
const loginKey = '' + process.env.VUE_LOGIN_KEY;

/**
 * 请求拦截
 */
let loginChangeError = '检测到当前窗口登录信息已发生变更';
let notLoginMsg = '未登录或登录已过期';
axios.interceptors.request.use(config => {
  let last = localStorage.getItem(loginKey);
  if (G.loginId != null) {
    let current = G.loginId;
    if (current && current !== last) {
      MessageBox.confirm('检测到当前窗口登录信息已发生变更， 点击确定将刷新窗口，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        router.replace({name: 'home'}).catch((e) => {
          console.log(e)
        });
        location.reload();
      }).catch(() => {

      });
      return Promise.reject(loginChangeError);
    }
  }

  // 请求头带上token null判定 否则IE报错
  if(G.tokenName){
    config.headers[G.tokenName] = localStorage.getItem(G.tokenName);
  }
  if (localStorage.getItem(G.tokenName) !== G.token) {
    //同时设置全局变量的token
    G.token = localStorage.getItem(G.tokenName);
  }

  // 请求地址处理
  if (window.ActiveXObject || 'ActiveXObject' in window) {
    config.url = config.url + (config.url.indexOf('?') > 0 ? '&' : '?') + '_tt=' + new Date().getTime()
  }
  if(!config.url.startsWith(BASE_URL)){
    // 请求地址处理
    config.url = BASE_URL + config.url
  }
  const type = config.method
  const defaults = {}
  const arrayFormat = config.headers.arrayFormat || 'indices'

  if (type === 'post' || type === 'put' && config.headers['Content-Type'] === 'application/x-www-form-urlencoded; charset=utf-8') {
    // post请求参数处理 FormData不进行转换（上传文件）
    config.data = config.data instanceof FormData ? config.data : qs.stringify(config.data, {allowDots: true, arrayFormat: arrayFormat})
  } else if (type === 'get') {
    // get请求参数处理
    config.params = qs.stringify(config.params, {allowDots: true, arrayFormat: arrayFormat})
    config.params = qs.parse(config.params)
    config.params = merge(defaults, config.params)
  }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
axios.interceptors.response.use(response => {
  //未登录，登录已过期
  if (notLoginMsg === response.data.msg) {
    return response
  }
  return response
}, error => {
  if (error === loginChangeError) {
    return Promise.reject(error)
  }
  Message({
    message: error.response.data.msg || error.response.data.exception || error.response.data || error.response || error,
    type: 'error',
    showClose: true,
    duration: 5000,
    customClass: 'zZindex'
  })
  console.log(error)
  return Promise.reject(error)
})

let complete = function (config){
  if (config && config.complete && typeof config.complete === 'function') {
    config.complete();
  }
}

let executeAxiosByType = (type, url, config) => {
  if(!config) {
    config = {};
  }
  config.method = type;
  config.url = url;
  axios(config).then(({data}) => {
    if (data && data.success) {
      if (config && config.callback && typeof config.callback === 'function') {
        config.callback(data.data, data.msg);
      }
      complete(config);
    } else {
      let r = true;
      if (config && config.failure && typeof config.failure === 'function') {
        r = config.failure(data.msg);
        r = r === undefined? true: r;
      }
      complete(config);
      //未登录，登录已过期
      if (notLoginMsg === data.msg && r) {
        Message({
          message: "请先登录！",
          type: 'error',
          showClose: true,
          dangerouslyUseHTMLString: true,
          duration: 3000,
          customClass: 'zZindex'
        })
        router.replace({name: 'login'}).catch((e) => {
          console.log(e)
        });
        return;
      }
      if(r){
        Message({
          message: data.msg,
          type: 'error',
          showClose: true,
          dangerouslyUseHTMLString: true,
          duration: 3000,
          customClass: 'zZindex'
        })
      }
    }
  }).catch(err => {
    console.error(err)
    if (config && config.failure && typeof config.failure === 'function') {
      config.failure(err);
    }
    complete(config);
  });
}

//让get支持data传参
axios['_get'] = (url, config) => {
  if(config.data){
    config.params = merge({}, config.params, G.copyVal(config.data))
    config.data = null;
  }
  executeAxiosByType('get', url, config);
}

axios['_post'] = (url, config) => {
  executeAxiosByType('post', url, config);
}

axios['_put'] = (url, config) => {
  executeAxiosByType('put', url, config);
}

axios['_delete'] = (url, config) => {
  if(config.data){
    config.params = merge({}, config.params, G.copyVal(config.data))
    config.data = null;
  }
  executeAxiosByType('delete', url, config);
}

export default axios
