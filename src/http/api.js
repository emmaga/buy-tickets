/**
 * Created by Administrator on 2017/6/25 0025.
 */
import axios from 'axios'
import {setLocal, getLocal} from '@/common/js/store'

// 登录
export const login = params => {
  params = Object.assign({action: 'GetToken', projectName: 'xitangdev'}, params)
  return axios.post('/loginOTA', params).then(res => {
    if (!(res.data.rescode === 401 || res.data.rescode !== 200)) {
      let data = res.data
      setLocal('userName', data.userName)
      setLocal('clearToken', data.token)
      setLocal('OTACode', data.OTACode)
      setLocal('account', data.account)
      setLocal('projectName', data.projectName)
    }
  })
}

// 修改用户密码
export const resetOTAUserPassword = params => {
  params = Object.assign({action: 'ResetOTAUserPassword'}, params)
  return axios.post('/otauser', params).then(res => res.data)
}

// 获取账户信息
export const getAccountInfo = params => {
  params = {
    action: 'GetOTADetail',
    data: {
      OTACode: getLocal('OTACode')
    }
  }
  return axios.post('/partners', params).then(res => res.data)
}

// 获取可售商品
export const getProductList = params => {
  params = {
    action: 'GetOTAProducts'
  }
  return axios.post('/otauser', params).then(res => res.data)
}
// 获取商品详情
export const getProductDetail = (saleId) => {
  let params = {
    action: 'GetDetail',
    account: getLocal('account'),
    token: getLocal('clearToken'),
    projectName: getLocal('projectName'),
    saleId: saleId
  }
  return axios.post('/sale', params).then(res => res.data)
}

// 下单
export const placeOrder = data => {
  let params = {
    action: 'OTANewOrder',
    data: data
  }
  return axios.post('/otauser', params).then(res => res.data)
}

// 搜索
export const searchOrder = (data, size, cur) => {
  let params = {
    action: 'GetOTAOrderListByPage',
    sortBy: 'OrderCreateTime', // 成交时间
    orderBy: 'desc', // asc 升序，desc 降序
    count: size, // 一页显示数量
    page: cur, // 当前页
    search: data
  }
  return axios.post('/otauser', params).then(res => res.data)
}

// 退票
export const cancelOrder = (params) => {
  params = Object.assign({action: 'OTACancelOrder'}, params)
  return axios.post('/otauser', params).then(res => res.data)
}

// 游客列表
export const getOrderUserList = (id) => {
  let params = {
    action: 'GetOrderUserList',
    orderId: id
  }
  return axios.post('/otauser', params).then(res => res.data)
}

// 获取用户列表
export const getAdminUserList = () => {
  let params = {
    action: 'GetAdminUserList'
  }
  return axios.post('/otauser', params).then(res => res.data)
}

// 添加用户
export const addUser = (params) => {
  params = Object.assign({
    action: 'AddUser'
  }, params)
  return axios.post('/otauser', params).then(res => res.data)
}

// 更新用户
export const updateUser = (params) => {
  params = Object.assign({
    action: 'UpdateUser'
  }, params)
  return axios.post('/otauser', params).then(res => res.data)
}

// 管理员设置用户密码
export const resetUserPassword = (params) => {
  params = Object.assign({
    action: 'ResetUserPassword'
  }, params)
  return axios.post('/otauser', params).then(res => res.data)
}

// 删除用户
export const deleteUser = (id) => {
  let params = {
    action: 'DeleteUser',
    UserID: id
  }
  return axios.post('/otauser', params).then(res => res.data)
}
