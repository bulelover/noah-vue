import Vue from 'vue'
import vm from '../main'
import VueRouter from 'vue-router'
import Main from "@/views/Main";
import $ from "jquery";
import store from "@/utils/store";
import $api from "@/utils/api";
import Home from "@/views/admin/Home";
// import exposedChildren from "@/router/exposed";
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onComplete, onAbort) {
  if(typeof onComplete === 'function'){
    return originalPush.call(this, location, onComplete, onAbort)
  }else{
    return originalPush.call(this, location).catch(err => err)
  }
}
Vue.use(VueRouter);

const router = new VueRouter({
  // mode: 'history',
  mode: 'hash',
  routes: [
    {
      name: 'admin', path: '/admin', component: Main,
      redirect: {name: G.home.code, replace: true},
      children: [
        {name: G.home.code, path: G.home.url, component: Home, meta: G.home},
      ],
      beforeEnter (to, from, next) {
        if (!G.tokenValue && to.name !== 'login') {
          store.setUser(null);
          next({name: 'login'});
          return
        }
        next()
      }
    },
    {name: 'login', path: '/', component: () => import('@/views/Login')},
    // {
    //   name: 'exposed', path: '/', component: () => import('@/views/exposed/index'),
    //   redirect: {name: 'exposed-home', replace: true},
    //   children: exposedChildren
    // },
  ]
});
//首页加入全局路由变量
G.setRouter('/admin/home', G.home);

let formatMenus = function (data) {
  /* 处理数据 */
  let setData = function (root, parents){
    root.forEach((item) => {
      if (!G.isEmpty(item.url)) {
        let name = G.urlToCode(item.url);
        G.meta[name] = item;
        if(!G.getRouter(item.url)){
          G.setRouter(item.url, G.copyAsMenu(item));
          router.addRoute('admin',{
            name: name, path: item.url, component: () => import('../views'+item.url), meta: {code:item.code, name: item.name}
          });
        }
      }
      let nextParents;
      let obj = G.copyAsMenu(item);
      if (parents == null) {
        item['parents'] = [];
        nextParents = [obj];
      } else {
        item['parents'] = G.copyVal(parents);
        nextParents = G.copyVal(parents || []).concat([obj]);
      }
      if(item.children && item.children.length > 0){
        setData(item.children, nextParents);
      }
    });
  }
  setData(data, null);
  router.addRoute('admin',{name: 'error', path: '*', component: () => import('../views/error/Error'), meta: {code:'error-page',name: '错误页'}});
  return data.filter( v => v.type === '1');
}

router.beforeEach((to, from, next) => {
  if(store.state.initMenu || to.name === 'login'){
    next()
    return;
  }
  console.log(localStorage.getItem('tokenKey'), localStorage.getItem(localStorage.getItem('tokenKey')))
  if (!G.tokenValue) {
    next({name: 'login'})
    return;
  }
  //清除权限、字典
  if(vm){
    vm.$perms.empty();
    vm.$dict.empty();
  }
  $api.getLoginData({
    callback:(res) => {
      //权限
      localStorage.setItem(G.permissions, JSON.stringify(res.permissions));
      //字典
      localStorage.setItem(G.dictionary, JSON.stringify(res.dictList));
      //获取所有菜单信息
      let menus = formatMenus(res.menuList);
      store.setMenus(menus);
      store.setInitMenu(true);
      next({...to, replace: true})
    },
    failure: (error) => {
      next()
    }
  });
  $api.getLoginUserInfo({
    callback: data => {
      //设置全局登录信息
      store.setUser(data);
    },
    failure: () => {

    }
  });
})

//设置相关参数
router.afterEach((to, from) => {
  to.meta.parentPath = from.fullPath;
  if(to.query && to.query.child){
    to.meta.child = true;
  }
  if(G.meta[to.name]){
    to.meta.code = G.meta[to.name].code;
    to.meta.name = G.meta[to.name].name;
    to.meta.type = G.meta[to.name].type;
    to.meta.icon = G.meta[to.name].icon;
    to.meta.parents = G.meta[to.name].parents;
  }
  if(to.query.title){
    to.meta.name = to.query.title;
  }
})

export default router;
