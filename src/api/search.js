import jsonp from 'common/js/jsonp'
import { commonParams, options } from './configs.js'
import axios from 'axios'

// 用于取消搜索请求
const CancelToken = axios.CancelToken

let cancelSearchRequestList = []

export function getCancelSearchRequestList () {
  return cancelSearchRequestList
}
export function initCancelSearchRequestList () {
  cancelSearchRequestList = []
}

export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

export function search ({ query, page, isZhiDa, perpage }) {
  const url = '/api/search'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: isZhiDa ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  })

  return axios
    .get(url, {
      params: data,
      cancelToken: new CancelToken(function executor (c) {
        cancelSearchRequestList.push(c)
      })
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
