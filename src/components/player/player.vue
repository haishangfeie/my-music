<template>
  <div class="player"
       v-show="playlist.length">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player"
           v-show="fullScreen">
        <div class="background">
          <img width="100%"
               height="100%"
               :src="currentSong.image"
               alt="">
        </div>
        <div class="top">
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
          <div class="back"
               @click="back">
            <i class="icon-back"></i>
          </div>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd">
          <div class="middle-l">
            <div class="cd-wrapper"
                 ref="cdWrapper">
              <div class="cd">
                <img class="img"
                     :class="cdCls"
                     :src="currentSong.image"
                     alt="">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
          <scroll :data="lyric && lyric.lines"
                  class="middle-r"
                  ref="lyricScroll">
            <div class="lyric-wrap">
              <p v-for="(line,index) in lyric.lines"
                 :key="index"
                 class="text"
                 :class="{active:lyricIndex === index}"
                 ref="lines">{{line.txt}}</p>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot "
                  :class="{active:currentTab ==='cd'}"></span>
            <span class="dot"
                  :class="{active:currentTab ==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time current-time">{{format(currentTime)}}</span>
            <div class="progress-bar-wrap">
              <progress-bar :percentage="percentage"
                            @progressChange="changeProgress"></progress-bar>
            </div>
            <span class="time total-time">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon-wrap i-left"
                 @click="changeMode">
              <i :class="modeIconCls"></i>
            </div>
            <div class="icon-wrap i-left"
                 :class="disableCls">
              <i @click="playPrev"
                 class="icon-prev"></i>
            </div>
            <div class="icon-wrap i-center"
                 :class="disableCls">
              <i @click="togglePlay"
                 :class="playIcon"></i>
            </div>
            <div class="icon-wrap i-right"
                 :class="disableCls">
              <i @click="playNext"
                 class="icon-next"></i>
            </div>
            <div class="icon-wrap i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player"
           v-show="!fullScreen"
           @click="open">
        <div class="icon">
          <img class="img"
               width="100%"
               height="100%"
               :src="currentSong.image"
               :class="cdCls"
               alt="">
        </div>
        <div class="text">
          <h1 class="song-name">{{currentSong.name}}</h1>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control">
          <progress-circle :diameter="32"
                           :percentage="percentage">
            <i @click.stop="togglePlay"
               class="control-play-icon"
               :class="miniIcon"></i>
          </progress-circle>

        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio"
           :src="currentSong.url"
           @canplay="playReady"
           @error="playError"
           @ended="playEnd"
           @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'

import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { findSongIndex } from 'common/js/song'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'

const transform = prefixStyle('transform')
const transition = prefixStyle('transition')

export default {
  data () {
    return {
      songReady: false,
      currentTime: 0,
      lyric: {},
      lyricIndex: 0,
      currentTab: 'cd'
    }
  },
  created () {
    this.touch = {}
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  },
  computed: {
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    percentage () {
      return this.currentTime / this.currentSong.duration
    },
    modeIconCls () {
      let cls = ''
      if (this.mode === playMode.sequence) {
        cls = 'icon-sequence'
      } else if (this.mode === playMode.loop) {
        cls = 'icon-loop'
      } else if (this.mode === playMode.random) {
        cls = 'icon-random'
      }
      return cls
    },
    ...mapGetters([
      'playlist',
      'fullScreen',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  methods: {
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    enter (el, done) {
      let { x, y, scale } = this.getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation: animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      let { x, y, scale } = this.getPosAndScale()
      const cdWrapper = this.$refs.cdWrapper
      cdWrapper.style.transition = 'transform 0.4s'
      cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      const timer = setTimeout(done, 400)
      cdWrapper.addEventListener('transitionend', () => {
        clearTimeout(timer)
        done()
      })
    },
    afterLeave () {
      const cdWrapper = this.$refs.cdWrapper
      cdWrapper.style.transition = ''
      cdWrapper.style[transform] = ''
    },
    getPosAndScale () {
      const miniLeft = 40
      const miniBottom = 30
      const miniWidth = 40
      const normalOffsetTop = 85
      const normalWidth = window.innerWidth * 0.8
      const normalLeft = window.innerWidth / 2
      const normalBottom = window.innerHeight - normalOffsetTop - normalWidth / 2
      return {
        x: -(normalLeft - miniLeft),
        y: normalBottom - miniBottom,
        scale: miniWidth / normalWidth
      }
    },
    togglePlay () {
      // 歌曲ready以前不允许切换歌曲，避免报错
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
    },
    playPrev () {
      // 歌曲ready以前不允许切换歌曲，避免报错
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlay()
      }
      // 歌曲发生切换，将ready设为false表示歌曲还没有ready
      this.songReady = false
    },
    playNext () {
      // 歌曲ready以前不允许切换歌曲，避免报错
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playlist.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlay()
      }
      // 歌曲发生切换，将ready设为false表示歌曲还没有ready
      this.songReady = false
    },
    playEnd () {
      if (this.mode === playMode.loop) {
        this.playLoop()
      } else {
        this.playNext()
      }
    },
    playLoop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
    },
    playReady () {
      // 歌曲准备好了才将ready设为true
      this.songReady = true
    },
    playError () {
      // 当出现错误时，歌曲就不会ready了，这时为了产品的正常使用，要将ready设会true，这样用户才能继续进行操作
      this.songReady = true
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    format (interval) {
      interval = interval | 0
      let min = interval / 60 | 0
      let second = interval % 60
      return `${min}:${this._pad(second)}`
    },
    changeProgress (progress) {
      this.$refs.audio.currentTime = this.currentSong.duration * progress
      if (!this.playing) {
        this.togglePlay()
      }
    },
    changeMode () {
      let mode = (this.mode + 1) % 3
      this.setMode(mode)
    },
    getLyric () {
      this.currentSong.getLyric().then(lyric => {
        this.lyric = new Lyric(lyric, this.handler)
        if (this.lyric) {
          this.lyric.play()
        }
      })
    },
    handler ({ lineNum, txt }) {
      this.lyricIndex = lineNum
      if (lineNum > 5) {
        this.$refs.lyricScroll.scrollToElement(this.$refs.lines[lineNum - 5], 1000)
      } else {
        this.$refs.lyricScroll.scrollTo(0, 0, 1000)
      }
    },
    middleTouchStart (e) {
      this.touch.init = true
      const touch = e.touches[0]
      this.touch.pageX = touch.pageX
      this.touch.pageY = touch.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.init) {
        return
      }
      const touch = e.touches[0]
      let deltaX = touch.pageX - this.touch.pageX
      let deltaY = touch.pageY - this.touch.pageY

      // 如果垂直方向的偏移大于水平方向的偏移，此时什么都不做
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      let left = this.currentTab === 'cd' ? 0 : -window.innerWidth
      // 计算右侧的偏移宽度

      let offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))

      this.$refs.lyricScroll.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricScroll.$el.style[transition] = 'none'

      this.touch.percent = Math.abs(offsetWidth) / window.innerWidth

      this.$refs.cdWrapper.style.opacity = `${1 - this.touch.percent}`
    },
    middleTouchEnd () {
      if (!this.touch.init) {
        return
      }
      this.$refs.lyricScroll.$el.style[transition] = 'transform 0.3s'
      this.$refs.cdWrapper.style[transition] = 'opacity 0.3s'
      if (this.currentTab === 'cd') {
        if (this.touch.percent > 0.1) {
          this.$refs.lyricScroll.$el.style[transform] = `translate3d(${-window.innerWidth}px,0,0)`
          this.$refs.cdWrapper.style.opacity = '0'
          this.currentTab = 'lyric'
        } else {
          this.$refs.cdWrapper.style.opacity = '1'
          this.$refs.lyricScroll.$el.style[transform] = `translate3d(0,0,0)`
        }
      } else {
        if (this.touch.percent < 0.9) {
          this.$refs.cdWrapper.style.opacity = '1'
          this.$refs.lyricScroll.$el.style[transform] = `translate3d(0,0,0)`
          this.currentTab = 'cd'
        } else {
          this.$refs.cdWrapper.style.opacity = '0'
          this.$refs.lyricScroll.$el.style[transform] = `translate3d(${-window.innerWidth}px,0,0)`
        }
      }
    },
    _pad (num, n = 2) {
      let len = num.toString().length
      if (len < n) {
        num = '0' + num
      }
      return num
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return
      }
      this.getLyric()
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    playing (newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    },
    mode (newMode) {
      if (newMode === playMode.random) {
        let randomList = shuffle(this.sequenceList)
        this.setCurrentIndex(findSongIndex(randomList, this.currentSong))
        this.setPlayList(randomList)
      } else {
        this.setCurrentIndex(findSongIndex(this.sequenceList, this.currentSong))
        this.setPlayList(this.sequenceList)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~styl/variable'
@import '~styl/mixin'
.player
  .normal-player
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    background: $color-background
    z-index: 100
    &.normal-enter-active, &.normal-leave-active
      transition: opacity 0.4s
      .top, .bottom
        transition: transform 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100%, 0)
      .bottom
        transform: translate3d(0, 100%, 0)
    .background
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      filter: blur(20px)
      opacity: 0.6
      z-index: -1
    .top
      padding: 0 60px
      text-align: center
      .title
        no-wrap()
        line-height: 40px
        font-size: $font-size-large
        color: $color-text
      .subtitle
        line-height: 20px
        font-size: $font-size-medium
        color: $color-text
      .back
        position: absolute
        left: 6px
        top: 0
        .icon-back
          display: block
          padding: 9px
          font-size: 22px
          color: $color-theme
          transform: rotate(-90deg)
    .middle
      position: absolute
      width: 100%
      left: 0
      top: 85px
      bottom: 170px
      font-size: 0
      white-space: nowrap
      .middle-l
        position: relative
        display: inline-block
        vertical-align: top
        padding-top: 80%
        width: 100%
        height: 0
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          box-sizing: border-box
          height: 100%
          .cd
            .img
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              box-sizing: border-box
              border-radius: 50%
              border: 10px solid rgba(255, 255, 255, 0.1)
            .play
              animation: rotate 20s linear infinite
            .pause
              animation-play-state: paused
        .playing-lyric-wrapper
          width: 80%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
      .middle-r
        display: inline-block
        width: 100%
        height: 100%
        vertical-align: top
        overflow: hidden
        .lyric-wrap
          width: 80%
          margin: 0 auto
          text-align: center
          .text
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            &.active
              color: $color-text
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        font-size: 0
        text-align: center
        .dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: rgba(255, 255, 255, 0.5)
          &.active
            width: 20px
            border-radius: 5px
            background: rgba(255, 255, 255, 0.8)
      .progress-wrapper
        display: flex
        padding: 10px 0
        width: 80%
        margin: 0px auto
        .time
          flex: 0 0 30px
          width: 30px
          line-height: 30px
          font-size: 12px
          color: $color-text
          &.total-time
            text-align: right
        .progress-bar-wrap
          flex: 1
      .operators
        display: flex
        align-items: center
        color: $color-theme
        .icon-wrap
          flex: 1
          &.i-left
            text-align: right
          &.i-center
            text-align: center
            padding: 0 20px
            i
              font-size: 40px
          &.i-right
            text-align: left
          &.disable
            color: $color-theme-d
          i
            font-size: 30px
  .mini-player
    position: fixed
    left: 0
    bottom: 0
    z-index: 180
    display: flex
    width: 100%
    height: 60px
    background: $color-highlight-background
    align-items: center
    &.mini-enter-active, &.mini-leave-active
      transition: opacity 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      flex: 0 0 40px
      width: 40px
      height: 40px
      padding: 0 10px 0 20px
      .img
        border-radius: 50%
      .play
        animation: rotate 20s linear infinite
      .pause
        animation-play-state: paused
    .text
      flex: 1
      overflow: hidden
      .song-name
        margin-bottom: 2px
        font-size: $font-size-medium
        color: $color-text
        no-wrap()
        line-height: 20px
      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-d
        line-height: 20px
    .control
      flex: 0 0 32px
      width: 32px
      padding: 0 10px
      i
        font-size: 32px
        color: $color-theme-d
        &.control-play-icon
          position: absolute
          left: 0
          top: 0
@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>
