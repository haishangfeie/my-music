<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text"
           class="search-input"
           v-model="query"
           :placeholder="placeholder">
    <i @click="clear"
       v-show="query"
       class="icon-dismiss"></i>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  created () {
    this.$watch('query', (newVal) => {
      this.$emit('query', this.query)
    })
  },
  methods: {
    clear () {
      this.query = ''
    },
    setQuery (query) {
      this.query = query
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styl/variable'
.search-box
  display: flex
  height: 40px
  padding: 0 6px
  align-items: center
  background: $color-highlight-background
  border-radius: 6px
  .icon-search
    font-size: 24px
    color: $color-dialog-background
  .search-input
    flex: 1
    margin: 0 5px
    line-height: 18px
    background: $color-highlight-background
    color: $color-text
    font-size: $font-size-medium
    outline: 0
  .icon-dismiss
    font-size: $font-size-medium-x
    color: $color-dialog-background
</style>
