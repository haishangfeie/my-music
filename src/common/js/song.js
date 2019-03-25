import { getSongsUrl } from 'api/song'

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

function mapSinger (singer) {
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
    songs.filter(song => {
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
