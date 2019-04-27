<template>
  <div class="search-wrap">
    <div class="search-box-wrap">
      <search-box @query="onquery"
                  ref="searchBox"></search-box>
    </div>
    <div class="shortcut-wrap"
         v-show="!query">
      <div>
        <div class="hot-key">
          <h2 class="title">热门搜索</h2>
          <ul class="hot-key-list">
            <li class="hot-item"
                v-for="(item,index) in hotKeys"
                :key="index"
                @click="addQuery(item.k)">{{item.k}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result"
         v-show="query">
      <suggest :query="query"></suggest>
    </div>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/configs'
import Suggest from '@@/suggest/suggest'

export default {
  components: {
    SearchBox,
    Suggest
  },
  data: function () {
    return {
      query: '',
      hotKeys: []
    }
  },
  created () {
    this._getHotKey()
  },
  methods: {
    onquery (query) {
      this.query = query
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    _getHotKey () {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKeys = res.data.hotkey.slice(0, 10)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styl/variable'
.search-wrap
  .search-box-wrap
    margin: 20px
  .shortcut-wrap
    position: fixed
    top: 168px
    bottom: 0
    .hot-key
      margin: 0 20px 20px 20px
      .title
        margin-bottom: 20px
        font-size: $font-size-medium
        color: $color-text-l
      .hot-key-list
        .hot-item
          display: inline-block
          padding: 5px 10px
          margin: 0 20px 10px 0
          border-radius: 6px
          background: #333
          font-size: $font-size-medium
          color: $color-text-d
  .search-result
    position: fixed
    top: 168px
    bottom: 0
    width 100%
</style>
