import Repository from './repository'

export default class GameStateRepository extends Repository {
  async createGameState(data) {
    let form = new FormData()
    form.append('game_map', data.game_map)
    form.append('user', data.user)

    let state = await this.create('/game-state/', form)
    return state
  }

  updateState(mapId, state) {
    let data = {
      state: state
    }
    return this.update(`/game-state/${mapId}/update_state/`, data)
  }

  getByUserId() {
    return this.get('/game-state/by_user/')
  }

  getById(id) {
    return this.get(`/game-state/${id}`)
  }

  getAllGameState() {
    return this.get('/game-state/')
  }
}
