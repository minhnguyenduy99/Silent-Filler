<template>
  <b-card
    :style="_cardStyle"
    class="game-object__container p-3" bg-variant="info"
    @click="toggleSelect"
    >
    <b-container fluid="false" style="max-width: 200px">
      <b-row no-gutters class="text-light justify-content-between" align-v="center">
        <b-form-input class="col col-12 p-2" ref="name-input" @click.stop type="text" required lazy v-model="name" placeholder="Object name" :disabled="!isSelected"></b-form-input>
        <b-form-input class="col p-2 mt-2 mr-2" v-b-tooltip.hover title="Tag" ref="tag-input" @click.stop type="text" placeholder="Tag" required lazy v-model.number="tag" disabled></b-form-input>
        <color-input class="col col-auto mt-2" @click.stop v-model="color" size="lg" :disabled="!isSelected"></color-input>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
import ColorInput from '../ColorPicker/ColorInput'
import { StaticObject } from '../MapUtilities'

export default {
  name: 'GameObjectItem',
  components: {
    ColorInput
  },
  props: {
    gameObject: {
      type: StaticObject,
      required: true
    }
  },
  model: {
    prop: 'gameObject',
    event: 'input'
  },
  data: function () {
    return {
      tag: this.gameObject.tag,
      name: this.gameObject.name,
      color: this.gameObject.color,
      isCreated: false,
      localGameObject: this.gameObject,
      isSelected: false,
      preKeyValueStack: []
    }
  },
  mounted: function() {
    this.select()
  },
  watch: {
    name: function(newVal) {
      this._setGameObjectValue('name', newVal)
    },
    tag: function(newVal) {
      this._setGameObjectValue('tag', newVal)
    },
    color: function(newVal) {
      this._setGameObjectValue('color', newVal)
    }
  },
  computed: {
    _cardStyle() {
      return {
        opacity: this.isSelected ? '1' : '0.6',
        transition: '0.2s'
      }
    }
  },
  methods: {
    toggleSelect(ev) {
      let cb = this.isSelected ? this.unselect : this.select
      cb()
    },
    select() {
      this.isSelected = true
      this.$emit('selected', this)
    },
    unselect() {
      if (!this.isSelected) {
        return
      }
      this.isSelected = false
      this.$emit('unselected', this)
    },
    restoreThePreviousValue() {
      let lastPreKeyValue = this.preKeyValueStack.pop()
      this.localGameObject[lastPreKeyValue.key] = lastPreKeyValue.value
      this[lastPreKeyValue.key] = this.$refs[`${lastPreKeyValue.key}-input`].localValue = lastPreKeyValue.value
    },
    _setGameObjectValue(key, newValue) {
      this.preKeyValueStack.push({ key: key, value: this.localGameObject[key] })
      this.localGameObject[key] = newValue
      this.$emit('input', this.localGameObject)
    }
  }
}
</script>

<style scoped lang="scss">
.game-object {

  &__container {

    // override bootstrap class
    &.card {
      > .card-body {
        padding: 0;
      }
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
