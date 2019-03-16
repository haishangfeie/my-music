<template>
  <div class="container">
    <list-view :data="singerList" @select="toDetail"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import listView from 'base/list-view/list-view'
import { getSingerList } from 'api/singer'
import Singer from 'common/js/singer'
import { mapMutations } from 'vuex'
const ERR_OK = 0
const HOT_TITLE = '热门'
const HOT_LIST_LEN = 10

export default {
  data () {
    return {
      singerList: []
    }
  },
  components: {
    listView
  },
  created () {
    this._getSingerList()
  },
  methods: {
    toDetail (singer) {
      this.setSinger(singer)
      this.$router.push({ path: `/singer/${singer.id}` })
    },
    mapSingerList (list) {
      let map = {
        hot: {
          title: HOT_TITLE,
          list: []
        }
      }
      list.forEach((singer, index) => {
        if (index < HOT_LIST_LEN) {
          map.hot.list.push(new Singer({ id: singer.Fsinger_mid, name: singer.Fsinger_name }))
        }
        if (!map[singer.Findex]) {
          map[singer.Findex] = {
            title: singer.Findex,
            list: []
          }
        }
        map[singer.Findex].list.push(new Singer({ id: singer.Fsinger_mid, name: singer.Fsinger_name }))
      })

      // 将对象转换为所需要的数据数据
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (key === 'hot') {
          hot.push(val)
        } else if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        }
      }
      // 排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    _getSingerList () {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singerList = this.mapSingerList(res.data.list)
        }
      })
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style scoped lang="stylus">
.container
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  overflow: hidden
</style>
