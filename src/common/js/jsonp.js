import originJsonp from 'jsonp'

export default function (url, data, options) {
  if (url.indexOf('?') !== -1) {
    url += '&'
  } else {
    url += '?'
  }
  url += getParams(data)

  return new Promise((resolve, reject) => {
    originJsonp(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
function getParams (data) {
  let url = ''
  for (let key in data) {
    let value = data[key] !== undefined ? data[key] : ''
    url += `&${key}=${encodeURIComponent(value)}`
  }
  return url ? url.slice(1) : ''
}
