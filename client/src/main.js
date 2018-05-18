// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import 'uikit/dist/css/uikit.min.css';
import Vue from 'vue';
import Vuex from 'vuex';
import locales from '@/framework/mixins/localesMixin';
import createStore from '@/store/store';
import App from './App';
import Suggestion from './framework/components/suggestion';
import router from './router';

// loads the Icon plugin
UIkit.use(Icons);

Vue.config.productionTip = false;
Vue.use(Vuex);
const store = createStore();

// Injecting locales
Vue.mixin(locales);

// Importing components globally
Vue.component('suggestion', Suggestion);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
});
