import * as types from './mutation-typte'
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/config'
import { findSongIndex } from 'common/js/song'
import {
  saveSearch,
  delSearchItem,
  delAllSearch,
  savePlay,
  saveFavorite,
  delFavoriteItem
} from 'common/js/cache'

/**
 * 播放歌曲列表，从index开始播放
 */
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

/**
 * 随机播放全部
 */
export const playRandom = ({ commit }, { list }) => {
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)

  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, shuffle(list))
  commit(types.SET_CURRENT_INDEX, 0)
}

/**
 * 插入并播放歌曲
 */
export const insertSong = ({ commit, state }, song) => {
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

/**
 * 保存搜索历史
 */
export const saveSearchHistory = ({ commit }, query) => {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

/**
 * 删除搜索历史item
 */
export const delSearchHistoryItem = ({ commit }, query) => {
  commit(types.SET_SEARCH_HISTORY, delSearchItem(query))
}

/**
 * 清空搜索历史
 */
export const clearSearchHistory = ({ commit }) => {
  commit(types.SET_SEARCH_HISTORY, delAllSearch())
}

export const deleteOneSong = ({ commit, state }, song) => {
  let sequenceList = state.sequenceList.slice()
  let playlist = state.playlist.slice()
  let currentIndex = state.currentIndex

  let sIndex = findSongIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  let pIndex = findSongIndex(playlist, song)
  playlist.splice(pIndex, 1)

  // 判断currentIndex是否需要调整
  if (currentIndex > pIndex) {
    currentIndex--
  }
  // 如果currentIndex是最后一首歌，恰好删的就是最后一首歌，切换为第一首歌
  if (playlist.length === currentIndex) {
    currentIndex = 0
  }
  // 如果歌曲列表已经空了，currentIndex为-1
  if (playlist.length === 0) {
    currentIndex = -1
  }
  let playingState = playlist.length > 0

  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYING_STATE, playingState)
}

/**
 * 清空播放列表
 */
export function clearSongList ({ commit }) {
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

/**
 * 切换播放模式，同时要将歌曲列表按照模式调整
 */
export const switchMode = ({ commit, state }, newMode) => {
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let currentSong = state.playlist[currentIndex]
  // 默认先设置为与sequenceList一致
  let playlist = sequenceList

  if (newMode === playMode.random) {
    playlist = shuffle(sequenceList)
  }

  currentIndex = findSongIndex(playlist, currentSong)

  commit(types.SET_MODE, newMode)
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
}

/**
 * 保存最近播放
 */
export function savePlayHistory ({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

/**
 * 添加收藏
 */
export function saveFavoriteList ({ commit }, song) {
  commit(types.SET_FAVORITE, saveFavorite(song))
}

/**
 * 取消收藏
 */
export function deleteFavoriteItem ({ commit }, song) {
  commit(types.SET_FAVORITE, delFavoriteItem(song))
}
