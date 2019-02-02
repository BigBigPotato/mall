import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/pages/GoodsList'
import Address from '@/pages/Address'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },
    {
      path: '/goods',
      name: 'goodsList',
      component: GoodsList
    },
    {
      path: '/address',
      name: 'address',
      component: Address
    }
  ]
})
