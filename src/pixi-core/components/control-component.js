import Component from '../core/component'
import Keyboard from 'pixi.js-keyboard'
import Mouse from 'pixi.js-mouse'

export default class ControlComponent extends Component {
  /**
   *
   * @param {Number} key
   * @param {*} event
   */
  addKeyController(key, event, handler) {
    Keyboard.events.on(event, (keyCode, ev) => {
      if (Keyboard.keyStates.get(keyCode) !== key) {
        return
      }
      handler()
      ev.preventDefault()
    })
  }

  render() {
    super.render()
  }

  /**
   *
   * @param {(keyCode: Number, ev: Event) => void} handler
   * @param {String} keys
   */
  onKeyPressed(handler, ...keys) {
    this._onKeyEvent('pressed', handler, ...keys)
  }

  /**
   *
   * @param {(keyCode: Number, ev: Event) => void} handler
   * @param {String} keys
   */
  onKeyReleased(handler, ...keys) {
    this._onKeyEvent('released', handler, ...keys)
  }

  /**
   * Execute the `handler` when the `key` is down. If `key` is null, then the `handler` executes if any key is down
   * @param {(keyCode: Number, ev: Event) => void} handler
   * @param {String} keys
   */
  onKeyDown(handler, ...keys) {
    this._onKeyEvent('down', handler, ...keys)
  }

  /**
   * @param {'pressed' | 'released' | 'down'} eventType
   * @param {(keyCode: Number, ev: Event) => void} handler
   * @param {String} keys
   */
  _onKeyEvent(eventType, handler, ...keys) {
    if (!keys) {
      Keyboard.events.on(`${eventType}`, null, (keyCode, ev) => handler(keyCode, ev))
      return
    }
    keys.forEach((key) => {
      Keyboard.events.on(`${eventType}_${key}`, null, (keyCode, ev) => handler(keyCode, ev))
    })
  }

  /**
   *
   * @param  {...String} keys Check if all the keys are pressed
   */
  isKeyPressed(...keys) {
    return Keyboard.isKeyPressed(...keys)
  }

  /**
   *
   * @param  {...String} keys Check if all the keys are released
   */
  isKeyReleased(...keys) {
    return Keyboard.isKeyReleased(...keys)
  }

  /**
   *
   * @param  {...String} keys Check if all the keys are down
   */
  isKeyDown(...keys) {
    return Keyboard.isKeyDown(...keys)
  }

  /**
   * Update the state of `Keyboard` and `Mouse`.
   * Always call this method in the `GameLoop`
   */
  static update() {
    Keyboard.update()
    Mouse.update()
  }
}
