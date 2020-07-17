<template>
  <div>
     <div class="image-container --full-screen">
      <b-img class="image-container__image" src="@/assets/background.jpg" />
    </div>
    <nav-bar class="navigation p-5 d-flex justify-content-end" />
    <div class="game-menu--container d-flex justify-content-center">
      <div class="game-menu--content">
        <h1 class="display-5 text-light mb-5">{{ webTitle }}</h1>
        <b-button class="game-menu--button" variant="outline-info" size="lg" to="/game">Play</b-button>
        <b-button class="game-menu--button" variant="outline-info" size="lg" to="/listmap">Edit map</b-button>
        <b-button class="game-menu--button" variant="outline-info" size="lg">How to play</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NavBar from '../web-components/base/NavBar'
export default {
  components: {
    NavBar
  },
  data: () => ({
    webTitle: 'SILENT FILLER'
  }),
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  }
}
</script>

<style scoped lang="scss">
.navigation {
  position: relative;
  z-index: 3;
  width: 100vw;
}

.main-content {

  &__container {
    position: relative;
    z-index: 2;
    height: 100vh;
    width: 100vw;
  }
}

.game-menu {
  &--container {
    position: relative;
    z-index: 2;
    width: 100vw;
  }

  &--content {
    margin-top: 5%;
  }

  &--button {
    width: 60%;
    margin-bottom: 20px;
  }
}
</style>
