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
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: this.click,
        bounce: this.bounce,
        probeType: this.probeType
      })
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
    }

  }
}
</script>

<style scoped>
</style>
