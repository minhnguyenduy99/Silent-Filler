<template>
  <div>
    <side-panel direction="horizontal-left" background="#eeffee">
      <div class="d-flex flex-column p-1">
        <b-button class="m-1" variant="outline-primary" @click="saveCurrentMap" :disabled="isButtonDisabled">Save and Quit</b-button>
        <b-button class="m-1" variant="outline-primary" @click="notifyUnderDevelopment">Test</b-button>
        <b-button class="m-1" variant="outline-primary" @click="notifyUnderDevelopment">Play and Upload</b-button>
        <b-button class="m-1" variant="outline-primary" @click="notifyUnderDevelopment">Quit Edit Mode</b-button>
      </div>
    </side-panel>
    <b-modal id="save-object-modal" ok-only hide-header>
      <span><strong>{{ msg }}</strong></span>
    </b-modal>
  </div>
</template>

<script>
import SidePanel from './Utilities/SidePanel'
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import { saveAs } from 'file-saver'
import { readFileHelper, repository } from '../services'

export default {
  name: 'ControlPanel',
  components: {
    SidePanel
  },
  data() {
    return {
      buttonClass: 'm-1 sm',
      isPanelShown: true,
      msg: null,
      mapRepo: null
    }
  },
  created: function() {
    this.mapRepo = repository.get('map').configToken(this.$store.getters['auth/token'])
  },
  computed: {
    ...mapState('map-edit', ['isNewMap', 'tabLength', 'mapObj']),
    ...mapGetters('map-edit', ['currentTabData']),

    isButtonDisabled() {
      return this.tabLength === 0
    }
  },
  methods: {
    ...mapMutations('map-edit', ['updateIsNewMap', 'updateMapObj']),
    ...mapMutations('web', ['loadingPage', 'unloadingPage']),

    saveCurrentMap() {
      let saveObj = this.currentTabData.save()
      console.log(saveObj)
      this.loadingPage('Saving map ...')
      if (this.isNewMap) {
        this.createNewMap(saveObj)
        return
      }
      this.saveMap(saveObj)
    },

    createNewMap(saveObj) {
      let mapObj = {}
      let id = this.mapObj.id
      mapObj.map_file = readFileHelper.toFileFromObject(saveObj, `${this.mapObj.map_name}.json`)
      mapObj.map_image = readFileHelper.toImageFileFromBase64(this.currentTabData.imageSrc, this.mapObj.map_name)
      mapObj.map_name = this.mapObj.map_name
      this.mapRepo.createMap(mapObj)
      .then(function (result) {
        this.unloadingPage()
        if (result.error) {
          this.notifyMsg(result.error)
          return
        }
        this.notifyMsg('Create map successfully...')
        this.updateIsNewMap(false)
        this.updateMapObj(result.data)
      }.bind(this))
    },

    async saveMap(saveObj) {
      let mapObj = {}
      let id = this.mapObj.id
      mapObj.map_file = readFileHelper.toFileFromObject(saveObj, `${this.mapObj.map_name}.json`)
      mapObj.map_image = await readFileHelper.toFileFromURL(this.currentTabData.imageSrc, this.mapObj.map_name)
      mapObj.map_name = this.mapObj.map_name
      this.mapRepo.updateMap(id, mapObj)
      .then(function (result) {
        this.unloadingPage()
        if (result.error) {
          this.notifyMsg(result.error)
          return
        }
        this.notifyMsg('Update map successfully')
      }.bind(this))
    },

    notifyMsg(msg) {
      this.msg = msg
      this.$bvModal.show('save-object-modal')
    },

    notifyUnderDevelopment() {
      this.notifyMsg('This feature is under development')
    }
  }
}
</script>

<style scoped lang="scss">
  .button-wrapper {
    background-color: #eeffee;
  }
</style>
