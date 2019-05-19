import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { findSongIndex } from 'common/js/song'

export const playlistMixin = {
  activated () {
    this.$nextTick(() => {
      this.handlePlaylist(this.playlist)
    })
  },
  mounted () {
    this.$nextTick(() => {
      this.handlePlaylist(this.playlist)
    })
  },
  computed: {
    ...mapGetters(['playlist'])
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist methods')
    }
  }
}

export const PlayerMixin = {
  methods: {
    changeMode () {
      let mode = (this.mode + 1) % 3
      this.switchMode(mode)
    },
    ...mapMutations({
      setMode: 'SET_MODE'
    }),
    ...mapActions(['switchMode'])
  },
  computed: {
    modeIconCls () {
      const modeIconClsList = {
        [playMode.sequence]: 'icon-sequence',
        [playMode.loop]: 'icon-loop',
        [playMode.random]: 'icon-random'
      }
      return modeIconClsList[this.mode] || ''
    },
    ...mapGetters(['mode'])
  }
}

export const searchMixin = {
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    onqueryCommon (key, query) {
      this[key] = query
    },
    addQueryCommon (component, query) {
      component.setQuery(query)
    },
    inputBlurCommon (component) {
      component.blur()
    },
    saveHistory () {
      this.saveSearchHistory(this.query)
    },
    ...mapActions(['saveSearchHistory', 'delSearchHistoryItem'])
  }
}

export const favoriteMixin = {
  methods: {
    favoriteCls (song) {
      let index = findSongIndex(this.favorite, song)
      if (index !== -1) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    toggleFavorite (song) {
      let index = findSongIndex(this.favorite, song)
      if (index !== -1) {
        this.deleteFavoriteItem(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    ...mapActions(['saveFavoriteList', 'deleteFavoriteItem'])
  },
  computed: {
    ...mapGetters(['favorite'])
  }
}
