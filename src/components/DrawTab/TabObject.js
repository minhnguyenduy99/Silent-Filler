import GameObject from '../MapUtilities/GameObject'

export default class TabObject {
  /**
   * @type {String}
   */
  title

  /**
   * @type {{ objects: GameObject[], map: Array }}
   */
  availableMap

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
  currentSelectedIndex

  /**
   * @type {Boolean}
   */
  isImageLoaded

  constructor() {
    this.title = ''
    this.availableMap = {
      objects: [],
      map: null
    }
    this.image = {
      width: 0,
      height: 0,
      src: null
    }
    this.currentSelectedIndex = -1
    this.isImageLoaded = false
  }

  isMapLoaded() {
    return this.availableMap.map !== null
  }

  loadImage(img) {
    this.image.width = img.width
    this.image.height = img.height
    this.image.src = img.src
    this.isImageLoaded = true
    this.__setMapInfo()
  }

  /**
   * @returns {TabObject}
   */
  copy() {
    let clone = new TabObject()
    clone.title = this.title
    clone.availableMap.map = this.availableMap.map ? [...this.availableMap.map] : null
    clone.availableMap.objects = this.availableMap.objects.map(obj => obj.copy())
    clone.currentSelectedIndex = this.currentSelectedIndex
    clone.image = { ...this.image }
    clone.isImageLoaded = this.isImageLoaded
    clone.mapInfo = { ...this.mapInfo }
    return clone
  }

  get currentSelectedObj() {
    return this.availableMap.objects[this.currentSelectedIndex]
  }

  __setMapInfo() {
    let { width, height } = this.image
    this.mapInfo = {
      width: width,
      height: height
    }
  }
}
