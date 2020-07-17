<template>
  <div>
    <player-item
      v-if="_isMapLoaded"
      :game-object="_player"
      @selected="_onPlayerSelected"
      @unselected="_onPlayerUnselected"
      ref="player-item"
    />
    <b-modal id="player-error-modal">
      <span><strong>{{ errorMsg }}</strong></span>
    </b-modal>
  </div>
</template>

<script>
import PlayerItem from './PlayerItem'
import { mapMutations, mapState, mapGetters } from 'vuex'
import { Player } from '../MapUtilities'

export default {
  name: 'PlayerItemPanel',
  components: {
    PlayerItem
  },
  data: () => ({
    OBJ_NAME_EXISTS_MSG: 'Tên của object đã tồn tại',
    errorMsg: null
  }),
  watch: {
    activePanel: function(newVal) {
      if (newVal === 2 || !this.tab) {
        return
      }
      this.$refs['player-item'].unselect()
    }
  },
  computed: {
    ...mapState('map-edit', {
      tab: 'currentTab',
      AVAILABLE_MODE: 'AVAILABLE_MODE'
    }),
    ...mapGetters('map-edit', {
      mode: 'mode',
      tabData: 'currentTabData',
      activePanel: 'currentActivePanel'
    }),

    _player() {
      return this.tabData ? this.tabData.player : Player.create()
    },

    _isMapLoaded() {
      return this.tabData ? this.tabData.isMapLoaded() : false
    }
  },
  methods: {
    ...mapMutations('map-edit', ['updateActivePanel']),

    _showErrorDialog(error) {
      this.errorMsg = error
      this.$bvModal.show('player-error-modal')
    },
    _onPlayerSelected() {
      this.tabData.isPlayerSelected = true
      this.updateActivePanel(2)
    },
    _onPlayerUnselected() {
      this.tabData.isPlayerSelected = false
    }
  }
}
</script>

<style scoped>
</style>
