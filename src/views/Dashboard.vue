<template>
  <div>
     <div class="image-container --full-screen">
      <b-img class="image-container__image" src="@/assets/background.jpg" />
    </div>
    <nav class="navigation p-5 d-flex justify-content-end">
      <div class="user-info" v-if="$auth.user.picture">
        <b-dropdown variant="outline-info" no-caret menu-class="bg-info" toggle-class="p-0 border-0">
          <b-button slot="button-content" variant="outline-info" size="lg" class="d-flex align-items-center">
            <b-avatar class="d-inline-block" :src="$auth.user.picture"></b-avatar>
            <h5 class="d-inline-block text-light m-0 ml-3">{{ $auth.user.family_name }}</h5>
          </b-button>
          <div class="d-flex flex-column p-2">
            <b-button type="link" variant="outline-light">Profile</b-button>
            <b-button class="mt-2" type="link" variant="outline-light">Logout</b-button>
          </div>
        </b-dropdown>
      </div>
    </nav>
    <div class="game-menu--container d-flex justify-content-center">
      <div class="game-menu--content">
        <h1 class="display-5 text-light mb-5">Name of the game</h1>
        <b-button class="game-menu--button" variant="outline-info" size="lg">Play</b-button>
        <b-button class="game-menu--button" variant="outline-info" size="lg">Setting</b-button>
        <b-button class="game-menu--button" variant="outline-info" size="lg" to="/editmap">Edit map</b-button>
        <b-button class="game-menu--button" variant="outline-info" size="lg">How to play</b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
