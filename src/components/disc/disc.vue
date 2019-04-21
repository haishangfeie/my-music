<template>
  <transition name="slide">
    <!-- :songs="songs" :title="singer.name" :bgUrl="singer.picUrl" -->
    <music-list :songs="songList"
                :title="disc.dissname"
                :bgUrl="disc.imgurl"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSongList } from 'api/recommend'
import { ERR_OK } from 'api/configs'
import { createSong, isValiMusic, processSongsUrl } from 'common/js/song'
import musicList from '@@/music-list/music-list'

export default {
  components: {
    musicList
  },
  data () {
    return {
      songList: []
    }
  },
  computed: {
    ...mapGetters([
      'disc'
    ])
  },
  created () {
    this._getSongList()
  },
  methods: {
    normalizeSongs (list) {
      let songs = []
      list.forEach(musicData => {
        if (isValiMusic(musicData)) {
          songs.push(createSong(musicData))
        }
      })
      return songs
    },
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          // 现在获取的songs还缺少了歌曲的url
          let songs = this.normalizeSongs(res.cdlist[0].songlist)

          // 处理songs，补全缺少的url
          processSongsUrl(songs).then(songs => {
            this.songList = songs
          })
        }
      })
    }
    // normalizeSongs (list) {
    //   let songs = []
    //   list.forEach(item => {
    //     let { musicData } = item
    //     if (isValiMusic(musicData)) {
    //       songs.push(createSong(musicData))
    //     }
    //   })
    //   return songs
    // }
    // _getSingerDetail () {
    //   if (!this.singer.id) {
    //     this.$router.push('/singer')
    //     return
    //   }
    //   getSingerDetail(this.singer.id)
    //     .then(res => {
    //       if (res.code === ERR_OK) {
    //         // 现在获取的songs还缺少了歌曲的url
    //         let songs = this.normalizeSongs(res.data.list)
    //         // 处理songs，补全缺少的url
    //         processSongsUrl(songs).then(songs => {
    //           this.songs = songs
    //         })
    //       }
    //     })
    // }
  }
}
</script>

<style scoped lang="stylus">
.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
.slide-enter-active, .slide-leave-active
  transition: transform 0.4s
</style>
