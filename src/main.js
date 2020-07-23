import '@babel/polyfill'
import 'mutationobserver-shim'
import './plugins/bootstrap-vue'
import './plugins/auth0'
import Vue from 'vue'
import VueHead from 'vue-head'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.use(VueHead)
Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
