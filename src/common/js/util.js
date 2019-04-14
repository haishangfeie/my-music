function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function shuffle (arr) {
  let _arr = arr.slice()
  _arr.forEach((item, index) => {
    let randomIndex = getRandomInt(0, _arr.length - 1)
    let temp = _arr[randomIndex]
    _arr[randomIndex] = _arr[index]
    _arr[index] = temp
  })
  return _arr
}
