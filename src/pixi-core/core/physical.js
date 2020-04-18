import { Rigidbody, TileMap } from './../components'
import { sweptAABB } from './collision'

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

        // Collision call
        if (!this.tilemap) {
            return
        }

        this.RigidbodyList.forEach(rigi => {
            let e = rigi._object
            let top = Math.floor((e.y + e.height / 2) / 32) + 1
            let bot = Math.floor((e.y - e.height / 2) / 32) - 1
            let left = Math.floor((e.x - e.width / 2) / 32) - 1
            let right = Math.floor((e.x + e.width / 2) / 32) + 1
            for (let i = bot; i <= top; i++) {
                for (let j = left; j <= right; j++) {
                    if (this.tilemap.__getPoint(i, j) > 0) {
                        sweptAABB(e, this.tilemap.__map[i][j], delta)
                    }
                }
            }
        })
    }
}

const PhysicalInstance = new Physical()

export default PhysicalInstance
export const DEFAULT_PIXEL_TO_CENTIMET = 29
