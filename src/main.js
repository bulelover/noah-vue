import Vue from 'vue'
import '@/utils/global';
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/scss/common.scss';
import '@/assets/scss/theme.scss';
import {IconPark,install} from '@icon-park/vue/es/all';
import '@icon-park/vue/styles/index.css';
Vue.use(ElementUI,{ size: 'medium'});
Vue.component('icon', IconPark);
install(Vue);

import { vuePlugin } from "@/components/bpmn/highlight";
import "highlight.js/styles/atom-one-dark-reasonable.css";
Vue.use(vuePlugin);

import MyPD from "@/components/bpmn/index.js";
Vue.use(MyPD);
import "@/components/bpmn/theme/index.scss";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";


//设置主题
if(G.white === '1'){
  document.body.classList.add('white-theme');
}
document.body.classList.add(G.theme);
document.body.classList.add(G.frame);

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

let vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
export default vm

