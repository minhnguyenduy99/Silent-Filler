<template>
  <div class="editor-page position-absolute d-flex justify-content-center">
    <button-panel
      class="panel panel__button"
      @fileUploaded="loadGameInfo"></button-panel>
    <control-panel class="panel panel__control"></control-panel>
    <!-- <color-picker class="panel panel__color"></color-picker> -->
    <game-object-panel
      :objects="_gameObjects"
      v-bind:selected.sync="currentSelectedObj"
      class="panel panel__objects"
    />
    <div class="edit-area">
      <map-drawer
        :drawObject="currentSelectedObj"
        :colors="_listColorsByTag"
        :map="_map" ref="map-drawer"/>
    </div>
  </div>
</template>

<script>
import ButtonPanel from '../components/ButtonPanel'
import ControlPanel from '../components/ControlPanel'
// import ColorPicker from '../components/ColorPicker/ColorPicker'
import GameObjectPanel from '../components/GameObjectPanel/GameObjectPanel'
import GridCellLayout from '../components/GridDrawer/GridCellLayout'
import MapDrawer from '../components/GridDrawer/MapDrawer'

export default {
  name: 'Test',
  components: {
    ButtonPanel, ControlPanel, GameObjectPanel, MapDrawer
  },
  data() {
    return {
      gameInfo: {
        objects: [],
        map: [[]],
        tags: []
      },
      currentSelectedObj: null,
      currentSelectedCell: null,
      isLoaded: false
    }
  },
  watch: {
    currentSelectedObj: function(newVal, oldVal) {
      console.log(newVal)
    }
  },
  computed: {
    _listColorsByTag() {
      return this.gameInfo.objects.map(object => object.color)
    },
    _tags() {
      return this.gameInfo.tags
    },
    _map() {
      return this.gameInfo.map
    },
    _gameObjects() {
      let listObjects = this.gameInfo.objects
      return Object.keys(this._tags).map(function(tagKey) {
        let tag = this._tags[tagKey]
        return {
          name: tagKey,
          tag: tag,
          color: listObjects[tag].color,
          size: listObjects[tag].size
        }
      }.bind(this))
    }
  },
  methods: {
    changeEditorImage(file) {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = evt => {
        let img = new Image()
        img.onload = () => {
          this.image.width = img.width
          this.image.height = img.height
          this.image.src = img.src
        }
        img.src = evt.target.result
      }

      reader.onerror = evt => {
        console.error(evt)
      }
    },
    loadGameInfo(file) {
      this.isLoaded = false
      let reader = new FileReader()
      reader.readAsText(file, 'utf-8')
      reader.onload = function(evt) {
        this.gameInfo = JSON.parse(evt.target.result)
        this.isLoaded = false
      }.bind(this)
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

.edit-area {
  position: relative;
  display: flex;
  margin: 100px;

  & &__image {
    position: absolute;
    z-index: 0;
  }
}
</style>
