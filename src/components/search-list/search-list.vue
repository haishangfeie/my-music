<template>
  <ul class="search-list">
    <li class="search-list-item" v-for="(item,index) in list" :key="index" @click="selectItem(item)">
      <span class="name">{{item}}</span>
      <div class="icon-wrap" @click.stop="deleteItem(item)">
        <i class="icon-delete"></i>
      </div>
    </li>
  </ul>
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
    .name
      flex: 1
      font-size:$font-size-medium-x
      color: $color-text-l
    .icon-wrap
      extend-click()
      font-size: $font-size-small
      color: $color-text-d
</style>
