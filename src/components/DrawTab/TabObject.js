import { GameObject } from '../MapUtilities'

export default class TabObject {
  DEFAULT_CELL_SIZE = 32

  /**
   * @type {String}
   */
  title

  /**
   * @type {Array}
   */
  map

  /**
   * @type {GameObject[]}
   */
  objects

  /**
   * @type {{
   width: Number,
   height: Number,
   src: String
   }}
   */
  image

  /**
   * @type {{
    width: Number,
    height: Number
  }}
   */
  mapInfo

  /**
   * @type {Number}
   */
  cellSize

  /**
   * @type {{[key: Number]: String}}
   */
  colors

  /**
   * @type {Number}
   */
  currentSelectedIndex

  /**
   * @type {Boolean}
   */
  isImageLoaded

  constructor() {
    this.title = ''
    this.objects = []
    this.map = null
    this.image = {
      width: 0,
      height: 0,
      src: null
    }
    this.colors = {}
    this.cellSize = this.DEFAULT_CELL_SIZE
    this.currentSelectedIndex = -1
    this.isImageLoaded = false
  }

  isMapLoaded() {
    return this.map !== null
  }

  loadImage(img) {
    this.image.width = img.width
    this.image.height = img.height
    this.image.src = img.src
    this.isImageLoaded = true
    this.__setMapInfo()
  }

  loadAvailableMap({ map, objects, cellSize }) {
    this.map = map
    this.objects = objects.map(obj => new GameObject(
      obj.tag, obj.name, obj._color, obj.size, obj.isOverlapable
    ))
    this.cellSize = cellSize
    let colorMap = {}
    this.objects.forEach(function(obj) {
      colorMap[obj.tag] = obj.color
    })
    this.colors = colorMap
  }

  /**
   * @returns {TabObject}
   */
  copy() {
    let clone = new TabObject()
    clone.title = this.title
    clone.map = this.map ? [...this.map.map(row => [...row])] : null
    clone.objects = this.objects.map(obj => obj.copy())
    clone.objects.forEach(function(obj) {
      obj.onColorChanged = this.__onObjectColorChanged.bind(this)
    }.bind(this))
    clone.colors = { ...this.colors }
    clone.currentSelectedIndex = this.currentSelectedIndex
    clone.image = { ...this.image }
    clone.isImageLoaded = this.isImageLoaded
    clone.mapInfo = { ...this.mapInfo }
    clone.cellSize = this.cellSize
    return clone
  }

  get currentSelectedObj() {
    return this.objects[this.currentSelectedIndex]
  }

  /**
   *
   * @param {GameObject} obj
   */
  addObject(obj) {
    if (!obj) {
      return
    }
    this.objects.push(obj)
    this.colors[obj.tag] = obj.color
    obj.onColorChanged = this.__onObjectColorChanged.bind(this)
  }

  /**
   * Callback when color of object changed
   * @param {GameObject} object
   */
  __onObjectColorChanged(object) {
    this.colors[object.tag] = object.color
  }

  __setMapInfo() {
    let { width, height } = this.image
    this.mapInfo = {
      width: width,
      height: height
    }
  }
}
