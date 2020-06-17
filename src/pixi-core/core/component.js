import GameObject from './game-object'

export default class Component {
  /**
   * @protected
   * @type {GameObject}
   */
  _object

  /**
   * @protected
   * @type {Boolean}
   */
  _isActive = true

  /**
   *
   * @param {GameObject} attachObj
   */
  constructor(attachObj = undefined) {
    if (attachObj) {
      this._object = attachObj
    }
    this.activate()
  }

  get name() {
    return this.contructor.name
  }

  /**
   * Specify if the component is active
   */
  get IsActive() {
    return this._isActive
  }

  set IsActive(value) {
    this._isActive = value
  }

  /**
   * Activate component
   */
  activate() {
    this._isActive = true
  }

  /**
   * Deactivate component
   */
  deactive() {
    this._isActive = false
  }

  /**
   * Update the component
   * @param {Number} delta
   */
  update(delta) {
  }

  render() {
  }

  /**
   * @param {Function} type The subtype of `Component` class
   * @param {GameObject} gameObj The game object registers component
   * @param {any[]} args
   * @returns {Component}
   */
  static create(type, gameObj = undefined, ...args) {
    const ComponentType = type
    return new ComponentType(gameObj, ...args)
  }
}
