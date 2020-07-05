import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
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
    activePanel: 0
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
  },
  modules: {
  }
})
