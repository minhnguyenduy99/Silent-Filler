<template>
  <b-card
    :style="_cardStyle"
    class="game-object__container p-3" bg-variant="danger"
    @click="toggleSelect"
  >
    <b-container fluid="false" style="max-width: 250px">
      <b-row no-gutters class="text-light justify-content-between" align-v="center">
        <b-col class="d-flex">
          <b-form-input v-b-tooltip.hover title="Tag" ref="tag-input" @click.stop type="text" placeholder="Tag" required lazy v-model.number="tag" disabled class="w-25 mb-2"></b-form-input>
        </b-col>
        <b-col cols="3" class="text-right">
          <size-input @click.stop v-model="size" :disabled="!isSelected" class="mb-1" v-b-tooltip.hover title="Size" />
        </b-col>
        <b-col cols="9">
           <b-form-input ref="name-input" @click.stop type="text" required lazy v-model="name" placeholder="Object name" :disabled="!isSelected"></b-form-input>
        </b-col>
        <b-col cols="3" class="text-right">
          <color-input @click.stop v-model="color" size="lg" :disabled="!isSelected"></color-input>
        </b-col>
        <b-col cols="12" class="mt-2">
          <b-form-group label="Vị trí của player" class="m-0">
            <div class="d-flex justify-content-between text-light">
              <b-form-radio v-model="selectedPosition" value="start">Vị trí bắt đầu</b-form-radio>
              <div>({{ this._isStartPositionSet ? 'Đã set' : 'Chưa set' }})</div>
            </div>
            <div class="d-flex justify-content-between text-light">
              <b-form-radio v-model="selectedPosition" value="end">Vị trí kết thúc</b-form-radio>
              <div>({{ this._isEndPositionSet ? 'Đã set' : 'Chưa set' }})</div>
            </div>
          </b-form-group>
        </b-col>
      </b-row>
    </b-container>
    <b-modal id="player-item-error-modal">
      <span><strong>{{ errorMsg }}</strong></span>
    </b-modal>
  </b-card>
</template>

<script>
import ColorInput from '../ColorPicker/ColorInput'
import SizeInput from '../Utilities/SizeInput'
import { Player, Position, GameObject, PlayableObject } from '../MapUtilities'
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'PlayableObjectItem',
  components: {
    ColorInput, SizeInput
  },
  props: {
    gameObject: {
      type: PlayableObject,
      required: true
    }
  },
  model: {
    prop: 'gameObject',
    event: 'input'
  },
  data: function () {
    return {
      START_POS_DRAWN_MSG: 'Vị trí bắt đầu đã được vẽ',
      END_POS_DRAWN_MSG: 'Vị trí kết thúc đã được vẽ',
      tag: this.gameObject.tag,
      name: this.gameObject.name,
      size: this.gameObject.size,
      color: this.gameObject.color,
      localGameObject: this.gameObject,
      isSelected: false,
      selectedPosition: 'start',
      errorMsg: null
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
    size: function(newVal) {
      this._setGameObjectValue('size', newVal)
    },
    color: function(newVal) {
      this._setGameObjectValue('color', newVal)
    },
    selectedPosition: function(newVal) {
      if (!newVal) {
        return
      }
      this.selectPlayerPosition(newVal)
    },
    playerPosition: function(newVal) {
      if (this.selectedPosition === 'start') {
        this._updateStartPosition(newVal)
      } else {
        this._updateEndPosition(newVal)
      }
    }
  },
  computed: {
    ...mapState('map-edit', ['AVAILABLE_MODE', 'playerItemState']),
    ...mapGetters('map-edit', ['mode']),

    _cardStyle() {
      return {
        opacity: this.isSelected ? '1' : '0.6',
        transition: '0.2s'
      }
    },
    playerPosition() {
      return this.playerItemState.playerPosition
    },
    _isStartPositionSet() {
      return this.gameObject.isStartPositionSet
    },
    _isEndPositionSet() {
      return this.gameObject.isEndPositionSet
    },
    getFormatSize() {
      let { width, height } = this.size
      return `${width} x ${height}`
    }
  },
  methods: {
    ...mapMutations('map-edit', ['selectPlayerPosition']),

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
      this.localGameObject[lastPreKeyValue.key] = lastPreKeyValue.value
      this[lastPreKeyValue.key] = this.$refs[`${lastPreKeyValue.key}-input`].localValue = lastPreKeyValue.value
    },

    _updateStartPosition(position) {
      this._setGameObjectValue('_startPosition', position)
    },

    _updateEndPosition(position) {
      this._setGameObjectValue('_endPosition', position)
    },

    _setGameObjectValue(key, newValue) {
      this.localGameObject[key] = newValue
      this.$emit('input', this.localGameObject)
    },
    _notifyError(error) {
      this.errorMsg = error
      this.$bvModal.show('player-item-error-modal')
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
