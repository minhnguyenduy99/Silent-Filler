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
    <loading-dialog v-model="isTabLoading" :centered="true" :content="content"/>
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
import { mapMutations, mapGetters, mapState } from 'vuex'

export default {
  name: 'EditMap',
  components: {
    ButtonPanel, ControlPanel, GameObjectPanel, LoadingDialog, DrawTab
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
      content: 'Đang load hình ảnh ...'
    }
  },
  watch: {
    currentTabIndex: function(newVal, oldVal) {
      this.currentTab = this.tabs[newVal]
      this.updateCurrentTab(this.tabComponents[this.currentTabIndex])
    }
  },
  created: function() {
    this.updateCurrentTab(this.currentTab)
  },
  computed: {
    ...mapGetters(['lengthOfTabs']),

    tabComponents() {
      return this.$refs['draw-tabs']
    },
    currentTabData() {
      return this.currentTab.tab
    }
  },
  methods: {
    ...mapMutations(['updateCurrentTab', 'updateLengthTab']),

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
