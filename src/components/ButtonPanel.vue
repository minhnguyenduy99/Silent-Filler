<template>
  <div>
    <side-panel direction="vertical-top" background="#efefef">
      <div>
        <b-container class="p-3" fluid="false">
          <b-row align-h="start">
            <icon-button :disabled="_blockButtonDisabled" size="lg" class="btn--block col col-1" btnIconName="square" btnTitle="Block mode" @click="onBlockButtonClicked"></icon-button>
            <icon-button
              :disabled="_drawButtonDisabled"
              size="lg"
              class="btn--eraser col col-1"
              toggle toggleIconName="archive" toggleTitle="Erase mode"
              btnIconName="pencil" btnTitle="Draw mode"
              :pressed="isDrawButtonPressed"
              @click="onEraseModeButtonClicked"
              @press-changed="_toggleStateDrawButton"
            />
            <icon-button
              size="lg"
              class="btn--duplicate col col-1"
              btnIconName="files" btnTitle="Duplicate"
              @click="onDuplicateButtonClicked"
              :disabled="_duplicateButtonDisabled"
            />
            <icon-button size="lg" class="btn--add col col-1" btnIconName="plus-circle" btnTitle="Add" @click="onAddNewTabButtonClicked"></icon-button>
            <size-input
              square
              v-model="localCellSize"
              class="btn--cell-size-modify col col-1"
              :disabled="_isCellSizeModifyButtonDisabled">
              <icon-button
                :disabled="_isCellSizeModifyButtonDisabled"
                class="text-dark"
                btnIconName="pencil-square" btnTitle="Cell size" size="lg">
              </icon-button>
            </size-input>
            <b-form-file
              size="lg"
              v-model="file"
              @input="onFileUploaded"
              class="col"
              browse-text="Upload"
              :disabled="_isFormInputDisabled"/>
          </b-row>
        </b-container>
      </div>
    </side-panel>
    <load-file-command ref='load-file' :file="file"/>
    <draw-map-command ref='draw-map' />
  </div>
</template>

<script>
import SidePanel from './Utilities/SidePanel'
import IconButton from './Utilities/IconButton'
import SizeInput from './Utilities/SizeInput'
import { LoadFileCommand, DrawMapCommand } from './Commands'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'ButtonPanel',
  components: {
    SidePanel, IconButton, LoadFileCommand, DrawMapCommand, SizeInput
  },
  data: () => {
    return {
      cursorIconSources: [
        'eraser.png'
      ],
      file: null,
      isDrawButtonPressed: false,
      localCellSize: 32
    }
  },
  watch: {
    localCellSize: function (newVal, oldVal) {
      this.currentTabData.cellSize = newVal
    }
  },
  computed: {
    ...mapState(['AVAILABLE_MODE', 'tabLength', 'mode']),
    ...mapGetters(['lengthOfTabs', 'isImageLoaded', 'isMapLoaded', 'currentTabData']),

    _blockButtonDisabled() {
        return this.lengthOfTabs === 0 || !this.isImageLoaded
    },
    _drawButtonDisabled() {
      return this.lengthOfTabs === 0 || !this.isMapLoaded
    },
    _duplicateButtonDisabled() {
      return this.lengthOfTabs === 0
    },
    _isCellSizeModifyButtonDisabled() {
      return this.lengthOfTabs === 0 || !this.isImageLoaded || this.isMapLoaded
    },
    _isFormInputDisabled() {
      return this.lengthOfTabs === 0 || this.isMapLoaded
    }
  },
  methods: {
    ...mapActions(['changeMode']),

    onFileUploaded(file) {
      this.file = file
      this.$emit('fileUploaded', file)
    },
    onBlockButtonClicked(ev) {
      this.$refs['draw-map'].execute()
      this.$emit('blockClicked', ev)
    },
    onEraseModeButtonClicked() {
      switch (this.mode) {
        case this.AVAILABLE_MODE.DRAW_MODE: this.changeMode(this.AVAILABLE_MODE.ERASE_MODE); break
        case this.AVAILABLE_MODE.ERASE_MODE: this.changeMode(this.AVAILABLE_MODE.DRAW_MODE); break
      }
      this.$emit('eraseButtonClicked', this)
    },
    onAddNewTabButtonClicked() {
      this.$emit('addNewTabButtonClicked', this)
    },
    onDuplicateButtonClicked() {
      this.$emit('duplicateButtonClicked', this)
    },
    _toggleStateDrawButton(newVal) {
      this.isDrawButtonPressed = newVal
    }
  }
}
</script>

<style scoped lang="scss">
  .panel-background {
    opacity: 0.3;
    background-color: #bbbbbb;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
</style>
