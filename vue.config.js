var path = require('path')
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@@': path.join(__dirname, '/src/components'),
        common: path.join(__dirname, '/src/common'),
        styl: path.join(__dirname, '/src/common/stylus'),
        api: path.join(__dirname, '/src/api'),
        base: path.join(__dirname, '/src/base')
      }
    }
  },
  productionSourceMap: false
}
