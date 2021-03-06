import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login/login'
import home from '@/pages/home/home'
import NotFound from '@/pages/404.vue'
import orderList from '@/pages/orderList/orderList'
import ticketList from '@/pages/ticketList/ticketList'
import userList from '@/pages/userList/userList'
import {getLocal} from '@/common/js/store'

Vue.use(Router)
const routes = [
  {
    path: '/',
    name: 'login',
    component: login,
    hidden: true
  },
  {
    path: '/login',
    redirect: '/',
    hidden: true
  },
  {
    path: '/home',
    name: '订单中心',
    component: home,
    iconCls: 'glyphicon glyphicon-barcode',
    meta: {
      requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
    },
    children: [
      {
        path: 'ticketList',
        name: '手动下单',
        iconCls: '',
        component: ticketList
      },
      {
        path: 'orderList',
        name: '订单查询',
        iconCls: '',
        component: orderList
      }
    ]
  },
  {
    path: '/home',
    name: '管理员工具',
    component: home,
    iconCls: 'glyphicon glyphicon-wrench',
    meta: {
      requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
    },
    children: [
      {
        path: 'userList',
        name: '用户管理',
        iconCls: '',
        component: userList
      }
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: {path: '/404'}
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
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

  // 用户管理
  if (to.matched.some(r => r.path.indexOf('user') !== -1)) {
    if (getLocal('account') !== 'admin') {
      alert('您无权访问')
      next({
        path: '/home/orderList'
      })
    } else {
      next()
    }
  }
})

export default router
