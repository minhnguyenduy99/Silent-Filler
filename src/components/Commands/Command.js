import TabObject from '../DrawTab/TabObject'

export default class Command {
  /**
   * @type {(obj: TabObject) => any}
   */
  callback = () => true

  tab = null

  /**
   * @type {(obj: TabObject) => any}
   */
  undoCallback

  /**
   * @param {(obj: GameObject) => void} cb The callback to execute
   * @param {TabObject} tab The tab to execute on `cb`
   */
  constructor(cb, tab) {
    this.callback = cb
    this.tab = tab
  }

  /**
   * Set the undo callback
   * @param {(tab: any) => any} cb The undo callback
   */
  setUndoCallback(cb) {
    this.undoCallback = cb
  }

  /**
   * @returns {Boolean}
   */
  hasUndo() {
    return this.undoCallback
  }

  /**
   * Execute the command
   * @returns {any}
   */
  execute() {
    return this.callback(this.tab)
  }

  /**
   * Undo the command
   */
  undo() {
    return this.undoCallback(this.tab)
  }
}
