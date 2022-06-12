const port = 5678; // dev port
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
// 是否为生产环境
const isProduction = process.env.NODE_ENV === 'production'
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  // 部署应用包时的基本 URL,用法和 webpack 本身的 output.publicPath 一致
  publicPath: '/',
  // 输出文件目录
  outputDir: 'dist',
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // transpileDependencies: ['element-ui', 'vue-cropper'],
  // webpack相关配置
  chainWebpack: (config) => {
    config.resolve.symlinks(true);
    config.entry('main').add('babel-polyfill')
    config.resolve.alias
        .set('vue$', 'vue/dist/vue.esm.js')
        .set('@', resolve('src'))
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境
      config.mode = 'production'
    } else {
      // 开发环境
      config.mode = 'development'
    }
  },
  // css相关配置
  css: {
    // 是否分离css（插件ExtractTextPlugin）
    // extract: isProduction,
    // // 是否开启 CSS source maps
    // sourceMap: true,
    loaderOptions: {
      less: {
        modifyVars: {
        },
        javascriptEnabled: true,
      }
    }
    // // css预设器配置项
    // loaderOptions: {},
    // // 是否启用 CSS modules for all css / pre-processor files.
    // requireModuleExtension: true
  },
  devServer: {
    port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // 配置代理
    proxy: {
      "/api": {
        target: process.env.VUE_APP_URL,
        changeOrigin: true, // 是否改变域名
        pathRewrite: {
          '^/api': ''
        }
      }
    }
    // 下边这个， 如果你是本地自己mock 的话用after这个属性，线上环境一定要干掉
    // after: require("./mock/mock-server.js")
  },
  lintOnSave: undefined
}
