<template>
  <div class="recommend">
    <div v-if="recommends.length"
         class="slider-wrap">
      <slider>
        <div v-for="(item,index) in recommends"
             :key="index">
          <a :href="item.linkUrl">
            <img :src="item.picUrl">
          </a>
        </div>
      </slider>
    </div>
    <div class="block">
      <h1 class="title">热门歌单推荐</h1>
      <ul class="disc-list-wrap">
        <li class="disc-song"
            v-for="(item,index) in discList"
            :key="index">
          <img class="cover"
               :src="item.imgurl"
               alt="">
          <div class="content">
            <h2 class="name">{{item.creator.name}}</h2>
            <p class="dissname">{{item.dissname}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Slider from 'base/slider/slider'
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/configs'
export default {
  components: {
    Slider
  },
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  created () {
    this._getRecommend()
    this._getDescList()
  },

  methods: {
    _getRecommend () {
      getRecommend()
        .then(res => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
    },
    _getDescList () {
      getDiscList().then(res => {
        this.discList = res.data.list
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~styl/variable'
.recommend
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .block
    .title
      height: 65px
      text-align: center
      line-height: 65px
      color: $color-theme
      font-size: $font-size-medium
    .disc-list-wrap
      .disc-song
        display: flex
        padding: 0 20px 20px 20px
        .cover
          width: 60px
          height: 60px
          flex: 0 0 60px
          margin-right: 20px
        .content
          flex: 1
          display: flex
          flex-direction: column
          justify-content center
          .name
            margin-bottom: 10px
            font-size:$font-size-medium
            color:$color-text
          .dissname
            color:$color-text-d
            font-size: $font-size-medium
</style>
