import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login/login'
import home from '@/pages/home/home'
import orderList from '@/pages/orderList/orderList'
import ticketList from '@/pages/ticketList/ticketList'
import {getLocal} from '@/common/js/store'

Vue.use(Router)
const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/login',
    redirect: '/'
  },
  {
    path: '/Home',
    name: 'home',
    component: home,
    meta: {
      requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
    },
    children: [
      {
        path: 'ticketList',
        name: 'ticketList',
        component: ticketList
      },
      {
        path: 'orderList',
        name: 'orderList',
        component: orderList
      }
    ]
  }
]

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (getLocal('clearToken')) {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})

export default router
