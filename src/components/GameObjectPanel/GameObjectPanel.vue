<template>
  <div>
    <side-panel background="#efefef" direction="horizontal-right" main-panel-class="shadow-lg">
      <div class="d-flex flex-column">
        <game-object-item
          class="mb-1 m-2"
          v-for="object in listObjects"
          :key="object.id"
          :game-object="object"
          @selected="updateSelectedObj"
          @unselected="updateSelectedObj(null)"
          ref="gameObjects"/>
      </div>
    </side-panel>
  </div>
</template>

<script>
import GameObjectItem from './GameObjectItem'
import SidePanel from '../SidePanel'

export default {
  name: 'GameObjectPanel',
  components: {
    GameObjectItem, SidePanel
  },
  props: {
    objects: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selected: null,
      listObjects: this.objects
    }
  },
  watch: {
    objects: function(newVal, oldVal) {
      this.listObjects = newVal
    }
  },
  methods: {
    updateSelectedObj(obj) {
      if (this.selected && this.selected !== obj) {
        this.selected.unselect()
      }
      this.selected = obj
      this.$emit('update:selected', this.selected)
    }
  }
}
</script>
