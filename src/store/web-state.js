
export default {
  namespaced: true,
  state: () => ({
    isPageLoading: false,
    loadingContent: ''
  }),
  mutations: {
    loadingPage(state, content) {
      state.isPageLoading = true
      state.loadingContent = content
    },
    unloadingPage(state) {
      state.isPageLoading = false
    }
  },
  getters: {
    isPageLoading: (state) => {
      return state.isPageLoading
    }
  }
}
