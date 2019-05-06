<template>
  <transition name="comfirm-fade">
    <div class="comfirm"
         v-show="showFlag">
      <div class="content-wrap">
        <div class="content">
          <p class="text">{{text}}</p>
          <div class="btn-wrap">
            <div class="cancel-btn btn left"
                 @click="cancel">{{cancelBtnText}}</div>
            <div class="comfirm-btn btn"
                 @click="comfirm">{{comfirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    },
    comfirmBtnText: {
      type: String,
      default: '确认'
    }
  },
  data () {
    return {
      showFlag: false
    }
  },
  methods: {
    show () {
      this.showFlag = true
    },
    hide () {
      this.showFlag = false
    },
    cancel () {
      this.hide()
      this.$emit('cancel')
    },
    comfirm () {
      this.hide()
      this.$emit('comfirm')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styl/variable'
.comfirm
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  z-index: 998
  background-color: $color-background-d
  &.comfirm-fade-enter
    opacity: 0
  &.comfirm-fade-enter-active
    transition: opacity 0.3s
    .content
      animation: confirm-zoom 0.3s
  .content-wrap
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    .content
      width: 270px
      border-radius: 13px
      background: #333
      .text
        padding: 19px 15px
        line-height: 22px
        text-align: center
        font-size: $font-size-large
        color: $color-text-l
      .btn-wrap
        display: flex
        text-align: center
        font-size: 18px
        .btn
          flex: 1
          line-height: 22px
          padding: 10px 0
          border-top: 1px solid $color-background-d
          color: $color-text-d
          &.left
            border-right: 1px solid $color-background-d
@keyframes confirm-zoom
  0%
    transform: scale(0)
  50%
    transform: scale(1.1)
  100%
    transform: scale(1)
</style>
