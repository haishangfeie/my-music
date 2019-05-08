<template>
  <transition name="fade">
    <div class="playlist-wrap"
         v-show="showFlag"
         @click="hide">
      <div class="playlist"
           @click.stop>
        <div class="header">
          <div class="mode-wrap"
               @click="changeMode">
            <i class="icon"
               :class="modeIconCls"></i>
            <span class="text">{{modeText}}</span>
          </div>
          <div class="clear"
               @click="showConfirm">
            <i class="icon-clear"></i>
          </div>
        </div>
        <scroll ref="content"
                class="content"
                :data="sequenceList">
          <transition-group tag="ul"
                            name="list">
            <li class="item"
                ref="songItems"
                v-for="(item,index) in sequenceList"
                :key="item.id"
                @click="selectItem(item,index)">
              <i class="icon-play"
                 :class="getCurrentCls(item)"></i>
              <span class="song-name">{{item.name}}</span>
              <div class="like">
                <i class="icon-not-favorite"></i>
              </div>
              <div class="delete"
                   @click.stop="deleteOne(item)"><i class="icon-delete"></i></div>
            </li>
          </transition-group>
        </scroll>
        <div class="operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="close"
             @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm"
               text="是否清空播放列表"
               confirmBtnText="清空"
               @confirm="confirmClear"></confirm>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { findSongIndex } from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import { PlayerMixin } from 'common/js/mixin'
export default {
  mixins: [PlayerMixin],
  data () {
    return {
      showFlag: false
    }
  },
  components: {
    Scroll,
    Confirm
  },
  computed: {
    modeText () {
      if (this.mode === playMode.sequence) {
        return '顺序播放'
      } else if (this.mode === playMode.loop) {
        return '单曲循环'
      } else {
        return '随机播放'
      }
    },
    ...mapGetters([
      'sequenceList',
      'playlist',
      'currentSong',
      'mode'
    ])
  },
  watch: {
    currentSong (newSong) {
      this.scrollToCurrentSong(newSong)
    }
  },
  methods: {
    show () {
      this.showFlag = true
      this.$nextTick(() => {
        this.$refs.content.refresh()
        this.scrollToCurrentSong(this.currentSong)
      })
    },
    hide () {
      this.showFlag = false
    },
    getCurrentCls (item) {
      if (item.id === this.currentSong.id) {
        return 'current'
      } else {
        return ''
      }
    },
    selectItem (item, index) {
      if (this.mode === playMode.random) {
        index = findSongIndex(this.playlist, item)
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    scrollToCurrentSong (song) {
      if (!this.showFlag) {
        return
      }
      // 滚动到播放歌曲的位置
      let index = findSongIndex(this.sequenceList, song)
      if (index !== -1) {
        let el = this.$refs.songItems[index]
        this.$refs.content.scrollToElement(el, 300)
      }
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    deleteOne (item) {
      this.deleteOneSong(item)
      if (!this.playlist.length) {
        this.hide()
      }
    },
    confirmClear () {
      this.clearSongList()
      this.hide()
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'deleteOneSong',
      'clearSongList'
    ])
  }
}
</script>

<style lang="stylus" scoped>
@import '~styl/variable'
@import '~styl/mixin'
.playlist-wrap
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  z-index: 200
  background-color: $color-background-d
  transition: opacity 0.3s
  &.fade-enter, &.fade-leave-to
    opacity: 0
    .playlist
      transform: translate3d(0, 100%, 0)
  .playlist
    position: absolute
    left: 0
    bottom: 0
    width: 100%
    background-color: $color-highlight-background
    transition: transform 0.3s
    .header
      display: flex
      padding: 20px 30px 10px 20px
      align-items: center
      .mode-wrap
        display: flex
        flex: 1
        align-items: center
        .icon
          margin-right: 10px
          font-size: 30px
          color: $color-theme-d
        .text
          font-size: $font-size-medium
          color: $color-text-l
      .clear
        extend-click()
        .icon-clear
          font-size: $font-size-medium
          color: $color-text-d
    .content
      padding: 0 30px 0 20px
      max-height: 240px
      overflow: hidden
      .item
        display: flex
        align-items: center
        height: 40px
        &.list-enter-active, &.list-leave-active
          transition: height 0.3s, opacity 0.3s
        &.list-enter, &.list-leave-to
          height: 0
          opacity: 0
        .icon-play
          visibility: hidden
          flex: 0 0 20px
          width: 20px
          font-size: 12px
          color: rgba(255, 205, 49, 0.5)
          &.current
            visibility: visible
        .song-name
          flex: 1
          no-wrap()
          font-size: $font-size-medium
          color: $color-text-d
        .like
          extend-click()
          margin-right: 15px
          .icon-not-favorite
            font-size: $font-size-small
            color: $color-theme
        .delete
          extend-click()
          .icon-delete
            font-size: $font-size-small
            color: $color-theme
    .operate
      width: 140px
      margin: 20px auto 30px auto
      .add
        display: flex
        align-items: center
        padding: 8px 16px
        border: 1px solid $color-text-l
        border-radius: 100px
        color: $color-text-l
        .icon-add
          margin-right: 5px
          font-size: $font-size-small-s
        .text
          font-size: $font-size-small
    .close
      text-align: center
      line-height: 50px
      background: $color-background
      font-size: $font-size-medium-x
      color: $color-text-l
</style>
