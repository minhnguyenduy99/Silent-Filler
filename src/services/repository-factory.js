import UserRepository from './user-repository'
import MapRepository from './map-repository'
import GameStateRepository from './state-repository'

let repositories = {
  user: new UserRepository(),
  map: new MapRepository(),
  game_state: new GameStateRepository()
}

export default {
  get: (name, config = {}) => {
    let repository = repositories[name]
    repository.config = config
    return repository
  }
}
