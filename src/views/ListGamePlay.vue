<template>
  <div>
    <nav-bar class="pb-0" variant="outline-info" dropdownBg="bg-info" textVariant="dark" dashboard dashboardClass="dashboard-class"/>
    <div id="list-map-view" class="d-flex justify-content-center">
      <div class="content__wrapper w-75 mt-5">
        <game-state-section
          title="Choose a map to play"
          :gameStates="listGameStates"
          :loadButton="!isLastPage"
          @loadButtonClicked="loadNewGamePlay"
        />
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../web-components/base/NavBar'
import GameStateSection from '../web-components/GameStateSection'
import { mapMutations } from 'vuex'

export default {
  name: 'ListGamePlay',
  components: {
    GameStateSection, NavBar
  },
  data: () => ({
    listGameStates: [],
    currentPage: 1,
    isLastPage: false
  }),
  created: function() {
    this.loadingPage('Loading gameplay ...')
    this.$store.dispatch('game_state/getListGameState')
    .then(results => {
      results = results.map(result => {
        result.last_edited = new Date(result.last_edited)
        return result
      })
      this.currentPage++
      this.listGameStates = results
      this.isLastPage = results.length < 6
      this.unloadingPage()
    })
  },
  methods: {
    ...mapMutations('web', ['loadingPage', 'unloadingPage']),

    loadNewGamePlay() {
      this.loadingPage('Loading gameplay ...')
      this.$store.dispatch('game_state/getListGameState', this.currentPage)
      .then(results => {
        results = results.map(result => {
          result.last_edited = new Date(result.last_edited)
          return result
        })
        this.listGameStates.push(...results)
        this.isLastPage = results.length < 6
        this.currentPage++
        this.unloadingPage()
      })
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
  margin-left: 180px;
}
</style>
