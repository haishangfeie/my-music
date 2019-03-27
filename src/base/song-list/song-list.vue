<template>
  <ul class="song-list">
    <li class="song"
        v-for="(song,index) in songs"
        :key="index">
      <h2 class="name">{{song.name}}</h2>
      <div class="desc">{{getDesc(song)}}</div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    getDesc (song) {
      if (!song) {
        return ''
      }
      let { singer = '', album = '' } = song
      return `${singer}·${album}`
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~styl/variable'
.song-list
  padding: 20px 0
  .song
    display: flex
    flex-direction: column
    justify-content: center
    height: 64px
    padding: 0 30px
    font-size: $font-size-medium
    .name
      text-overflow: ellipsis
      white-space: nowrap
      overflow: hidden
      color: $color-text
    .desc
      text-overflow: ellipsis
      overflow: hidden
      white-space: nowrap
      margin-top: 4px
      color: $color-text-d
</style>
