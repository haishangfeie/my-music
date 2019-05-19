<template>
  <ul class="song-list">
    <li @click="selectItem(song,index)"
        class="song"
        v-for="(song,index) in songs"
        :key="index">
      <div v-if="isRank"
           class="rank">
        <span :class="rankCls(index)">{{rankText(index)}}</span>
      </div>
      <div class="content">
        <h2 class="name">{{song.name}}</h2>
        <div class="desc">{{getDesc(song)}}</div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    isRank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getDesc(song) {
      if (!song) {
        return ''
      }
      let { singer = '', album = '' } = song
      return `${singer}·${album}`
    },
    selectItem(item, index) {
      this.$emit('select', item, index)
    },
    rankCls(index) {
      if (index < 3) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    },
    rankText(index) {
      if (index < 3) {
        return ''
      } else {
        return index + 1
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~styl/variable'
@import '~styl/mixin'
.song-list
  padding: 20px 0
  .song
    display: flex
    align-items: center
    padding: 0 30px
    .rank
      flex: 0 0 25px
      width: 25px
      margin-right: 30px
      text-align: center
      .icon
        display: block
        width: 25px
        height: 24px
        background-size: 25px 24px
        &.icon0
          bg-image('./first')
        &.icon1
          bg-image('./second')
        &.icon2
          bg-image('./third')
      .text
        color: $color-theme
        font-size: $font-size-large
    .content
      flex: 1
      display: flex
      flex-direction: column
      justify-content: center
      height: 64px
      font-size: $font-size-medium
      overflow: hidden
      .name
        text-overflow: ellipsis
        white-space: nowrap
        overflow: hidden
        color: $color-text
      .desc
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        margin-top: 10px
        color: $color-text-d
</style>
