import { ObjectPanel } from '.'
import { StaticObject } from '../MapUtilities'

export default class StaticObjectPanel extends ObjectPanel {
  _createListObjectsFromPlain(listPlainObjs) {
    return listPlainObjs.map(({ tag, name, color, id }) =>
      new StaticObject(tag, name, color, id))
  }
}
