import Vue from 'vue'
import VueRouter from 'vue-router'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Page404 from '../views/Page404'

// ROUTES FROM DASHBOARD
import Index from '../views/Index.vue'
import Transacoes from '../views/Transacoes.vue'
import Receitas from '../views/Receitas.vue'
import Despesas from '../views/Despesas.vue'

// import instanceAxios from '../utils/axiosInstance.js';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/dashboard',
    redirect: '/dashboard/index'
  },
  {
    path: '/login',
    component: Login,
    name: 'login'
  },
  {
    path: '/signup',
    component: Signup,
    name: 'signup'
  },
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    name: 'dashboard',
    children: [
      {
        path: 'index',
        component: Index,
        name: 'index'
      },
      {
        path: 'transacoes',
        component: Transacoes,
        name: 'transacoes'
      },
      {
        path: 'receitas',
        component: Receitas,
        name: 'receitas'
      },
      {
        path: 'despesas',
        component: Despesas,
        name: 'despesas'
      }
    ]
  },
  {
    path: '/*',
    component: Page404,
    name: 'page404'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})

export default router
