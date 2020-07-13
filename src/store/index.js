import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
import { auth } from './auth-state'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth: auth
  },
  plugins: [
    createPersistedState({
      paths: ['auth']
      // storage: {
      //   getItem: (key) => Cookies.get(key),
      //   setItem: (key, value) => {
      //     Cookies.set(key, value, { expires: 3, secure: true })
      //   },
      //   removeItem: (key) => Cookies.remove(key)
      // }
    })
  ],
  state: {
    AVAILABLE_MODE: {
      DRAW_MODE: 0,
      ERASE_MODE: 1
    },
    AVAILABLE_ERASE_MODE: {
      OBJECT: 0,
      MAP: 1
    },
    currentTab: null,
    tabLength: 0,
    mode: 0,
    eraseMode: 0,
    currentCommand: null,
    listCommands: [],
    activePanel: 0,
    playerItemState: {
      playerPosition: null,
      isStartPosSelected: true
    }
  },
  mutations: {
    updateCurrentTab (state, newTab) {
      state.currentTab = newTab
    },
    updateLengthTab (state, length) {
      state.tabLength = length
    },
    updateActivePanel(state, value) {
      state.activePanel = value
    },
    updatePlayerPosition(state, value) {
      state.playerItemState.playerPosition = value
    },
    selectPlayerPosition(state, value) {
      if (value === 'start') {
        state.playerItemState.isStartPosSelected = true
      } else {
        state.playerItemState.isStartPosSelected = false
      }
    }
  },
  getters: {
    tab: (state) => {
      return state.currentTab
    },
    currentTabData: (state) => {
      let tab = state.currentTab
      return tab ? tab.tab : null
    },
    isImageLoaded: (state) => {
      let tab = state.currentTab
      return tab ? tab.tab.isImageLoaded : false
    },
    isMapLoaded: (state) => {
      let tab = state.currentTab
      return tab ? tab.tab.isMapLoaded() : false
    },
    mode: (state) => {
      return state.mode
    },
    lengthOfTabs: (state) => {
      return state.tabLength
    },
    currentActivePanel: (state) => {
      return state.activePanel
    },
    isEraseMode: (state) => {
      return state.mode === state.AVAILABLE_MODE.ERASE_MODE
    },
    eraseMode: (state) => {
      return state.eraseMode
    },
    playerPosition: (state) => {
      return state.playerPosition
    },
    isPlayerStartPositionSelected: (state) => {
      let playerStartPos = state.currentTab.player.startPosition
      return state.playerPosition.equals(playerStartPos)
    }
  },
  actions: {
    addCommand({ state }, command) {
      if (!command.hasUndo()) {
        return
      }
      state.listCommands.push(command)
    },
    undo({ state }) {
      let lastCommand = state.listCommands.pop()
      if (!lastCommand) {
        return
      }
      lastCommand.undo()
    },
    changeMode({ state }, mode) {
      let modes = Object.values(state.AVAILABLE_MODE)
      if (!modes.includes(mode)) {
        return
      }
      state.mode = mode
    },
    changeEraseMode({ state }, mode) {
      let { MAP, OBJECT } = state.AVAILABLE_ERASE_MODE
      if (mode !== MAP && mode !== OBJECT) {
        return
      }
      state.eraseMode = mode
    }
  }
})
