<template>
  <transition name="slide">
    <div class="singer-detail">
      singer-detail
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/configs'
import { createSong, isValiMusic, processSongsUrl } from 'common/js/song'

export default {
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
@import '~styl/variable.styl'
.singer-detail
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 100
  background: $color-background
.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
.slide-enter-active, .slide-leave-active
  transition: transform 0.4s
</style>
