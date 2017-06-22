/**
 * Created by caizb on 2017/6/16.
 */
import Vue from 'vue'
import util from './util.js'
import cardType from './getCardType'
import checkStatus from './getCheckStatus'
import isExpired from './getIsExpired'
import money from './getFenToYuan'
import date from './date'
import dateTime from './dateTime'
import isNot from './isNot'

let filters = {
  checkStatus,
  isExpired,
  cardType,
  dateTime,
  money,
  isNot,
  date
}

util.each(filters, function (value, key) {
  Vue.filter(key, value)
})
