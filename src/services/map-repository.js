import Repository from './repository'

export default class MapRepository extends Repository {
  async createMap(data) {
    let form = new FormData()
    form.append('map_name', data.map_name)
    form.append('map_image', data.map_image)
    form.append('map_file', data.map_file)

    let response = await this.create('/map/', form)
    return response
  }

  async updateMap(mapId, data) {
    let form = new FormData()
    form.append('map_name', data.map_name)
    form.append('map_image', data.map_image)
    form.append('map_file', data.map_file)

    let map = await this.update(`/map/${mapId}/`, form)
    return map
  }

  async getByPage(page = 1) {
    let result = await this.get(`/map?page=${page}`)
    return result
  }

  async getRecentMaps() {
    return this.get('/map?page=1')
  }

  configLastMapId(mapId = 'None') {
    return this.configHeaders({
      'amz-last-map-id': mapId
    })
  }

  getMapById(id) {
    return this.get(`/map/${id}`)
  }
}
