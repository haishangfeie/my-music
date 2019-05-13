import { playMode } from 'common/js/config'
import { getSearch, getPlay } from 'common/js/cache'

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
  playHistory: getPlay()
}
export default state
