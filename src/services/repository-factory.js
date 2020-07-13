import UserRepository from './user-repository'

let repositories = {
  user: new UserRepository()
}

export default {
  get: (name) => repositories[name]
}
