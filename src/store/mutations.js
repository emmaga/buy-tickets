/**
 * Created by caizb on 2017/6/19.
 */
import {setLocal, getLocal, clearLocal} from '@/common/js/store'

export default {
  getUserName (state) {
    state.userName = getLocal('userName')
  },
  delUserName (state) {
    clearLocal('userName')
    state.userName = null
  },
  setAccount (state, data) {
    setLocal('userName', data.userName)
    setLocal('clearToken', data.token)
    setLocal('OTACode', data.OTACode)
    setLocal('account', data.account)
    setLocal('projectName', data.projectName)
    state.userName = data.userName
  },
  setAmount (state, data) {
    state.prePayment = data.PrePayment
    state.paymentAmount = data.PaymentAmount
  },
  setProductList (state, data) {
    state.productList = data.ProductList
  },
  setSearchResult (state, data) {
    state.searchResult = data.orders
  }
}
