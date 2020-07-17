<template>
  <div>
    <nav-bar class="pb-0" variant="outline-info" dropdownBg="bg-info" textVariant="dark" />
    <div id="list-map-view" class="d-flex justify-content-center">
      <div class="content__wrapper w-75 mt-5">
        <b-button class="button__add mb-5" variant="primary" @click="navigateToEditNewMap">Add new map</b-button>
        <map-section
          title="Recent maps"
          :listMap="recent"
        />
        <map-section
          class="mt-5"
          title="All maps"
          :listMap="listMaps"
        />
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../web-components/base/NavBar'
import MapSection from '../web-components/MapSection'
import { mapMutations } from 'vuex'

export default {
  name: 'ListMapPage',
  components: {
    MapSection, NavBar
  },
  data: () => ({
    listMaps: [],
    recent: [],
    currentPage: 1,
    lastPage: -1,
    totalNumber: 0,
    nextURL: null,
    previousURL: null
  }),
  created: function() {
    this.loadingPage('List of maps are loading ...')
    this.$store.dispatch('map/getListMap', this.currentPage)
    .then(({ count, next, previous, results, recent }) => {
      results = results.map(result => {
      result.last_edited = new Date(result.last_edited)
      return result
      })
      recent = recent.map(result => {
        result.last_edited = new Date(result.last_edited)
        return result
      })
      this.recent = recent
      this.listMaps = results
      this.nextURL = next
      this.previousURL = previous
      this.totalNumber = count
      this.unloadingPage()
    })
  },
  methods: {
    ...mapMutations('web', ['loadingPage', 'unloadingPage']),
    navigateToEditNewMap() {
      this.$router.push('/editmap')
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
</style>
