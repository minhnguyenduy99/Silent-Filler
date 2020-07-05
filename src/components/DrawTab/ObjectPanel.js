export { GameObject } from '../MapUtilities'

export default class ObjectPanel {
  /**
   * @type {GameObject[]}
   */
  objects

  /**
   * @type {Number}
   */
  currentSelectedIndex

  /**
   *
   * @param {any[]} listObjects
   */
  constructor(listObjects = []) {
    this.objects = this._createListObjectsFromPlain(listObjects)
    this.currentSelectedIndex = -1
  }

  get selectedObj() {
    return this.objects[this.currentSelectedIndex]
  }

  getById(id) {
    return this.objects.find((obj) => obj.id === id)
  }

  select(index) {
    if (index < -1 || index >= this.objects.length) {
      index = -1
    }
    this.currentSelectedIndex = index
  }

  /**
   *
   * @param {GameObject} object
   */
  addObject(obj) {
    this.objects.push(obj)
  }

  /**
   * Create a copy of this instance
   */
  copy() {
    let copyPanel = new ObjectPanel(this.objects.map(obj => obj.copy()))
    copyPanel.currentSelectedIndex = this.currentSelectedIndex
    return copyPanel
  }

  /**
   *
   * @param {any[]} listPlainObjs
   */
  _createListObjectsFromPlain(listPlainObjs) {}
}
