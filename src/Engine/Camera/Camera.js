import Euler from '../Math/Euler'
import Matrix4 from '../Math/Matrix4'
import Vector3 from '../Math/Vector3'

export default class Camera {
    /**
     * @param {Number} fov 
     * @param {Number} aspect 
     * @param {Number} near 
     * @param {Number} far 
     */
    constructor(fov, aspect, near, far) {
        this.fov = fov
        this.aspect = aspect
        this.near = near
        this.far = far
    
        this.projectionMatrix = new Matrix4()
        this.rotationMatrix = new Matrix4()
        this.viewMatrix = new Matrix4()

        this.position = new Vector3(0, 0, 0)
        this.rotation = new Euler(0, 0, 0)

        /**
         * @type {Vector3}
         */
        this.target = null

        this.updateProjectionMatrix()
    }


    updateViewMatrix() {
        return this
    }

    updateProjectionMatrix() {
        return this
    }
}