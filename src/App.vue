<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <router-view></router-view>
  </div>
</template>
<script>
import MHeader from '@@/m-header/m-header'
import Tab from '@@/tab/tab'
export default {
  components: {
    MHeader,
    Tab
  }
}
</script>
<style lang="stylus">
</style>
