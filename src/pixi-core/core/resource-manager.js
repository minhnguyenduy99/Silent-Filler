import * as pixi from 'pixi.js'
import path from 'path'
import os from 'os'

class ResourceManager {
  /**
   * @private
   * @type {PIXI.Loader}
   */
  __loader

  /**
   * @private
   * @type {string}
   */
  __defaultResourceDirectory

  /**
   * @type {ObjectMapper}
   */
  config

  /**
   * @public
   * @param {pixi.Loader} __loader The resource __loader to use
   */
  constructor(loader = pixi.Loader.shared) {
    if (!loader) {
      if (pixi.Loader.shared) {
        throw new Error('__loader has not been instantiated')
      }
      this.__loader = pixi.Loader.shared
    } else {
      this.__loader = loader
    }
  }

  get defaultResourceDirectory() {
    return this.__defaultResourceDirectory
  }

  /**
   * @param {string} resourceDirectory
   */
  setDefaultResourceDirectory(resourceDirectory) {
    this.__defaultResourceDirectory = resourceDirectory
  }

  /**
   * Load all added resources
   */
  load() {
    return new Promise((resolve) => {
      this.__loader.load((loader, resources) => {
        resolve()
      })
    })
  }

  /**
   * @public
   * @param {String} tag a label to for the all the added textures
   * @param {{name: String, resourceFile: any}[]} resources resource collection
   */
  addResourceCollection(tag = '', resources = []) {
    resources.forEach(resource => {
      this.addResourceFile(this.generateResourceName(tag, resource.name), resource.resourceFile)
    })
  }

  /**
   * @public
   * @param {String} tag tag of the texture resource
   * @returns {{ name: String, texture: PIXI.Texture}[]} Array of TextureObject
   */
  getResourceCollection(tag) {
    const resourceArr = Object.values(this.__loader.resources)

    return resourceArr
      .filter(resource => resource.name.includes(tag))
      .map(resource => {
        return {
          name: resource.name,
          texture: resource.texture
        }
      })
  }

  destroy() {
    Object.values(pixi.utils.TextureCache).forEach(function(texture) {
      texture.destroy()
    })
    this.__loader.resources = {}
  }

  /**
   * Load a resource from a resource collection
   * @public
   * @param {String} name Name of the texture
   * @param {String} tag Tag of texture collection
   * @returns {PIXI.Texture}
   * @example
   *   ResourceManager.addResourceCollection("player", "run")
   *   .then(()) => {
   *   const playerRunTexture = ResourceManager.getTextureIncludeTag("player", "run")
   *   })
   */
  getTextureIncludeTag(name, tag) {
    let resourceName = this.generateResourceName(tag, name)
    return this.__loader.resources[resourceName].texture
  }

  /**
   * Get texture from resource by name of resource
   * @param {String} name Name of the resource
   * @returns {PIXI.Texture} The texture resource
   */
  getTextureByName(name) {
    return this.__loader.resources[name].texture
  }

  /**
   * Return the JSON data resource
   * @param {string} name Name of the resource
   */
  getJSONData(name) {
    const resource = this.__loader.resources[name]
    if (resource.extension !== 'json') {
      throw new Error('The resource is not in json format')
    }
    const object = JSON.parse(JSON.stringify(resource.data))
    return object
  }

  /**
   * @param {string} name Name of the resource
   * @param {any} file The module of the file
   * @example
   * addResourceFile('player', require('./assets/player.png'))
   */
  addResourceFile(name, file) {
    return this.__loader.add(name, file)
  }

  /**
   * @private
   * Generate the combined value of two strings
   * @param {String} tag
   * @param {String} name
   */
  generateResourceName(tag, name) {
    return `${tag}_${name}`
  }
}

const ResrcManager = new ResourceManager()

export default ResrcManager
