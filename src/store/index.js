import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  userName: '',
  prePayment: 0,
  paymentAmount: 0,
  searchResult: {}
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
