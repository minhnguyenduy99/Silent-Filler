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
    }

    CollisionCall(delta) {
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

        for (let i = 0; i < this.RigidbodyList.length; i++) {
            let collisionList = []
            let box = new Box(this.RigidbodyList[i])
            let top = Math.floor((box.top + 16) / 32)
            let bot = Math.floor((box.bottom - 16) / 32)
            let left = Math.floor((box.left - 16) / 32)
            let right = Math.floor((box.right + 16) / 32)
            for (let i = bot; i <= top; i++) {
                for (let j = left; j <= right; j++) {
                    if (this.tilemap.__getPoint(i, j) > 0) {
                        collisionList.push(new Box(this.tilemap.__map[i][j]))
                    }
                }
            }
            if (collisionList.length > 0) {
                for (let i = 0; i < collisionList.length; i++) {
                    collisionList[i].userdata = box.distance(collisionList[i])
                }
                collisionList.sort((a, b) => {
                    if (a.userdata === b.userdata) {
                        return 0
                    } else if (a.userdata < b.userdata) {
                        return -1
                    } else {
                        return 1
                    }
                })
                sweptAABB(box, collisionList, delta, true)
            }
        }
    }
}

const PhysicalInstance = new Physical()

export default PhysicalInstance
export const DEFAULT_PIXEL_TO_CENTIMET = 29
