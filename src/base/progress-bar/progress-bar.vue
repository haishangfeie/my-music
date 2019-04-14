<template>
  <div class="progress-bar">
    <div class="bar-inner"
         ref="barInner"
         @click="changProgress">
      <div class="progress"
           ref="progress"></div>
      <div class="progress-btn-wrap"
           ref="progressBtnWrap"
           @touchstart.prevent="progressBtnStart"
           @touchmove.prevent="progressBtnMove"
           @touchend="progressBtnEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from 'common/js/dom'
const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  props: {
    percentage: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  watch: {
    percentage (newPercentage) {
      if (this.touch.initTouch) {
        return
      }
      let barWidth = this.$refs.barInner.clientWidth
      let progressMaxWidth = barWidth - progressBtnWidth
      let offsetWidth = progressMaxWidth * newPercentage
      this._offset(offsetWidth)
    }
  },
  methods: {
    progressBtnStart (e) {
      this.touch.initTouch = true
      this.touch.start = e.touches[0].pageX
      this.touch.progressWidth = this.$refs.progress.clientWidth
    },
    progressBtnMove (e) {
      if (!this.touch.initTouch) {
        return
      }
      let diff = e.touches[0].pageX - this.touch.start

      let barWidth = this.$refs.barInner.clientWidth
      let progressMaxWidth = barWidth - progressBtnWidth
      let offsetWidth = Math.min(progressMaxWidth, Math.max(0, this.touch.progressWidth + diff))
      this._offset(offsetWidth)
    },
    progressBtnEnd () {
      this.touch = {}
      this.$emit('progressChange', this.$refs.progress.clientWidth / (this.$refs.barInner.clientWidth - progressBtnWidth))
    },
    changProgress (e) {
      let offsetWidth = Math.min((this.$refs.barInner.clientWidth - progressBtnWidth), Math.max(0, e.clientX - this.$refs.barInner.offsetLeft - progressBtnWidth / 2))
      this.$emit('progressChange', offsetWidth / (this.$refs.barInner.clientWidth - progressBtnWidth))
      this._offset(offsetWidth)
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtnWrap.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styl/variable'
.progress-bar
  height: 30px
  .bar-inner
    position: relative
    top: 13px
    height: 4px
    background-color: $color-background-d
    .progress
      position: absolute
      height: 100%
      background: #ffcd32
    .progress-btn-wrap
      position: absolute
      top: -13px
      left: -7px
      width: 30px
      height: 30px
      .progress-btn
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid #fff
        border-radius: 50%
        background: #ffcd32
</style>
