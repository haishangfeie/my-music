<template>
  <div class="progress-circle">
    <svg :width="diameter"
         :height="diameter"
         viewBox="0 0 100 100"
         xmlns="http://www.w3.org/2000/svg"
         version="1.1">
      <circle cx="50"
              cy="50"
              r="50"
              class="progress-background"></circle>
      <circle cx="50"
              cy="50"
              r="50"
              class="progress-bar" :stroke-dasharray="dasharray" :stroke-dashoffset="dashoffset"></circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    diameter: {
      type: Number,
      default: 100
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dasharray: Math.PI * 100
    }
  },
  computed: {
    dashoffset () {
      return (1 - this.percentage) * this.dasharray
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styl/variable'
.progress-circle
  position relative
  circle
    stroke-width: 8px
    transform-origin: center
    fill: none
    &.progress-background
      transform: scale(0.9)
      stroke: $color-theme-d
    &.progress-bar
      transform: scale(0.9) rotate(-90deg)
      stroke: $color-theme
</style>
