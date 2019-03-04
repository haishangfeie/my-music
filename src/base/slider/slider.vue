<template>
  <!-- limitHeight限制初始化前slider的高度，避免因为高度过高出现的滚动条导致宽度计算错误 -->
  <div class="slider"
       ref="slider" :class="{limitHeight:!slider}">
    <div class="slider-group"
         ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot"
            v-for="(item,index) in dots"
            :key="index"
            :class="{active:currentIndex === index}"></span>
    </div>
  </div>
</template>

<script>
import { addClass } from 'common/js/dom.js'
import BScroll from 'better-scroll'
export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 2000
    },
    dotsShop: {
      type: Boolean,
      default: true
    },
    speed: {
      type: Number,
      default: 400
    }
  },
  data () {
    return {
      slider: null,
      dots: [],
      currentIndex: 0,
      timer: null
    }
  },
  mounted () {
    setTimeout(() => {
      this._setSliderWidth()
      this.$nextTick(() => {
        this._initDots()
        this._initSlider()
        this._play()
      })
    }, 20) // 浏览器一般是间隔17ms刷新
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth (refreshing) {
      let baseWidth = this.$refs.slider.clientWidth
      let sliderGroup = this.$refs.sliderGroup
      let sliderItems = sliderGroup.children
      let sliderGroupWidth = baseWidth * sliderItems.length

      // 循环时左右会各自复制一个dom
      if (this.loop && !refreshing) {
        sliderGroupWidth += baseWidth * 2
      }
      for (let i = 0; i < sliderItems.length; i++) {
        let item = sliderItems[i]
        addClass(item, 'slider-item')
        item.style = 'width:' + baseWidth + 'px;'
      }
      sliderGroup.style = 'width:' + sliderGroupWidth + 'px;'
    },
    _initDots () {
      this.dots = new Array(this.$refs.sliderGroup.children.length)
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        click: true,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.1,
          speed: this.speed
        },
        bounce: false,
        stopPropagation: true
      })
      this.slider.on('beforeScrollStart', () => {
        if (this.timer) {
          clearTimeout(this.timer)
        }
      })
      this.slider.on('scrollEnd', () => {
        this.currentIndex = this.slider.getCurrentPage().pageX
        if (this.autoPlay) {
          // 循环滚动时，在倒数第二张转到第一张图片时会触发两次滚动事件（倒数第二张图片到最后一张图片再到第二张图片，因此要注意使用定时器先清定时器，否则会连续触发两次定时器
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this._play()
        }
      })
    },
    _play () {
      if (!this.autoPlay) {
        return
      }
      this.timer = setTimeout(() => {
        this.slider.next()
        setTimeout(() => {
        }, 500)
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~styl/variable'
.slider
  position: relative
  width: 100%
  overflow: hidden
  &.limitHeight
    max-height 1px
  .slider-group
    position: relative
    .slider-item
      float: left
      a
        display: block
        width: 100%
      img
        display: block
        width: 100%
  .dots
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    text-align: center
    .dot
      display: inline-block
      width: 8px
      height: 8px
      margin-right: 4px
      border-radius: 50%
      background: $color-text-l
      &.active
        width: 20px
        border-radius: 5px
        background-color: $color-text-ll
</style>
