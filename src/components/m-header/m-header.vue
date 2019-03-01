<template>
  <div class="c-m-header">
    <div class="logo"></div>
    <span class="title">Chicken Music</span>
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
  display: flex
  height: 44px
  justify-content: center
  align-items center
  .logo
    flex:0 0 30px
    width 30px
    height 32px
    bg-image('logo')
    background-size 30px 32px
    background-repeat no-repeat
    margin-right 9px
  .title
    font-size: $font-size-large;
    color:$color-theme;

</style>
