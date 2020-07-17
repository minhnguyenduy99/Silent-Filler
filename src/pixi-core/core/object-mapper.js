import { Player } from '../prefab'
import * as pixi from 'pixi.js'

export default class ObjectMapper {
  /**
   * @type {ObjectMapper}
   */
  static instance

  /**
   * @type {Player}
   */
  player

  /**
   * @type {Array}
   */
  map

  /**
   * @type {}
   */
  ground

  /**
   * @type {number}
   */
  tileSize

  obj

  constructor(obj = null) {
    // this.tileSize = obj.cellSize
    // let _player = obj.player
    // let playerSize = _player.size
    // let startPos = this.convertPosition(_player._startPosition, playerSize)
    // let endPos = this.convertPosition(_player._endPosition, playerSize)
    // let color = this.convertHEXToColorCode(_player.color)
    // this.player = new Player(startPos, endPos, color, playerSize.width, playerSize.height)
    // this.map = obj.map
    this.obj = obj
  }

  static Instance(obj = null) {
    if (!ObjectMapper.instance) {
      if (!obj) {
        throw new Error('Cannot initialize object')
      }
      ObjectMapper.instance = new ObjectMapper(obj)
    }
    return ObjectMapper.instance
  }

  /**
   *
   * @param {{x: Number, y: Number}} position
   */
  convertPosition({ x, y }, { width, height }) {
    return new pixi.Point(x + Math.floor(width * this.tileSize / 2), y + Math.floor(height * this.tileSize / 2))
  }

  /**
   *
   * @param {String} hex
   * @returns {number}
   */
  convertHEXToColorCode(hex) {
  }
}

var _ObjectMapper = ObjectMapper || {}
