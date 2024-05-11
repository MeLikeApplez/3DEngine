import Engine from '../Engine/Engine'

import Mesh from '../Engine/Meshes/Mesh'
import BoxGeometry from '../Engine/Geometry/Box'
import BasicMaterial from '../Engine/Meshes/BasicMaterial'
import Color from '../Engine/Utils/Color'

import Vector3 from '../Engine/Math/Vector3'
import Vector4 from '../Engine/Math/Vector4'
import Matrix3 from '../Engine/Math/Matrix3'
import Matrix4 from '../Engine/Math/Matrix4'

import Controller from '../Engine/Controls/Controller'
import OrbitControls from '../Engine/Controls/OrbitControls'
import FirstPersonControls from '../Engine/Controls/FirstPersonControls'
import TextureLoader from '../Engine/Texture/TextureLoader'
import InstancedMesh from '../Engine/Meshes/Instancing/InstancedMesh'
import PlaneGeometry from '../Engine/Geometry/Plane'
import PerspectiveCamera from '../Engine/Camera/Perspective'

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
/**
 * @param {Engine} Engine 
 */
export default async function Playground(Engine) {
    Engine.camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100)
    Engine.controller = new OrbitControls(Engine.canvasElement, Engine.camera)
    // Engine.controller = new FirstPersonControls(Engine.canvasElement, Engine.camera)
    const { Scene, Renderer, camera, controller } = Engine

    const ground = new Mesh(
        new PlaneGeometry(32, 32),
        new BasicMaterial({
            color: new Color(150, 150, 150),
        }),
    )

    ground.rotation.x = Math.PI / 2

    camera.position.set(0, 15, 20)
    
    Scene.add(ground)

    let time = 0
    Engine.on('update', ({delta}) => {
        
        controller.update()

        camera.lookAt(new Vector3(0, 0, 0))
        // camera.updateViewMatrix()


        time += delta
    })
}