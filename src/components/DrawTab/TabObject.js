import { GameObject, GameMap, Position, Player } from '../MapUtilities'
import { PlayableObjectPanel, StaticObjectPanel } from '.'
import uniqid from 'uniqid'

export default class TabObject {
  DEFAULT_CELL_SIZE = 32

  /**
   * @type {String}
   */
  _id

  /**
   * @type {Player}
   */
  player

  /**
   * @type {Boolean}
   */
  isPlayerSelected

  /**
   * @type {String}
   */
  title

  /**
   * @type {Array}
   */
  map

  /**
   * @type {GameMap}
   */
  objMap

  /**
   * @type {PlayableObjectPanel}
   */
  playableObjects

  /**
   * @type {StaticObjectPanel}
   */
  staticObjects

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
   * @type {Boolean}
   */
  isImageLoaded

  constructor() {
    this._id = uniqid()
    this.title = ''
    this.playableObjects = new PlayableObjectPanel()
    this.staticObjects = new StaticObjectPanel()
    this.map = null
    this.player = Player.create()
    this.isPlayerSelected = true
    this.objMap = new GameMap()
    this.image = {
      width: 0,
      height: 0,
      src: null
    }
    this.colors = {}
    this.cellSize = this.DEFAULT_CELL_SIZE
    this.isImageLoaded = false
  }

  get selectedObj() {
    return (this.isPlayerSelected && this.player) || this.staticObjects.selectedObj || this.playableObjects.selectedObj
  }

  get objectMap() {
    return this.objMap
  }

  /**
   * @param {number} panelType The type of panel
   */
  isSelectedObjInPanel(panelType) {
    let selectedObj = this.selectedObj
    if (!selectedObj) {
      return null
    }
    let { tag: staticTag = null } = this.staticObjects.selectedObj
    let { tag: playableTag = null } = this.playableObjects.selectedObj
    return (panelType === 0 && selectedObj.tag === staticTag) ||
      (panelType === 1 && selectedObj.tag === playableTag)
  }

  /**
   * Save an object with particular position to the map
   * @param {GameObject} obj
   * @param {Position} position
   */
  savePlayableObjectPosition(obj, position) {
    return this.objMap.add(position, obj)
  }

  /**
   * Remove an object in a particular position from the map
   * @param {Position} position
   */
  removeObject(position) {
    let obj = this.objMap.remove(position)
    if (!obj) {
      return null
    }
    let { x, y } = position
    let { size: { width, height } } = obj
    for (let row = y; row < y + height; row++) {
      for (let col = x; col < x + width; col++) {
        this.map[row][col] = '-1'
      }
    }
    return obj
  }

  /**
   * Check if there are any objects in particular range
   * @param {Position} topLeft
   * @param {Position} bottomRight
   */
  isAnyObjectInRange(topLeft, bottomRight) {
    return this.objMap.isAnyObjectsInRange(topLeft, bottomRight)
  }

  unselectAll() {
    this.staticObjects.currentSelectedIndex = -1
    this.playableObjects.currentSelectedIndex = -1
  }

  isMapLoaded() {
    return this.map !== null
  }

  /**
   * Reset the map to the empty state
   */
  resetMap() {
    this.objMap = new GameMap()
    this.player.setStartPosition(null)
    this.player.setEndPosition(null)
  }

  loadImage(img) {
    this.image.width = img.width
    this.image.height = img.height
    this.image.src = img.src
    this.isImageLoaded = true
    this.__setMapInfo()
  }

  loadAvailableMap({
    map,
    player: {
      id, tag, name, size, color,
      _startPosition,
      _endPosition
    },
    playableObjects, staticObjects, cellSize, objectMap
  }) {
    this.map = map
    this.playableObjects = new PlayableObjectPanel(playableObjects)
    this.staticObjects = new StaticObjectPanel(staticObjects)
    this.player = new Player(
      tag, name,
      color,
      size,
      id,
      _startPosition == null ? null : new Position(_startPosition.x, _startPosition.y),
      _endPosition == null ? null : new Position(_endPosition.x, _endPosition.y))
    this.cellSize = cellSize
    let rawObjMap = objectMap
    for (let pos in objectMap) {
      let id = objectMap[pos]
      rawObjMap[pos] = this.playableObjects.getById(id) || this.player
    }
    this.objMap = new GameMap(rawObjMap)
  }

  /**
   * @returns {TabObject}
   */
  copy() {
    let clone = new TabObject()
    clone.title = this.title
    clone.map = this.map ? [...this.map.map(row => [...row])] : null
    clone.playableObjects = this.playableObjects.copy()
    clone.staticObjects = this.staticObjects.copy()
    clone.image = { ...this.image }
    clone.isImageLoaded = this.isImageLoaded
    clone.mapInfo = { ...this.mapInfo }
    clone.cellSize = this.cellSize
    clone.objMap = this.objMap.copy()
    return clone
  }

  /**
   *
   * @param {GameObject} obj The object to add to map
   */
  addObject(obj) {
    if (!obj) {
      return
    }
    if (!obj.isStatic) {
      this.playableObjects.addObject(obj)
    } else {
      this.staticObjects.addObject(obj)
    }
  }

  /**
   * Get information for saving data
   * @returns {Object}
   */
  save() {
    return {
      player: this.player,
      staticObjects: this.staticObjects.objects,
      playableObjects: this.playableObjects.objects,
      map: this.map,
      cellSize: this.cellSize,
      objectMap: this.objMap.getMapObject()
    }
  }

  get imageSrc() {
    return this.image.src
  }

  __setMapInfo() {
    let { width, height } = this.image
    this.mapInfo = {
      width: width,
      height: height
    }
  }
}
