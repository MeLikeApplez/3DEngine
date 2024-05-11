export default class Matrix3 {
    /**
     * 
     * @param {Number} n11 
     * @param {Number} n12 
     * @param {Number} n13 
     * @param {Number} n21 
     * @param {Number} n22 
     * @param {Number} n23 
     * @param {Number} n31 
     * @param {Number} n32 
     * @param {Number} n33 
     */
    constructor(n11=1, n12=0, n13=0, n21=0, n22=1, n23=0, n31=0, n32=0, n33=1) {
        this.elements = new Float32Array(9)

        this.set(
            n11, n12, n13,
            n21, n22, n23,
            n31, n32, n33,
        )
    }

    set(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
        this.elements[0] = n11
        this.elements[1] = n12
        this.elements[2] = n13
        this.elements[3] = n21
        this.elements[4] = n22
        this.elements[5] = n23
        this.elements[6] = n31
        this.elements[7] = n32
        this.elements[8] = n33

        return this
    }

    identity() {
        this.set(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        )

        return this
    }

    /**
     * 
     * @param {Number} theta 
     */
    makeRotation(theta) {
        const sin = Math.sin(theta)
        const cos = Math.cos(theta)
        
        this.set(
            cos, -sin, 0,
            sin, cos, 0,
            0, 0, 1
        )
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    makeTranslation(x, y) {
        this.set(
            1, 0, x,
            0, 1, y,
            0, 0, 1
        )
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     */
    translate(x, y) {
        this.set(
            1, 0, 0,
            0, 1, 0,
            x, y, 1
        )
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    makeScale(x, y) {
        this.set(
            x, 0, 0,
            0, y, 0,
            0, 0, 1
        )
    }

    /**
     * 
     * @param {Matrix3} matrix 
     */
    multiply(matrix) {
        for(let i = 0; i < this.elements.length; i++) {
            this.elements[i] *= matrix.elements[i]
        }
    }

    /**
     * 
     * @param {Number} scale 
     */
    multiplyScalar(scale) {
        for(let i = 0; i < this.elements.length; i++) {
            this.elements[i] *= scale
        }
    }

    // source: https://stackoverflow.com/a/72596891/13159492
    inverse() {
        const [ a, b, c, d, e, f, g, h, i ] = this.elements
    
        const x = e * i - h * f
        const y = f * g - d * i
        const z = d * h - g * e
        const det = a * x + b * y + c * z

        if(det === 0) return null

        this.set(
            x, c * h - b * i, b * f - c * e,
            y, a * i - c * g, d * c - a * f,
            z, g * b - a * h, a * e - d * b
        )

        return this
    }

    clone() {
        return new Matrix3(...this.elements)
    }

    /**
     * 
     * @param {Matrix3} matrix 
     */
    copy(matrix) {
        this.set(...matrix.elements)
        
        return this
    }
}