<template>
  <transition name="slide">
    <music-list :songs="songs" :title="singer.name" :bgUrl="singer.picUrl"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/configs'
import { createSong, isValiMusic, processSongsUrl } from 'common/js/song'
import musicList from '@@/music-list/music-list'

export default {
  components: {
    musicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getSingerDetail()
  },
  methods: {
    normalizeSongs (list) {
      let songs = []
      list.forEach(item => {
        let { musicData } = item
        if (isValiMusic(musicData)) {
          songs.push(createSong(musicData))
        }
      })
      return songs
    },
    _getSingerDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id)
        .then(res => {
          if (res.code === ERR_OK) {
            // 现在获取的songs还缺少了歌曲的url
            let songs = this.normalizeSongs(res.data.list)
            // 处理songs，补全缺少的url
            processSongsUrl(songs).then(songs => {
              this.songs = songs
            })
          }
        })
    }
  }
}
</script>

<style scoped lang="stylus">

.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
.slide-enter-active, .slide-leave-active
  transition: transform 0.4s
</style>
