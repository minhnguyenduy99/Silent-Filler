import { ControlComponent } from '.'

export default class PlayerController extends ControlComponent {
    update() {
        if (this.isKeyDown('ArrowLeft', 'KeyA') && (this.isKeyDown('ArrowRight', 'KeyD'))) {
            this._object.vx = 0
        } else if (this.isKeyDown('ArrowLeft', 'KeyA')) {
            this._object.vx = -2
        } else if (this.isKeyDown('ArrowRight', 'KeyD')) {
            this._object.vx = 2
        } else {
            // this._object.vx = 0
        }

        if (this.isKeyPressed('KeyW', 'ArrowUp')) {
            this._object.vy = 10
        }
    }
}
