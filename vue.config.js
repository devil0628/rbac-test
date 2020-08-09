const path = require('path');
//const config=require('./src/common/js/config')
const config = {
  baseUrl : 'http://10.32.68.18:80'
}

module.exports = {
  devServer: {
    proxy:  {
      '/oms/*': {
        target: config.baseUrl,
      },
      '/task/*': {
        changeOrigin: true,
        target: config.baseUrl,
      },
      '/open/*': {
        changeOrigin: true,
        target: config.baseUrl,
      },

      '/rbac/*': {
        changeOrigin: true,
        target: config.baseUrl,
      },
      '/*':{
        changeOrigin: true,
        target: config.baseUrl,
      }
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './node_modules/'),
        '@': path.resolve(__dirname, './src'),
        api: path.resolve('./src/api'),
        common: path.resolve('./src/common'),
        components: path.resolve('./src/components'),
        router: path.resolve('./src/router'),
        store: path.resolve('./src/store'),
        static: path.resolve('../src/static'),
        views: path.resolve('./src/views'),
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 102400,
        maxSize: 512000,
        minChunks: 2,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        cacheGroups: {
          vue: {
            test: /[\\/]node_modules[\\/](vue|vue-router|vuex|vue-i18n)[\\/]/,
            priority: 20,
            reuseExistingChunk: true,
            enforce: true,
            maxSize: 1024 * 1024 * 5, // 5M
            filename: 'js/venders~vue.[contenthash].js',
          },
        },
      },
    },
    plugins: [

    ],
  },

  productionSourceMap: true,

};
