<template>
  <transition name="slide">
    <div class="singer-detail">
      singer-detail
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'singer'
    ])
  }
}
</script>

<style scoped lang="stylus">
@import '~styl/variable.styl'
.singer-detail
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 100
  background: $color-background
.slide-enter,.slide-leave-to
  transform:translate3d(100%,0,0)
.slide-enter-active,.slide-leave-active
  transition:transform .4s;
</style>
