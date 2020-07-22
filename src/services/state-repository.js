import Repository from './repository'
import ResponseObject from './ResponseObject'

export default class GameStateRepository extends Repository {
  createGameState(data) {
    let form = new FormData()
    form.append('game_map', data.game_map)
    form.append('user', data.user)
    return this.create('/game-state/', form)
  }

  updateState(mapId, state) {
    let data = {
      state: state
    }
    return this.update(`/game-state/${mapId}/update_state/`, data)
  }

  getAll(page = 1) {
    return this.get('/game-state', {
      params: {
        page: page
      }
    })
  }

  getById(id) {
    return this.get(`/game-state/${id}`)
  }
}
