// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import '../theme/index.css'
import router from './router'
import http from '@/http'
import store from '@/store'
import VueBus from 'vue-bus'
import filters from '@/common/js/filters/index'
// import VueScrollTo from 'vue-scrollto'
import vuescroll from 'vue-scroll'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueBus)
// Vue.use(VueScrollTo)
Vue.use(vuescroll)

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

