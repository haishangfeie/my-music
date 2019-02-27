var path = require('path')
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@@': path.join(__dirname, '/src/components'),
        common: path.join(__dirname, '/src/common')
      }
    }
  },
  productionSourceMap: false
}
