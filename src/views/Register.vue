<template>
  <div>
     <div class="image-container --full-screen">
      <b-img class="image-container__image" src="@/assets/background.jpg" />
    </div>
    <b-container class="form__container vh-100 min-vh-100 d-flex justify-content-center">
      <b-row align-h="center" class="w-100 mt-3">
         <b-form
          id="register-form"
          @submit="onFormSubmit"
          class="form__form-el text-left col col-lg-6 col-md-8 col-sm-12">
          <b-card>
            <b-tabs pills card :tabindex="currentTabIndex">
              <b-tab title="Profile" :disabled="!isTabActive(0)">
                <label for="form-family-name">Family name</label>
                <b-input id="form-family-name" lazy trim v-model="form.family_name" value="family_name" />
                <label for="form-family-name">Given name</label>
                <b-input id="form-family-name" lazy trim v-model="form.given_name" value="given_name" />
                <label for="form-family-name">Avatar</label>
                <b-file v-model="form.picture" value="picture"/>
                <b-button variant="primary" size="lg" class="w-100 mt-5" @click="nextTab">Next</b-button>
              </b-tab>
              <b-tab title="Account" :disabled="!isTabActive(1)">
                <b-button class="mb-3 d-block w-100" variant="danger" @click="backToProfile">Back</b-button>
                <label for="form-username">Username</label>
                <b-input id="form-username" lazy trim v-model="form.username" value="username" />
                <label for="form-password">Password</label>
                <b-input id="form-password" lazy trim type="password" v-model="form.password" value="password" />
                <label for="form-password_again">Input password again</label>
                <b-input id="form-password_again" lazy trim type="password" v-model="form.passwordAgain" value="passwordAgain" />
                <label for="form-email">Email</label>
                <b-input id="form-email" type="email" lazy trim v-model="form.email" value="email" />
                <b-button class="w-100 mt-5" size="lg" type="submit" variant="primary">Register</b-button>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-form>
      </b-row>
    </b-container>
    <b-modal id="form-error-modal" hide-header cancel-disabled centered>
      {{ errorMsg }}
    </b-modal>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { repository } from '../services'

export default {
  name: 'Register',
  data: () => ({
    form: {
      username: '',
      password: '',
      passwordAgain: '',
      email: '',
      family_name: '',
      given_name: '',
      picture: null
    },
    currentTabIndex: 0,
    errorMsg: ''
  }),
  methods: {
    ...mapActions('auth', ['createUser']),
    ...mapMutations('web', ['loadingPage', 'unloadingPage']),
    ...mapMutations('auth', ['auth_success', 'auth_failed']),

    isTabActive(index) {
      return this.currentTabIndex === index
    },

    nextTab() {
      this.currentTabIndex++
    },

    backToProfile() {
      this.currentTabIndex--
    },

    onFormSubmit(e) {
      e.preventDefault()
      if (this.form.password !== this.form.passwordAgain) {
        this.notifyMsg('The password is mismatch')
        e.preventDefault()
        return
      }
      this.loadingPage('The request is on process ...')
      repository.get('user').createUser(this.form)
      .then(function (result) {
        this.unloadingPage()
        if (result.error) {
          this.auth_failed(result.error)
          this.notifyMsg(result.error)
          return
        }
        result.data.token = {
          access_token: result.data.access_token
        }
        this.auth_success(result.data)
        this.$router.push({
          name: 'Dashboard'
        })
        document.location.reload()
      }.bind(this))
    },
    notifyMsg(msg) {
      this.errorMsg = msg
      this.$bvModal.show('form-error-modal')
    }
  }
}
</script>

<style scoped lang="scss">
.form {

  &__container {
    position: relative;
    z-index: 2;
  }

  &__form-el {
    label {
      margin-top: 15px;
    }
  }
}
</style>
