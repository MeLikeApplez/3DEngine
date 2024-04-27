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

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
/**
 * @param {Engine} Engine 
 */
export default async function Playground(Engine) {
    Engine.controller = new OrbitControls(Engine.canvasElement, Engine.camera)
    // Engine.controller = new FirstPersonControls(Engine.canvasElement, Engine.camera)

    const { Scene, Renderer, camera, controller } = Engine

    const texture1 = new TextureLoader()
    const texture2 = new TextureLoader()

    const path = '/Textures/'
    const gridTexture = path + 'grid.png'
    const lightStone = path + 'light-stone.png'
    const greyStone = path + 'grey-stone.jpg'
    const midron = path + 'midron.jpeg'
    const larva = path + 'larva.png'

    await texture1.load(greyStone)
    await texture2.load(larva)

    const box = new Mesh(
        new BoxGeometry(),
        new BasicMaterial({
            // color: [
            //     new Color(250, 120, 0),
            //     new Color(0, 120, 250),
            //     new Color(0, 250, 120),
            //     new Color(250, 250, 50),
            //     new Color(250, 0, 0),
            //     new Color(250, 0, 190),
            // ],
            texture: texture1,
        })
    )

    const box2 = new Mesh(
        new BoxGeometry(),
        new BasicMaterial({
            color: [
                new Color(250, 0, 190),
                new Color(250, 0, 0),
                new Color(250, 250, 50),
                new Color(0, 250, 120),
                new Color(0, 120, 250),
                new Color(250, 120, 0),
            ],
            // texture: texture2
        })
    )

    const grid = new InstancedMesh(
        new BoxGeometry(),
        new BasicMaterial({
            color: [
                new Color(0, 100, 100),
                new Color(200, 200, 200),
                new Color(100, 200, 100),
                new Color(100, 100, 200),
                new Color(100, 200, 200),
                new Color(200, 200, 100),
            ],
        })
    )

    console.log(grid)

    grid.position.set(0, 0, -2)
    box.position.set(0, 0, 0)
    box2.position.set(-2, 0, 0)

    // Scene.add(grid)
    Scene.add(box, box2)

    camera.position.set(2, 2, 2)
    camera.lookAt(new Vector3(0, 0, 0))
    camera.updateViewMatrix()
    
    let time = 0
    Engine.on('update', ({delta}) => {
        // box.rotation.x += delta
        // box.rotation.y += delta
        // box.rotation.z += delta

        controller.update()

        camera.lookAt(new Vector3(0, 0, 0))
        // camera.updateViewMatrix()


        time += delta
    })
}