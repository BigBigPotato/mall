import axios from 'axios'
import apiMap from './apiMap'
import { getCookie } from '@/assets/js/util'
import LoadingPlugin from '@/plugin/loading/loading'

// 拦截器
axios.interceptors.request.use(function (config) {
  let noRequireLoginApi = ['/goods/list', '/goods/priceRange', '/user/login', '/user/login']
  if (!(noRequireLoginApi.includes(config.url))) {
    let userId = getCookie('userId')
    if (userId) {
      config.data.userId = getCookie('userId')
    } else {
      LoadingPlugin.Message({
        type: 'error',
        infoText: '请先登录'
      })
      return Promise.reject(new Error('请先登录'))
    }
  }
  return config
}, function (err) {
  return Promise.reject(err)
})

axios.interceptors.response.use(function (res) {
  console.log(res)
  return res
}, function (err) {
  return Promise.reject(err)
})

let options = {
  baseURL: '/api'
}
// 重写post、get
export default {
  post (path, parameter, opt = {}) {
    let config = Object.assign({}, options, opt)
    return new Promise(function (resolve, reject) {
      axios.post(apiMap[path], parameter, config)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  get (path, parameter, opt = {}) {
    let config = Object.assign({}, options, opt, { params: parameter })
    return new Promise(function (resolve, reject) {
      axios.get(apiMap[path], config)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
