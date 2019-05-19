<template>
  <transition name="slide">
    <div class="user-center">
      <div class="header">
        <div class="back"
             @click="back">
          <i class="icon-back"></i>
        </div>
        <div class="switches-wrap">
          <switches :titleList="titleList"
                    :currentIndex="currentIndex"
                    @select="switchTab"></switches>
        </div>
      </div>
      <div class="random-play-wrap">
        <div class="random-btn"
             @click="playSongRandom">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <scroll ref="favAndHisWrap" class="favorite-history-wrap"
              :data="scrollData">
        <div>
          <song-list v-show="currentIndex===0"
                     :songs="favorite"
                     @select="selectItem"></song-list>

          <song-list v-show="currentIndex===1"
                     :songs="playHistory"
                     @select="selectItem"></song-list>

        </div>
      </scroll>
      <div class="no-result-wrap" v-show="noResShow">
        <no-result :title="noResTitle"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import { mapGetters, mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'
import NoResult from 'base/no-result/no-result'

export default {
  mixins: [playlistMixin],
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
  },
  data () {
    return {
      titleList: [
        {
          name: '我喜欢的'
        },
        {
          name: '最近听的'
        }
      ],
      currentIndex: 0
    }
  },
  computed: {
    scrollData () {
      if (this.currentIndex === 0) {
        return this.favorite
      } else {
        return this.playHistory
      }
    },
    noResShow () {
      if (this.currentIndex === 0 && !this.favorite.length) {
        return true
      }
      if (this.currentIndex === 1 && !this.playHistory.length) {
        return true
      }
      return false
    },
    noResTitle () {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲'
      } else {
        return '你还没有听过歌曲'
      }
    },
    ...mapGetters([
      'favorite',
      'playHistory'
    ])
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '60px' : ''
      let component = this.$refs.favAndHisWrap
      if (!component) {
        return
      }
      component.$el.style.bottom = bottom
      component.refresh()
    },
    back () {
      this.$router.back()
    },
    switchTab (index) {
      this.currentIndex = index
    },
    selectItem (song) {
      this.insertSong(song)
    },
    playSongRandom () {
      let list = []
      if (this.currentIndex === 0) {
        list = this.favorite
      } else {
        list = this.playHistory
      }
      if (!list.length) {
        return
      }
      this.playRandom({ list })
    },
    ...mapActions([
      'insertSong',
      'playRandom'
    ])
  }
}
</script>

<style lang="stylus" scoped>
@import '~styl/variable'
.user-center
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  z-index: 100
  background-color: $color-background
  &.slide-enter,&.slide-leave-to
    transform: translate3d(100%, 0, 0)
  &.slide-enter-active, &.slide-leave-active
    transition: transform 0.4s
  .header
    position: relative
    overflow: hidden
    .back
      position: absolute
      top: 0
      left: 6px
      .icon-back
        display: block
        padding: 10px
        font-size: 22px
        color: #ffcd32
    .switches-wrap
      width: 240px
      margin: 10px auto 15px
  .random-play-wrap
    margin-bottom: 15px
    .random-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: 16px
      .text
        display: inline-block
        vertical-align: middle
        font-size: 12px
  .favorite-history-wrap
    position: absolute
    top: 110px
    bottom: 0
    width: 100%
    overflow: hidden
  .no-result-wrap
    position absolute
    top 50%
    left 50%
    transform:translate(-50%,-50%)
</style>
