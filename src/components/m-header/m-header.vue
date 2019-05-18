<template>
  <div class="c-m-header">
    <div class="logo"></div>
    <span class="title">Chicken Music</span>
    <router-link :to="{name:'userCenter'}" class="mine" tag="div">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped  lang="stylus">
@import '~styl/variable'
@import '~styl/mixin'
.c-m-header
  position: relative
  display: flex
  height: 44px
  justify-content: center
  align-items: center
  color: $color-theme
  .logo
    flex: 0 0 30px
    width: 30px
    height: 32px
    bg-image('logo')
    background-size: 30px 32px
    background-repeat: no-repeat
    margin-right: 9px
  .title
    font-size: $font-size-large
  .mine
    position: absolute
    right: 0
    top: 0
    .icon-mine
      display: block
      font-size: 20px
      padding: 12px
</style>
