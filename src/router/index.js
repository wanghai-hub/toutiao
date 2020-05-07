import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
Vue.use(VueRouter)

import auth from '../api/auth'

const routes = [
  {path: '/login',component: login},
  {path: '/',name: 'home', component: () => import('../views/home.vue'),
    children: [
      {path: '/', component:() => import('../views/welcome.vue')},
      {path: '/article', component:() => import('../views/article.vue')},
      // {path: '/edit/:id', component:() => import('../views/edit.vue')},
      {path: '/img', component:() => import('../views/img.vue')},
      {path: '/publish', component:() => import('../views/publish.vue')},
      
    ]
  },
  {path: '*',component:() => import('../views/unfound')}
]

 
const router = new VueRouter({
  routes
})

 // 导航守卫
 router.beforeEach((to, from, next) => {
   const user = auth.getuser()
    if(to.path !== '/login' && !user.token) {
      return next('/login')
    }
    next()
})

export default router
