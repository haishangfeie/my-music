<template>
  <transition-group name="list"
                    tag="ul"
                    class="search-list">
    <li class="search-list-item"
        v-for="(item) in list"
        :key="item"
        @click="selectItem(item)">
      <span class="name">{{item}}</span>
      <div class="icon-wrap"
           @click.stop="deleteItem(item)">
        <i class="icon-delete"></i>
      </div>
    </li>
  </transition-group>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    deleteItem (item) {
      this.$emit('deleteItem', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styl/variable'
@import '~styl/mixin'
.search-list
  .search-list-item
    display: flex
    align-items: center
    height: 40px
    transition: opacity 0.3s, height 0.3s
    &.list-enter, &.list-leave-to
      opacity: 0
      height: 0
    .name
      flex: 1
      font-size: $font-size-medium-x
      color: $color-text-l
    .icon-wrap
      extend-click()
      font-size: $font-size-small
      color: $color-text-d
</style>
