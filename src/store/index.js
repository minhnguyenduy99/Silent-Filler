import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import map from './map'
import { mapEditState } from './map-edit-state'
import authState from './auth-state'
import Cookies from 'js-cookie'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['auth']
})

const vuexCookie = new VuexPersistence({
  restoreState: (key, storage) => Cookies.getJSON(key),
  saveState: (key, state, storage) =>
    Cookies.set(key, state, {
      expires: 3
    }),
  modules: ['auth']
})

export default new Vuex.Store({
  modules: {
    map: map,
    'map-edit': mapEditState,
    auth: authState
  },
  plugins: [
    vuexCookie.plugin
  ]
})
