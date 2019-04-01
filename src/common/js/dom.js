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

export function getData (el, name, val) {
  let prefix = 'data-'
  name = prefix + name
  if (val !== undefined) {
    el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

let domStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  if (domStyle[transformNames.standard] !== undefined) {
    return 'standard'
  } else {
    for (let key in transformNames) {
      if (domStyle[transformNames[key]] !== undefined) {
        return key
      }
    }
  }
  return false
})()

export function prefixStyle (style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  } else {
    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
  }
}
