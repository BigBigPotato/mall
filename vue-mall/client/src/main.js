import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import LoadingPlugin from '@/plugin/loading/loading'

Vue.use(LoadingPlugin)

Vue.config.productionTip = false

Vue.filter('imgPrefix', function (val) {
  return 'http://localhost:3001/images/' + val
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
