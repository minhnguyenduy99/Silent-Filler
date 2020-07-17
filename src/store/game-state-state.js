import { repository } from '../services'

let stateRepo = null

function getStateRepo(token) {
  if (!stateRepo) {
    stateRepo = repository.get('game_state', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
  }
  return stateRepo
}

export default {
  namespaced: true,
  state: () => ({
  }),
  getters: {
  },
  actions: {
    getListGameState({ rootState }, page = 1) {
      console.log(rootState)
      let token = rootState.auth.token
      let repo = getStateRepo(token)
      return repo.getByUserId(page)
    },
    getMapById({ rootState }, id) {
      let token = rootState.auth.token
      return getStateRepo(token).getById(id)
    },
    createState({ rootState }, data) {
      let token = rootState.auth.token
      return getStateRepo(token).createGameState(data)
    },
    updateGameState({ rootState }, { id, state }) {
      let token = rootState.auth.token
      return getStateRepo(token).updateState(id, state)
    }
  }
}
