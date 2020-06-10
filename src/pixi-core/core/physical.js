import { Rigidbody, TileMap } from './../components'
import { sweptAABB, Box } from './collision'

class Physical {
    /**
     * List Rigidbody object will check collision
     * @private
     * @type {Rigidbody[]}
     */
    RigidbodyList

    /**
     * Current tile map
     * @type {TileMap}
     */
    tilemap

    constructor() {
        this.RigidbodyList = []
    }

    update(delta) {
        this.RigidbodyList.forEach(e => e.update(delta))

        // Collision to other object

        for (let i = 0; i < this.RigidbodyList.length - 1; i++) {
            for (let j = i + 1; j < this.RigidbodyList.length; j++) {
                sweptAABB(this.RigidbodyList[i]._object, this.RigidbodyList[j]._object, delta, true)
            }
        }

        // Collision to tilemap
        if (!this.tilemap) {
            return
        }

        this.RigidbodyList.forEach(rigi => {
            let box = new Box(rigi)
            let top = Math.floor((box.top + 16) / 32)
            let bot = Math.floor((box.bottom - 16) / 32)
            let left = Math.floor((box.left - 16) / 32)
            let right = Math.floor((box.right + 16) / 32)
            for (let i = bot; i <= top; i++) {
                for (let j = left; j <= right; j++) {
                    if (this.tilemap.__getPoint(i, j) > 0) {
                        sweptAABB(box, this.tilemap.__map[i][j], delta)
                    }
                }
            }
        })
    }
}

const PhysicalInstance = new Physical()

export default PhysicalInstance
export const DEFAULT_PIXEL_TO_CENTIMET = 29
