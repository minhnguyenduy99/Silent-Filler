import ObjectPanel from './ObjectPanel'
import { PlayableObject } from '../MapUtilities'

export default class PlayableObjectPanel extends ObjectPanel {
  constructor(listPlainObjs = []) {
    super(listPlainObjs)
  }

  _createListObjectsFromPlain(listPlainObjs) {
    return listPlainObjs.map(({ tag, name, color, size, id }) =>
      new PlayableObject(tag, name, color, size, id))
  }

  copy() {
    let panel = super.copy()
    panel.objMap = this.objMap.copy()
    return panel
  }
}
