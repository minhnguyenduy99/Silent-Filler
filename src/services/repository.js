import axios from 'axios'
import ResponseObject, { STATUS } from './ResponseObject'
import cookie from 'js-cookie'

let domain = process.env.VUE_APP_SERVER_DOMAIN
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
      return new ResponseObject(response.data, null, STATUS.HTTP_201_CREATED)
    } catch (err) {
      console.log(err)
      return this.getErrorResponse(err.response)
    }
  }

  /**
   * @param {String} path
   * @param {any} config
   */
  async get(path, config = {}) {
    try {
      let fullURL = baseURL + `${path}`
      let response = await axios.get(fullURL, {
        ...this.config,
        ...config
      })
      return new ResponseObject(response.data, null)
    } catch (err) {
      console.log(err)
      return this.getErrorResponse(err.response)
    }
  }

  async update(path, data, config = {}) {
    try {
      let fullURL = baseURL + `${path}`
      let response = await axios.put(fullURL, data, {
        ...this.config,
        ...config
      })
      return new ResponseObject(response.data, null, STATUS.HTTP_200_OK)
    } catch (err) {
      console.log(err)
      return this.getErrorResponse(err.response)
    }
  }

  configToken(token) {
    return this.configHeaders({
      Authorization: `Token ${token}`
    })
  }

  configHeaders(headers) {
    this.config.headers = {
      ...this.config.headers,
      ...headers
    }
    return this
  }

  otherConfig(config) {
    this.config = {
      ...this.config,
      ...config
    }
    return this
  }

  async getErrorResponse(response) {
    let { data, status } = response
    return new ResponseObject(null, data.error ?? data.detail, status)
  }

  async acquireAccessToken() {
    try {
      let csrftoken = cookie.get('csrftoken')
      let url = `${baseURL}/acquireaccesstoken`
      let response = await axios.post(url, null, {
        headers: {
          'X-CSRFTOKEN': csrftoken
        }
      })
      return new ResponseObject(response.data, null, response.status)
    } catch (err) {
      console.log(err)
      return this.getErrorResponse(err.response)
    }
  }
}
