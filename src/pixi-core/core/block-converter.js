import { ACCELERATION_GRAVITY } from './constant'

/**
 * @returns {number} velocity jump
 * @param {number} block
 */
export function JumpBlockToVelocity(block) {
    return Math.sqrt(-2 * block * ACCELERATION_GRAVITY)
}

/**
 * @return {number} pixel/frame
 * @param {number} block block/s
 */
export function MoveBlockToVelocity(block) {
    return block
}
