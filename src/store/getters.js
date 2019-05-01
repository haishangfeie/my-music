export const singer = state => {
  return state.singer
}

export const playing = state => {
  return state.playing
}

export const fullScreen = state => {
  return state.fullScreen
}

export const playlist = state => {
  return state.playlist
}

export const sequenceList = state => {
  return state.sequenceList
}

export const mode = state => {
  return state.mode
}

export const currentIndex = state => {
  return state.currentIndex
}

export const currentSong = state => {
  return state.playlist[state.currentIndex] || {}
}

export const disc = state => {
  return state.disc
}

export const rankItem = state => {
  return state.rankItem
}

export const searchHistory = state => {
  return state.searchHistory
}
