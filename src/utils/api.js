/**
 * 公共API接口，其他业务接口请勿写在这里。
 * 这里写是方便基础框架的接口调用。
 */
import ajax from "@/utils/ajax";
const BASE_URL = process.env.NODE_ENV !== 'production' ? '/api' : g.serverUrl
const api = {
    upload:(config) => {
        // config["transformRequest"]= [
        //     function (data, config) {
        //         return data;
        //     }
        // ];
        config["headers"] = {"Content-Type": "multipart/form-data; charset=UTF-8"};
        return ajax._post('/file/upload',  config);
    },
    preview:(id) => {return BASE_URL + '/file/preview/'+id},
    download:(id) => {return '/file/download/'+id},
    login: (config) => { return ajax._post('/login', config) }, //登录
    logout: (config) => { return ajax._post('/logout', config) }, //注销
    getLoginUserInfo: (config) => { return ajax._get('/sys/user/info', config) }, //获取登录信息
    getLoginData: (config) => { return ajax._get('/sys/menu/getLoginData', config) }, //查询登录用户所有权限

}

export default api;
