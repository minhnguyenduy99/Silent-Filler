import axios from 'axios'
import status from './STATUS'

// let domain = 'https://pixijsserver.herokuapp.com'
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
   * @type {any}
   */
  config

  constructor(config = {}) {
    this.config = config
  }

  /**
   * @param {String} path
   * @param {any} payload
   */
  async create(path, payload, config = {}) {
    try {
      let fullURL = baseURL + `${path}`
      let response = await axios.post(fullURL, payload, {
        ...this.config,
        ...config
      })
      if (response.status === 201 || response.status === 200) {
        return response.data
      }
      throw new Error(response.data)
    } catch (err) {
      console.log(err)
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
      ...this.config,
      ...config
    })
    return response.data
  }

  async update(path, data, config = {}) {
    let fullURL = baseURL + `${path}`
    let response = await axios.put(fullURL, data, {
      ...this.config,
      ...config
    })
    return response.data
  }
}
