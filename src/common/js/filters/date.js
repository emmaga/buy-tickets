/**
 * Created by Administrator on 2017/6/17 0017.
 */
import moment from 'moment'
function setDate (value) {
  moment.locale('zh-cn')
  return moment(value).format('YYYY-MM-DD')
}

export default setDate
