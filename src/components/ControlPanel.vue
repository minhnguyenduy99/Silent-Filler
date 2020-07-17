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
    <b-modal id="save-object-modal">
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
      msg: null
    }
  },
  computed: {
    ...mapState('map-edit', ['isNewMap', 'tabLength', 'mapObj']),
    ...mapGetters('map-edit', ['currentTabData']),

    isButtonDisabled() {
      return this.tabLength === 0
    }
  },
  methods: {
    ...mapActions('map', ['updateMap', 'createMap']),
    ...mapMutations('map-edit', ['updateIsNewMap', 'updateMapObj']),

    saveCurrentMap() {
      let saveObj = this.currentTabData.save()
      console.log(saveObj)
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
      this.createMap(mapObj).then((mapObj) => {
        this.notifyMsg('Thêm map thành công')
        this.updateIsNewMap(false)
        this.updateMapObj(mapObj)
      }).catch(err => {
        this.notifyMsg(err)
      })
    },

    async saveMap(saveObj) {
      let mapObj = {}
      let id = this.mapObj.id
      mapObj.map_file = readFileHelper.toFileFromObject(saveObj, `${this.mapObj.map_name}.json`)
      mapObj.map_image = await readFileHelper.toFileFromURL(this.currentTabData.imageSrc, this.mapObj.map_name)
      mapObj.map_name = this.mapObj.map_name
      this.updateMap({
        id: id,
        data: mapObj
      }).then(() => {
        this.notifyMsg('Cập nhật map thành công')
      }).catch(err => {
        this.notifyMsg(err)
      })
    },

    notifyMsg(msg) {
      this.msg = msg
      this.$bvModal.show('save-object-modal')
    }
  }
}
</script>

<style scoped lang="scss">
  .button-wrapper {
    background-color: #eeffee;
  }
</style>
