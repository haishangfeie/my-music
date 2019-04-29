<template>
  <div class="wrapper"
       ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  data () {
    return {
      scroll: null
    }
  },
  props: {
    data: {
      type: Array,
      default: null
    },
    click: {
      type: Boolean,
      default: true
    },
    bounce: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 0
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    }

  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  },
  mounted () {
    setTimeout(() => {
      this.initScroll()
    }, 20)
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.refresh()
      }, 20)
    })
  },
  methods: {
    initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: this.click,
        bounce: this.bounce,
        probeType: this.probeType
      })
      this.scroll.on('scroll', (pos) => {
        if (this.listenScroll) {
          this.$emit('scroll', pos)
        }
      })
      if (this.pullup) {
        this.scroll.on('scrollEnd', ({ y }) => {
          if (this.scroll.maxScrollY < 0 && y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    refresh () {
      if (!this.scroll) {
        return
      }
      this.scroll.refresh()
    },
    enable () {
      this.scroll && this.scroll.enable()
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }

  }
}
</script>

<style scoped>
</style>
