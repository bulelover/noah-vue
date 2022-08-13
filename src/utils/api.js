/**
 * 公共API接口，其他业务接口请勿写在这里。
 * 这里写是方便基础框架的接口调用。
 */
import http from "@/utils/http";
const BASE_URL = process.env.NODE_ENV !== 'production' ? '/api' : G.serverUrl
const api = {
    upload:(config) => {
        // config["transformRequest"]= [
        //     function (data, config) {
        //         return data;
        //     }
        // ];
        config["headers"] = {"Content-Type": "multipart/form-data; charset=UTF-8"};
        return http._post('/file/upload',  config);
    },
    preview:(id) => {return BASE_URL + '/file/preview/'+id},
    download:(id) => {return '/file/download/'+id},
    login: (config) => { return http._post('/login', config) }, //登录
    logout: (config) => { return http._post('/logout', config) }, //注销
    getLoginUserInfo: (config) => { return http._get('/sys/user/info', config) }, //获取登录信息
    getTokenInfo: (config) => { return http._get('/getTokenInfo', config) }, //获取登录Token信息
    getLoginData: (config) => { return http._get('/sys/menu/getLoginData', config) }, //查询登录用户所有权限

}

export default api;
