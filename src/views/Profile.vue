<template>
  <div class="d-flex justify-content-center">
    <div class="image-container --full-screen">
      <b-img class="image-container__image" src="@/assets/background.jpg" />
    </div>
    <div class="edit-profile__container d-flex flex-column justify-content-center align-items-center">
      <div class="button__dashboard">
        <b-button to="/dashboard" size="lg" variant="outline-primary">Dashboard</b-button>
      </div>
      <div class="edit-profile__wrapper">
        <b-container fluid="false">
          <b-row align-h="start">
            <b-col cols="3">
              <b-img
                :src="user.profile.picture_large || user.profile.picture"
                width="200px"
                height="200px"
                rounded="circle"
              />
            </b-col>
            <b-col cols="6" class="text-left text-light">
              <b-tabs
                pills card
                active-nav-item-class="bg-info"
              >
                <b-tab title="Thông tin cá nhân" active>
                  <div class="d-flex flex-wrap justify">
                    <div class="edit-profile__field --family-name w-100">
                      <label>Họ</label>
                      <b-input v-model="form.profile.family_name" />
                    </div>
                    <div class="edit-profile__field --given-  name w-100">
                      <label>Tên</label>
                      <b-input v-model="form.profile.given_name" />
                    </div>
                    <div class="edit-profile__field mt-2">
                      <b-button
                        type="button"
                        variant="success"
                        class="mr-3"
                        size="lg"
                        @click="updateUserProfile">Cập nhật</b-button>
                    </div>
                  </div>
                </b-tab>
                <b-tab title="Tài khoản">
                  <div class="d-flex flex-wrap justify">
                    <div class="edit-profile__field --username w-100">
                      <label>Tên đăng nhập</label>
                      <b-input v-model="form.username" />
                    </div>
                    <div class="edit-profile__field --password w-50">
                      <label>Mật khẩu mới</label>
                      <b-input type="password" v-model="form.password" />
                    </div>
                    <div class="edit-profile__field --password w-50">
                      <label>Nhập lại mật khẩu</label>
                      <b-input type="password" v-model="form.password_again"/>
                    </div>
                    <div class="edit-profile__field mt-2">
                      <b-button
                        type="button"
                        variant="success"
                        class="mr-3"
                        size="lg"
                        @click="updateUserAccount">Cập nhật</b-button>
                    </div>
                  </div>
                </b-tab>
              </b-tabs>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
    <b-modal id="update-user-modal" ok-only @ok="reloadPage">
      {{ msg }}
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
import { repository } from '../services'

export default {
  data: () => ({
    form: {
      username: null,
      password: null,
      password_again: null,
      profile: {
        given_name: null,
        family_name: null
      }
    },
    msg: '',
    userRepo: null
  }),
  created: function() {
    this.loadingPage('The page is loading ...')
    this.userRepo = repository.get('user').configToken(this.token)
    this.userRepo.getUserById(this.user.user_id)
    .then(function (result) {
      if (result.error) {
        this.$router.push({
          name: 'Home'
        })
        return
      }
      let { profile, username } = result.data
      this.form.profile = profile
      this.form.username = username
      this.unloadingPage()
    }.bind(this))
  },
  computed: {
    ...mapGetters('auth', ['user', 'isAuthenticated', 'token'])
  },
  methods: {
    ...mapMutations('auth', ['update_user', 'update_profile']),
    ...mapMutations('web', ['loadingPage', 'unloadingPage']),

    updateUserProfile() {
      this.userRepo.updateProfile(this.user.user_id, this.form.profile)
      .then(function (result) {
        if (result.error) {
          this.popup(result.error)
          return
        }
        this.popup('Update user successfully')
        this.update_profile(result.data)
      }.bind(this))
    },
    updateUserAccount() {
      let { password, password_again } = this.form
      if (password !== password_again || password == null) {
        this.popup('Mật khẩu không khớp')
        return
      }
      this.userRepo.updateUser(this.user.user_id, this.form)
      .then(function (result) {
        if (result.error) {
          this.popup(result.error)
          return
        }
        this.popup('Update user successfully')
      }.bind(this))
    },
    popup(msg) {
      this.msg = msg
      this.$bvModal.show('update-user-modal')
    },
    reloadPage() {
      document.location.reload()
    }
  }
}
</script>

<style scoped lang="scss">
.edit-profile {
  &__container {
    position: relative;
    z-index: 2;
    height: 100vh;
    width: 100vw;
  }

  &__wrapper {
    width: 80%;
  }

  &__field {
    padding: 10px;
    padding-left: 0;

    &.--username {
      width: 100%;
    }
  }
}

.button {
  &__dashboard {
    position: fixed;
    top: 50px;
    right: 50px;
  }
}
</style>
