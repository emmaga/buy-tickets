// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import '../theme/index.css'
import router from './router'
import http from '@/http'
import store from '@/store'
import VueBus from 'vue-bus'
import filters from '@/common/js/filters/index'

Vue.config.productionTip = false

Vue.use(VueBus)
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  http,
  store,
  filters,
  template: '<App/>',
  components: {App}
})

