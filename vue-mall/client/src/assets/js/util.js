function setCookie (cname, cvalue, exdays = 7) { // 7天
  let d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  document.cookie = `${cname}=${cvalue};expires=${d.toUTCString()}`
}

function getCookie (cname) {
  let arr
  let reg = new RegExp(`(^| )${cname}=([^;]*)(;|$)`)
  arr = document.cookie.match(reg)
  if (arr) {
    return (arr[2])
  } else {
    return null
  }
}

function delCookie (cname) {
  let d = new Date()
  d.setTime(d.getTime() - 1)
  let cvalue = getCookie(cname)
  if (cvalue) {
    document.cookie = `${cname}=${cvalue};expires=${d.toUTCString()}`
  }
}

function deepCopy (val) {
  let newVal
  if (typeof val !== 'object') {
    return val
  } else {
    newVal = JSON.parse(JSON.stringify(val))
  }
  // for (let i in val) {
  //   if (val.hasOwnProperty(i)) {
  //     // console.log(typeof val[i])
  //     let itemType = typeof val[i];
  //     if (itemType !== 'object') {
  //       newVal[i] = val[i]
  //     } else if (val[i] === null) {
  //       newVal[i] = null
  //     } else {
  //       newVal[i] = deepCopy(val[i])
  //     }
  //   }
  // }
  return newVal
}

export {
  setCookie,
  getCookie,
  delCookie,
  deepCopy
}
