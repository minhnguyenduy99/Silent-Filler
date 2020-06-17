import { BaseScene, GameObject, PhysicalInstance, ControlComponent } from '../core'
import Player from '../prefab/player'
import { TileMap } from '../components'

export default class TestScene extends BaseScene {
  constructor() {
    super()

    this.__initializeGameObjects()
  }

  p2

  __initializeGameObjects() {
    let mapContainer = new GameObject()
    let map = mapContainer.addComponent(new TileMap(mapContainer))
    map.setFilter(0x000080)
    PhysicalInstance.tilemap = map

    let p = new Player(1, 1)
    p.position.set(32 * 4 - 16, 32 * 9)
    p.setFilter(0xff0000)
    this.addChild(mapContainer)
    this.addChild(p)

    this.p2 = new Player(1, 1)
    this.p2.position.set(32 * 1 - 16, 32 * 11)
    this.p2.setFilter(0xffff00)
    this.addChild(this.p2)
    this.p2.IsActive = false

    let control = new GameObject()
    let tmp = new ControlComponent()
    control.addComponent(tmp)
    this.addChild(control)

    this._players.push(p)
    this._players.push(this.p2)

    tmp.onKeyPressed(() => {
      this._players[this._currentPlayer].IsActive = false
      this._currentPlayer++
      if (this._currentPlayer === this._players.length) {
        this._currentPlayer = 0
      }
      this._players[this._currentPlayer].IsActive = true
    }, 'KeyR')
  }

  _currentPlayer = 0
  _players = []
}
