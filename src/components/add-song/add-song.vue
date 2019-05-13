<template>
  <transition name="slide">
    <div class="add-song"
         v-show="showFlag"
         @click.stop>
      <header class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close-wrap"
             @click="hide">
          <i class="icon-close"></i>
        </div>
      </header>
      <div class="search-box-wrap">
        <search-box placeholder="搜索歌曲"
                    @query="onquery"
                    ref="searchBox"></search-box>
      </div>
      <div class="shortcut"
           v-show="!query">
        <div class="switches-wrap">
          <switches :titleList="titleList"
                    :currentIndex="currentIndex"
                    @select="switchTab"></switches>
        </div>
        <scroll ref="listWrap"
                class="list-wrap"
                :data="scrollData">
          <div>
            <song-list v-show="currentIndex===0"
                       :songs="playHistory"
                       @select="selectItem"></song-list>
            <div class="search-list-wrap"
                 v-show="currentIndex===1">
              <search-list :list="searchHistory"
                           @select="addQuery"
                           @deleteItem="delSearchHistoryItem"></search-list>
            </div>
          </div>
        </scroll>
      </div>
      <div ref="searchResult"
           class="search-result"
           v-show="query">
        <suggest ref="suggest"
                 :query="query"
                 :isShowSinger="false"
                 @scrollStart="inputBlur"
                 @select="onSelect"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from '@@/suggest/suggest'
import { searchMixin } from 'common/js/mixin'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import { mapGetters, mapActions } from 'vuex'
import SearchList from '@@/search-list/search-list'
import TopTip from 'base/top-tip/top-tip'

export default {
  mixins: [searchMixin],
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip
  },
  data () {
    return {
      query: '',
      showFlag: false,
      titleList: [
        {
          name: '最近播放'
        },
        {
          name: '播放历史'
        }
      ],
      currentIndex: 0
    }
  },
  computed: {
    scrollData () {
      return this.playHistory.concat(this.searchHistory)
    },
    ...mapGetters([
      'playHistory'
    ])
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        this.nextTickRefresh()
      }
    }
  },
  methods: {
    show () {
      this.showFlag = true
      this.nextTickRefresh()
    },
    refresh () {
      this.$refs.listWrap.refresh()
    },
    nextTickRefresh () {
      this.$nextTick(() => {
        this.refresh()
      })
    },
    hide () {
      this.showFlag = false
      this.$emit('hide')
    },
    switchTab (index) {
      this.currentIndex = index
      this.nextTickRefresh()
    },
    selectItem (song, index) {
      // index为0的是当前在播放的歌曲
      if (index !== 0) {
        this.insertSong(song)
        this.$refs.topTip.show()
      }
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
    onSelect (item) {
      this.saveHistory()
      this.$refs.topTip.show()
    },
    ...mapActions([
      'insertSong'
    ])
  }
}
</script>

<style lang="stylus" scoped>
@import '~styl/variable'
@import '~styl/mixin'
.add-song
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  z-index: 200
  background: #222
  transition: transform 0.3s
  &.slide-enter, &.slide-leave-to
    transform: translate3d(100%, 0, 0)
  .header
    position: relative
    height: 44px
    text-align: center
    .title
      line-height: 44px
      font-size: $font-size-large
      color: $color-text
    .close-wrap
      position: absolute
      top: 12px
      right: 20px
      .icon-close
        font-size: 20px
        color: $color-theme
  .search-box-wrap
    margin: 20px
  .shortcut
    .switches-wrap
      width: 240px
      margin: 0 auto
    .list-wrap
      position: absolute
      top: 165px
      bottom: 0
      width: 100%
      overflow: hidden
      .search-list-wrap
        padding: 20px 30px
  .search-result
    position: fixed
    top: 124px
    bottom: 0
    width: 100%
  .tip-title
    text-align: center
    padding: 18px 0
    font-size: 0
    .icon-ok
      font-size: $font-size-medium
      color: $color-theme
      margin-right: 4px
    .text
      font-size: $font-size-medium
      color: $color-text
</style>
