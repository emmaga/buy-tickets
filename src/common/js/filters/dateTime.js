/**
 * Created by Administrator on 2017/6/17 0017.
 */
import moment from 'moment'

function setDateTime (value) {
  moment.locale('zh-cn')
  return moment(new Date(value - 0)).format('YYYY-MM-DD HH:mm:ss')
}

export default setDateTime
