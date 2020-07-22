<template>
  <div class="home">
    <div class="image-container --full-screen">
      <b-img class="image-container__image" src="@/assets/background.jpg" referrerpolicy="origin"/>
    </div>
    <div class="main-content__container d-flex justify-content-center align-items-center">
      <div class="main-content__area d-flex justify-content-center flex-column align-items-center">
        <h1 class="main-content__game-title display-3 text-light">{{ webTitle }}</h1>
        <h4 class="main-content__game-description text-light">{{ description }}</h4>
        <div class="mt-5 w-75">
          <b-container fluid>
            <b-row align-h="between">
              <b-button class="col py-3 px-2 mr-2" size="lg" variant="success" @click="openLoginBox">Login</b-button>
              <b-button class="col py-3 px-2 ml-2" size="lg" variant="outline-info">About</b-button>
              <b-button class="col col-12 py-3 px-2 mt-3" size="lg" variant="primary" to="/register">Register</b-button>
            </b-row>
          </b-container>
        </div>
      </div>
    </div>
    <b-modal id="login-box-modal" centered hide-footer hide-header>
      <login-box />
    </b-modal>
    <loading-dialog :show="showDialog" :content="content" :centered="true" />
  </div>
</template>

<script>
import { login as authLogin, repository } from '@/services'
import { mapMutations, mapActions } from 'vuex'
import LoadingDialog from 'webcomponents/Utilities/LoadingDialog.vue'
import LoginBox from '../web-components/LoginBox'

export default {
  name: 'Home',
  components: {
    LoadingDialog, LoginBox
  },
  data: () => ({
    showDialog: false,
    content: 'Login...',
    webTitle: 'SILENT FILLER',
    description: 'Of the Kingdom Paper'
  }),
  methods: {
    openLoginBox() {
      this.$bvModal.show('login-box-modal')
    },
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
