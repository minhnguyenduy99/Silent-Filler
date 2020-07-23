import axios from 'axios'
import ResponseObject from './ResponseObject'

let domain = process.env.VUE_APP_SERVER_DOMAIN

export default {
  login: async ({ username, password }) => {
    try {
      let form = new FormData()
      form.append('username', username)
      form.append('password', password)
      let response = await axios.post(`${domain}/login`, form)
      return new ResponseObject(response.data, null, response.status)
    } catch (err) {
      console.log(err)
      let { data, status } = err.response
      return new ResponseObject(null, data.detail || data.error, status)
    }
  }
}
