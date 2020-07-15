import { BaseScene, GameObject, PhysicalInstance, ControlComponent, PointBounding, Sprite } from '../core'
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

    let p3 = new Player(1, 1)
    p3.position.set(32 * 5.5 - 16, 32 * 11)
    p3.setFilter(0x00ffff)
    this.addChild(p3)
    p3.IsActive = false

    this.p2 = new Player(1, 1)
    this.p2.position.set(32 * 2 - 16, 32 * 11)
    this.p2.setFilter(0xffff00)
    this.addChild(this.p2)
    this.p2.IsActive = false

    let control = new GameObject()
    let tmp = new ControlComponent()
    control.addComponent(tmp)
    this.addChild(control)

    this._players.push(p)
    this._players.push(this.p2)
    this._players.push(p3)

    tmp.onKeyPressed(() => {
      console.log(this._players[this._currentPlayer].position)
      this._players[this._currentPlayer].IsActive = false
      this._currentPlayer++
      if (this._currentPlayer === this._players.length) {
        this._currentPlayer = 0
      }
      this._players[this._currentPlayer].IsActive = true
    }, 'KeyR')

    this.cam.push(p)
    this.cam.push(this.p2)
    this.cam.push(p3)

    this.debug = new GameObject()
    this.debug.setRenderSprite(new Sprite('SelectArrow'))
    this.addChild(this.debug)
  }

  _currentPlayer = 0
  _players = []

  debug

  update(delta) {
    super.update(delta)
    this.debug.position.set(this.cam.central.x, this.cam.central.y)
  }
}
