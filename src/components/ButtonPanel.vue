<template>
  <div>
    <side-panel direction="vertical-top" background="#efefef">
      <div>
        <b-container class="p-3" fluid="false">
          <b-row class="flex-wrap justify-items-start" cols="7" align-h="start">
            <icon-button class="btn--block col col-auto" :disabled="_blockButtonDisabled" size="lg" btnIconName="square" btnTitle="Block mode" @click="onBlockButtonClicked"></icon-button>
            <icon-button class="btn--draw col col-auto" :pressed="_isDrawMode" :disabled="_drawButtonDisabled" size="lg" btnIconName="pencil" btnTitle="Draw" @click="onDrawButtonClicked"></icon-button>
            <b-dropdown class="col col-auto align-items-start"
              no-caret
              toggle-class="p-0"
              menu-class="w-100"
              variant="transparent"
              ref="erase-panel"
              :disabled="_eraseButtonDisabled"
              >
              <icon-button
                slot="button-content"
                size="lg"
                class="btn--erase"
                btnIconName="file-break"
                btnTitle="Erase"
                :pressed="isEraseMode"
                :disabled="_eraseButtonDisabled"
                @click="onEraseButtonClicked" />
              <div class="p-2 d-flex flex-column">
                <b-button
                  class="text-left"
                  variant="outline-primary"
                  @click="eraseMapButtonClicked"
                  :pressed="!_isEraseObjectMode">
                  <b-icon icon="file-break"></b-icon> Erase map
                </b-button>
                 <b-button
                  variant="outline-primary"
                  class="mt-2 text-left"
                  @click="eraseObjectButtonClicked"
                  :pressed="_isEraseObjectMode">
                  <b-icon icon="file-break"></b-icon> Erase object
                </b-button>
              </div>
            </b-dropdown>
            <b-dropdown class="col col-auto align-items-start"
              no-caret
              toggle-class="p-0"
              menu-class="p-0 border-0"
              variant="transparent"
              ref="drop-down-panel"
              :disabled="_playObjectPanelDisabled"
              @toggle="toggleShow"
              @hide="_beforeHidden">
              <icon-button :disabled="_playObjectPanelDisabled" size="lg" slot="button-content" btnIconName="view-list" btnTitle="Objects"></icon-button>
              <div class="p-2 shadow-lg" style="width: 300px; background-color: rgb(230, 230, 230)">
                <playable-object-panel ref="object-panel"></playable-object-panel>
              </div>
            </b-dropdown>
            <size-input
              class="col col-auto btn--cell-size-modify"
              square
              v-model="localCellSize"
              :disabled="_isCellSizeModifyButtonDisabled">
              <icon-button
                :disabled="_isCellSizeModifyButtonDisabled"
                class="text-dark"
                btnIconName="pencil-square" btnTitle="Cell size" size="lg">
              </icon-button>
            </size-input>
            <b-dropdown class="col col-auto align-items-start"
              no-caret
              toggle-class="p-0"
              menu-class="w-100"
              variant="transparent"
              ref="drop-down-panel"
              >
              <icon-button slot="button-content" size="lg" class="btn--add" btnIconName="grid-fill" btnTitle="Others"></icon-button>
              <b-dropdown-item-button
                variant="primary"
                @click="onAddNewTabButtonClicked"
              >
                New tab
              </b-dropdown-item-button>
              <b-dropdown-item-button
                variant="primary"
                @click="onDuplicateButtonClicked"
              >
                Duplicate tab
              </b-dropdown-item-button>
              <b-form-file
                class="mx-3 w-100"
                size="sm"
                v-model="file"
                @input="onFileUploaded"
                browse-text="Upload"
                placeholder=""
                :disabled="_isFormInputDisabled"
                ref="file-uploader"
              >
                <template slot="file-name" slot-scope="{ names }">
                  <b-badge variant="dark">{{ names[0] }}</b-badge>
                </template>
              </b-form-file>
            </b-dropdown>
            <div class="col col-xl-6 col-lg-4 col-md-2 col-1">
            </div>
          </b-row>
        </b-container>
      </div>
    </side-panel>
    <load-file-command ref='load-file' :file="file"/>
    <draw-map-command ref='draw-map' />
    <reset-map-command ref='reset-map' />
  </div>
</template>

<script>
import SidePanel from './Utilities/SidePanel'
import IconButton from './Utilities/IconButton'
import SizeInput from './Utilities/SizeInput'
import PlayableObjectPanel from './PlayableObjectPanel/PlayableObjectPanel'
import { LoadFileCommand, DrawMapCommand, ResetMapCommand } from './Commands'
import { mapActions, mapState, mapGetters } from 'vuex'
import { Closable } from './Utilities/Directives'

export default {
  name: 'ButtonPanel',
  components: {
    SidePanel, IconButton, SizeInput, PlayableObjectPanel, LoadFileCommand, DrawMapCommand, ResetMapCommand
  },
  directives: {
    Closable
  },
  data: () => {
    return {
      cursorIconSources: [
        'eraser.png'
      ],
      file: null,
      isDrawButtonPressed: false,
      localCellSize: 32,
      isClickOutSide: false,
      isObjectPanelShown: true
    }
  },
  watch: {
    localCellSize: function (newVal, oldVal) {
      this.currentTabData.cellSize = newVal
    }
  },
  mounted: function () {
  },
  computed: {
    ...mapState(['AVAILABLE_MODE', 'AVAILABLE_ERASE_MODE', 'tabLength', 'mode', 'eraseMode']),
    ...mapGetters(['lengthOfTabs', 'isImageLoaded', 'isMapLoaded', 'currentTabData', 'isEraseMode']),

    _blockButtonDisabled() {
        return this.lengthOfTabs === 0 || !this.isImageLoaded
    },
    _drawButtonDisabled() {
      return this.lengthOfTabs === 0 || !this.isMapLoaded
    },
    _eraseButtonDisabled() {
      return this.lengthOfTabs === 0 || !this.isMapLoaded
    },
    _playObjectPanelDisabled() {
      return this.mode === this.AVAILABLE_MODE.ERASE_MODE
    },
    _duplicateButtonDisabled() {
      return this.lengthOfTabs === 0
    },
    _isCellSizeModifyButtonDisabled() {
      return this.lengthOfTabs === 0 || !this.isImageLoaded || this.isMapLoaded
    },
    _isFormInputDisabled() {
      return this.lengthOfTabs === 0 || this.isMapLoaded
    },
    _othersButtonDisabled() {
      return this.lengthOfTabs === 0
    },
    _isDrawMode() {
      return this.mode === this.AVAILABLE_MODE.DRAW_MODE
    },
    _isEraseObjectMode() {
      return this.eraseMode === this.AVAILABLE_ERASE_MODE.OBJECT
    }
  },
  methods: {
    ...mapActions(['changeMode', 'changeEraseMode']),

    onFileUploaded(file) {
      this.file = file
      this.$emit('fileUploaded', file)
    },
    onBlockButtonClicked(ev) {
      if (this.isMapLoaded) {
        this.$refs['reset-map'].execute()
      } else {
        this.$refs['draw-map'].execute()
      }
      this.$emit('blockClicked', ev)
    },
    onDrawButtonClicked(ev) {
      if (this._isDrawMode) {
        return
      }
      this._switchMode()
      this.$emit('drawButtonClicked', ev)
    },
    onEraseButtonClicked(ev) {
      if (this.isEraseMode) {
        return
      }
      this._switchMode()
      this.$emit('eraseButtonClicked', ev)
    },
    eraseObjectButtonClicked() {
      if (!this.isEraseMode) {
        return
      }
      this.changeEraseMode(this.AVAILABLE_ERASE_MODE.OBJECT)
      this.$refs['erase-panel'].hide()
    },
    eraseMapButtonClicked() {
      if (!this.isEraseMode) {
        return
      }
      this.changeEraseMode(this.AVAILABLE_ERASE_MODE.MAP)
      this.$refs['erase-panel'].hide()
    },
    onAddNewTabButtonClicked() {
      this.$emit('addNewTabButtonClicked', this)
    },
    onDuplicateButtonClicked() {
      this.$emit('duplicateButtonClicked', this)
    },
    onUploadFileClicked() {
      this.$refs['file-uploader'].$el.click()
    },
    _toggleStateDrawButton(newVal) {
      this.isDrawButtonPressed = newVal
    },
    _beforeHidden(e) {
      if (this.isObjectPanelShown) {
        return
      }
      e.preventDefault()
    },
    _switchMode() {
      switch (this.mode) {
        case this.AVAILABLE_MODE.DRAW_MODE: {
          this.changeMode(this.AVAILABLE_MODE.ERASE_MODE)
          this.toggleShow()
          break
        }
        case this.AVAILABLE_MODE.ERASE_MODE: this.changeMode(this.AVAILABLE_MODE.DRAW_MODE); break
      }
    },
    toggleShow() {
      this.isObjectPanelShown = !this.isObjectPanelShown
      if (!this.isObjectPanelShown) {
        this.$refs['drop-down-panel'].hide()
      }
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
