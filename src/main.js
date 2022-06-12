import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/scss/common.scss';
import '@/assets/scss/theme.scss';
import {IconPark} from '@icon-park/vue/es/all';
import '@icon-park/vue/styles/index.css';
Vue.use(ElementUI,{ size: 'medium'});
Vue.component('icon', IconPark);
Vue.prototype.g = window.g;
//设置主题
document.body.classList.add(g.theme);
document.body.classList.add(g.frame);

import router from '@/router'
import ajax from "@/utils/ajax";
import api from "@/utils/api";

//定义全局
Vue.prototype.$ajax = ajax;
Vue.prototype.$api = api;
Vue.prototype.$theme = {
  lmWidth: '220px',
}
import tools from '@/utils/tools'
import store from "@/utils/store";
Vue.use(tools);

//兼容IE
require('es6-promise').polyfill();
require('es6-promise/auto');

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});


