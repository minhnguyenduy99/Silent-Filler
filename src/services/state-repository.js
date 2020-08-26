import Repository from './repository'
import ResponseObject from './ResponseObject'

export default class GameStateRepository extends Repository {
  createGameState(data) {
    let form = new FormData()
    form.append('game_map', data.game_map)
    form.append('user', data.user)
    return this.create('/gamestate/', form)
  }

  updateState(mapId, state) {
    let data = {
      state: state
    }
    return this.update(`/gamestate/${mapId}/update_state/`, data)
  }

  getAll(page = 1) {
    return this.get('/gamestate', {
      params: {
        page: page
      }
    })
  }

  getByMapId(mapId) {
    return this.get(`/gamestate/${mapId}`)
  }

  configLastMapId(mapId = 'None') {
    return this.configHeaders({
      'amz-last-map-id': mapId
    })
  }
}
