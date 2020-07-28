<template>
  <div>
    <nav-bar class="pb-0" variant="outline-info" dropdownBg="bg-info" textVariant="dark" dashboard dashboardClass="dashboard-class h-100"/>
    <div class="d-flex justify-content-center">
      <div class="content__wrapper w-75 mt-5">
        <game-state-section
          class="mb-5"
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
import { repository } from '../services'

export default {
  name: 'ListGamePlay',
  components: {
    GameStateSection, NavBar
  },
  data: () => ({
    listGameStates: [],
    currentPage: 1,
    isLastPage: false,
    gameStateRepo: null
  }),
  created: function() {
    this.gameStateRepo = repository.get('game_state').configToken(this.$store.getters['auth/token'])
    this.loadingPage('Loading gameplay ...')
    this.gameStateRepo.getAll(1)
    .then(function (result) {
      if (result.error) {
        this.$router.push({
          name: 'Dashboard'
        })
        return
      }
      this.addNewGamePlays(result.data)
      this.unloadingPage()
    }.bind(this))
  },
  methods: {
    ...mapMutations('web', ['loadingPage', 'unloadingPage']),

    loadNewGamePlay() {
      this.loadingPage('Loading gameplay ...')
      this.gameStateRepo.getAll(this.currentPage)
      .then(function (result) {
        this.addNewGamePlays(result.data)
        this.unloadingPage()
      }.bind(this))
    },

    addNewGamePlays(listGamePlays) {
      listGamePlays = listGamePlays.map(result => {
        result.last_edited = new Date(result.last_edited)
        return result
      })
      this.listGameStates.push(...listGamePlays)
      this.isLastPage = listGamePlays.length < 6
      this.currentPage++
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
