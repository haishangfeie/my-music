import axios from 'axios'
import getUid from 'common/js/uid'
import { commonParams, ERR_OK } from 'api/configs'

const debug = process.env.NODE_ENV !== 'production'

export function getSongsUrl (songs) {
  let url = debug
    ? '/api/getPurlUrl'
    : 'http://ustbhuangyi.com/music/api/getPurlUrl'

  // 在发出请求前，先要将参数构造出来
  let mids = []
  let types = []

  songs.forEach(item => {
    mids.push(item.mid)
    types.push(0)
  })

  const urlMid = getUrlMid(mids, types)

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  return new Promise((resolve, reject) => {
    let tryTime = 3
    request()

    function request () {
      return axios
        .post(url, {
          comm: data,
          req_0: urlMid
        })
        .then(response => {
          const res = response.data
          if (res.code === ERR_OK) {
            let urlMid = res.req_0

            if (urlMid && urlMid.code === ERR_OK) {
              let midurlinfo = urlMid.data.midurlinfo

              let purlMap = {}
              midurlinfo.forEach(item => {
                if (item.purl) {
                  purlMap[item.songmid] = item.purl
                }
              })
              resolve(purlMap)
            } else {
              retry()
            }
          } else {
            retry()
          }
        })
    }
    function retry () {
      tryTime--
      if (tryTime > 0) {
        request()
      } else {
        // reject(new Error('Can not get the song url'))
        resolve({})
      }
    }
  })
}

export function getLyric (mid) {
  const url = '/api/get-lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}

function getUrlMid (mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}
