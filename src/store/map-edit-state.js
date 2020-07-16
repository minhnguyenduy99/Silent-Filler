
export const mapEditState = {
  namespaced: true,
  state: () => ({
    isNewMap: false,
    mapObj: {
      map_name: '',
      map_file: null,
      map_image: null
    },
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
  }),
  mutations: {
    updateIsNewMap(state, value) {
      state.isNewMap = value
    },
    updateMapObj (state, value) {
      state.mapObj = value
    },
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
    mapObj: (state) => {
      return state.mapObj
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
}
