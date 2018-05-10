import Vue from 'vue';
import Router from 'vue-router';
import Sheet from '@/components/sheet';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/sheet',
      name: 'Sheet',
      component: Sheet,
    },
  ],
});
