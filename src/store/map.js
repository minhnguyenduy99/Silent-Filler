import { repository } from '../services'

let mapRepo = null

function getMapRepo(token) {
  if (!mapRepo) {
    mapRepo = repository.get('map', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
  }
  return mapRepo
}

export default {
  namespaced: true,
  state: () => ({
  }),
  getters: {
  },
  actions: {
    async getListMap({ rootState }, page) {
      console.log(rootState)
      let token = rootState.auth.token
      let repo = getMapRepo(token)
      let [pageMap, recentMaps] = await Promise.all([
        repo.getByPage(page),
        repo.getRecentMaps()
      ])
      return {
        ...pageMap,
        recent: recentMaps.results
      }
    },
    async getListMapByPage({ rootState }, page) {
      console.log(rootState)
      let token = rootState.auth.token
      let repo = getMapRepo(token)
      let pageMaps = await repo.getByPage(page)
      return pageMaps
    },
    async getMapById({ rootState }, id) {
      let token = rootState.auth.token
      return getMapRepo(token).getMapById(id)
    },
    createMap({ rootState }, data) {
      let token = rootState.auth.token
      return getMapRepo(token).createMap(data)
    },
    updateMap({ rootState }, { id, data }) {
      let token = rootState.auth.token
      return getMapRepo(token).updateMap(id, data)
    }
  }
}
