import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import 'reset-css';
import './plugins/element.js'
import './plugins/axios.js'
import './plugins/toasted.js'


Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
