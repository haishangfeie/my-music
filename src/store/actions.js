import * as types from './mutation-typte'
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/config'
import { findSongIndex } from 'common/js/song'

export const selectPlay = ({ commit, state }, { list, index }) => {
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    index = findSongIndex(randomList, list[index])
    commit(types.SET_PLAYLIST, randomList)
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
}

export const playRandom = ({ commit }, { list }) => {
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)

  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, shuffle(list))
  commit(types.SET_CURRENT_INDEX, 0)
}

export const insertSong = ({ commit, state }, { song }) => {
  // 插入歌曲，需要改变playlist/sequenceList/currentIndex/playing/fullScreen
  // 插入歌曲，如果歌曲已在列表中，先删除列表中对应的歌曲，往播放列表中插入歌曲，并将索引指向该歌曲
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let currentSong = currentIndex !== -1 ? playlist[currentIndex] : null

  // 先确保playing中删除了对应的歌曲
  let delPlaylistIndex = findSongIndex(playlist, song)
  if (delPlaylistIndex !== -1) {
    playlist.splice(delPlaylistIndex, 1)

    // delPlaylistIndex不为-1时，说明歌曲列表是有歌曲的，因此currentIndex一定不是-1
    if (delPlaylistIndex <= currentIndex) {
      currentIndex--
    }
  }

  // 让playlist中插入歌曲,currentIndex指向插入的歌曲，对于空列表+1正好是0
  currentIndex++
  playlist.splice(currentIndex, 0, song)

  // 确保sequenceList中删除待插入歌曲
  let delSeqListIndex = findSongIndex(sequenceList, song)
  let findSeqCurrentSongIndex = currentSong
    ? findSongIndex(sequenceList, currentSong)
    : -1
  if (delSeqListIndex !== -1) {
    sequenceList.splice(delSeqListIndex, 1)

    // delSeqListIndex不为-1时，说明歌曲列表是有歌曲的，因此currentSong是一定存在的，findSeqCurrentSongIndex不可能是-1
    if (delSeqListIndex <= findSeqCurrentSongIndex) {
      findSeqCurrentSongIndex--
    }
  }

  // 给sequenceList插入歌曲
  findSeqCurrentSongIndex++
  sequenceList.splice(findSeqCurrentSongIndex, 0, song)

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
