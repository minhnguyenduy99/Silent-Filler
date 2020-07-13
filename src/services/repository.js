import axios from 'axios'
import status from './STATUS'

let domain = 'http://127.0.0.1:8000'
let baseURL = `${domain}`

export default class Repository {
  /**
   * @type {String}
   */
  get baseURL() {
    return baseURL
  }

  /**
   * @param {String} path
   * @param {any} payload
   */
  async create(path, payload) {
    try {
      let fullURL = baseURL + `${path}`
      let response = await axios.post(fullURL, payload, {
        headers: {
          ...this.configHeaders()
        }
      })
      return response.data
    } catch (err) {
      return err
    }
  }

  /**
   * @param {String} path
   * @param {any} config
   */
  async get(path, config = {}) {
    let fullURL = baseURL + `${path}`
    let response = await axios.get(fullURL, {
      headers: {
        ...this.configHeaders()
      },
      ...config
    })
    return response.data
  }

  async update(path, data, config = {}) {
    let fullURL = baseURL + `${path}`
    let response = await axios.put(fullURL, data, {
      headers: {
        ...this.configHeaders()
      },
      ...config
    })
    return response.data
  }

  configHeaders() {
    return {}
  }
}
