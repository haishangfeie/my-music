var express = require('express')
var axios = require('axios')
var bodyParser = require('body-parser')

var app = express()

app.get('/api/getDiscList', function (req, res) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then(function (response) {
      res.json(response.data)
    })
    .catch(function (e) {
      console.log(e)
    })
})
app.post('/api/getPurlUrl', bodyParser.json(), function (req, res) {
  var url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  axios
    .post(url, req.body, {
      headers: {
        referer: 'https://y.qq.com/',
        origin: 'https://y.qq.com/',
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
    .then(function (response) {
      res.json(response.data)
    })
    .catch(function (err) {
      console.log(err)
    })
})
app.get('/api/get-lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then(function (response) {
      res.json(response.data)
    })
    .catch(function (e) {
      console.log(e)
    })
})
app.get('/api/getCdInfo', function (req, res) {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then(function (response) {
      // 返回的数据是jsonp，需要对数据进行处理
      let ret = response.data
      if (typeof ret === 'string') {
        const reg = /^\w+\(({.+})\)$/
        const matches = ret.match(reg)
        if (matches) {
          ret = JSON.parse(matches[1])
        }
      }
      res.json(ret)
    })
    .catch(function (e) {
      console.log(e)
    })
})
app.get('/api/search', function (req, res) {
  var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then(function (response) {
      res.json(response.data)
    })
    .catch(e => {
      console.log(e)
    })
})

app.use(express.static('./dist'))

var POST = 80
app.listen(POST, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('服务启动在' + POST + '端口')
})
