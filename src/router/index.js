import Vue from 'vue'
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
  mode: 'history',
  routes: [
    {
      name: 'admin', path: '/admin', component: Main,
      redirect: {name: g.home.code, replace: true},
      children: [
        {name: g.home.code, path: g.home.url, component: Home, meta: g.home},
      ],
      beforeEnter (to, from, next) {
        if (!g.tokenValue && to.name !== 'login') {
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
g.router['/admin/home'] = g.home;
let initMenu = false;

let formatMenus = function (data) {
  /* 处理数据 */
  let setData = function (root, parents){
    root.forEach((item) => {
      if (!g.isEmpty(item.url)) {
        let name = g.urlToCode(item.url);
        g.meta[name] = item;
        if(!g.router[item.url]){
          g.router[item.url] = {
            code: item.code,
            name: item.name,
            url: item.url,
            icon: item.icon
          };
          router.addRoute('admin',{
            name: name, path: item.url, component: () => import('../views'+item.url), meta: {code:item.code, name: item.name}
          });
        }
      }
      let nextParents;
      let obj = {
        type: item.type,
        name: item.name
      };
      if (parents == null) {
        item['parents'] = [];
        nextParents = [obj];
      } else {
        item['parents'] = g.copyVal(parents);
        nextParents = g.copyVal(parents || []).concat([obj]);
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
  if(initMenu || to.name === 'login'){
    next()
    return;
  }
  if (!g.tokenValue) {
    next({name: 'login'})
    return;
  }
  $api.getUserPermissions({
    callback:(res) => {
      localStorage.setItem(g.permissions, JSON.stringify(res));
      //获取所有菜单信息
      $api.getUserMenuList({
        callback: data => {
          let menus = formatMenus(data);
          store.setMenus(menus);
          initMenu = true;
          next({...to, replace: true})
        },
        failure: () => {
          next()
        }
      });
    },
    failure: (error) => {
      next()
    }
  });
  $api.sysUserInfo({
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
  if(to.query && to.query.child){
    to.meta.parentPath = from.fullPath;
  }
  if(g.meta[to.name]){
    to.meta.code = g.meta[to.name].code;
    to.meta.name = g.meta[to.name].name;
    to.meta.type = g.meta[to.name].type;
    to.meta.icon = g.meta[to.name].icon;
    to.meta.parents = g.meta[to.name].parents;
  }
  if(to.query.title){
    to.meta.name = to.query.title;
  }
})

export default router;
