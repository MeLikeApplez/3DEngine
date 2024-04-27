import Euler from "./Euler"
import Quaternion from "./Quaternion"

export default class Matrix4 {
    /**
     * 
     * @param {Number} n11 
     * @param {Number} n12 
     * @param {Number} n13 
     * @param {Number} n14 
     * @param {Number} n21 
     * @param {Number} n22 
     * @param {Number} n23 
     * @param {Number} n24 
     * @param {Number} n31 
     * @param {Number} n32 
     * @param {Number} n33 
     * @param {Number} n34 
     * @param {Number} n41 
     * @param {Number} n42 
     * @param {Number} n43 
     * @param {Number} n44 
     */
    constructor(n11=1, n12=0, n13=0, n14=0, n21=0, n22=1, n23=0, n24=0, n31=0, n32=0, n33=1, n34=0, n41=0, n42=0, n43=0, n44=1) {
        this.elements = new Float32Array(16)
        
        this.set(
            n11, n12, n13, n14,
            n21, n22, n23, n24,
            n31, n32, n33, n34,
            n41, n42, n43, n44,
        )
    }

    /**
     * 
     * @param {Number} n11 
     * @param {Number} n12 
     * @param {Number} n13 
     * @param {Number} n14 
     * @param {Number} n21 
     * @param {Number} n22 
     * @param {Number} n23 
     * @param {Number} n24 
     * @param {Number} n31 
     * @param {Number} n32 
     * @param {Number} n33 
     * @param {Number} n34 
     * @param {Number} n41 
     * @param {Number} n42 
     * @param {Number} n43 
     * @param {Number} n44 
     */
    set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        this.elements[0] = n11
        this.elements[1] = n12
        this.elements[2] = n13
        this.elements[3] = n14
        this.elements[4] = n21
        this.elements[5] = n22
        this.elements[6] = n23
        this.elements[7] = n24
        this.elements[8] = n31
        this.elements[9] = n32
        this.elements[10] = n33
        this.elements[11] = n34
        this.elements[12] = n41
        this.elements[13] = n42
        this.elements[14] = n43
        this.elements[15] = n44

        return this
    }

    identity() {
        this.set(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )

        return this
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    makeTranslation(x, y, z) {
        this.set(
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        )

        return this
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    makeScale(x, y, z) {
        this.set(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        )

        return this
    }

    
    /**
     * @param {Number} theta 
     */
    makeRotationX(theta) {
        const sin = Math.sin(theta)
        const cos = Math.cos(theta)
        
        this.set(
            1, 0, 0, 0,
            0, cos, -sin, 0,
            0, sin, cos, 0,
            0, 0, 0, 1
        )

        return this
    }

    /**
     * @param {Number} theta 
     */
    makeRotationY(theta) {
        const sin = Math.sin(theta)
        const cos = Math.cos(theta)
        
        this.set(
            cos, 0, sin, 0,
            0, 1, 0, 0,
            -sin, 0, cos, 0,
            0, 0, 0, 1
        )

        return this
    }

    /**
     * @param {Number} theta 
     */
    makeRotationZ(theta) {
        const sin = Math.sin(theta)
        const cos = Math.cos(theta)
        
        this.set(
            cos, -sin, 0, 0,
            sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )

        return this
    }

    /**
     * 
     * @param {Euler} euler 
     */
    // https://en.wikipedia.org/wiki/Euler_angles#Rotation_matrix
    makeRotationFromEuler(euler) {
        const { s1, s2, s3, c1, c2, c3 } = euler.getEulerByOrderTrig()
        
        switch(euler.order) {
            // proper euler angles
            case 'XZX':
                return this.set(
                    c2, -c3 * s2, s2 * s3, 0,
                    c1 * s2, (c1 * c2 * c3) - (s1 * s3), (-c3 * s1) - (c1 * c2 * s3), 0,
                    s1 * s2, (c1 * s3) + (c2 * c3 * s1), (c1 * c3) - (c2 * s1 * s3), 0,
                    0, 0, 0, 1
                )
            case 'XYX':
                return this.set(
                    c2, s2 * s3, c3 * s2, 0,
                    s1 * s2, (c1 * c3) - (c2 * s1 * s3), -(c1 * s3) - (c2 * c3 * s1), 0,
                    -c1 * s2, (c3 * s1) + (c1 * c2 * s3), (c1 * c2 * c3) - (s1 * s3), 0,
                    0, 0, 0, 1
                )
            case 'YXY':
                return this.set(
                    (c1 * c3) - (c2 * s1 * s3), (s1 * s2), (c1 * s3) + (c2 * c3 * s1), 0,
                    s2 * s3, c2, -c3 * s2, 0,
                    (-c3 * s1) - (-c1 * c2 * s3), c1 * s2, (c1 * c2 * c3) - (s1 * s3), 0,
                    0, 0, 0, 1
                )
            case 'YZY':
                return this.set(
                    (c1 * c2 * c3) - (s1 * s3), -   c1 * s2, (c3 * s1) + (c1 * c2 * s3), 0,
                    c3 * s2, c2, s2 * s3, 0,
                    (-c1 * s3) - (c2 * c3 * s1), s1 * s2, (c1 * c3) - (c2 * s1 * s3), 0,
                    0, 0, 0, 1
                )
            case 'ZYZ':
                return this.set(
                    (c1 * c2 * c3) - (s1 * s3), (-c3 * s1) - (c1 * c2 * s3), c1 * s2, 0,
                    (c1 * s3) + (c2 * c3 * s1), (c1 * c3) - (c2 * s1 * s3), s1 * s2, 0,
                    -c3 * s2, s2 * s3, c2, 0,
                    0, 0, 0, 1
                )
            case 'ZXZ':
                return this.set(
                    (c1 * c3) - (c2 * s1 * s3), (-c1 * s3) - (c2 * c3 * s1), s1 * s2, 0,
                    (c3 * s1) + (c1 * c2 * s3), (c1 * c2 * c3) - (s1 * s3), -c1 * s2, 0,
                    s2 * s3, c3 * s2, c2, 0,
                    0, 0, 0, 1
                )
            // tait-bryan angles
            case 'XZY':
                return this.set(
                    c2 * c3, -s2, c2 * s3, 0,
                    (s1 * s3) + (c1 * c3 * s2), c1 * c2, (c1 * s2 * s3) - (c3 * s1), 0,
                    (c3 * s1 * s2) - (c1 * s3), c2 * s1, (c1 * c3) + (s1 * s2 * s3), 0,
                    0, 0, 0, 1
                )
            case 'XYZ':
                return this.set(
                    c2 * c3, -c2 * s3, s2, 0,
                    (c1 * s3) + (c3 * s1 * s2), (c1 * c3) - (s1 * s2 * s3), -c2 * s1, 0,
                    (s1 * s3) - (c1 * c3 * s2), (c3 * s1) + (c1 * s2 * s3), c1 * c2, 0,
                    0, 0, 0, 1
                )
            case 'YXZ':
                return this.set(
                    (c1 * c3) + (s1 * s2 * s3), (c3 * s1 * s2) - (c1 * s3), (c2 * s1), 0,
                    c2 * s3, c2 * c3, -s2, 0,
                    (c1 * s2 * s3) - (c3 * s1), (c1 * c3 * s2) + (s1 * s3), (c1 * c2), 0,
                    0, 0, 0, 1
                )
            case 'YZX':
                return this.set(
                    c1 * c2, (s1 * s3) - (c1 * c3 * s2), (c3 * s1) + (c1 * s2 * s3), 0,
                    s2, c2 * c3, -c2 * s3, 0,
                    -c2 * s1, (c1 * s3) + (c3 * s1 * s2), (c1 * c3) - (s1 * s2 * s3), 0,
                    0, 0, 0, 1
                )
            case 'ZYX':
                return this.set(
                    c1 * c2, (c1 * s2 * s3) - (c3 * s1), (s1 * s3) + (c1 * c3 * s2), 0,
                    c2 * s1, (c1 * c3) + (s1 * s2 * s3), (c3 * s1 * s2) - (c1 * s3), 0,
                    -s2, c2 * s3, c2 * c3, 0,
                    0, 0, 0, 1
                )
            case 'ZXY':
                return this.set(
                    (c1 * c3) - (s1 * s2 * s3), -c1 * s1, (c1 * s3) + (c3 * s1 * s2), 0,
                    (c3 * s1) + (c1 * s2 * s3), c1 * c2, (s1 * s3) - (c1 * c3 * s2), 0,
                    -c2 * s3, s2, c2 * c3, 0,
                    0, 0, 0, 1
                )
        }

        return null
    }

    /**
     * 
     * @param {Quaternion} quaternion 
     */
    makeRotationFromQuaternion(quaternion) {
        const x2 = quaternion.x * quaternion.x
        const y2 = quaternion.y * quaternion.y
        const z2 = quaternion.z * quaternion.z
        
        const xy = quaternion.x * quaternion.y
        const xz = quaternion.x * quaternion.z
        const yz = quaternion.y * quaternion.z

        const xw = quaternion.x * quaternion.w
        const yw = quaternion.y * quaternion.w
        const zw = quaternion.z * quaternion.w

        const m11 = 1 - ((2 * y2) - (2 * z2))
        const m12 = (2 * xy) - (2 * zw)
        const m13 = (2 * xz) + (2 * yw)
        const m21 = (2 * xy) + (2 * zw)
        const m22 = 1 - ((2 * x2) - (2 * z2))
        const m23 = (2 * yz) - (2 * xw)
        const m31 = (2 * xz) - (2 * yw)
        const m32 = (2 * yz) + (2 * xw)
        const m33 = 1 - ((2 * x2) - (2 * y2))
    
        return this.set(
            m11, m12, m13, 0,
            m21, m22, m23, 0,
            m31, m32, m33, 0,
            0, 0, 0, 1
        )
    }

    /**
     * 
     * @param {Matrix4} matrix 
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

    // source: https://evanw.github.io/lightgl.js/docs/matrix.html
    inverse() {
        const result = new Matrix4()

        const r = result.elements
        const m = this.elements

        r[0] = m[5]*m[10]*m[15] - m[5]*m[14]*m[11] - m[6]*m[9]*m[15] + m[6]*m[13]*m[11] + m[7]*m[9]*m[14] - m[7]*m[13]*m[10]
        r[1] = -m[1]*m[10]*m[15] + m[1]*m[14]*m[11] + m[2]*m[9]*m[15] - m[2]*m[13]*m[11] - m[3]*m[9]*m[14] + m[3]*m[13]*m[10]
        r[2] = m[1]*m[6]*m[15] - m[1]*m[14]*m[7] - m[2]*m[5]*m[15] + m[2]*m[13]*m[7] + m[3]*m[5]*m[14] - m[3]*m[13]*m[6]
        r[3] = -m[1]*m[6]*m[11] + m[1]*m[10]*m[7] + m[2]*m[5]*m[11] - m[2]*m[9]*m[7] - m[3]*m[5]*m[10] + m[3]*m[9]*m[6]

        r[4] = -m[4]*m[10]*m[15] + m[4]*m[14]*m[11] + m[6]*m[8]*m[15] - m[6]*m[12]*m[11] - m[7]*m[8]*m[14] + m[7]*m[12]*m[10]
        r[5] = m[0]*m[10]*m[15] - m[0]*m[14]*m[11] - m[2]*m[8]*m[15] + m[2]*m[12]*m[11] + m[3]*m[8]*m[14] - m[3]*m[12]*m[10]
        r[6] = -m[0]*m[6]*m[15] + m[0]*m[14]*m[7] + m[2]*m[4]*m[15] - m[2]*m[12]*m[7] - m[3]*m[4]*m[14] + m[3]*m[12]*m[6]
        r[7] = m[0]*m[6]*m[11] - m[0]*m[10]*m[7] - m[2]*m[4]*m[11] + m[2]*m[8]*m[7] + m[3]*m[4]*m[10] - m[3]*m[8]*m[6]

        r[8] = m[4]*m[9]*m[15] - m[4]*m[13]*m[11] - m[5]*m[8]*m[15] + m[5]*m[12]*m[11] + m[7]*m[8]*m[13] - m[7]*m[12]*m[9]
        r[9] = -m[0]*m[9]*m[15] + m[0]*m[13]*m[11] + m[1]*m[8]*m[15] - m[1]*m[12]*m[11] - m[3]*m[8]*m[13] + m[3]*m[12]*m[9]
        r[10] = m[0]*m[5]*m[15] - m[0]*m[13]*m[7] - m[1]*m[4]*m[15] + m[1]*m[12]*m[7] + m[3]*m[4]*m[13] - m[3]*m[12]*m[5]
        r[11] = -m[0]*m[5]*m[11] + m[0]*m[9]*m[7] + m[1]*m[4]*m[11] - m[1]*m[8]*m[7] - m[3]*m[4]*m[9] + m[3]*m[8]*m[5]

        r[12] = -m[4]*m[9]*m[14] + m[4]*m[13]*m[10] + m[5]*m[8]*m[14] - m[5]*m[12]*m[10] - m[6]*m[8]*m[13] + m[6]*m[12]*m[9]
        r[13] = m[0]*m[9]*m[14] - m[0]*m[13]*m[10] - m[1]*m[8]*m[14] + m[1]*m[12]*m[10] + m[2]*m[8]*m[13] - m[2]*m[12]*m[9]
        r[14] = -m[0]*m[5]*m[14] + m[0]*m[13]*m[6] + m[1]*m[4]*m[14] - m[1]*m[12]*m[6] - m[2]*m[4]*m[13] + m[2]*m[12]*m[5]
        r[15] = m[0]*m[5]*m[10] - m[0]*m[9]*m[6] - m[1]*m[4]*m[10] + m[1]*m[8]*m[6] + m[2]*m[4]*m[9] - m[2]*m[8]*m[5]

        const det = m[0]*r[0] + m[1]*r[4] + m[2]*r[8] + m[3]*r[12]

        for (var i = 0; i < 16; i++) {
            r[i] /= det
        }

        this.elements = result.elements

        return this
    }

    clone() {
        return new Matrix4(...this.elements)
    }

    /**
     * 
     * @param {Matrix4} matrix 
     */
    copy(matrix) {
        this.set(...matrix.elements)
        
        return this
    }
}