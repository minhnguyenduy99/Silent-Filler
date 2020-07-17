<template>
  <div id="app">
    <router-view/>
    <loading-dialog :show="isPageLoading" :content="content" :centered="true"/>
  </div>
</template>

<script>
import LoadingDialog from 'webcomponents/Utilities/LoadingDialog.vue'
import { mapGetters, mapMutations, mapState } from 'vuex'
export default {
  components: {
    LoadingDialog
  },
  computed: {
    ...mapState('web', ['loadingContent']),
    ...mapGetters('web', ['isPageLoading']),

    content() {
      return this.loadingContent
    }
  }
}
</script>

<style lang="scss">
@import './styles/animates.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
