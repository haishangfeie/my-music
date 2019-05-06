import storage from 'good-storage'
const SEARCH_KEY = '__search__'
const MAX_LEN = 15
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

export function saveSearch (query) {
  let history = storage.get(SEARCH_KEY, [])
  insertArr(
    history,
    query,
    item => {
      return item === query
    },
    MAX_LEN
  )
  storage.set(SEARCH_KEY, history)
  return history
}

export function getSearch () {
  return storage.get(SEARCH_KEY, [])
}

export function delSearchItem (query) {
  let history = storage.get(SEARCH_KEY, [])
  removeArr(history, item => {
    return item === query
  })
  storage.set(SEARCH_KEY, history)
  return history
}

export function delAllSearch () {
  storage.remove(SEARCH_KEY)
  return []
}
