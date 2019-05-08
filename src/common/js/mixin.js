import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'

export const playlistMixin = {
  activated () {
    this.handlePlaylist(this.playlist)
  },
  mounted () {
    this.handlePlaylist(this.playlist)
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
      let cls = ''
      if (this.mode === playMode.sequence) {
        cls = 'icon-sequence'
      } else if (this.mode === playMode.loop) {
        cls = 'icon-loop'
      } else if (this.mode === playMode.random) {
        cls = 'icon-random'
      }
      return cls
    },
    ...mapGetters(['mode'])
  }
}
