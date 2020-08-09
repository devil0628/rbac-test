import Vue from 'vue';
import App from './App.vue';
import './plugins/element.js'


import {router} from './router/index';

import Vuex from 'vuex';

Vue.use(Vuex);
Vue.config.productionTip = false;
const store = new Vuex.Store({
  modules: {},
});  //空的vueX可以让frame的进行注入
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
