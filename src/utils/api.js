/**
 * 这里写是方便基础框架的接口调用。
 * 业务功能可直接使用 $ajax._get/_post 等。
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
    sysUserInfo: (config) => { return ajax._get('/sys/user/info', config) }, //获取登录信息
    savePersonalInfo: (config) => { return ajax._put('/sys/user/savePersonal', config) }, //保存个人信息
    saveHeadImg: (config) => { return ajax._put('/sys/user/saveImg', config) }, //保存个人信息
    sysUserGetById: (config) => { return ajax._get('/sys/user/getById', config) }, //根据ID查询用户
    sysUserGetUserRoles: (config) => { return ajax._get('/sys/user/getUserRoles', config) }, //查询所有角色 并标识用户所拥有的角色
    sysUserSaveUserRole: (config) => { return ajax._post('/sys/user/saveUserRole', config) }, //分配角色
    sysUserAdd: (config) => { return ajax._post('/sys/user/save', config) }, //新增用户信息
    sysUserEdit: (config) => { return ajax._put('/sys/user/save', config) }, //修改用户信息
    sysUserEnable: (config) => { return ajax._put('/sys/user/enable', config) }, //解锁用户
    sysUserDisable: (config) => { return ajax._put('/sys/user/disable', config) }, //锁定用户
    sysUserRemoveById: (config) => { return ajax._delete('/sys/user/removeById', config) }, //锁定用户
    sysUserPage: (config) => { return ajax._post('/sys/user/page', config) }, //查询用户分页信息
    getUserMenuList: (config) => { return ajax._get('/sys/menu/getUserMenuList', config) }, //查询登录用户所拥有的菜单信息
    getUserPermissions: (config) => { return ajax._get('/sys/menu/getUserPermissions', config) }, //查询登录用户所有权限
    getAllDictList: (config) => { return ajax._get('/sys/dict/getAllDictList', config) }, //查询所有字典项
    sysRoleGetById: (config) => { return ajax._get('/sys/role/getById', config) }, //根据ID查询角色
    sysRoleGetMenusByRoleId: (config) => { return ajax._get('/sys/role/getMenusByRoleId', config) }, //根据ID查询角色
    sysRolePage: (config) => { return ajax._post('/sys/role/page', config) }, //角色分页列表查询
    sysRoleAdd: (config) => { return ajax._post('/sys/role/save', config) }, //新增角色信息
    sysRoleEdit: (config) => { return ajax._put('/sys/role/save', config) }, //修改角色信息
    sysRoleSaveRoleMenu: (config) => { return ajax._post('/sys/role/saveRoleMenu', config) }, //保存角色授权信息
    sysRoleRemoveById: (config) => { return ajax._delete('/sys/role/removeById', config) }, //根据ID删除角色
    sysMenuPage: (config) => { return ajax._post('/sys/menu/page', config) }, //菜单分页列表查询
    sysMenuChildren: (config) => { return ajax._get('/sys/menu/children', config) }, //查询下级菜单列表
    getAllMenuList: (config) => { return ajax._get('/sys/menu/getAllMenuList', config) }, //查询所有菜单
    sysMenuGetById: (config) => { return ajax._get('/sys/menu/getById', config) }, //根据ID查询菜单
    sysMenuAdd: (config) => { return ajax._post('/sys/menu/save', config) }, //新增菜单信息
    sysMenuEdit: (config) => { return ajax._put('/sys/menu/save', config) }, //修改菜单信息
    sysMenuEnable: (config) => { return ajax._put('/sys/menu/enable', config) }, //启用菜单
    sysMenuDisable: (config) => { return ajax._put('/sys/menu/disable', config) }, //禁用菜单
    sysMenuRemoveById: (config) => { return ajax._delete('/sys/menu/removeById', config) }, //根据ID删除角色
    sysDictGetById: (config) => { return ajax._get('/sys/dict/getById', config) }, //根据ID查询字典
    sysDictPage: (config) => { return ajax._post('/sys/dict/page', config) }, //字典分页列表查询
    sysDictAdd: (config) => { return ajax._post('/sys/dict/save', config) }, //新增字典信息
    sysDictEdit: (config) => { return ajax._put('/sys/dict/save', config) }, //修改字典信息
    sysDictRemoveById: (config) => { return ajax._delete('/sys/dict/removeById', config) }, //根据ID删除字典
    sysDictGetItemById: (config) => { return ajax._get('/sys/dict/getItemById', config) }, //根据ID查询字典项
    sysDictItemPage: (config) => { return ajax._post('/sys/dict/dictItemPage', config) }, //根据字典ID查询字典项列表
    sysDictItemAdd: (config) => { return ajax._post('/sys/dict/saveItem', config) }, //新增字典项信息
    sysDictItemEdit: (config) => { return ajax._put('/sys/dict/saveItem', config) }, //修改字典项信息
    sysDictRemoveByItemId: (config) => { return ajax._delete('/sys/dict/removeByItemId', config) }, //根据ID删除字典项
    sysLogPage: (config) => { return ajax._post('/sys/log/page', config) }, //日志分页列表查询
    sysMyLogPage: (config) => { return ajax._post('/sys/log/myPage', config) }, //我的日志分页列表查询
    sysRequestLogPage: (config) => { return ajax._post('/sys/log/requestPage', config) }, //访问日志分页列表查询

}

export default api;
