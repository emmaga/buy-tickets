/**
 * Created by Administrator on 2017/6/17 0017.
 */
function getIsExpired (value) {
  switch (value) {
    case 'yes':
      return '已过期'
    case 'no':
      return '未过期'
  }
}

export default getIsExpired
