<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="header"
         :style="bgImg"
         ref="header">
      <div class="filter"></div>
    </div>
    <div class="bg-songs"
         ref="bgSongs"></div>
    <scroll class="scroll"
            :data="songs"
            :probeType="probeType"
            :listenScroll="true"
            @scroll="onScroll"
            ref="scroll">
      <song-list :songs="songs"></song-list>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import { prefixStyle } from 'common/js/dom'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  components: { Scroll, SongList },
  props: {
    title: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    bgUrl: {
      type: String,
      default: ''
    }
  },
  computed: {
    bgImg () {
      if (!this.bgUrl) {
        return ''
      } else {
        return `background-image:url(${this.bgUrl})`
      }
    }
  },
  mounted () {
    this.calcScrollTop()
  },
  methods: {
    calcScrollTop () {
      let height = this.$refs.header.clientHeight
      this.imgHeight = height
      this.minTranslate = -height + RESERVED_HEIGHT
      this.$refs.scroll.$el.style.top = height + 'px'
    },
    onScroll (pos) {
      this.offsetY = pos.y
    }
  },
  data () {
    return {
      probeType: 3,
      offsetY: 0
    }
  },
  watch: {
    offsetY (newY) {
      let transY = Math.max(newY, this.minTranslate)
      let zIndex = 0
      let paddingTop = '70%'
      let imgHeightEqualReservedHeight = false

      let precentage = Math.abs(newY / this.imgHeight)
      let imgScale = 1 + precentage

      // 上拉的模糊值
      let blur = Math.min(20 * precentage, 20)

      this.$refs.bgSongs.style[transform] = `translate3d(0,${transY}px,0)`

      // 在滚动到距离顶部预留距离时发生样式切换，实现跟随滚动
      if (newY < this.minTranslate) {
        zIndex = 10
        paddingTop = `${RESERVED_HEIGHT}px`
        imgHeightEqualReservedHeight = true
      } else {
        imgHeightEqualReservedHeight = false
      }
      if (imgHeightEqualReservedHeight !== this.imgHeightEqualReservedHeight) {
        this.$refs.header.style.paddingTop = paddingTop
        this.$refs.header.style.zIndex = zIndex
      }
      this.imgHeightEqualReservedHeight = imgHeightEqualReservedHeight

      if (newY > 0) {
        // 列表下拉时图片放大
        this.$refs.header.style[transform] = `scale(${imgScale})`
      } else {
        // 上拉时IOS实现高斯模糊
        this.$refs.header.style[backdrop] = `${blur}px`
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~styl/variable.styl'
@import '~styl/mixin.styl'
.music-list
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 100
  background: $color-background
  .back
    position: absolute
    top: 0
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .title
    position: absolute
    top: 0
    left: 10%
    z-index: 40
    width: 80%
    no-wrap()
    text-align: center
    line-height: 40px
    font-size: $font-size-large
    color: $color-text
  .header
    position: relative
    top: 0
    width: 100%
    height: 0
    padding-top: 70%
    background-size: cover
    transform-origin: top
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .bg-songs
    position: relative
    height: 100%
    width: 100%
    background: $color-background
  .scroll
    position: absolute
    left: 0
    width: 100%
    bottom: 0
</style>
