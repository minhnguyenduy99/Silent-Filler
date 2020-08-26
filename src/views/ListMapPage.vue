<template>
  <div>
    <nav-bar class="pb-0" variant="outline-info" dropdownBg="bg-info" textVariant="dark" dashboard dashboardClass="dashboard-class"/>
    <div id="list-map-view" class="d-flex justify-content-center">
      <div class="content__wrapper w-75 mt-5">
        <b-button class="button__add mb-5" variant="primary" @click="navigateToEditNewMap">Add new map</b-button>
        <map-section
          title="Recent maps"
          :listMap="recent"
          emptyContent="There's no map available"
        />
        <map-section
          class="my-5"
          title="All maps"
          :listMap="listMaps"
          emptyContent="There's no map available"
          :loadButton="!isLastPage"
          @loadButtonClicked="onLoadButtonClicked"
        />
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../web-components/base/NavBar'
import MapSection from '../web-components/MapSection'
import { mapMutations, mapGetters } from 'vuex'
import { repository } from '../services'

export default {
  name: 'ListMapPage',
  components: {
    MapSection, NavBar
  },
  data: () => ({
    listMaps: [],
    recent: [],
    currentPage: 1,
    isLastPage: false,
    mapRepo: repository.get('map')
  }),
  created: function() {
    this.mapRepo = repository.get('map').configToken(this.$store.getters['auth/token']).configLastMapId()
    this.loadingPage('List of maps are loading ...')
    this.mapRepo.getByPage()
    .then(function (result) {
      if (result.error) {
        return
      }
      this.loadNewMapPage(result.data)
      this.loadRecentMaps()
      this.unloadingPage()
    }.bind(this))
  },
  methods: {
    ...mapMutations('web', ['loadingPage', 'unloadingPage']),

    navigateToEditNewMap() {
      this.$router.push('/editmap')
    },

    onLoadButtonClicked() {
      let lastMapId = this.listMaps[this.listMaps.length - 1].id ?? 'None'
      this.mapRepo
      .configLastMapId(lastMapId)
      .getByPage(this.currentPage)
      .then(function (result) {
        if (result.error) {
          return
        }
        this.loadNewMapPage(result.data)
      }.bind(this))
    },

    loadNewMapPage({ count, next, previous, results }) {
      results = results.map(result => {
        result.last_edited = new Date(result.last_edited)
        return result
      })
      this.listMaps.push(...results)
      this.currentPage++
      this.isLastPage = next === null
    },

    loadRecentMaps() {
      this.recent = [...this.listMaps]
    }
  }
}
</script>

<style lang="scss">
#list-map-view {
  width: 100vw;
  height: 100vh;
}

.button {
  &__add {
    display: inherit;
  }
}

.dashboard-class {
  margin-right: 20px;
  height: 100%;
}
</style>
