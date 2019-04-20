<template>
  <scroll class="list-view-wrap"
          :data="data"
          :probeType="3"
          :listenScroll="true"
          @scroll="onScroll"
          ref="scroll">
    <ul class="groups">
      <li class="group"
          v-for="(group,index) in data"
          :key="index"
          ref="group">
        <h2 class="title">{{group.title}}</h2>
        <ul>
          <li class="item"
              v-for="(item,index) in group.list"
              :key="index" @click="select(item)">
            <img class="avatar"
                 v-lazy="item.picUrl"
                 alt="">
            <div class="name">{{item.name}}</div>
          </li>
        </ul>
      </li>
    </ul>
    <!-- fixed-title -->
    <h2 v-show="fixed"
        class="fixed-title"
        ref="fixedTitle">{{fixedTitleText}}</h2>
    <ul class="shortcut-list-wrap"
        @touchstart.stop.prevent="onShortcutTouchstart"
        @touchmove.stop.prevent="onShortcutTouchmove">
      <li v-for="(item,index) in shortcutList"
          :key="index"
          class="item"
          :class="{current:currentIndex === index}"
          :data-index="index">{{item}}</li>
    </ul>
    <div class="loading-container"
         v-if="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getData } from 'common/js/dom'

// 右侧快速入口每个入口的高度都是18px
const SHORTCUT_ITEM_HEIGHT = 18

// 每个group的title的高度
const GROUP_TITLE_HEIGHT = 30

export default {
  components: {
    Scroll,
    Loading
  },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      currentIndex: 0,
      fixed: false
    }
  },
  computed: {
    shortcutList () {
      return this.data.map(item => {
        return item.title.slice(0, 1)
      })
    },
    fixedTitleText () {
      if (!this.data.length) {
        return ''
      }
      return this.data[this.currentIndex].title
    }
  },
  watch: {
    data () {
      // 确保dom已渲染
      setTimeout(() => {
        this.calcGroupsHight()
      }, 20)
    }
  },
  created () {
    this.touch = {}
    this.touchStartIndex = -1
    this.groupsHeight = []
    this.diff = 0
  },
  methods: {
    onShortcutTouchstart (e) {
      let index = getData(e.target, 'index')
      // 处理边界问题
      if (index === null) {
        return
      }

      // 将index转换为数字
      index *= 1

      this.currentIndex = index
      this._scrollTo()
      this.touch.y1 = e.touches[0].pageY
      this.touchStartIndex = index
    },
    onShortcutTouchmove (e) {
      this.touch.y2 = e.touches[0].pageY
      let offest = (this.touch.y2 - this.touch.y1) / SHORTCUT_ITEM_HEIGHT | 0
      let currentIndex = this.touchStartIndex + offest

      // 处理边界问题
      if (currentIndex < 0) {
        currentIndex = 0
      } else if (currentIndex > this.shortcutList.length - 1) {
        currentIndex = this.shortcutList.length - 1
      }
      this.currentIndex = currentIndex
      this._scrollTo()
    },
    calcGroupsHight () {
      let groups = this.$refs.group
      if (!groups) {
        return
      }
      let height = 0
      let groupsHeight = [height] // 存入第一个的高度为0
      for (let i = 0; i < groups.length; i++) {
        let item = groups[i]
        height += item.clientHeight
        groupsHeight.push(height)
      }
      this.groupsHeight = groupsHeight
    },
    onScroll (pos) {
      let currentScroll = -pos.y
      this.updateCurrentIndexWhenScroll(currentScroll)
      this.updateFixedTitlePos(currentScroll)
    },
    updateFixedTitlePos (currentScroll) {
      let groupsHeight = this.groupsHeight
      for (let i = 0; i < groupsHeight.length; i++) {
        let item = groupsHeight[i]
        if (currentScroll > item - GROUP_TITLE_HEIGHT && currentScroll < item) {
          let diff = currentScroll - (item - GROUP_TITLE_HEIGHT)
          if (this.diff === diff) {
            return
          }
          this.diff = diff
          this.$refs.fixedTitle.style.transform = `translate3d(0,-${diff}px,0)`
          return
        }
      }
      this.diff = 0
      this.$refs.fixedTitle.style.transform = `translate3d(0,0,0)`
    },
    updateCurrentIndexWhenScroll (currentScroll) {
      if (currentScroll < 0) {
        this.currentIndex = 0
        this.fixed = false
        return
      }
      this.fixed = true
      for (let i = 0; i < this.groupsHeight.length - 1; i++) {
        let itemHeight = this.groupsHeight[i]
        let nextItemHeight = this.groupsHeight[i + 1]

        if (currentScroll >= itemHeight && currentScroll < nextItemHeight) {
          this.currentIndex = i
          return
        }
      }
      this.currentIndex = this.groupsHeight.length - 2
    },
    select (item) {
      this.$emit('select', item)
    },
    refresh () {
      this.$refs.scroll.refresh()
    },
    _scrollTo () {
      let index = this.currentIndex
      let scroll = this.$refs.scroll
      let groupArr = this.$refs.group
      scroll.scrollToElement(groupArr[index], 0)
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~styl/variable.styl'
.list-view-wrap
  position: relative
  height: 100%
  .groups
    .group
      .title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .item
        display: flex
        padding: 20px 0 0 30px
        align-items: center
        .avatar
          flex: 0 0 50px
          width: 50px
          height: 50px
          margin-right: 20px
          border-radius: 50%
        .name
          flex: 1
          color: $color-text-l
          font-size: $font-size-medium
  .fixed-title
    position: absolute
    top: 0
    left: 0
    right: 0
    height: 30px
    line-height: 30px
    padding-left: 20px
    font-size: $font-size-small
    color: $color-text-l
    background: $color-highlight-background
  .shortcut-list-wrap
    position: absolute
    padding: 20px 0
    top: 50%
    right: 0
    transform: translateY(-50%)
    text-align: center
    background: $color-background-d
    z-index: 10
    border-radius: 10px
    font-family: Helvetica
    width: 20px
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: #ffcd32
  .loading-container
    position: absolute
    top: 50%
    left 0
    width 100%
    transform: translateY(-50%)
</style>
