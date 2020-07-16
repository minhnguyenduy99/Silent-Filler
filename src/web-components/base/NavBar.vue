<template>
  <nav class="navigation px-5 pt-5 pb-0 d-flex justify-content-end">
    <div class="user-info" v-if="user.picture">
      <b-dropdown
        :variant="variant" no-caret :menu-class="dropdownBg" toggle-class="p-0 border-0">
        <b-button slot="button-content" :variant="buttonVariant" size="lg" class="d-flex align-items-center">
          <b-avatar class="d-inline-block" :src="user.picture"></b-avatar>
          <h5 :class="textClass">{{ user.family_name }}</h5>
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
    }
  },
  data: () => ({
    TEXT_CLASS: [
      'd-inline-block', 'm-0', 'ml-3'
    ]
  }),
  computed: {
    ...mapGetters('auth', {
      user: 'user'
    }),
    textClass() {
      return [...this.TEXT_CLASS, `text-${this.textVariant}`]
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
