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
  _color

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
  isOverlapable

  /**
   * @type {(GameObject) => void}
   */
  onColorChanged

  /**
   *
   * @param {number} tag
   * @param {String} name
   * @param {Stringg} _color
   * @param {{ width: number, height: number }} size
   * @param {Boolean} isOverlapable Specify if this object can be overlap another object
   */
  constructor(tag, name, _color, size, isOverlapable = true) {
    this.id = uniqid()
    this.tag = tag
    this.name = name
    this._color = _color
    this.size = size
    this.isOverlapable = isOverlapable
  }

  get color() {
    return this._color
  }

  set color(val) {
    if (this._color === val) {
      return
    }
    this._color = val
    this.onColorChanged(this)
  }

  /**
   * @returns {GameObject}
   */
  copy() {
    return new GameObject(
      this.tag,
      this.name,
      this._color,
      { ...this.size },
      this.isOverlapable
    )
  }
}
