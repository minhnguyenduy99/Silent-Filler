import Command from './Command'

export default class NullCommand extends Command {
  constructor() {
    super(null, null)
  }

  execute() {}
  setUndoCallback() {}
  undo() {}
}
