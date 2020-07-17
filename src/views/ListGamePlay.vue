<template>
  <div>
    <nav-bar class="pb-0" variant="outline-info" dropdownBg="bg-info" textVariant="dark" />
    <div id="list-map-view" class="d-flex justify-content-center">
      <div class="content__wrapper w-75 mt-5">
        <game-state-section
          title="Choose a map to play"
          :gameStates="listGameStates"
        />
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../web-components/base/NavBar'
import GameStateSection from '../web-components/GameStateSection'

export default {
  name: 'ListGamePlay',
  components: {
    GameStateSection, NavBar
  },
  data: () => ({
    listGameStates: []
  }),
  created: async function() {
    let results = await this.$store.dispatch('game_state/getListGameState')
    results = results.map(result => {
      result.last_edited = new Date(result.last_edited)
      return result
    })
    this.listGameStates = results
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
