var path = require('path')
var axios = require('axios')
module.exports = {
  devServer: {
    before: function (app) {
      app.get('/api/getDiscList', function (req, res) {
        var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
        axios
          .get(url, {
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          })
          .then(response => {
            res.json(response.data)
          })
          .catch(e => {
            console.log(e)
          })
      })
    }
  },
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
