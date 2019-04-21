<template>
  <div>
    <scroll class="rank"
            :data="rankList" ref="scroll">
      <ul class="rank-list">
        <li class="rank-item-wrap"
            v-for="(item,index) in rankList"
            :key="index"
            @click="selectItem(item)">
          <img width="100"
               height="100"
               class="cover"
               v-lazy="item.picUrl">
          <div class="content">
            <ol v-for="(song,idx) in item.songList"
                :key="idx">
              <li class="music">
                <span class="music-index">{{idx+1}}</span>
                <span>{{song.songname}}-{{song.singername}}</span>
              </li>
            </ol>
          </div>
        </li>
      </ul>
      <div class="loading-wrap">
        <loading v-show="!rankList.length"></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRankList } from 'api/rank'
import { ERR_OK } from 'api/configs'
import Scroll from 'base/scroll/scroll'
import { mapMutations } from 'vuex'
import Loading from 'base/loading/loading'
import { playlistMixin } from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      rankList: []
    }
  },
  components: {
    Scroll,
    Loading
  },
  created () {
    this._getRankList()
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem (item) {
      this.$router.push({
        name: 'rankDetail',
        params: {
          id: item.id
        }
      })
      this.setRankItem(item)
    },
    _getRankList () {
      getRankList().then(res => {
        if (res.code === ERR_OK) {
          this.rankList = res.data.topList
        }
      })
    },
    ...mapMutations({
      setRankItem: 'SET_RANK_ITEM'
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~styl/variable'
@import '~styl/mixin'
.rank
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  overflow: hidden
  .rank-list
    margin: 0 20px
    .rank-item-wrap
      display: flex
      padding-top: 20px
      width: 100%
      &:last-child
        padding-bottom: 20px
      // .cover
      .content
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        height: 100px
        padding: 0 20px
        overflow: hidden
        background: $color-highlight-background
        color: $color-text-d
        font-size: $font-size-small
        .music
          line-height: 26px
          no-wrap()
          .music-index
            margin-right: 3px
  .loading-wrap
    position: absolute
    top: 50%
    left 0
    width 100%
    transform: translateY(-50%)
    text-align: center
</style>
