<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>
<script>
import MHeader from '@@/m-header/m-header'
import Tab from '@@/tab/tab'
import Player from '@@/player/player'
export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>
<style lang="stylus">
</style>
