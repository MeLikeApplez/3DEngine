export default class Vector4 {
    constructor(x=0, y=0, z=0, w=0) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }

    set(x, y, z, w) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w

        return this
    }

    /** @param {Vector4} vector  */
    add(vector) {
        this.x += vector.x
        this.y += vector.y
        this.z += vector.z
        this.w += vector.w
    
        return this
    }

    /** @param {Vector4} vector  */
    subtract(vector) {
        this.x -= vector.x
        this.y -= vector.y
        this.z -= vector.z
        this.w -= vector.w
    
        return this
    }

    /** @param {Vector4} vector  */
    multiply(vector) {
        this.x *= vector.x
        this.y *= vector.y
        this.z *= vector.z
        this.w *= vector.w
    
        return this
    }

    /** @param {Vector4} vector  */
    divide(vector) {
        this.x /= vector.x
        this.y /= vector.y
        this.z /= vector.z
        this.w /= vector.w
    
        return this
    }

    /**
     * @param {Number} factor 
     */
    addScalar(factor) {
        this.x += factor
        this.y += factor
        this.z += factor
        this.w += factor

        return this
    }

    /**
     * @param {Number} factor 
     */
    subtractScalar(factor) {
        this.x -= factor
        this.y -= factor
        this.z -= factor
        this.w -= factor

        return this
    }

    /**
     * @param {Number} factor 
     */
    multiplyScalar(factor) {
        this.x *= factor
        this.y *= factor
        this.z *= factor
        this.w *= factor

        return this
    }

    /**
     * @param {Number} factor 
     */
    divideScalar(factor) {
        this.x /= factor
        this.y /= factor
        this.z /= factor
        this.w /= factor

        return this
    }

    /** @param {Vector4} vector  */
    distanceTo(vector) {
        const a = vector.x - this.x
        const b = vector.y - this.y
        const c = vector.z - this.z
        const d = vector.w - this.w
        const distance = Math.sqrt((a * a) + (b * b) + (c * c) + (d * d))

        return distance
    }

    /** @param {Vector4} vector  */
    distanceToSquared(vector) {
        const a = vector.x - this.x
        const b = vector.y - this.y
        const c = vector.z - this.z
        const d = vector.w - this.w
        const distance = (a * a) + (b * b) + (c * c) + (d * d)

        return distance
    }

    floor() {
        this.x = Math.floor(this.x)
        this.y = Math.floor(this.y)
        this.z = Math.floor(this.z)
        this.w = Math.floor(this.w)

        return this
    }

    ceil() {
        this.x = Math.ceil(this.x)
        this.y = Math.ceil(this.y)
        this.z = Math.ceil(this.z)
        this.w = Math.ceil(this.w)

        return this
    }

    round() {
        this.x = Math.round(this.x)
        this.y = Math.round(this.y)
        this.z = Math.round(this.z)
        this.w = Math.round(this.w)

        return this
    }

     /**
     * 
     * @param {Vector4} min 
     * @param {Vector4} max 
     */
     clamp(min, max) {
        this.x = Math.max(min.x, Math.min(this.x, max.x))
        this.y = Math.max(min.y, Math.min(this.y, max.y))
        this.z = Math.max(min.z, Math.min(this.z, max.z))
        this.w = Math.max(min.w, Math.min(this.w, max.w))

        return this
    }

    normalize() {
        const magnitude = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w))

        if(magnitude === 0) {
            this.x = 0
            this.y = 0
            this.z = 0
            this.w = 0
        } else {
            this.x /= magnitude
            this.y /= magnitude
            this.z /= magnitude
            this.w /= magnitude
        }

        return this
    }

    /**
     * 
     * @param {Matrix4} matrix 
     */
    applyFromMatrix4(matrix) {
        this.x = (matrix.elements[0] * this.x) + (matrix.elements[1] * this.y) + (matrix.elements[2] * this.z) + (matrix.elements[3] * this.w)
        this.y = (matrix.elements[4] * this.x) + (matrix.elements[5] * this.y) + (matrix.elements[6] * this.z) + (matrix.elements[7] * this.w)
        this.z = (matrix.elements[8] * this.x) + (matrix.elements[9] * this.y) + (matrix.elements[10] * this.z) + (matrix.elements[11] * this.w)
        this.w = (matrix.elements[12] * this.x) + (matrix.elements[13] * this.y) + (matrix.elements[14] * this.z) + (matrix.elements[15] * this.w)

        return this
    }

    /**
     * 
     * @param {Vector4} vector 
     */
    dot(vector) {
        return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z) + (this.w * vector.w)
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
    }

    clone() {
        return new Vector4(this.x, this.y, this.z, this.w)
    }

    /**
     * 
     * @param {Vector4} vector 
     */
    copy(vector) {
        this.x = vector.x
        this.y = vector.y
        this.z = vector.z
        this.w = vector.w

        return this
    }
}