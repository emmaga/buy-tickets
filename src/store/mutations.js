/**
 * Created by caizb on 2017/6/19.
 */
import {getLocal, clearLocal} from '@/common/js/store'

export default {
  getUserName (state) {
    state.userName = getLocal('userName')
  },
  delUserName (state) {
    clearLocal('userName')
    state.userName = null
  },
  setAmount (state, data) {
    state.prePayment = data.PrePayment
    state.paymentAmount = data.PaymentAmount
  },
  setSearchResult (state, data) {
    state.searchResult = data.orders
  }
}
