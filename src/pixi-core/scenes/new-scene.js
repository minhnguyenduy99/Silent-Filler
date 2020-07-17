import { BaseScene, GameObject, PhysicalInstance, TILE_SIZE } from '../core'
import { Player } from '../prefab'
import { TileMap } from '../components'
import * as pixi from 'pixi.js'

export default class NewScene extends BaseScene {
  obj

  constructor() {
    super('New scene')
    this.obj = Math.obj
    console.log(this.obj)

    let tile = this.obj.map
    for (let i = 0; i < tile.length; i++) {
      for (let j = 0; j < tile[0].length; j++) {
        let cell = tile[i][j]
        if (cell[0] === 'S') {
          tile[i][j] = Number.parseInt(cell.substr(1))
        } else {
          tile[i][j] = -1
        }
      }
    }
    let mapColor = `0x${this.obj.staticObjects[0] ? this.obj.staticObjects[0].color.substr(1) : '000080'}`
    let mapContainer = new GameObject()
    let tileMap = new TileMap(mapContainer, tile)
    let map = mapContainer.addComponent(tileMap)
    map.setFilter(parseInt(mapColor, 16))
    PhysicalInstance.tilemap = tileMap
    this.addChild(mapContainer)
    this.addChild(this.createPlayer())
    this.createPlayerFromPlayableObjects().forEach(function (player) {
      this.addChild(player)
    }.bind(this))
  }

  createPlayer() {
    let _player = this.obj.player
    let playerSize = _player.size
    let startPos = this.convertPosition(_player._startPosition, playerSize)
    let endPos = this.convertPosition(_player._endPosition, playerSize)
    let color = parseInt(`0x${_player.color.substr(1)}`, 16)
    let player = new Player(startPos, endPos, color, playerSize.width, playerSize.height)
    return player
  }

  createPlayerFromPlayableObjects() {
    let listRawPlayers = this.obj.playableObjects
    let listPlayers = listRawPlayers.map((rawPlayer) => {
      let startPos = this.convertPosition(this.obj._player._startPosition, rawPlayer.size)
      let endPos = this.convertPosition(this.obj._player._endPosition, rawPlayer.size)
      let color = parseInt(`0x${rawPlayer.color.substr(1)}`, 16)
      return new Player(startPos, endPos, color, rawPlayer.width, rawPlayer.height)
    })
    return listPlayers
  }

  /**
   *
   * @param {{x: Number, y: Number}} position
   */
  convertPosition({ x, y }, { width, height }) {
    let rowCount = this.obj.map.length
    return new pixi.Point(TILE_SIZE * (x + width / 2), TILE_SIZE * (rowCount - y - height / 2))
  }
}
