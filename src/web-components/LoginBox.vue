<template>
  <b-container>
    <b-row align-h="center" align-v="center" class="p-3">
      <b-form id="login-form" class="col col-12" @submit.prevent="login">
        <h4 class="text-center">Login</h4>
        <label class="mt-3">Username</label>
        <b-input value="username" v-model="form.username" />
        <label class="mt-3" for="textbox-username">Password</label>
        <b-input value="username" v-model="form.password" type="password" />
        <p class="text-danger mt-2">{{ errorMsg }}</p>
        <b-button type="submit" variant="primary" size="lg" class="w-100 mt-3 font-weight-bold">Login</b-button>
      </b-form>
    </b-row>
    <b-modal class="login-modal">
      {{ errorMsg }}
    </b-modal>
  </b-container>
</template>

<script>
import { authenticate } from '../services'
import { mapMutations } from 'vuex'
export default {
  data: () => ({
    form: {
      username: '',
      password: ''
    },
    errorMsg: null
  }),
  methods: {
    ...mapMutations('auth', ['auth_success', 'auth_failed']),
    ...mapMutations('web', ['loadingPage', 'unloadingPage']),

    login() {
      this.loadingPage('The request is processing ...')
      authenticate.login(this.form)
      .then(result => {
        this.unloadingPage()
        if (result.error) {
          this.auth_failed(result.error)
          this.errorMsg = result.error
          return
        }
        result.data.user.token = {
          access_token: result.data.access_token
        }
        this.auth_success(result.data.user)
        this.$router.push({
          name: 'Dashboard'
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
