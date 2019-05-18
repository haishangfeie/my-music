import storage from 'good-storage'
import Song from './song'

const SEARCH_KEY = '__search__'
const PLAY_KEY = '__play__'
const FAVORITE_KEY = '__favorite__'

const MAX_SEARCH_LEN = 15
const MAX_PLAY_LEN = 200
const MAX_FAVORITE_LEN = 200

function insertArr (arr, item, compare, maxLen) {
  let index = arr.findIndex(compare)
  if (index !== -1 && index !== 0) {
    arr.splice(index, 1)
  }
  if (index === 0) {
    return
  } else {
    arr.unshift(item)
  }

  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function removeArr (arr, compare) {
  let index = arr.findIndex(compare)
  if (index !== -1) {
    arr.splice(index, 1)
  }
}
function _saveList (key, val, compare, len) {
  let history = storage.get(key, [])
  insertArr(history, val, compare, len)
  storage.set(key, history)
  return history
}
function _deleteList (key, compare) {
  let history = storage.get(key, [])
  removeArr(history, compare)
  storage.set(key, history)
  return history
}

/** **********搜索历史************/

export function saveSearch (query) {
  return _saveList(
    SEARCH_KEY,
    query,
    item => {
      return item === query
    },
    MAX_SEARCH_LEN
  )
}

export function getSearch () {
  return storage.get(SEARCH_KEY, [])
}

export function delSearchItem (query) {
  return _deleteList(SEARCH_KEY, item => {
    return item === query
  })
}

export function delAllSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

/** **********最近播放********** */
export const savePlay = song => {
  return _saveList(
    PLAY_KEY,
    song,
    item => {
      return item.id === song.id
    },
    MAX_PLAY_LEN
  ).map(item => {
    return new Song(item)
  })
}

export function getPlay () {
  return storage.get(PLAY_KEY, []).map(item => {
    return new Song(item)
  })
}

export function saveFavorite (song) {
  return _saveList(
    FAVORITE_KEY,
    song,
    item => {
      return item.id === song.id
    },
    MAX_FAVORITE_LEN
  ).map(item => {
    return new Song(item)
  })
}

export function delFavoriteItem (song) {
  return _deleteList(FAVORITE_KEY, item => {
    return item.id === song.id
  })
}

export function getFavorite () {
  return storage.get(FAVORITE_KEY, []).map(item => {
    return new Song(item)
  })
}
