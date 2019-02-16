import LoadingTemp from './Index.vue'
import Vue from 'vue'

function installLoading () {
  Vue.prototype.$message = ({ type = 'info', infoText = 'loading', duration = 1500 }) => {
    const LoadingTempConstructor = Vue.extend(LoadingTemp)
    const LoadingTempElement = new LoadingTempConstructor()
    LoadingTempElement.$mount(document.createElement('div'))
    document.body.appendChild(LoadingTempElement.$el)
    LoadingTempElement.showLoading = true
    LoadingTempElement.showLoadingContent = true
    LoadingTempElement.showIconName = type
    LoadingTempElement.infoText = infoText
    setTimeout(() => {
      LoadingTempElement.showLoadingContent = false
    }, duration)
    setTimeout(() => {
      LoadingTempElement.showLoading = false
      document.body.removeChild(LoadingTempElement.$el)
    }, duration + 400)
  }
}
export default installLoading
