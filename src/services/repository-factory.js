import UserRepository from './user-repository'
import MapRepository from './map-repository'

let repositories = {
  user: new UserRepository(),
  map: new MapRepository()
}

export default {
  get: (name, config = {}) => {
    let repository = repositories[name]
    repository.config = config
    return repository
  }
}
