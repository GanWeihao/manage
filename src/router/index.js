import Vue from 'vue'
import Router from 'vue-router'
import Home from "../views/Home";
import Index from "../views/Index"
import Changeimg from "../views/changeimg"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    },
    {
      path: '/changeimg',
      name: 'changeimg',
      component: Changeimg
    }
  ]
})
