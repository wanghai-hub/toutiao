import Vue from 'vue'
import App from './App.vue'
import router from './router/index'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


import plugin from './util/plugin'
Vue.use(plugin)


import './style/index'

import axios from './api/index'
// 全局挂载，组件中就不用再导入
Vue.prototype.$http = axios

Vue.use(ElementUI);


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
