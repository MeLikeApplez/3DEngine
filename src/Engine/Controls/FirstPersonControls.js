import Camera from '../Camera/Camera'
import Controller from './Controller'

import Vector2 from '../Math/Vector2'

export default class FirstPersonControls extends Controller {
    /**
     * @param {HTMLElement} target 
     * @param {Camera} camera 
     */
    constructor(target, camera) {
        super(target)

        this.camera = camera

        this.initialDown = true

        this.initialX = 0
        this.initialY = 0

        this.initialCameraX = 0
        this.initialCameraY = 0
        this.initialCameraZ = 0

        this.initialDistance = 0
        this.initialAngle = 0

        this.scale = new Vector2(1, 1)

        this.dragX = 0
        this.dragY = 0
    }

    update() {
        if(this.mouseUp) {
            this.dragX = 0
            this.dragY = 0

            this.initialX = 0
            this.initialY = 0

            this.initialCameraX = 0
            this.initialCameraY = 0
            this.initialCameraZ = 0
            
            this.initialDistance = 0
            this.initialAngle = 0

            this.initialDown = true

            return
        }

        if(this.initialDown) {
            this.initialX = this.x
            this.initialY = this.y

            this.initialCameraX = this.camera.position.x
            this.initialCameraY = this.camera.position.y
            this.initialCameraZ = this.camera.position.z

            this.initialDistance = this.camera.position.distanceTo(this.camera.target)
            this.initialAngleX = this.camera.rotation.x
            this.initialAngleY = this.camera.rotation.y

            this.initialDown = false
        }

        this.dragX = this.x - this.initialX
        this.dragY = this.y - this.initialY

        const normalX = this.dragX / this.getTargetWidth()
        const normalY = this.dragY / this.getTargetHeight()

        this.camera.rotation.y = this.initialAngleY + normalX
        this.camera.rotation.x = this.initialAngleX + normalY

        this.camera.updateViewMatrix()
    }
}