<template>
  <div>
    <side-panel background="#efefef" direction="horizontal-right" main-panel-class="shadow-lg">
      <div>
        <div class="d-flex justify-content-start">
          <icon-button class="m-2" btnIconName="plus-circle" variant="outline-primary" size="lg"
            v-b-tooltip.hover title="Thêm object"
            @click="_addObject" />
          <icon-button class="m-2" btnIconName="trash2" variant="danger" size="lg"
            v-b-tooltip.hover title="Xóa object"
            @click="_deleteSelectedObj"
            :disabled="!_hasObjectSelected" />
        </div>
        <div class="d-flex flex-column">
          <game-object-item
            class="mb-1 m-2"
            v-for="(object, index) in listObjects"
            :key="object.tag + object.name"
            :game-object="object"
            v-show="_isObjectInCurrentPage(index)"
            @input="_onObjectChanged(index, $event)"
            @selected="_updateSelectedObj(index)"
            @unselected="_onItemUnselected(index)"
            ref="gameObjects"/>
        </div>
        <b-pagination
          v-model="currentPage"
          :total-rows="_totalRows"
          :per-page="objectPerPage"
          :limit="3"
          ref="pagination">
        </b-pagination>
      </div>
    </side-panel>
    <b-modal id="invalid-object-modal">
      <span>Invalid value: <strong>{{ invalidValue }}</strong></span>
    </b-modal>
  </div>
</template>

<script>
import GameObjectItem from './GameObjectItem'
import SidePanel from '../Utilities/SidePanel'
import IconButton from '../Utilities/IconButton'

export default {
  name: 'GameObjectPanel',
  components: {
    GameObjectItem, SidePanel, IconButton
  },
  props: {
    objects: {
      type: Array,
      default: () => []
    }
  },
  model: {
    prop: 'objects',
    event: 'objectsChanged'
  },
  data() {
    return {
      selectedIndex: -1,
      listObjects: [...this.objects],
      objectPerPage: 3,
      currentPage: 1,
      invalidValue: null
    }
  },
  watch: {
    objects: function(newVal, oldVal) {
      this.listObjects = newVal
    }
  },
  computed: {
    _autoIncrementTagValue() {
      if (!this.listObjects || this.listObjects.length === 0) {
        return 0
      }
      return this.listObjects[this.listObjects.length - 1].tag + 1
    },
    _selectedObj() {
      return this.listObjects[this.selectedIndex]
    },
    _totalRows() {
      return this.listObjects.length
    },
    _hasObjectSelected() {
      return this.selectedIndex !== -1
    }
  },
  methods: {
    _onObjectChanged(objIndex, objVal) {
      let sameObj = this.listObjects.filter((obj, index) =>
        objIndex !== index && (obj.name === objVal.name || obj.tag === objVal.tag))[0]
      if (!sameObj) {
        return
      }
      if (sameObj.tag === objVal.tag) {
        this._showInvalidObjectValue(objVal.tag)
      } else {
        this._showInvalidObjectValue(objVal.name)
      }
      this.$refs.gameObjects[objIndex].restoreThePreviousValue()
    },
    _updateSelectedObj(index) {
      let selectedObj = this.listObjects[index]
      let preObj = this.$refs.gameObjects[this.selectedIndex]
      let shouldUnselectPreObj = false
      if (index !== this.selectedIndex && this.selectedIndex !== -1) {
        shouldUnselectPreObj = true
      }
      this.selectedIndex = index
      if (shouldUnselectPreObj) {
        preObj.unselect()
      }
      this.$emit('update:selected', selectedObj)
    },
    _onItemUnselected(index) {
      if (index !== this.selectedIndex) {
        return
      }
      this.selectedIndex = -1
    },
    _addObject() {
      let tagValue = this._autoIncrementTagValue
      this.listObjects.push({
        tag: tagValue,
        name: `Object ${tagValue}`,
        color: '#000000',
        size: { width: 1, height: 1 }
      })
      this._onObjectAdded()
    },
    _deleteSelectedObj() {
      if (this.selectedIndex === -1) {
        return
      }
      this.$delete(this.listObjects, this.selectedIndex)
      this.selectedIndex = -1
      this._onObjectDeleted()
    },
    _isObjectInCurrentPage(index) {
      let startIndex = (this.currentPage - 1) * this.objectPerPage
      let endIndex = startIndex + this.objectPerPage - 1
      return index >= startIndex && index <= endIndex
    },
    _onObjectAdded() {
      // this._navigateCurrentPage()
      console.log(this.currentPage)
    },
    _onObjectDeleted() {
      // this._navigateCurrentPage()
      console.log(this.currentPage)
    },
    _showInvalidObjectValue(obj) {
      this.invalidValue = obj
      this.$bvModal.show('invalid-object-modal')
    }
  }
}
</script>
