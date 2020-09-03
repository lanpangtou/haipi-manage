import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../view/Home.vue'
import login from '../view/Login.vue'
import goods from '../view/goods/GoodsList.vue'
import category from '../view/goods/Category.vue'
import brand from '../view/goods/Brand.vue'
import specParam from '../view/goods/SpecParam.vue'

Vue.use(VueRouter)

  const routes = [
    {path: '/login',component: login},
    {path: '/',redirect: '/home'},
    {
      path: '/home',
      component: home,
      children: [
        {path: '/goods/list',component: goods},
        {path: '/goods/category',component: category},
        {path: '/goods/brand',component: brand},
        {path: '/goods/spec-parameters',component: specParam},
      ]
    },
]

const router = new VueRouter({
  routes
})

export default router
