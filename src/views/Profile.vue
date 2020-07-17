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
                :src="user.picture_large || user.picture"
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
                      <b-input v-model="form.family_name" />
                    </div>
                    <div class="edit-profile__field --given-  name w-100">
                      <label>Tên</label>
                      <b-input v-model="form.given_name" />
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
                      <b-input v-model="form.user.username" />
                    </div>
                    <div class="edit-profile__field --password w-50">
                      <label>Mật khẩu mới</label>
                      <b-input type="password" v-model="form.user.password" />
                    </div>
                    <div class="edit-profile__field --password w-50">
                      <label>Nhập lại mật khẩu</label>
                      <b-input type="password" v-model="form.user.password_again"/>
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
    <b-modal id="update-user-modal">
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
      given_name: null,
      family_name: null,
      user: {
        username: null,
        password: null,
        password_again: null
      }
    },
    msg: ''
  }),
  created: function() {
    if (!this.isAuthenticated) {
      this.$router.push('/')
    }
  },
  mounted: function() {
    let { user, given_name, family_name, picture_large, picture } = this.user
    this.form.user = user
    this.form.given_name = given_name
    this.form.family_name = family_name
  },
  computed: {
    ...mapGetters('auth', {
      isAuthenticated: 'isAuthenticated',
      user: 'user'
    })
  },
  methods: {
    updateUserProfile() {
      let profile = {
        given_name: this.form.given_name,
        family_name: this.form.family_name
      }
      this.$store.dispatch('auth/updateProfile', this.user.id, profile)
      .then(result => {
        this.popup('Cập nhật thành công')
      })
      .catch(err => {
        this.popup('Cập nhật thất bại')
        console.log(err)
      })
    },
    updateUserAccount() {
      let user = this.form.user
      let { password, password_again } = this.form.user
      if (password !== password_again || password == null) {
        this.popup('Mật khẩu không khớp')
        return
      }
      this.$store.dispatch('auth/updateAccount', this.user.id, user)
      .then(result => {
        this.popup('Cập nhật thành công')
        this.form.user.password = this.form.user.password_again = null
      })
      .catch(err => {
        this.popup('Cập nhật thất bại')
        console.log(err)
      })
    },
    popup(msg) {
      this.msg = msg
      this.$bvModal.show('update-user-modal')
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
