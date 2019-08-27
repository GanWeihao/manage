// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import qs from 'qs';
import store from './store';
// 引入echarts
import echarts from 'echarts'
import VueCropper from 'vue-cropper'
import clipboard from 'clipboard';
import Video from 'video.js'
import 'video.js/dist/video-js.css'

Vue.prototype.$video = Video
Vue.use(VueCropper)
Vue.use(Vuex)
Vue.use(ElementUI, {size: 'small', zIndex: 3000});
Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios
Vue.prototype.$clipboard = clipboard
Vue.prototype.$qs = qs
Vue.config.productionTip = false
Vue.prototype.$bus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
