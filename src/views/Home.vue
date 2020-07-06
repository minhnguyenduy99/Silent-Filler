<template>
  <div class="home">
    <div class="image-container --full-screen">
      <b-img class="image-container__image" src="@/assets/background.jpg" />
    </div>
    <div class="main-content__container d-flex justify-content-center align-items-center">
      <div class="main-content__area">
        <h1 class="main-content__game-title display-3 text-light">The name of the game</h1>
        <h4 class="main-content__game-description text-light">Description of the game</h4>
        <div class="d-flex justify-content-center mt-5">
          <b-button class="mr-3 py-3 px-4" size="lg" variant="success" @click="login">Login</b-button>
          <b-button class="ml-3 py-3 px-4" size="lg" variant="outline-info">About</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login as authLogin } from '@/services'

export default {
  name: 'Home',
  methods: {
    login () {
      this.$auth.loginWithRedirect().then(result => {
        console.log(result)
      })
    }
  }
}
</script>

<style scoped lang="scss">

.main-content {

  &__container {
    position: relative;
    z-index: 2;
    height: 100vh;
    width: 100vw;
  }
}
</style>
