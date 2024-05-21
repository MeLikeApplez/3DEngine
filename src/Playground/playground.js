import Engine from '../Engine/Engine'

import Mesh, { BufferMeshMaterial } from '../Engine/Meshes/Mesh'
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
import InstancedMesh from '../Engine/Meshes/Instancing/InstancedMesh'
import PlaneGeometry from '../Engine/Geometry/Plane'
import PerspectiveCamera from '../Engine/Camera/Perspective'

import TextureLoader from '../Engine/Texture/Texture2DLoader'
import CubeTextureLoader from '../Engine/Texture/CubeTextureLoader'
import { BACK, FRONT, FRONT_AND_BACK } from '../Engine/Utils/Constants'

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
/**
 * @param {Engine} Engine 
 */
export default async function Playground(Engine) {
    Engine.camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 500)
    Engine.controller = new OrbitControls(Engine.canvasElement, Engine.camera)
    // Engine.controller = new FirstPersonControls(Engine.canvasElement, Engine.camera)
    const { Scene, Renderer, camera, controller } = Engine

    const texture = new TextureLoader()
    const cubeTexture = new CubeTextureLoader()

    const path = '/Textures/'
    const gridTexture = path + 'grid.png'
    const lightStone = path + 'light-stone.png'
    const greyStone = path + 'grey-stone.jpg'
    const midron = path + 'midron.jpeg'
    const larva = path + 'larva.png'

    Scene.background = cubeTexture

    const ground = new Mesh(
        new PlaneGeometry(32, 32),
        new BasicMaterial({
            color: new Color(150, 150, 150),
            // texture: texture
        }),
    )

    const box = new Mesh(
        new BoxGeometry(10, 10, 10),
        new BufferMeshMaterial({
            color: [new Color(250, 120, 60), new Color(60, 120, 250), new Color(120, 60, 250), new Color(250, 60, 120), new Color(120, 250, 60), new Color(250, 250, 60)],
            // texture: texture,
            // texture: cubeTexture,
        })
    )

    ground.rotation.x = Math.PI / 2
    box.position.y = 12
    // box.side = BACK
    // box.rotation.y = Math.PI / -4

    // camera.position.set(0, 10, 0)
    camera.position.set(0, 20, 100)
        camera.lookAt(new Vector3(0, 0, 0))
    
    Scene.add(ground, box)

    let time = 0
    Engine.on('update', ({delta}) => {
        // camera.rotation.y = time

        controller.update()

        camera.lookAt(new Vector3(0, 0, 0))
        // camera.updateViewMatrix()


        time += delta
    })
}