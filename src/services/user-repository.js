import Repository from './repository'
import Axios from 'axios'

export default class UserRepository extends Repository {
  async createUser(data) {
    let user = await this.create('/user/', data)
    Axios.defaults.headers.Authorization = `Token ${user.user.token}`
    delete user.user.token
    return user
  }

  updateProfile(userId, profile) {
    return super.update(`/user/${userId}/`, profile, {
      contentType: 'application/json'
    })
  }

  updateAccount(userId, account) {
    return super.update(`/user/${userId}/update_account/`, account, {
      contentType: 'application/json'
    })
  }

  getUserById(userId) {
    if (!userId) {
      throw Error('The userId is null')
    }
    return this.get('/user', {
      params: {
        user_id: userId
      }
    })
  }

  configHeaders() {
  }
}
