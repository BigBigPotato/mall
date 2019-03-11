import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/pages/GoodsList'
import Address from '@/pages/Address'
import ConfirmOrder from '@/pages/ConfirmOrder'
import OrderSuccess from '@/pages/OrderSuccess'
import Cart from '@/pages/Cart'

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
      path: '/cart',
      name: 'cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'address',
      component: Address
    },
    {
      path: '/confirmOrder',
      name: 'confirmOrder',
      component: ConfirmOrder
    },
    {
      path: '/orderSuccess',
      name: 'orderSuccess',
      component: OrderSuccess
    }
  ]
})
