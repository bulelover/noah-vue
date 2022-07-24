var dynBaseUrl = function (rootPath) {
  var path = window.document.location.pathname;
  var base = '';
  if (path === '/' || path === '//' ||path === '') {
    base = window.document.location.href;
  } else {
    base = window.document.location.href.substring(0, window.document.location.href.indexOf(window.document.location.pathname))
  }
  if(base.indexOf('#')>0){
    base = base.substring(0,base.indexOf('#'));
  }
  return (base + rootPath)
      .replace('://', '^').replace('//','/').replace('//','/').replace('//','/')
      .replace('^', '://');
};

window.G.appTitle = 'Noah 后台管理系统'
// 后台地址 只针对打包生效
window.G.serverUrl = dynBaseUrl('/api')
