<template>
  <scroll class="suggest" :data="result" :pullup="true" @scrollToEnd="serachMove">
    <ul>
      <li class="item"
          v-for="(item,index) in result"
          :key="index">
        <i class="icon"
           :class="getIconCls(item)"></i>
        <p class="name">{{getName(item)}}</p>
      </li>
      <div class="loading-wrap" v-show="haveMove">
        <loading title=""></loading>
      </div>
    </ul>

  </scroll>
</template>

<script>
import { search, getCancelSearchRequestList, initCancelSearchRequestList } from 'api/search'
import { ERR_OK } from 'api/configs'
import Scroll from 'base/scroll/scroll'
import { createSong, isValiMusic, processSongsUrl } from 'common/js/song'
import Loading from 'base/loading/loading'
import axios from 'axios'

const perpage = 20
const TYPE_SINGER = 'singer'

export default {
  components: { Scroll, Loading },
  props: {
    query: {
      type: String,
      default: ''
    },
    isShowSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      haveMove: true
    }
  },
  created () {
    this.isSearching = false
    // 用于取消请求
    this.cancelRequestList = []
  },
  watch: {
    query (newQuery) {
      this.search()
    }
  },
  methods: {
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    search () {
      this.haveMove = true
      this.page = 1
      this.result = []
      this.isSearching = true

      // 发起搜索前取消之前的搜索请求
      let cancelSearchRequestList = getCancelSearchRequestList()
      if (cancelSearchRequestList.length) {
        cancelSearchRequestList.forEach(cancel => {
          cancel()
        })
        initCancelSearchRequestList()
      }

      search({
        query: this.query,
        page: this.page,
        isZhiDa: this.isShowSinger,
        perpage
      }).then(res => {
        this.isSearching = false
        if (res.code === ERR_OK) {
          this.checkMore(res.data)
          this.getResult(res.data).then(result => {
            this.result = result
            // 确保结果数大于等于perpage是为了确保条数足够进行上拉刷新
            if (this.result.length < perpage) {
              this.serachMove()
            }
          })
        }
      }).catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message)
        }
      })
    },
    checkMore (data) {
      if (data.song.list.length < perpage) {
        this.haveMove = false
      } else {
        this.haveMove = true
      }
    },
    serachMove () {
      if (this.isSearching || !this.haveMove) {
        return
      }
      this.isSearching = true
      this.page++
      return search({
        query: this.query,
        page: this.page,
        isZhiDa: false,
        perpage
      }).then(res => {
        this.isSearching = false
        if (res.code === ERR_OK) {
          this.checkMore(res.data)
          this.getResult(res.data).then(result => {
            this.result = this.result.concat(result)
            // 如果列表可以继续加载，但是结果还没有满perpage条的话继续加载，避免由于加载的数量不足，无法触发上拉加载更多
            if (res.data.song.list.length === perpage && this.result.length < perpage) {
              this.serachMove()
            }
          })
        }
      }).catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message)
        }
      })
    },
    getResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        ret.push({ ...data.zhida, type: TYPE_SINGER })
      }
      // 处理songs，补全缺少的url
      return processSongsUrl(this.normalizeSongs(data.song.list)).then(songs => {
        ret = ret.concat(songs)
        return Promise.resolve(ret)
      })
    },
    normalizeSongs (list) {
      let songs = []
      list.forEach(musicData => {
        if (isValiMusic(musicData)) {
          songs.push(createSong(musicData))
        }
      })
      return songs
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styl/variable'
@import '~styl/mixin'
.suggest
  height: 100%
  overflow: hidden
  padding: 10px 30px 0
  box-sizing: border-box
  .item
    display: flex
    align-items: center
    color: $color-text-d
    font-size: $font-size-medium
    padding-bottom: 20px
    .icon
      margin-right: 16px
    .name
      flex: 1
      overflow: hidden
      no-wrap()
  .loading-wrap
    width: 100%
    text-align: center
</style>
