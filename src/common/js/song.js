import { getSongsUrl, getLyric } from 'api/song'
import { ERR_OK } from '../../api/configs'
import { Base64 } from 'js-base64'

export default class Song {
  constructor ({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric (mid) {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}
export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: mapSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${
      musicData.albummid
    }.jpg?max_age=2592000`,
    url: ''
  })
}

export function mapSinger (singer) {
  if (!singer.length) {
    return ''
  }
  let ret = singer.map(s => {
    return s.name
  })
  return ret.join('/')
}

export function isValiMusic (musicData) {
  return (
    musicData.albumid &&
    musicData.songid &&
    (!musicData.pay || musicData.pay.payalbumprice === 0)
  )
}

export function processSongsUrl (songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return getSongsUrl(songs).then(purlMap => {
    songs = songs.filter(song => {
      let purl = purlMap[song.mid]
      if (purl) {
        song.url =
          purl.indexOf('http') !== -1
            ? purl
            : `http://dl.stream.qqmusic.qq.com/${purl}`
        return true
      }
      return false
    })
    return songs
  })
}

export function findSongIndex (list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}
