import Vue from "vue";
import {Base64} from "js-base64";
import $ from "jquery";

//权限校验方法
let permissions;
//字典缓存
let dictionary = {};

const toolFunctions = {
  getHttpOptions(){
    return {
      data: {},
      //(data, msg)=>{}
      callback: null,
      // (error)=>{}
      failure: null,
      //()=>{}
      complete: null
    }
  },
  validator: {
    required(trigger, message){
      return [{
        required: true,
        trigger: trigger || 'blur',
        message: message || '不能为空',
        transform(value) {return value.trim()}
      }]
    },
    letters(trigger, message){
      return [{
        trigger: trigger || 'blur',
        type: 'string',
        pattern: /^[a-z]+$/i,
        message: message || '只能输入字母',
        transform(value) {return value.trim()}
      }]
    },
    email(trigger, message){
      return [{
        trigger: trigger || 'blur',
        type: 'email',
        message: message || '邮箱格式有误',
        transform(value) {return value.trim()}
      }]
    },
    phone(trigger, message){
      return [{
        trigger: trigger || 'blur',
        type: 'string',
        pattern: /(^((\d{11})|(\d{7,8})|(\d{4}|\d{3})-(\d{7,8}))$)/,
        message: message || '电话或手机号格式有误',
        transform(value) {return value.trim()}
      }]
    },
    mobile(trigger, message){
      return [{
        trigger: trigger || 'blur',
        type: 'string',
        pattern: /^1[3-9]\d{9}$/,
        message: message || '手机号格式有误',
        transform(value) {return value.trim()}
      }]
    },
    fixedPhone(trigger, message){
      return {
        trigger: trigger || 'blur',
        type: 'string',
        pattern: /^(?:(?:0\d{2,3}[\- ]?[1-9]\d{6,7})|(?:[48]00[\- ]?[1-9]\d{6}))$/,
        message: message || '固定电话格式有误',
        transform(value) {return value.trim()}
      }
    }
  },
  /**
   * 清除keep-alive中某个组件的缓存，逻辑参考 keep-alive 的源码实现
   * @param { VNode } instance 需要清除的组件的实例对象，这个组件应为 keep-alive 的直接子组件
   * @returns
   */
  clearAliveCache(instance) {
    if(!instance){
      return false;
    }
    const attributesRequired = instance.$vnode &&
      instance.$vnode.data.keepAlive &&
      instance.$vnode.parent &&
      instance.$vnode.parent.componentInstance &&
      instance.$vnode.parent.componentInstance.cache &&
      instance.$vnode.componentOptions;

    if (!attributesRequired) {
      return false;
    }

    const tag = instance.$vnode.componentOptions.tag ? "::" + instance.$vnode.componentOptions.tag : "";
    const key = !instance.$vnode.key ? instance.$vnode.componentOptions.Ctor.cid + tag : instance.$vnode.key;
    // 拿到该实例对象父组件的组件对象，通过父组件去删除子组件。
    const { cache, keys, $vnode } = instance.$vnode.parent.componentInstance;
    if (cache[key]) {
      pruneCacheEntry(cache, key, keys, $vnode);
    }
  },

  /**
   * 判断对象是否为null或undefined
   * @param val 对象
   * @returns {boolean}
   */
  isNull: function (val) {
    return val === undefined || val === null;
  },
  isEmpty: function (val) {
    if (val === undefined || val === null) {
      return true;
    }
    val = val.trim();
    return val === '';
  },
  urlToCode: function (url) {
    var arr = url.split('/');
    var name = '';
    arr.forEach(function (item) {
      if (!G.isEmpty(item)) {
        name += item.trim().toLowerCase().replace(item[0], item[0].toUpperCase());
      }
    });
    return name;
  },
  /**
   * file图片文件转base64
   * @param {*} img file文件或者blob
   * @param {*} callback function (imgurl)通过参数获得base64
   */
  getBase64: function (img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  },

  setRouter: (url, item) =>{
    if(G.router[url] && G.router[url]['_vm']){
      let _vm = G.router[url]['_vm'];
      G.router[url] = item;
      G.router[url]['_vm'] = _vm;
    }else {
      G.router[url] = item;
    }
  },
  getRouter:(url) => {
    return G.router[url];
  },
  setRouterVm: (url, vm) =>{
    if(G.router[url]){
      G.router[url]['_vm'] = vm;
    }else {
      G.router[url] = {
        _vm: vm
      };
    }
  },
  getRouterVm: (url) =>{
    if(G.router[url]){
      return G.router[url]['_vm']
    }
    return null;
  },
  hasPerm: function (code){
    if(permissions && permissions.length > 0){
      return permissions.indexOf(code) > -1;
    }
    let str = localStorage.getItem(G.permissions);
    if(str && str.substring(0,1) === '['){
      permissions = JSON.parse(str);
      return permissions.indexOf(code) > -1;
    }
    return false;
  },
  emptyPerm: function (){
      permissions = []
  },

  getDictList: function (dictCode){
    if(dictionary && dictionary.length > 0){
      return dictionary[dictCode];
    }
    let str = localStorage.getItem(G.dictionary);
    if(str && str.substring(0,1) === '{'){
      dictionary = JSON.parse(str);
      return dictionary[dictCode];
    }
  },
  getDictLabel: function (dictCode, itemCode){
    if(dictionary && dictionary.length > 0 && dictionary[dictCode]){
      let s = dictionary[dictCode].filter(item => item.code == itemCode);
      return s && s.length === 1?s[0].name: '--';
    }
    let str = localStorage.getItem(G.dictionary);
    if(str && str.substring(0,1) === '{'){
      dictionary = JSON.parse(str);
      if(!dictionary[dictCode]){
        return '--';
      }
      let s = dictionary[dictCode].filter(item => item.code == itemCode);
      return s && s.length === 1?s[0].name: '--';
    }
  },
  emptyDict(){
    dictionary = {}
  },

  base64Encode(str){
    return Base64.encode(str);
  },

  base64EncodeURI(str){
    return Base64.encodeURI(str);
  },

  base64Decode(str){
    return Base64.decode(str);
  },

  getRouterParams(obj){
    if(obj.params){
      return JSON.parse(G.base64Decode(obj.params))
    }
    return {};
  },

  extend(deep , target, ...object){
    return $.extend(deep, target, ...object);
  }

}

window.G = {
  // affixTop: 60,
  // affixBottom: 0,
  home: {
    code: 'admin-home',
    name: '首页',
    url: '/admin/home',
    icon: 'el-icon-s-home',
  },
  //存储权限缓存的KEY
  permissions: "noah-permissions",
  //存储字典缓存的KEY
  dictionary: "noah-dictionary",
  //常规弹窗宽度1
  dialogWidth1: '700px',
  //常规弹窗宽度2
  dialogWidth2: '820px',
  //列表表格高度（带分页/搜索条件）
  tableHeight: 'calc(100% - 137px)',
  //列表表格高度（无分页）
  tableHeightNoPage: 'calc(100% - 89px)',
  //列表表格高度（无分页和搜索条件）
  tableHeightNoPageSearch: 'calc(100% - 52px)',
  //列表表格高度（页面只有表格）
  tableHeightOnlyList: 'calc(100% - 38px)',
  //列表中基本的行样式
  rowClass: 'base-tr',
  //登录的ID
  loginId: null,
  //显示多页签 、默认开启
  multiTab: localStorage.getItem('multiTab') || '1',
  //显示当前位置 、默认开启
  position: localStorage.getItem('position') || '1',
  //全白主题、默认否
  white: localStorage.getItem('white') || '0',
  //主题色彩、默认“深邃蓝”
  theme: localStorage.getItem('theme') || 'theme-dark-blue',
  //主题色彩、默认“深邃蓝”
  frame: localStorage.getItem('frame') || 'frame-default',
  steep: localStorage.getItem('steep') || '',
  tokenName: localStorage.getItem('tokenKey'),
  tokenValue: localStorage.getItem(localStorage.getItem('tokenKey')),
  meta: {},
  router: {},
  destroyTimeout: 300,
  //菜单的选项（辅助）
  menuOptions: null,
  copyVal: function (data) {
    return JSON.parse(JSON.stringify(data))
  },
  copyAsMenu: function (item) {
    return {
      code: item.code,
      name: item.name,
      url: item.url,
      icon: item.icon,
      type: item.type,
      parents: item.parents,
    }
  },
  setTheme: function (theme) {
    localStorage.setItem('theme', theme);
  },
  setMultiTab: function (v) {
    localStorage.setItem('multiTab', v);
  },
  setFrame: function (v) {
    localStorage.setItem('frame', v);
  },
  setSteep: function (v) {
    localStorage.setItem('steep', v);
  },
  setWhite: function (v) {
    localStorage.setItem('white', v);
  },
  setPosition: function (v) {
    localStorage.setItem('position', v);
  },
  ...toolFunctions,
  ...window.G
}
Vue.prototype.G = window.G;



function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

/**
 * 清除缓存和实例
 * @param { VNodeCache } cache
 * @param { string } key
 * @param { Array<string> } keys
 * @param { VNode } current
 */
function pruneCacheEntry(cache, key, keys, current) {
  var cachedItem = cache[key];
  if (cachedItem && (!current || cachedItem.tag !== current.tag)) {
    cachedItem.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}