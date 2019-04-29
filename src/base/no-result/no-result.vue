<template>
  <div class="no-result-wrap">
    <div class="bg"></div>
    <p class="title">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styl/variable'
@import '~styl/mixin'
.no-result-wrap
  text-align: center
  .bg
    width: 86px
    height: 90px
    bg-image('no-result')
    margin: 0 auto
    background-size: 86px 90px
  .title
    margin-top: 30px
    font-size: $font-size-medium
    color: $color-text-d
</style>
