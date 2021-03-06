<template>
  <div class="search-wrap">
    <div class="search-box-wrap">
      <search-box @query="onquery"
                  ref="searchBox"></search-box>
    </div>
    <scroll ref="shortcutWrap"
            class="shortcut-wrap"
            :data="shortcut"
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
        <div class="search-history"
             v-show="searchHistory.length">
          <div class="history-header">
            <h2 class="title">搜索历史</h2>
            <div class="icon-wrap"
                 @click="confirmClear">
              <i class="icon-clear"></i>
            </div>
          </div>
          <search-list :list="searchHistory"
                       @select="addQuery"
                       @deleteItem="delSearchHistoryItem"></search-list>
        </div>
      </div>
    </scroll>
    <div ref="searchResult"
         class="search-result"
         v-show="query">
      <suggest ref="suggest"
               :query="query"
               @scrollStart="inputBlur"
               @select="saveHistory"></suggest>
    </div>
    <confirm ref="confirm"
             text="是否清空所有搜索历史"
             confirmBtnText="清空"
             @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/configs'
import Suggest from '@@/suggest/suggest'
import { mapActions } from 'vuex'
import SearchList from '@@/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import { playlistMixin, searchMixin } from 'common/js/mixin'

export default {
  mixins: [playlistMixin, searchMixin],
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  },
  data: function () {
    return {
      hotKeys: [],
      query: ''
    }
  },
  created () {
    this._getHotKey()
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '60px' : ''

      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()

      this.$refs.shortcutWrap.$el.style.bottom = bottom
      this.$refs.shortcutWrap.refresh()
    },
    confirmClear () {
      this.$refs.confirm.show()
    },
    onquery (query) {
      this.onqueryCommon('query', query)
    },
    addQuery (query) {
      this.addQueryCommon(this.$refs.searchBox, query)
    },
    inputBlur () {
      this.inputBlurCommon(this.$refs.searchBox)
    },
    _getHotKey () {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKeys = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        this.$nextTick(() => {
          this.$refs.shortcutWrap.refresh()
        })
      }
    }
  },
  computed: {
    shortcut () {
      return this.hotKeys.concat(this.searchHistory)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styl/variable'
@import '~styl/mixin'
.search-wrap
  .search-box-wrap
    margin: 20px
  .shortcut-wrap
    position: fixed
    top: 168px
    bottom: 0
    overflow: hidden
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
    width: 100%
  .search-history
    position: relative
    margin: 0 20px
    color: $color-text-l
    .history-header
      height: 40px
      line-height: 40px
      font-size: $font-size-medium
    .icon-wrap
      position: absolute
      right: -10px
      top: 0
      padding: 0 10px
      .icon-clear
        font-size: $font-size-medium
        line-height: 40px
</style>
