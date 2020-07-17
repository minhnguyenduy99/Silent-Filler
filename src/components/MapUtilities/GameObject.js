import uniqid from 'uniqid'

export default class GameObject {
  /**
   * @type {String}
   */
  id

  /**
   * @type {number}
   */
  tag

  /**
   * @type {String}
   */
  color

  /**
   * @type {String}
   */
  name

  /**
   * @type {{ width: number, height: number }}
   */
  size

  /**
   * @type {Boolean}
   */
  _isStatic

  /**
   * @type {(GameObject) => void}
   */
  onColorChanged

  /**
   *
   * @param {number} tag
   * @param {String} name
   * @param {Stringg} color
   * @param {{ width: number, height: number }} size
   */
  constructor(tag, name, color, size, id = null) {
    this.id = id ?? uniqid()
    this.tag = tag
    this.name = name
    this.color = color
    this.size = size
  }

  get isStatic() {
    return this._isStatic
  }

  /**
   * @returns {GameObject}
   */
  copy() {
    return new GameObject(
      this.tag,
      this.name,
      this.color,
      { ...this.size }
    )
  }
}
