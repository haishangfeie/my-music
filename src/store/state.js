import { playMode } from 'common/js/config'
import { getSearch, getPlay, getFavorite } from 'common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  rankItem: {},
  searchHistory: getSearch(),
  playHistory: getPlay(),
  favorite: getFavorite()
}
export default state
