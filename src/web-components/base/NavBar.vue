<template>
  <nav :class="getNavClass">
    <b-button :class="dashboardClass" v-if="dashboard" to="/dashboard" size="lg" variant="outline-primary">Dashboard</b-button>
    <div class="user-info">
      <b-dropdown
        :variant="variant" no-caret :menu-class="dropdownBg" toggle-class="p-0 border-0">
        <b-button slot="button-content" :variant="buttonVariant" size="lg" class="d-flex align-items-center">
          <b-avatar class="d-inline-block" :src="user.profile.picture"></b-avatar>
          <h5 :class="textClass">{{ user.profile.given_name }}</h5>
        </b-button>
        <div class="d-flex flex-column p-2">
          <b-button type="link" variant="outline-light" to="profile">Profile</b-button>
          <b-button class="mt-2" type="link" variant="outline-light" @click="logout">Logout</b-button>
        </div>
      </b-dropdown>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'NavBar',
  props: {
    variant: {
      type: String,
      required: false,
      default: () => 'outline-info'
    },
    'dropdownBg': {
      type: String,
      required: false,
      default: () => 'bg-info'
    },
    'buttonVariant': {
      type: String,
      required: false,
      default: () => 'outline-info'
    },
    'textVariant': {
      type: String,
      required: false,
      default: () => 'light'
    },
    dashboard: {
      type: Boolean,
      required: false,
      default: () => false
    },
    dashboardClass: {
      type: String,
      required: false,
      default: () => ''
    }
  },
  data: () => ({
    TEXT_CLASS: [
      'd-inline-block', 'm-0', 'ml-3'
    ]
  }),
  computed: {
    ...mapGetters('auth', ['user']),
    textClass() {
      return [...this.TEXT_CLASS, `text-${this.textVariant}`]
    },
    getNavClass() {
      let baseNavClass = ['navigation', 'px-5', 'pt-5', 'pb-0', 'd-flex', 'align-items-center']
      if (this.dashboard) {
        baseNavClass.push('justify-content-between')
      } else {
        baseNavClass.push('justify-content-end')
      }
      return baseNavClass
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
    }
  }
}
</script>

<style lang="stylus">
</style>
