<template>
  <div class="loading">
    <img width="24" height="24" src="./loading.gif" alt="">
    <p class="title">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '正在载入···'
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styl/variable'
.loading
  text-align:center
  .title
    line-height 20px
    color:$color-text-l
    font-size:$font-size-small
</style>
