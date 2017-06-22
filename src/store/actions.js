/**
 * Created by caizb on 2017/6/19.
 */
import axios from 'axios'
import {getLocal} from '@/common/js/store'

export default {
  login ({commit}, payload) {
    return axios.post('/loginOTA', {
      action: 'GetToken',
      projectName: 'xitangdev',
      OTACode: payload.OTACode,
      account: payload.account,
      password: payload.password
    })
      .then((response) => {
        if (!(response.data.rescode === 401 || response.data.rescode !== 200)) {
          let data = response.data
          commit('setAccount', data)
        }
      })
  },
  getAccount ({commit}) {
    return axios.post('/partners', {
      action: 'GetOTADetail',
      data: {
        OTACode: getLocal('OTACode')
      }
    }).then((response) => {
      commit('setAmount', response.data.data)
    })
  },
  getProduct ({commit}) {
    return axios.post('/otauser', {
      action: 'GetOTAProducts',
      OTACode: getLocal('OTACode')
    }).then((response) => {
      commit('setProductList', response.data)
    })
  },
  search ({commit}, payload) {
    return axios.post('/otauser', {
      action: 'GetOTAOrderListByPage',
      sortBy: 'OrderCreateTime', // 成交时间
      orderBy: 'desc', // asc 升序，desc 降序
      count: payload.pageSize, // 一页显示数量
      page: payload.currentPage, // 当前页
      search: {
        checkStatus: payload.checkStatus,
        isExpired: payload.isExpired,
        orderCreateDateStart: payload.orderCreateDateStart,
        orderCreateDateEnd: payload.orderCreateDateEnd,
        visitDateStart: payload.visitDateStart,
        visitDateEnd: payload.visitDateEnd,
        checkDateStart: payload.checkDateStart,
        checkDateEnd: payload.checkDateEnd,
        bookMobile: payload.bookMobile,
        bookPerson: payload.bookPerson,
        orderTicketCode: payload.orderTicketCode,
        parterOrderId: payload.parterOrderId,
        orderId: payload.orderId,
        goodsName: payload.goodsName,
        bookerIDType: payload.bookerIDType,
        bookerID: payload.bookerID
      }
    })
      .then((response) => {
        commit('setSearchResult', response.data)
      })
  }
}
