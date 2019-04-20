import { mapGetters } from 'vuex'
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
