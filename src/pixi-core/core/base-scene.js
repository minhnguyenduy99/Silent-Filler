import * as pixi from 'pixi.js'
import { ControlComponent } from '../components'
import PhysicalInstance from './physical'
import { PointBounding } from '.'

export default class BaseScene extends pixi.Container {
  /**
   *
   * @param {String} name Name of the scene
   */
  constructor(name) {
    super()
    this.name = name
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pivot.set(0, window.innerHeight)
    this.scale.set(1, -1)
    this._controller = new ControlComponent()
    this._controller.onKeyPressed(() => {
      this.IsPause = !this.IsPause
    }, 'KeyP')
    this.UpdateDeadZone()
    window.addEventListener('resize', () => {
      this.UpdateDeadZone()
    })
  }

  /**
   * @type {ControlComponent}
   */
  _controller

  /**
   * @type {number} value [0,1] description how much % camera follower center point
   */
  _deadzone = 0.1

  _deadzoneBox = new pixi.Rectangle()

  /**
   * @param {value} value [0,1]
   */
  set DeadZone(value) {
    this._deadzone = value
  }

  /**
   * @return {number} value [0,1] description how much % camera follower center point;
   * 0 is full deadzone, 1 is free
   */
  get DeadZone() {
    return this._deadzone
  }

  UpdateDeadZone() {
    this._deadzoneBox.width = window.innerWidth * this._deadzone
    this._deadzoneBox.height = window.innerHeight * this._deadzone
  }

  _IsPause = false

  set IsPause(value) {
    this._IsPause = value
    PhysicalInstance.IsActive = !value
  }

  get IsPause() {
    return this._IsPause
  }

  /**
   * Update the scene
   * @virtual
   * @param {Number} delta
   */
  update(delta) {
    if (this.IsPause) {
      return
    }
    this.children.forEach((child) => {
      if (child.update && child.IsActive) {
        child.update(delta)
      }
    })
    this.updateCamera()
  }

  cam = new PointBounding()

  updateCamera() {
    this.cam.update()
    this._deadzoneBox.x = Math.round(-this.cam.central.x + window.innerWidth / 2)
    this._deadzoneBox.y = Math.round(this.cam.central.y - window.innerHeight / 2)
    this.position.set(Math.clamp(this._deadzoneBox.left, this._deadzoneBox.right, this.position.x), Math.clamp(this._deadzoneBox.bottom, this._deadzoneBox.top, this.position.y))
  }

  /**
   * @returns {pixi.Point}
   */
  get GlobalPosition() {
    return new pixi.Point(0, 0)
  }
}
