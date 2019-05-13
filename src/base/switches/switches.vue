<template>
  <ul class="switches">
    <li v-for="(item,index) in titleList"
        :key="index"
        class="switch-item"
        :class="{active:currentIndex === index}"
        @click.stop="selectItem(item,index)">{{item.name}}</li>
  </ul>
</template>

<script>
export default {
  props: {
    titleList: {
      type: Array,
      default () {
        return []
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    selectItem (item, index) {
      this.$emit('select', index)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styl/variable'
@import '~styl/mixin'
.switches
  display: flex
  border: 1px solid #333
  border-radius: 5px
  align-items: center
  .switch-item
    flex: 1
    padding: 8px
    text-align: center
    font-size: $font-size-medium
    color: $color-text-d
    no-wrap()
    &.active
      background: #333
      color: #fff
</style>
