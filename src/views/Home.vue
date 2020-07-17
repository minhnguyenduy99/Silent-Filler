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
    <loading-dialog :show="showDialog" :content="content" :centered="true" />
  </div>
</template>

<script>
import { login as authLogin, repository } from '@/services'
import { mapMutations, mapActions } from 'vuex'
import LoadingDialog from 'webcomponents/Utilities/LoadingDialog.vue'

export default {
  name: 'Home',
  components: {
    LoadingDialog
  },
  data: () => ({
    showDialog: false,
    content: 'Login...'
  }),
  methods: {
    login () {
      this.$auth.loginWithPopup()
      .then(() => {
        this.showDialog = true
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
        this.$store.dispatch('auth/authenticateUser', user)
        .then(() => {
          this.showDialog = false
          this.$router.push('/dashboard')
        })
      })
      .catch(err => {
        console.log(err)
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
