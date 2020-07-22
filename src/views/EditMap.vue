<template>
  <div class="editor-page position-absolute d-flex justify-content-center">
    <button-panel
      class="panel panel__button"
      @addNewTabButtonClicked="createNewTab"
      @duplicateButtonClicked="duplicateCurrentTab"></button-panel>
    <control-panel class="panel panel__control"></control-panel>
    <!-- <color-picker class="panel panel__color"></color-picker> -->
    <game-object-panel
      v-if="tabs.length > 0"
      class="panel panel__objects"
    />
    <div v-if="tabs.length === 0" class="empty-area">
      <div class="empty-area__content-container">
        <span class="h1">No tabs created yet !</span>
        <b-button class="mt-2" size="lg" variant="outline-dark" @click="createNewTab">Create new</b-button>
      </div>
    </div>
    <b-card id="tab-card" no-body class="m-5">
      <b-tabs
        card
        v-model="currentTabIndex">
        <draw-tab v-for="(tab, index) in tabs" :key="tab.id"
          :tab="tab"
          ref='draw-tabs'
          @on-remove="removeTab(index)"
        />
      </b-tabs>
    </b-card>
    <b-modal id="editmap-modal" centered>
      {{ errorMsg }}
    </b-modal>
    <loading-dialog v-model="isTabLoading" :centered="true" :content="content"/>
    <draw-map-command ref="drawer"/>
    <load-file-command :url="fileMap" lazy ref="map-loader"/>
    <load-file-command :url="image" lazy ref="image-loader"/>
  </div>
</template>

<script>
import ButtonPanel from '../components/ButtonPanel'
import ControlPanel from '../components/ControlPanel'
// import ColorPicker from '../components/ColorPicker/ColorPicker'
import GameObjectPanel from '../components/GameObjectPanel/GameObjectPanel'
import GridCellLayout from '../components/GridDrawer/GridCellLayout'
import LoadingDialog from '../components/Utilities/LoadingDialog'
import { DrawTab, TabObject } from '../components/DrawTab'
import { mapMutations, mapState } from 'vuex'
import { DrawMapCommand, LoadFileCommand } from '../components/Commands'
import { repository } from '../services'

export default {
  name: 'EditMap',
  components: {
    ButtonPanel, ControlPanel, GameObjectPanel, LoadingDialog, DrawTab, DrawMapCommand, LoadFileCommand
  },
  data() {
    return {
      currentSelectedObj: null,
      currentSelectedCell: null,
      isTabLoading: false,
      tabs: [],
      currentTab: null,
      generateTabIndex: 0,
      currentTabIndex: -1,
      map: null,
      content: 'Đang load hình ảnh ...',
      fileMap: null,
      image: null,
      loadedByResource: false,
      mapRepo: null,
      errorMsg: null
    }
  },
  watch: {
    currentTabIndex: function(newVal, oldVal) {
      console.log(this.$store)
      this.currentTab = this.tabs[newVal]
      this.updateCurrentTab(this.tabComponents[newVal])
    }
  },
  created: function() {
    this.mapRepo = repository.get('map').configToken(this.$store.getters['auth/token'])
    this.createNewTab()
    this.updateCurrentTab(this.currentTab)
    let mapId = this.$route.params.id
    if (!mapId) {
      this.updateIsNewMap(true)
      return
    }
    this.updateIsNewMap(false)
    this.mapRepo.getMapById(mapId)
    .then(function (result) {
      if (result.error) {
        this.$router.push({
          name: 'ListMap'
        })
        return
      }
      this.updateMapObj(result.data)
    }.bind(this))
  },
  computed: {
    ...mapState('map-edit', ['mapObj']),

    tabComponents() {
      return this.$refs['draw-tabs']
    }
  },
  methods: {
    ...mapMutations('map-edit', ['updateCurrentTab', 'updateLengthTab', 'updateMapObj', 'updateIsNewMap']),

    createNewTab() {
      let newTab = new TabObject()
      newTab.title = `Tab ${this.generateTabIndex + 1}`
      this.tabs.push(newTab)
      this._onTabAdded()
    },
    duplicateCurrentTab() {
      let newTab = this.tabs[this.currentTabIndex].copy()
      newTab.title = `Tab ${this.generateTabIndex + 1}`
      this.tabs.push(newTab)
      this._onTabAdded()
    },
    removeTab(index) {
      this.tabs.splice(index, 1)
      this._onTabRemoved()
    },
    _onTabAdded() {
      this.generateTabIndex++
      this.updateLengthTab(this.tabs.length)
    },
    _onTabRemoved() {
      if (this.tabs.length === 0) {
        this.generateTabIndex = 0
      }
    },
    openModal(msg) {
      this.errorMsg = msg
      this.$bvModal.show('editmap-modal')
    }
  }
}
</script>

<style scoped lang="scss">

.editor-page {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
}

.panel {
  position: fixed;
  z-index: 2;

  &__button {
    top: 0;
    left: 0;
    width: 100%;
  }

  &__control {
    left: 0;
    top: 32%;
  }

  &__objects {
    right: 0;
    top: 20%;
  }

  &__color {
    right: 0;
    top: 35%;
  }
}

.empty-area {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  & &__content-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
</style>
