<template>
  <transition name="slide">
    <music-list :songs="songs" :title="rankItem.topTitle" :bgUrl="bgUrl" :isRank="true"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/configs'
import { createSong, isValiMusic, processSongsUrl } from 'common/js/song'
import musicList from '@@/music-list/music-list'

export default {
  computed: {
    bgUrl () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'rankItem'
    ])
  },
  components: {
    musicList
  },
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getMusicList()
  },
  methods: {
    normalizeSongs (list) {
      let songs = []
      list.forEach(item => {
        let musicData = item.data
        if (isValiMusic(musicData)) {
          songs.push(createSong(musicData))
        }
      })
      return songs
    },
    _getMusicList () {
      if (!this.rankItem.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.rankItem.id)
        .then(res => {
          if (res.code === ERR_OK) {
            // 现在获取的songs还缺少了歌曲的url
            let songs = this.normalizeSongs(res.songlist)
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
