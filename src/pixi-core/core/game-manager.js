import * as pixi from 'pixi.js'
import Bump from 'bump.js'
import ControlComponent from '../components/control-component'
import ResourceManager from './resource-manager'
import SceneManager from './scene-manager'
import BaseScene from './base-scene'
import { PhysicalInstance } from '.'

class GameManager {
  /**
   * @protected
   * @type {PIXI.Application}
   */
  _app

  /**
   * @type {PIXI.extras.Bump}
   */
  _bump

  /**
   * @protected
   * @type {SceneManager}
   */
  _sceneManager

  /**
   * @protected
   * @type {PIXI.Graphics}
   */
  _graphics

  constructor() {
    this._app = new pixi.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: 1,
      resizeTo: window,
      transparent: true
    })
    this._graphics = new pixi.Graphics()
    this._sceneManager = new SceneManager()
    this.setGameColor(0xffffff)
    this._bump = new Bump(pixi)
    this._sceneManager.onCurrentSceneChanged((oldScene, newScene) => this._replaceSceneChildFromApp(oldScene, newScene))
}

  /**
   * @type {PIXI.Graphics}
   */
  get graphics() {
    return this._graphics
  }

  /**
   * Return the auto-generated view of the game
   */
  get gameView() {
    return this._app.view
  }

  get resourceManager() {
    return ResourceManager
  }

  get bump() {
    return this._bump
  }

  /**
   * Set the game background color
   * @param {number} color The color
   */
  setGameColor(color) {
    this._app.renderer.backgroundColor = color
  }

  /**
   *
   * @param {BaseScene} scene
   */
  addScene(scene) {
    this._sceneManager.addScene(scene)
  }

  currentStage() {
    return this._app.stage
  }

  /**
   * Get the stage of game by name of stage
   * @param {String} name
   * @return {PIXI.DisplayObject}
   */
  getStageByName(name) {
    return this._app.stage.getChildByName(name)
  }

  /**
   * Set up the game
   */
  setup() {
  }

  /**
   * Start the game
   */
  start() {
    this._sceneManager.nextScene()
    this._app.renderer.backgroundColor = 'transparent'
    this.time = 0
    this._app.ticker.maxFPS = 90
    this._app.ticker.add((delta) => {
      this._gameLoop(delta / this._app.ticker.FPS)
      this.time += delta
    })
  }

  /**
   *
   * @param {BaseScene[]} args
   */
  _replaceSceneChildFromApp([oldScene, newScene]) {
    // If the old scene exists, remove it from application to avoid redundant render
    if (oldScene) {
      const oldSceneChild = this._app.stage.getChildByName(oldScene.name)
      this._app.stage.removeChild(oldSceneChild)
    }
    this._app.stage.addChild(newScene)
  }

  /**
   * @protected
   * @param {Number} delta
   */
  _gameLoop(delta) {
    const currentScene = this._sceneManager.currentScene
    currentScene.update(delta)
    currentScene.lateUpdate(delta)
    PhysicalInstance.update(delta)
    PhysicalInstance.CollisionCall(delta)
    PhysicalInstance.lateUpdate(delta)
    currentScene.render(this._app.renderer)

    ControlComponent.update()
  }
}

const GameManagerInstance = new GameManager()

export default GameManagerInstance
