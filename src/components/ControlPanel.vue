<template>
  <div>
    <side-panel direction="horizontal-left" background="#eeffee">
      <div class="d-flex flex-column p-1">
        <b-button class="m-1" variant="outline-primary">Test</b-button>
        <b-button class="m-1" variant="outline-primary" @click="saveCurrentMap" :disabled="isButtonDisabled">Save and Quit</b-button>
        <b-button class="m-1" variant="outline-primary">Play and Upload</b-button>
        <b-button class="m-1" variant="outline-primary">Quit Edit Mode</b-button>
      </div>
    </side-panel>
  </div>
</template>

<script>
import SidePanel from './Utilities/SidePanel'
import { mapGetters, mapState } from 'vuex'
import { saveAs } from 'file-saver'

export default {
  name: 'ControlPanel',
  components: {
    SidePanel
  },
  data() {
    return {
      buttonClass: 'm-1 sm',
      isPanelShown: true
    }
  },
  computed: {
    ...mapState(['tabLength']),
    ...mapGetters(['currentTabData']),

    isButtonDisabled() {
      return this.tabLength === 0
    }
  },
  methods: {
    saveCurrentMap() {
      let saveObj = this.currentTabData.save()
      var blob = new Blob([JSON.stringify(saveObj)], { type: 'application/json' })
      let fileName = 'map_' + this.currentTabData.title.toLowerCase()
      saveAs(blob, fileName)
    }
  }
}
</script>

<style scoped lang="scss">
  .button-wrapper {
    background-color: #eeffee;
  }
</style>
