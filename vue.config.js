var path = require('path')
var axios = require('axios')
var bodyParser = require('body-parser')
module.exports = {
  devServer: {
    before: function (app) {
      app.get('/api/getDiscList', function (req, res) {
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
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
      app.post('/api/getPurlUrl', bodyParser.json(), function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios
          .post(url, req.body, {
            headers: {
              referer: 'https://y.qq.com/',
              origin: 'https://y.qq.com/',
              'Content-type': 'application/x-www-form-urlencoded'
            }
          })
          .then(response => {
            res.json(response.data)
          })
          .catch(err => {
            console.log(err)
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
