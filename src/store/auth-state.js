import { repository } from '../services'

let userRepo = repository.get('user')

export const auth = {
  namespaced: true,
  state: () => ({
    user: null,
    isAuthenticated: false,
    authError: null,
    token: null
  }),
  mutations: {
    auth_success: (state, user, token) => {
      state.isAuthenticated = true
      state.user = user
      state.token = token
      state.authError = null
    },
    auth_failed: (state, error) => {
      state.authError = error || 'Authentication failed'
      state.isAuthenticated = false
    },
    update_user: (state, user) => {
      let account = state.user.user
      state.user = user
      state.user.user = account
    },
    update_account: (state, account) => {
      state.user.account = account
    }
  },
  getters: {
    isAuthenticated: (state) => {
      return state.isAuthenticated
    },
    user: (state) => {
      return state.user
    }
  },
  actions: {
    authenticateUser: async ({ commit }, user) => {
      try {
        let result = await userRepo.create('/user/', user)
        commit('auth_success', result, result.user.token)
      } catch (err) {
        console.log(err)
        commit('auth_failed')
      }
    },
    updateProfile: async ({ commit }, userId, profile) => {
      try {
        let updateResult = await userRepo.updateProfile(userId, profile)
        commit('update_user', updateResult)
        console.log('update profile success')
      } catch (err) {
        console.log(err)
      }
    },
    updateAccount: async ({ commit }, userId, account) => {
      try {
        let updateResult = await userRepo.updateAccount(userId, account)
        commit('update_account', updateResult)
        console.log('update account succes')
      } catch (err) {
        console.log(err)
      }
    },
    logout: ({ state }) => {
      state.token = null
      state.isAuthenticated = false
    }
  }
}
