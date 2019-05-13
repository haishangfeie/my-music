<template>
  <transition name="slide">
    <div class="top-tip"
         v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
import { clearTimeout } from 'timers'
export default {
  props: {
    delay: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      showFlag: false
    }
  },
  created () {
    this.tiemr = null
  },
  methods: {
    show () {
      this.showFlag = true
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.timer = null
        this.hide()
      }, this.delay)
    },
    hide () {
      this.showFlag = false
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styl/variable'
.top-tip
  position: fixed
  top: 0
  left: 0
  width: 100%
  z-index: 500
  background: $color-dialog-background
  &.slide-enter, &.slide-leave-to
    transform: translate3d(0, -100%, 0)
  &.slide-enter-active, &.slide-leave-active
    transition: transform 0.3s
</style>
