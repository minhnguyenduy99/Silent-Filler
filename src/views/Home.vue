<template>
  <div class="home">
    <div class="image-container --full-screen">
      <b-img class="image-container__image" src="@/assets/background.jpg" referrerpolicy="origin"/>
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
import { login as authLogin, repository } from '@/services'
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'Home',
  methods: {
    async login () {
      try {
        let result = await this.$auth.loginWithPopup()
        let socialUser = this.$auth.user
        let user = {
          social_id: socialUser.sub.split('|')[1],
          family_name: socialUser.family_name,
          given_name: socialUser.given_name,
          picture: socialUser.picture,
          picture_large: socialUser.picture_large,
          user: {
            email: socialUser.email
          }
        }
        await this.$store.dispatch('auth/authenticateUser', user)
        this.$router.push('/dashboard')
      } catch (err) {
        console.log(err)
      }
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
