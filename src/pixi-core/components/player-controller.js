import { ControlComponent } from '.'
import { GameObject, TILE_SIZE } from '../core'
import Rigidbody from './rigibody'
import { JumpBlockToVelocity, MoveBlockToVelocity } from '../core/block-converter'

export default class PlayerController extends ControlComponent {
    /**
     * @type {Rigidbody}
     */
    rigi

    jumpAbility = 0
    moveAbility = 0

    /**
     * @param {GameObject} attack
     */
    constructor(attack) {
        super(attack)

        this.rigi = attack.getComponent(Rigidbody)
        let width = this.rigi._object.width / TILE_SIZE
        let height = this.rigi._object.height / TILE_SIZE

        this.jumpAbility = JumpBlockToVelocity(0.5 + Math.max(1, Math.round(height / width)))
        this.moveAbility = MoveBlockToVelocity(Math.clamp(2, 5, 15 / (width * height)))
    }

    update(delta) {
        if (this.isKeyDown('ArrowLeft', 'KeyA') && (this.isKeyDown('ArrowRight', 'KeyD'))) {
            this._object.vx = 0
        } else if (this.isKeyDown('ArrowLeft', 'KeyA')) {
            this._object.vx = -this.moveAbility
        } else if (this.isKeyDown('ArrowRight', 'KeyD')) {
            this._object.vx = this.moveAbility
        } else {
            this._object.vx = 0
        }

        if (this.isKeyPressed('KeyW', 'ArrowUp') && this.rigi.OnTheFloor) {
            this._object.vy = this.jumpAbility
        }
    }
}
