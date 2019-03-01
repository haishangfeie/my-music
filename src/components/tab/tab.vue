<template>
  <div class="c-tab">
    <router-link class="tab-item"
                 tag="div"
                 :to="{name:'recommend'}">
      <span class="text">推荐</span>
    </router-link>
    <router-link class="tab-item"
                 tag="div"
                 :to="{name:'singer'}">
      <span class="text">歌手</span>
    </router-link>
    <router-link class="tab-item"
                 tag="div"
                 :to="{name:'rank'}">
      <span class="text">排行</span>
    </router-link>
    <router-link class="tab-item"
                 tag="div"
                 :to="{name:'search'}">
      <span class="text">搜索</span>
    </router-link>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="stylus">
@import '~styl/variable'
.c-tab
  display: flex
  text-align: center
  .tab-item
    overflow: hidden
    flex: 1
    height: 44px
    .text
      display inline-block
      padding:15px 0 5px
      line-height: $font-size-medium
      font-size: $font-size-medium
      color: rgba(255, 255, 255, 0.5)
    &.router-link-active
      .text
        color: #ffcd32
        border-bottom: 2px solid #ffcd32
</style>
