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
      recommends: []
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
        console.log(res)
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
  .block
    .title
      height: 65px
      text-align: center
      line-height: 65px
      color: $color-theme
      font-size: $font-size-medium
</style>
