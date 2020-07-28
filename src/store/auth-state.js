import { repository } from '../services'

let userRepo = repository.get('user')

export default {
  namespaced: true,
  state: () => ({
    user: null,
    isAuthenticated: false,
    authError: null,
    token: null
  }),
  mutations: {
    auth_success: (state, user) => {
      state.isAuthenticated = true
      state.user = user
      state.token = user.token.access_token
      state.authError = null
      console.log(state)
    },
    auth_failed: (state, error) => {
      state.authError = error || 'Authentication failed'
      state.isAuthenticated = false
    },
    logout: (state) => {
      state.token = null
      state.isAuthenticated = false
      state.user = null
    },
    update_user: (state, user) => {
      let profile = state.user.profile
      state.user = {
        ...state.user,
        ...user
      }
      state.user.profile = profile
    },
    update_profile: (state, profile) => {
      state.user.profile = {
        ...state.user.profile,
        ...profile
      }
    }
  },
  getters: {
    isAuthenticated: (state) => {
      return state.isAuthenticated
    },
    user: (state) => {
      return state.user
    },
    token: (state) => {
      return state.token
    }
  },
  actions: {
    authenticateUser: async ({ state, commit }, user) => {
      try {
        let result = await userRepo.createUser(user)
        commit('auth_success', result)
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
    logout: ({ commit }) => {
      commit('logout')
    }
  }
}
