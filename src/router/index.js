import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import GameView from '../views/GameView.vue'
import EditMap from '../views/EditMap.vue'
import Profile from '../views/Profile.vue'
import ListMapPage from '../views/ListMapPage'
import ListGamePlay from '../views/ListGamePlay'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      requiresAuth: true
    },
    component: Dashboard
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/game/:id',
    name: 'Game',
    component: GameView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/listmap',
    name: 'ListMap',
    component: ListMapPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/game',
    name: 'ListGamePlay',
    component: ListGamePlay,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/editmap/:id',
    name: 'EditMap',
    component: EditMap,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/editmap',
    name: 'EditNewMap',
    component: EditMap,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeResolve((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log(store)
    let isAuthenticated = store.getters['auth/isAuthenticated']
    if (!isAuthenticated) {
      next({
        name: 'Home'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
