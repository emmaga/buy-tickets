var util = {}
util.isArray = function (obj) {
  return Array.isArray(obj)
}
util.each = function (obj, callback) {
  var i,
    len
  if (util.isArray(obj)) {
    for (i = 0, len = obj.length; i < len; i++) {
      if (callback(obj[i], i, obj) === false) {
        break
      }
    }
  } else {
    for (i in obj) {
      if (callback(obj[i], i, obj) === false) {
        break
      }
    }
  }
  return obj
}

export default util
