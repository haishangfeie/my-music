export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }
  let classList = el.className.split(' ')
  classList.push(className)
  let classStr = classList.join(' ')
  el.className = classStr
}
export function hasClass (el, className) {
  // 方法1
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
