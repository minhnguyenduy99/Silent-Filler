import Repository from './repository'

export default class UserRepository extends Repository {
  async createUser(data) {
    var form = new FormData()
    form.append('username', data.username)
    form.append('password', data.password)
    form.append('email', data.email)
    form.append('family_name', data.family_name)
    form.append('given_name', data.given_name)
    return super.create('/user/', data)
  }

  updateProfile(userId, profile) {
    var form = new FormData()
    form.append('family_name', profile.family_name)
    form.append('given_name', profile.given_name)
    return super.update(`/user/${userId}/profile/`, form)
  }

  updateUser(userId, account) {
    return super.update(`/user/${userId}/`, account, {
      contentType: 'application/json'
    })
  }

  getUserById(userId) {
    if (!userId) {
      throw Error('The userId is null')
    }
    return this.get(`/user/${userId}/`)
  }
}
