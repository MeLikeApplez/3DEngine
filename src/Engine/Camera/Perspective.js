import Matrix4 from '../Math/Matrix4'
import Quaternion from '../Math/Quaternion'
import Vector3 from '../Math/Vector3'
import Camera from './Camera'

export default class PerspectiveCamera extends Camera {
    /**
     * @param {Number} fov 
     * @param {Number} aspect 
     * @param {Number} near 
     * @param {Number} far 
     */
    constructor(fov, aspect, near, far) {
        super(fov, aspect, near, far)
    }

    /**
     * @param {Vector3} target 
     * @param {Vector3} up 
     */
    lookAt(target, up) {
        if(!up) up = new Vector3(0, 1, 0)
        
        const zAxis = this.position.clone().subtract(target).normalize()
        const xAxis = up.cross(zAxis).normalize()
        const yAxis = zAxis.cross(xAxis).normalize()

        const rotationMatrix = new Matrix4(
            xAxis.x, xAxis.y, xAxis.z, 0,
            yAxis.x, yAxis.y, yAxis.z, 0,
            zAxis.x, zAxis.y, zAxis.z, 0,
            0, 0, 0, 1
        ).inverse()

        this.target = target
        // this.rotation.setFromRotationMatrix(rotationMatrix)

        this.rotationMatrix.elements = rotationMatrix.elements

        return this
    }

    /**
     * @param {Matrix4} matrix 
     */
    updateRotationMatrix(matrix) {
        this.rotationMatrix.elements = matrix.elements

        return this
    }

    updateViewMatrix() {
        this.viewMatrix.makeRotationFromEuler(this.rotation)

        // this.viewMatrix.elements[12] = -this.position.x
        // this.viewMatrix.elements[13] = -this.position.y
        // this.viewMatrix.elements[14] = this.position.z
        // this.viewMatrix.elements[15] = 1

        return this
    }

    updateProjectionMatrix() {
        const fovRadian = this.fov * (Math.PI / 180)
        const f = 1 / Math.tan(fovRadian / 2)
        const rangeInv = 1 / (this.near - this.far)

        this.projectionMatrix.set(
            f / this.aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (this.near + this.far) * rangeInv, -1,
            0, 0, this.near * this.far * rangeInv * 2, 0
        )

        return this
    }
}