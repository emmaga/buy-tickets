/**
 * Created by caizb on 2017/6/19.
 */
import {getAccountInfo} from '../http/api'

export default {
  getAccount ({commit}) {
    return getAccountInfo().then((obj) => {
      commit('setAmount', obj.data)
    })
  }
}
