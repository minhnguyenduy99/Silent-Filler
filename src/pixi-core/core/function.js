/**
 * @returns {number}
 * @param {number} low
 * @param {number} hight
 * @param {number} value
 */
Math.clamp = function (low, hight, value) {
    if (value < low) {
        return low
    } else if (value > hight) {
        return hight
    } else {
        return value
    }
}
