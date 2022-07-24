let gro = function (path, meta){
  return {
    name: G.urlToCode(path),
    path: path,
    component: () => import('../views'+path),
    meta: meta || {
      name: '',
      parents: '',
      parentPath: '',
    }
  }
}

const exposedChildren = [
  {name: 'exposed-home', path: '/exposed/home', component: () => import('../views/exposed/home')},
  {name: 'exposed-blogs', path: '/exposed/blogs', component: () => import('../views/exposed/blogs/index')},
  {name: 'exposed-tools', path: '/exposed/tools', component: () => import('../views/exposed/tools/index')},
];

export default exposedChildren;
