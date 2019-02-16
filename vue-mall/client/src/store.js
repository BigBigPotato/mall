import Vue from 'vue'
import Vuex from 'vuex'
import { getCookie } from '@/assets/js/util'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pageSize: 10,
    userNameCookie: getCookie('userName')
  },
  mutations: {
    toChangeUserName (state, flag = true) {
      flag ? (state.userNameCookie = getCookie('userName')) : (state.userNameCookie = '')
    }
  },
  actions: {

  },
  getters: {
    hasLogin (state) {
      return !!state.userNameCookie
    }
  }
})
