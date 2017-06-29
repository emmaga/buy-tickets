import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import router from '@/router'
import store from '@/store'
import {getLocal, clearLocal} from '@/common/js/store'

axios.defaults.baseURL = 'http://otatest.cleartv.cn/ota_backend/v1'

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (getLocal('clearToken')) {
    config.data.token = getLocal('clearToken')
    config.data.projectName = getLocal('projectName')
    config.data.OTACode = getLocal('OTACode')
    config.data.account = getLocal('account')
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  let statusCode = response.data.rescode ? response.data.rescode : response.data.status
  // 对响应数据做些事
  if (statusCode === 401) {
    ElementUI.Message({
      showClose: true,
      message: response.data.errInfo,
      type: 'error'
    })
    clearLocal('clearToken')
    store.commit('delUserName')
    router.push('/login')
  } else if (statusCode !== 200) {
    ElementUI.Message({
      showClose: true,
      message: response.data.errInfo,
      type: 'error'
    })
  } else {
    return response
  }
}, function (error) {
  // 请求错误时做些事
  ElementUI.Message({
    showClose: true,
    message: '连接服务器出错 ' + error,
    type: 'error'
  })
  // return Promise.reject(error)
})

// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.axios = axios

export default axios
